// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import connectDB from './models/db.js';
import authRoutes from './routes/authRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import performanceLogger from './middleware/performanceLogger.js';
import errorHandler from './middleware/errorHandler.js';

// load .env
dotenv.config();

// connect to Mongo
connectDB();

// redis client & session store
const redisClient = new Redis(process.env.REDIS_URL);
redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('error', (err) => console.error('❌ Redis error:', err));

const redisStore = new RedisStore({ client: redisClient });

// create express app
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE STACK ---
app.use(performanceLogger); // our custom timing logger
app.use(cors()); // CORS headers
app.use(helmet()); // security headers
app.use(compression()); // gzip/brotli
app.use(express.json()); // body parser

// sessions (stored in Redis)
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

// passport
app.use(passport.initialize());
app.use(passport.session());

// --- VIEW ENGINE & LAYOUTS ---
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'server', 'templates'));

// express-ejs-layouts will look for layout at `views/base/layout.ejs`
app.use(expressLayouts);
app.set('layout', 'base/layout');

// make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// serve static assets from /public
app.use(express.static(path.join(process.cwd(), 'public')));

// --- ROUTES ---
// auth API
app.use('/api/auth', authRoutes);

// server-side rendered templates (list, new, edit, etc.)
app.use('/templates', templateRoutes);

// optional: a landing page at “/”
app.get('/', (req, res) => {
  res.render('index', {
    /* any data for your landing page */
  });
});

// --- ERROR HANDLING ---
app.use(errorHandler);

// --- START ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
