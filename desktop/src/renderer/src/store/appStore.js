import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // State
  isRecording: false,
  connectionStatus: 'disconnected', // 'connected' | 'disconnected' | 'connecting'

  // Actions
  setRecording: (isRecording) => set({ isRecording }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
}));
