/* eslint-disable no-console */
/**
 * Client-Side Socket Service.
 *
 * Establishes real-time connection from Electron React renderer to Express backend.
 * Provides subscription handlers for transcripts, suggestions, and action items.
 */

import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
  }

  /**
   * Connect to the WebSocket server.
   */
  connect(meetingId, onStatusChange) {
    if (this.socket) {
      this.socket.disconnect();
    }

    onStatusChange('connecting');
    this.socket = io(BACKEND_URL);

    this.socket.on('connect', () => {
      onStatusChange('connected');
      console.log(`[SocketService] Connected to backend, joining meeting room: ${meetingId}`);
      this.socket.emit('join-meeting', meetingId);
    });

    this.socket.on('disconnect', () => {
      onStatusChange('disconnected');
      console.log('[SocketService] Disconnected from backend');
    });

    this.socket.on('connect_error', (error) => {
      onStatusChange('disconnected');
      console.error('[SocketService] Connection error:', error);
    });
  }

  /**
   * Subscribe to specific socket channel events.
   *
   * @param {string} channel
   * @param {Function} callback
   */
  subscribe(channel, callback) {
    if (!this.socket) {
      console.warn('[SocketService] Cannot subscribe, socket not connected.');
      return;
    }
    this.socket.on(channel, callback);
  }

  /**
   * Unsubscribe from channel events.
   */
  unsubscribe(channel) {
    if (this.socket) {
      this.socket.off(channel);
    }
  }

  /**
   * Disconnect socket connection.
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
