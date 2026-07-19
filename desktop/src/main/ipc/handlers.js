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
export function registerIpcHandlers() {
  // Meeting handlers
  ipcMain.handle(IPC_CHANNELS.MEETING_LIST, async () => {
    // Phase 2: Forward to backend API
    return { success: true, data: [] };
  });

  ipcMain.handle(IPC_CHANNELS.MEETING_CREATE, async (_event, data) => {
    return { success: true, data: { id: 'stub', ...data } };
  });

  ipcMain.handle(IPC_CHANNELS.MEETING_START, async (_event, meetingId) => {
    return { success: true, data: { id: meetingId, status: 'ACTIVE' } };
  });

  ipcMain.handle(IPC_CHANNELS.MEETING_STOP, async (_event, meetingId) => {
    return { success: true, data: { id: meetingId, status: 'COMPLETED' } };
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
