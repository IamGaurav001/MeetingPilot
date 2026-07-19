/**
 * Meeting routes.
 */

import { Router } from 'express';
import { validate } from '../../shared/middleware/validator.js';
import { authGuard } from '../../shared/middleware/authGuard.js';
import { createMeetingSchema, updateMeetingSchema, meetingIdSchema } from './meeting.validator.js';
import * as meetingController from './meeting.controller.js';

const router = Router();

// All meeting routes require authentication
router.use(authGuard);

router.post('/', validate(createMeetingSchema), meetingController.create);
router.get('/', meetingController.getAll);
router.get('/:id', validate(meetingIdSchema, 'params'), meetingController.getById);
router.patch('/:id', validate(meetingIdSchema, 'params'), validate(updateMeetingSchema), meetingController.update);
router.delete('/:id', validate(meetingIdSchema, 'params'), meetingController.remove);

router.post('/:id/start', validate(meetingIdSchema, 'params'), meetingController.start);
router.post('/:id/stop', validate(meetingIdSchema, 'params'), meetingController.stop);

export default router;
