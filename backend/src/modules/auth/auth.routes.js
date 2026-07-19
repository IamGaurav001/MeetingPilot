/**
 * Auth routes.
 */

import { Router } from 'express';
import { validate } from '../../shared/middleware/validator.js';
import { authGuard } from '../../shared/middleware/authGuard.js';
import { authLimiter } from '../../shared/middleware/rateLimiter.js';
import { registerSchema, loginSchema, refreshSchema } from './auth.validator.js';
import * as authController from './auth.controller.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', authGuard, authController.logout);

export default router;
