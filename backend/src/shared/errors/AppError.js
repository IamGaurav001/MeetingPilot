/**
 * Custom application error class.
 *
 * Extends the native Error with HTTP status code and an application-specific
 * error code for consistent API error responses.
 */

export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {string} [errorCode] - Application error code (e.g., 'AUTH_INVALID_TOKEN')
   */
  constructor(message, statusCode, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Factory: 400 Bad Request
   */
  static badRequest(message, errorCode = 'BAD_REQUEST') {
    return new AppError(message, 400, errorCode);
  }

  /**
   * Factory: 401 Unauthorized
   */
  static unauthorized(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
    return new AppError(message, 401, errorCode);
  }

  /**
   * Factory: 403 Forbidden
   */
  static forbidden(message = 'Forbidden', errorCode = 'FORBIDDEN') {
    return new AppError(message, 403, errorCode);
  }

  /**
   * Factory: 404 Not Found
   */
  static notFound(message = 'Resource not found', errorCode = 'NOT_FOUND') {
    return new AppError(message, 404, errorCode);
  }

  /**
   * Factory: 409 Conflict
   */
  static conflict(message, errorCode = 'CONFLICT') {
    return new AppError(message, 409, errorCode);
  }

  /**
   * Factory: 500 Internal Server Error
   */
  static internal(message = 'Internal server error', errorCode = 'INTERNAL_ERROR') {
    return new AppError(message, 500, errorCode);
  }
}
