import express from 'express';
import { registerUser, authUser } from '../controllers/authController.js';

const router = express.Router();

// /api/auth/register
router.post('/register', registerUser);

// /api/auth/login
router.post('/login', authUser);

export default router;

