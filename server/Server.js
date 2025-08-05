 // server/Server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Favicon workaround
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
  res.send('server on');
});

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

    console.log('✅ Express app configured for Vercel');
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
  }
})();

// ✅ THIS IS WHAT VERCEL WANTS
export default app;
