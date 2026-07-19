/**
 * Socket.io Server Configuration.
 *
 * Initializes the WebSocket server instance alongside Express.
 */

import { Server } from 'socket.io';
import { logger } from './logger.js';
import { metricsCollector } from '../shared/observability/MetricsCollector.js';

let io = null;

/**
 * Initialize Socket.io on the HTTP server.
 *
 * @param {import('http').Server} httpServer
 */
export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow connections from Electron renderer in local/dev
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    metricsCollector.increment('activeWebSocketConnections');
    logger.info({ msg: 'Socket client connected', socketId: socket.id });

    // Join room for specific meeting
    socket.on('join-meeting', (meetingId) => {
      socket.join(meetingId);
      logger.info({ msg: `Socket ${socket.id} joined meeting room: ${meetingId}`, meetingId });
    });

    // Leave room on disconnect
    socket.on('disconnect', () => {
      metricsCollector.decrement('activeWebSocketConnections');
      logger.info({ msg: 'Socket client disconnected', socketId: socket.id });
    });
  });

  return io;
}

/**
 * Returns the active Socket.io instance.
 */
export function getSocketIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket(server) first.');
  }
  return io;
}
