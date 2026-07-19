/**
 * Generic Zod validation middleware.
 *
 * Wraps Zod schemas for use as Express middleware.
 * Validates body, params, or query based on the schema target.
 */

import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

/**
 * Creates a validation middleware for the given Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'params' | 'query'} source - Which part of the request to validate
 * @returns {import('express').RequestHandler}
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);

      return next(
        AppError.badRequest(
          `Validation failed: ${messages.join(', ')}`,
          ERROR_CODES.VALIDATION_ERROR,
        ),
      );
    }

    // Replace with parsed (and potentially transformed) data
    req[source] = result.data;
    next();
  };
}
