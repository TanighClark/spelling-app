import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from '../services/googleStrategy.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Test Route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth Routes Working' });
});

// Initiate Google Authentication
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Google Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.json({ message: 'Google SSO successful', user: req.user });
  },
);

export default router;
