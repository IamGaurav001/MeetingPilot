/**
 * Transcript routes.
 *
 * Mounted at /api/meetings in app.js,
 * so full paths are /api/meetings/:meetingId/transcript/...
 */

import { Router } from 'express';
import { validate } from '../../shared/middleware/validator.js';
import { authGuard } from '../../shared/middleware/authGuard.js';
import { createChunkSchema, meetingIdParamSchema } from './transcript.validator.js';
import * as transcriptController from './transcript.controller.js';

const router = Router({ mergeParams: true });

router.use(authGuard);

router.get('/:meetingId/transcript', validate(meetingIdParamSchema, 'params'), transcriptController.getTranscript);
router.post('/:meetingId/transcript/chunks', validate(meetingIdParamSchema, 'params'), validate(createChunkSchema), transcriptController.addChunk);

export default router;
