/**
 * Request logger middleware.
 *
 * Logs incoming requests and response times using Pino.
 */

import { logger } from '../../config/logger.js';

/**
 * Logs method, URL, status code, and response time for every request.
 */
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      msg: 'request',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}
