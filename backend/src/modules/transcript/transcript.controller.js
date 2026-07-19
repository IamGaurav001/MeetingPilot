/**
 * Transcript controller.
 */

import * as transcriptService from './transcript.service.js';
import { sendSuccess, sendCreated } from '../../shared/utils/response.js';

/**
 * POST /api/meetings/:meetingId/transcript/chunks
 */
export async function addChunk(req, res, next) {
  try {
    const chunk = await transcriptService.addChunk(req.params.meetingId, req.user.userId, req.body);
    sendCreated(res, chunk);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/meetings/:meetingId/transcript
 */
export async function getTranscript(req, res, next) {
  try {
    const transcript = await transcriptService.getTranscript(req.params.meetingId, req.user.userId);
    sendSuccess(res, { data: transcript });
  } catch (error) {
    next(error);
  }
}
