// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import session from 'express-session';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';
import connectDB from './models/db.js';
import authRoutes from './routes/authRoutes.js';
import performanceLogger from './middleware/performanceLogger.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Redis client
const redisClient = new Redis(process.env.REDIS_URL);
redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('error', (err) => console.error('❌ Redis error:', err));

// Create Redis session store
const redisStore = new RedisStore({ client: redisClient });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Performance logging
app.use(performanceLogger);

// Standard middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Session handling
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  }),
);

// Initialize Passport for SSO
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Spelling App Backend Running');
});

// Global error handler (last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
