/**
 * Consistent API response builder.
 *
 * Every API response from MeetingPilot follows this format:
 * { success: boolean, data?: any, error?: object, meta?: object }
 */

import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * Send a success response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {any} [options.data] - Response payload
 * @param {number} [options.statusCode] - HTTP status (default 200)
 * @param {object} [options.meta] - Pagination or other metadata
 */
export function sendSuccess(res, { data = null, statusCode = HTTP_STATUS.OK, meta = undefined } = {}) {
  const response = { success: true };

  if (data !== null) {
    response.data = data;
  }

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send a created (201) response.
 */
export function sendCreated(res, data) {
  return sendSuccess(res, { data, statusCode: HTTP_STATUS.CREATED });
}

/**
 * Send a no content (204) response.
 */
export function sendNoContent(res) {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
}
