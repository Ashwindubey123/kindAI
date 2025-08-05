import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { requireAuth } from '@clerk/express'; // ✅ updated import
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';

const app = express();

const startServer = async () => {
  try {
    await connectCloudinary();

    // ✅ Setup CORS
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }));

    app.use(express.json());

    // ✅ Test protected route
    app.get('/test', requireAuth(), (req, res) => {
      res.json({ userId: req.auth.userId });
    });

    // ✅ Use requireAuth on protected routes
    app.use('/api/ai', requireAuth(), aiRouter);
    app.use('/api/user', requireAuth(), userRouter);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
