 // server/Server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import serverless from 'serverless-http';

const app = express();

// Basic route to confirm server is up
app.get('/', (req, res) => {
  res.send('server on');
});
// Prevent 500 error when browser requests /favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());


// Wrap async setup logic in an IIFE
(async () => {
  try {
    await connectCloudinary();

    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    }));
    app.use(express.json());

    app.get('/test', requireAuth(), (req, res) => {
      res.json({ userId: req.auth.userId });
    });

    app.use('/api/ai', requireAuth(), aiRouter);
    app.use('/api/user', requireAuth(), userRouter);

    // No app.listen here – Vercel handles server start
    console.log('✅ Express app configured for Vercel');
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
  }
})();

// ✅ Export handler for Vercel
export const handler = serverless(app);
