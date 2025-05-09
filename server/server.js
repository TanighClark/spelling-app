import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./models/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./services/googleStrategy.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(passport.initialize());

// Authentication Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Spelling App Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
