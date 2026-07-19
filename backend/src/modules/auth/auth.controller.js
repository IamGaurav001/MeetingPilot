/**
 * Auth controller.
 *
 * Receives requests, validates input (via middleware), calls service, returns responses.
 * No business logic here.
 */

import * as authService from './auth.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/response.js';

/**
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    sendCreated(res, result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, { data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/refresh
 */
export async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, { data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 */
export async function logout(req, res, next) {
  try {
    await authService.logout(req.user.userId);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}
