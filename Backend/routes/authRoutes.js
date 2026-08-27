import express from 'express';
import { 
  registerUser, 
  authUser, 
  forgotPassword, 
  resetPasswordWithOtp 
} from '../controllers/authController.js';

const router = express.Router();

// /api/auth/register
router.post('/register', registerUser);

// /api/auth/login
router.post('/login', authUser);

// /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// /api/auth/reset-password
router.post('/reset-password', resetPasswordWithOtp);

export default router;

