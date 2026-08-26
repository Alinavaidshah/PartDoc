import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js'; 

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
    contentSecurityPolicy: false,
  })
);

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})); 

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

// Static folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ensure DB is connected before handling requests in serverless environment
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection middleware error:", err);
  }
  next();
});

// --- ROUTES ---
app.use('/api/orders', orderRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/users', userRoutes);

// Sync Route
app.post('/api/users/sync', async (req, res) => {
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
    console.error("User Sync Error:", error);
    res.status(500).json({ success: false, error: "Sync failed: " + error.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'PartDoc Server is running smoothly!',
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