/**
 * Transcript validation schemas.
 */

import { z } from 'zod';

export const createChunkSchema = z.object({
  speaker: z.string().min(1, 'Speaker is required').max(255),
  text: z.string().min(1, 'Text is required'),
  startTime: z.number().nonnegative('Start time must be non-negative'),
  endTime: z.number().nonnegative('End time must be non-negative'),
  confidence: z.number().min(0).max(1).optional().default(1),
});

export const meetingIdParamSchema = z.object({
  meetingId: z.string().uuid('Invalid meeting ID'),
});
