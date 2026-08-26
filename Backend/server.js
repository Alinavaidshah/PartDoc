import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js'; 
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
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

// Trust Proxy for Cloud Hosting (Vercel, Render)
app.set('trust proxy', 1); 

// 1. HELMET SECURITY HEADERS
app.use(
  helmet({
    crossOriginResourcePolicy: false, 
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "https:", "data:", "http://localhost:5000"],
      },
    },
  })
);

// 2. CORS PROTECTION
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})); 

// 3. PAYLOAD LIMITERS (Prevent Memory Crashes)
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' })); 

// 4. NOSQL INJECTION SANITIZATION (Strips out $ and . characters from user inputs)
app.use(mongoSanitize());

// 5. SECURITY RATE LIMITERS (Anti-DDOS & Anti-Bruteforce)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per IP per 15 minutes
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40, // Max 40 write operations per 15 mins
  message: { message: "Action limit exceeded. Please wait before submitting more requests." }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Max 15 login attempts per 15 mins
  message: { message: "Too many authentication attempts. Account protected." }
});

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

// Apply Global Rate Limiter
app.use(globalLimiter);

// --- SECURE ROUTES ---
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/orders', writeLimiter, orderRoutes);
app.use('/api/appointments', writeLimiter, appointmentRoutes);
app.use('/api/payments', writeLimiter, paymentRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/users', userRoutes);

// Sync Route
app.post('/api/users/sync', writeLimiter, async (req, res) => {
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
    message: 'PartDoc Secure Backend API is operational & protected!',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.use(notFound);
app.use(errorHandler);

// --- SERVER START ---
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Secure Server running on port ${PORT}`));
}

export default app;