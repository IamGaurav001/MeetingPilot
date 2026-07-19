/**
 * Transcript service.
 *
 * Handles transcript chunk ingestion and retrieval.
 */

import { getPrisma } from '../../config/database.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES } from '../../shared/constants/errorCodes.js';
import { MEETING_STATUS } from '../../shared/constants/meetingStatus.js';

/**
 * Add a transcript chunk to an active meeting.
 */
export async function addChunk(meetingId, userId, chunkData) {
  const prisma = getPrisma();

  const meeting = await prisma.meeting.findFirst({
    where: { id: meetingId, userId },
  });

  if (!meeting) {
    throw AppError.notFound('Meeting not found', ERROR_CODES.MEETING_NOT_FOUND);
  }

  if (meeting.status !== MEETING_STATUS.ACTIVE) {
    throw AppError.badRequest(
      'Transcript chunks can only be added to active meetings',
      ERROR_CODES.TRANSCRIPT_MEETING_NOT_ACTIVE,
    );
  }

  return prisma.transcriptChunk.create({
    data: {
      meetingId,
      ...chunkData,
    },
  });
}

/**
 * Get all transcript chunks for a meeting, ordered by start time.
 */
export async function getTranscript(meetingId, userId) {
  const prisma = getPrisma();

  const meeting = await prisma.meeting.findFirst({
    where: { id: meetingId, userId },
  });

  if (!meeting) {
    throw AppError.notFound('Meeting not found', ERROR_CODES.MEETING_NOT_FOUND);
  }

  const chunks = await prisma.transcriptChunk.findMany({
    where: { meetingId },
    orderBy: { startTime: 'asc' },
  });

  return { meetingId, chunks };
}
