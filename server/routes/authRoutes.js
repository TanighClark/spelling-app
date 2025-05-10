// server/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from '../services/googleStrategy.js';
import verifyToken from '../middleware/verifyToken.js';
import authorize from '../middleware/authorize.js';
import catchAsync from '../middleware/catchAsync.js';
import statsController from '../controllers/statsController.js';

const router = express.Router();

// User registration & login
router.post('/register', catchAsync(registerUser));
router.post('/login', catchAsync(loginUser));

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Auth Routes Working' });
});

// Google SSO
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.json({ message: 'Google SSO successful', user: req.user });
  },
);

// Admin-only stats
router.get(
  '/admin/stats',
  verifyToken,
  authorize('admin'),
  catchAsync(statsController.getStats),
);

export default router;
