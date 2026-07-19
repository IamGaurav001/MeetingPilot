/**
 * JWT authentication guard middleware.
 *
 * Verifies the Bearer token from the Authorization header.
 * Attaches the decoded user payload to req.user.
 */

import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

/**
 * Middleware that requires a valid JWT access token.
 */
export function authGuard(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized(
        'Missing or invalid authorization header',
        ERROR_CODES.AUTH_TOKEN_INVALID,
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    if (error.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Token expired', ERROR_CODES.AUTH_TOKEN_EXPIRED));
    }

    return next(AppError.unauthorized('Invalid token', ERROR_CODES.AUTH_TOKEN_INVALID));
  }
}
