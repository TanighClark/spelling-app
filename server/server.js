import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import connectDB from './models/db.js';
import authRoutes from './routes/authRoutes.js';
import './models/Activity.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send('Spelling App Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
