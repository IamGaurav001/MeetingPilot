/**
 * Centralized error handler middleware.
 *
 * Must be registered as the LAST middleware in Express.
 * Catches all errors and returns a consistent response format.
 */

import { AppError } from '../errors/AppError.js';
import { logger } from '../../config/logger.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * Express error-handling middleware.
 * Signature must have 4 params for Express to recognize it.
 */
export function errorHandler(err, _req, res, _next) {
  // Log the error
  if (err instanceof AppError && err.isOperational) {
    logger.warn({
      msg: err.message,
      errorCode: err.errorCode,
      statusCode: err.statusCode,
    });
  } else {
    logger.error({
      msg: 'Unexpected error',
      error: err.message,
      stack: err.stack,
    });
  }

  // AppError — send structured response
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
      },
    });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors,
      },
    });
  }

  // Prisma known request errors
  if (err.code === 'P2002') {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this value already exists',
      },
    });
  }

  // Unknown errors — never leak internals
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
