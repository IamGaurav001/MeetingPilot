/**
 * Rate limiter middleware.
 *
 * Uses express-rate-limit with sensible defaults.
 * Returns consistent error format on limit exceeded.
 */

import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

/**
 * Default rate limiter: 100 requests per 15 minutes per IP.
 */
export const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: 'Too many requests, please try again later',
      },
    });
  },
});

/**
 * Strict rate limiter for auth endpoints: 10 requests per 15 minutes.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: 'Too many authentication attempts, please try again later',
      },
    });
  },
});
