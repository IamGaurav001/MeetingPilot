/**
 * Meeting status enum.
 *
 * Mirrors the Prisma MeetingStatus enum.
 */

export const MEETING_STATUS = Object.freeze({
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});

/**
 * Valid status transitions.
 * Key: current status. Value: array of allowed next statuses.
 */
export const MEETING_STATUS_TRANSITIONS = Object.freeze({
  [MEETING_STATUS.SCHEDULED]: [MEETING_STATUS.ACTIVE, MEETING_STATUS.CANCELLED],
  [MEETING_STATUS.ACTIVE]: [MEETING_STATUS.PAUSED, MEETING_STATUS.COMPLETED],
  [MEETING_STATUS.PAUSED]: [MEETING_STATUS.ACTIVE, MEETING_STATUS.COMPLETED],
  [MEETING_STATUS.COMPLETED]: [],
  [MEETING_STATUS.CANCELLED]: [],
});
