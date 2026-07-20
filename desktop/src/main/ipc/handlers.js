/**
 * IPC handler registration.
 *
 * Registers all IPC handlers that the main process responds to.
 * Each handler maps an IPC channel to its handler function.
 */

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from './channels.js';

/**
 * Register all IPC handlers.
 * Called once during app initialization.
 */
const BACKEND_URL = 'http://localhost:3001';

export function registerIpcHandlers() {
  // Meeting handlers
  ipcMain.handle(IPC_CHANNELS.MEETING_LIST, async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/meetings`);
      return await response.json();
    } catch (error) {
      console.error('[IPC] Failed to list meetings:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.MEETING_CREATE, async (_event, data) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('[IPC] Failed to create meeting:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.MEETING_GET, async (_event, meetingId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/meetings/${meetingId}`);
      return await response.json();
    } catch (error) {
      console.error('[IPC] Failed to get meeting:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.MEETING_START, async (_event, meetingId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/meetings/${meetingId}/start`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('[IPC] Failed to start meeting:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.MEETING_STOP, async (_event, meetingId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/meetings/${meetingId}/stop`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('[IPC] Failed to stop meeting:', error);
      return { success: false, error: error.message };
    }
  });

  // Audio handlers
  ipcMain.handle(IPC_CHANNELS.AUDIO_START, async () => {
    return { success: true, data: { recording: true } };
  });

  ipcMain.handle(IPC_CHANNELS.AUDIO_STOP, async () => {
    return { success: true, data: { recording: false } };
  });

  ipcMain.handle(IPC_CHANNELS.AUDIO_STATUS, async () => {
    return { success: true, data: { recording: false, device: null } };
  });
}
