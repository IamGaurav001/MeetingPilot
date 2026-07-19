/**
 * Express application setup.
 *
 * Configures global middleware and registers module routes.
 * Does NOT start the HTTP server — that's server.js's job.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { requestLogger } from './shared/middleware/requestLogger.js';
import { defaultLimiter } from './shared/middleware/rateLimiter.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { sendSuccess } from './shared/utils/response.js';

// Module routes
import authRoutes from './modules/auth/auth.routes.js';
import meetingRoutes from './modules/meeting/meeting.routes.js';
import transcriptRoutes from './modules/transcript/transcript.routes.js';
import searchRoutes from './modules/search/search.routes.js';

const app = express();

// ---- Global Middleware ----
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(defaultLimiter);

// ---- Health Check ----
app.get('/api/health', (_req, res) => {
  sendSuccess(res, {
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// ---- Module Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/meetings', transcriptRoutes);
app.use('/api/search', searchRoutes);

// ---- 404 Handler ----
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested endpoint does not exist',
    },
  });
});

// ---- Centralized Error Handler (must be last) ----
app.use(errorHandler);

export default app;
