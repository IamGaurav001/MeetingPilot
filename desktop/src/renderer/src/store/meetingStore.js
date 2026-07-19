import { create } from 'zustand';

export const useMeetingStore = create((set) => ({
  // State
  meetings: [],
  activeMeeting: null,
  isLoading: false,

  // Actions
  setMeetings: (meetings) => set({ meetings }),
  setActiveMeeting: (meeting) => set({ activeMeeting: meeting }),
  setLoading: (isLoading) => set({ isLoading }),

  clearActiveMeeting: () => set({ activeMeeting: null }),
}));
