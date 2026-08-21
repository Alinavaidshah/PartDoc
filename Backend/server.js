import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js'; 
import rateLimit from 'express-rate-limit';

// Security Imports
import helmet from 'helmet';

// Routes Import
import authRoutes from './routes/authRoutes.js';
import partRoutes from './routes/partRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js'; 

// Middlewares Import 
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Security Config
app.set('trust proxy', 1); 
app.use(
  helmet({
    crossOriginResourcePolicy: false, 
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "https://via.placeholder.com", "data:", "http://localhost:5000"],
      },
    },
  })
);

app.use(cors()); 

app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' })); 

// --- RATE LIMITERS ---
const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 9999,
});

const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 9999,
});

// Static folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ensure DB is connected before handling requests in serverless environment
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- ROUTES ---
app.use(standardLimiter);
app.use('/api/orders', strictLimiter, orderRoutes);
app.use('/api/appointments', strictLimiter, appointmentRoutes);
app.use('/api/payments', strictLimiter, paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/users', userRoutes);

// Sync Route
app.post('/api/users/sync', strictLimiter, async (req, res) => {
  const { clerkId, email, name } = req.body;
  try {
    let user = await User.findOne({ clerkId });
    if (!user) user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ clerkId, email, name });
    } else if (!user.clerkId) {
      user.clerkId = clerkId;
      await user.save();
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Sync failed" });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Byteforge Backend Server is running and Secure!',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.use(notFound);
app.use(errorHandler);

// --- VERCEL COMPATIBILITY ---
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;