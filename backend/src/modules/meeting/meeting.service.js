/**
 * Meeting service.
 *
 * Handles meeting lifecycle: create, read, update, delete,
 * start, pause, stop — with status transition validation.
 */

import { getPrisma } from '../../config/database.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES } from '../../shared/constants/errorCodes.js';
import { MEETING_STATUS, MEETING_STATUS_TRANSITIONS } from '../../shared/constants/meetingStatus.js';

/**
 * Create a new meeting.
 */
export async function createMeeting(userId, data) {
  const prisma = getPrisma();

  return prisma.meeting.create({
    data: {
      ...data,
      userId,
      status: data.scheduledAt ? MEETING_STATUS.SCHEDULED : MEETING_STATUS.ACTIVE,
    },
  });
}

/**
 * Get all meetings for a user with pagination.
 */
export async function getMeetings(userId, { skip, limit }) {
  const prisma = getPrisma();

  const [meetings, total] = await Promise.all([
    prisma.meeting.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.meeting.count({ where: { userId } }),
  ]);

  return { meetings, total };
}

/**
 * Get a single meeting by ID.
 */
export async function getMeetingById(meetingId, userId) {
  const prisma = getPrisma();

  const meeting = await prisma.meeting.findFirst({
    where: { id: meetingId, userId },
    include: {
      actionItems: true,
      decisions: true,
      summary: true,
    },
  });

  if (!meeting) {
    throw AppError.notFound('Meeting not found', ERROR_CODES.MEETING_NOT_FOUND);
  }

  return meeting;
}

/**
 * Update meeting details.
 */
export async function updateMeeting(meetingId, userId, data) {
  await getMeetingById(meetingId, userId); // Ensures it exists and belongs to user

  const prisma = getPrisma();

  return prisma.meeting.update({
    where: { id: meetingId },
    data,
  });
}

/**
 * Delete a meeting.
 */
export async function deleteMeeting(meetingId, userId) {
  await getMeetingById(meetingId, userId);

  const prisma = getPrisma();

  await prisma.meeting.delete({ where: { id: meetingId } });
}

/**
 * Transition meeting to a new status.
 * Validates the transition is allowed.
 */
export async function transitionStatus(meetingId, userId, newStatus) {
  const meeting = await getMeetingById(meetingId, userId);

  const allowed = MEETING_STATUS_TRANSITIONS[meeting.status] || [];

  if (!allowed.includes(newStatus)) {
    throw AppError.badRequest(
      `Cannot transition from ${meeting.status} to ${newStatus}`,
      ERROR_CODES.MEETING_INVALID_STATUS,
    );
  }

  const prisma = getPrisma();

  const updateData = { status: newStatus };

  if (newStatus === MEETING_STATUS.ACTIVE && !meeting.startedAt) {
    updateData.startedAt = new Date();
  }

  if (newStatus === MEETING_STATUS.COMPLETED) {
    updateData.endedAt = new Date();
  }

  return prisma.meeting.update({
    where: { id: meetingId },
    data: updateData,
  });
}
