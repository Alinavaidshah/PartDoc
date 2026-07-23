import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import User from './models/User.js'; 
import rateLimit from 'express-rate-limit';

// Security Imports
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

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


// app.use(mongoSanitize()); 
// app.use(xss());               

// --- RATE LIMITERS ---
const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 9999, // 30 se badha kar 9999 kar do
  // ... baqi code
});

const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 9999, // 200 se badha kar 9999 kar do
  // ... baqi code
});

// Static folder for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- ROUTES REGISTER WITH LIMITS ---

// Global limit for general traffic
app.use(standardLimiter);

// Strict limits for sensitive routes
app.use('/api/orders', strictLimiter, orderRoutes);
app.use('/api/appointments', strictLimiter, appointmentRoutes);
app.use('/api/payments', strictLimiter, paymentRoutes);

// Baki routes
app.use('/api/auth', authRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/users', userRoutes);

// --- User Sync Route (Clerk to MongoDB) ---
app.post('/api/users/sync', strictLimiter, async (req, res) => {
  const { clerkId, email, name } = req.body;
  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      user = await User.create({ clerkId, email, name });
      console.log("Naya User Sync hua:", email);
    } else if (!user.clerkId) {
      user.clerkId = clerkId;
      await user.save();
      console.log("Existing user updated with clerkId:", email);
    }

    res.status(200).json({ success: true, message: "Sync successful", user });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ success: false, error: "Sync failed" });
  }
});

app.get('/', (req, res) => {
  res.send('Byteforge Backend Server is running and Secure!');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();