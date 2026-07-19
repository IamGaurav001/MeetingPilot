/**
 * Preload script.
 *
 * Exposes a limited, safe API from the main process to the renderer
 * via contextBridge. No raw Node.js access in the renderer.
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('meetingPilot', {
  // Meeting operations
  meeting: {
    list: () => ipcRenderer.invoke('meeting:list'),
    create: (data) => ipcRenderer.invoke('meeting:create', data),
    get: (id) => ipcRenderer.invoke('meeting:get', id),
    start: (id) => ipcRenderer.invoke('meeting:start', id),
    stop: (id) => ipcRenderer.invoke('meeting:stop', id),
  },

  // Transcript operations
  transcript: {
    get: (meetingId) => ipcRenderer.invoke('transcript:get', meetingId),
    onChunk: (callback) => {
      ipcRenderer.on('transcript:chunk', (_event, chunk) => callback(chunk));
    },
  },

  // Audio controls
  audio: {
    start: () => ipcRenderer.invoke('audio:start'),
    stop: () => ipcRenderer.invoke('audio:stop'),
    status: () => ipcRenderer.invoke('audio:status'),
  },

  // AI features
  ai: {
    onSuggestion: (callback) => {
      ipcRenderer.on('ai:suggestion', (_event, suggestion) => callback(suggestion));
    },
    onActionItems: (callback) => {
      ipcRenderer.on('ai:action-items', (_event, items) => callback(items));
    },
    onSummary: (callback) => {
      ipcRenderer.on('ai:summary', (_event, summary) => callback(summary));
    },
  },

  // App controls
  app: {
    minimizeToTray: () => ipcRenderer.invoke('app:minimize-to-tray'),
    quit: () => ipcRenderer.invoke('app:quit'),
  },
});
