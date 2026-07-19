/**
 * Shared constants used across backend and desktop.
 */

/**
 * IPC channel names for Electron main ↔ renderer communication.
 */
export const IPC_CHANNELS = Object.freeze({
  // Meeting
  MEETING_CREATE: 'meeting:create',
  MEETING_START: 'meeting:start',
  MEETING_STOP: 'meeting:stop',
  MEETING_LIST: 'meeting:list',
  MEETING_GET: 'meeting:get',

  // Transcript
  TRANSCRIPT_CHUNK: 'transcript:chunk',
  TRANSCRIPT_GET: 'transcript:get',

  // Audio
  AUDIO_START: 'audio:start',
  AUDIO_STOP: 'audio:stop',
  AUDIO_STATUS: 'audio:status',

  // AI
  AI_SUGGESTION: 'ai:suggestion',
  AI_ACTION_ITEMS: 'ai:action-items',
  AI_SUMMARY: 'ai:summary',

  // App
  APP_MINIMIZE_TO_TRAY: 'app:minimize-to-tray',
  APP_QUIT: 'app:quit',
});

/**
 * Meeting status values (shared between backend and frontend).
 */
export const MEETING_STATUS = Object.freeze({
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});
