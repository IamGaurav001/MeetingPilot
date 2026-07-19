/**
 * Search routes.
 */

import { Router } from 'express';
import { authGuard } from '../../shared/middleware/authGuard.js';
import * as searchController from './search.controller.js';

const router = Router();

router.use(authGuard);

router.get('/', searchController.search);

export default router;
