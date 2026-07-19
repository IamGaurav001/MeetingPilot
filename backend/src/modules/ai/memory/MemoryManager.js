/**
 * Central Memory Manager.
 *
 * Exposes a single entry orchestrator to load, retrieve,
 * update, and flush both short-term and current meeting memory spaces.
 */

import { ConversationMemory } from './ConversationMemory.js';
import { MeetingMemory } from './MeetingMemory.js';

class MemoryManager {
  constructor() {
    this.conversation = new ConversationMemory();
    this.meeting = new MeetingMemory();
  }

  /**
   * Initializes state caches when a meeting starts.
   */
  startMeeting(meetingId, metadata = {}) {
    this.meeting.init(meetingId, metadata);
  }

  /**
   * Ingests a new transcript segment into memory space.
   */
  rememberChunk(meetingId, chunk) {
    this.conversation.add(meetingId, chunk);
  }

  /**
   * Builds prompt context objects combining short-term history and running summary.
   */
  getPromptContext(meetingId) {
    const recentHistory = this.conversation.getRecent(meetingId);
    const meetingState = this.meeting.get(meetingId);

    return {
      recentTranscript: recentHistory.map((h) => `[${h.speaker}]: ${h.text}`).join('\n'),
      runningSummary: meetingState ? meetingState.runningSummary : '',
      extractedEntities: meetingState ? meetingState.extractedEntities : [],
    };
  }

  /**
   * Clean up all memory slots when a meeting is closed.
   */
  forgetMeeting(meetingId) {
    this.conversation.clear(meetingId);
    this.meeting.clear(meetingId);
  }
}

export const memoryManager = new MemoryManager();
