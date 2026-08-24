import express, { Request, Response } from 'express';
import cors from 'cors';

import { getAllowedOrigins } from './config/cors';
import { uploadDir, ensureUploadDir } from './middleware/upload';
import { createApiRouter } from './routes';

/** Builds and configures the Express app. Does not start listening. */
export function createApp(dbConnected: boolean) {
  const app = express();

  const allowedOrigins = getAllowedOrigins();
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));

  ensureUploadDir();
  app.use(express.json());

  app.use('/api', createApiRouter(dbConnected));

  // Static: uploaded product images
  app.use('/product_images', express.static(uploadDir));

  // 404 for unknown API routes
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error('Server error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  });

  return { app, allowedOrigins };
}
