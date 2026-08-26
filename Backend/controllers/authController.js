import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// JWT Token Generate karne ka helper function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'byteforge_super_secret_key_123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new Admin/User
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });

    // Auto create default Admin if attempting login with admin@partdoc.com or alinavaid010@gmail.com and not exists yet
    const normalizedEmail = email.toLowerCase();
    if (!user && (normalizedEmail === 'admin@partdoc.com' || normalizedEmail === 'alinavaid010@gmail.com')) {
      user = await User.create({
        name: 'Ali Navaid Shah',
        email: normalizedEmail,
        password: password,
        isAdmin: true,
        role: 'admin'
      });
    }

    if (user && (await user.matchPassword(password))) {
      // Auto promote to admin if email matches designated admin emails
      if (!user.isAdmin && (normalizedEmail === 'admin@partdoc.com' || normalizedEmail === 'alinavaid010@gmail.com')) {
        user.isAdmin = true;
        user.role = 'admin';
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role || 'admin',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};