 import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import serverless from 'serverless-http';

const app = express();


  try {
    await connectCloudinary();

    // Middleware setup
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    }));
    app.use(express.json());

    // Routes
    app.get('/test', requireAuth(), (req, res) => {
      res.json({ userId: req.auth.userId });
    });

    app.use('/api/ai', requireAuth(), aiRouter);
    app.use('/api/user', requireAuth(), userRouter);

    // ✅ Don't start server manually in Vercel
     const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

  } catch (error) {
    console.error('❌ Failed to start:', error.message);
  }

