import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Login user check middleware
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'byteforge_super_secret_key_123');
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error("Token error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin access check middleware
export const admin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};