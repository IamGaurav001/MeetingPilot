/**
 * Centralized Notification Service.
 *
 * Handles WebSocket broadcasts to connected clients.
 * Decouples logic modules from direct Socket.io references.
 */

import { getSocketIO } from '../../config/socket.js';
import { logger } from '../../config/logger.js';
import { latencyTracker } from '../observability/LatencyTracker.js';

/**
 * Broadcasts a payload event to all users connected to a specific meeting.
 *
 * @param {string} meetingId - Scope of the room
 * @param {string} channel - e.g. 'ai:suggestion', 'ai:action-items', 'ai:decisions'
 * @param {any} payload - Data payload to transmit
 */
export async function sendNotification(meetingId, channel, payload) {
  const stopTimer = latencyTracker.startTimer('socket');

  try {
    const io = getSocketIO();

    // Broadcast to everyone in the meeting room
    io.to(meetingId).emit(channel, {
      meetingId,
      channel,
      payload,
      timestamp: new Date().toISOString(),
    });

    const latency = stopTimer();
    logger.debug({
      msg: `Notification sent on channel ${channel}`,
      meetingId,
      latencyMs: Math.round(latency),
    });
  } catch (error) {
    stopTimer();
    logger.error({
      msg: `Failed to broadcast notification on channel ${channel}`,
      meetingId,
      error: error.message,
    });
  }
}
