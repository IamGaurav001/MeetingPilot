/**
 * Meeting validation schemas.
 */

import { z } from 'zod';

export const createMeetingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional().default(''),
  scheduledAt: z.string().datetime().optional(),
  participants: z.array(z.string().email()).optional().default([]),
});

export const updateMeetingSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  participants: z.array(z.string().email()).optional(),
});

export const meetingIdSchema = z.object({
  id: z.string().uuid('Invalid meeting ID'),
});
