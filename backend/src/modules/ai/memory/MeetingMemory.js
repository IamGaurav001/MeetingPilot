/**
 * Meeting Memory.
 *
 * Manages persistent context, entity logs, and running summaries
 * for ongoing meetings.
 */

export class MeetingMemory {
  constructor() {
    this.meetings = {}; // Keyed by meetingId: active memory states
  }

  /**
   * Initialize memory configuration for a meeting.
   */
  init(meetingId, metadata = {}) {
    this.meetings[meetingId] = {
      runningSummary: '',
      extractedEntities: [],
      participants: metadata.participants || [],
      startedAt: new Date().toISOString(),
      ...metadata,
    };
  }

  /**
   * Get full persistent memory state.
   */
  get(meetingId) {
    return this.meetings[meetingId] || null;
  }

  /**
   * Update the running summary.
   */
  updateSummary(meetingId, summary) {
    if (this.meetings[meetingId]) {
      this.meetings[meetingId].runningSummary = summary;
    }
  }

  /**
   * Add extracted entities (e.g. action items, dates, names).
   */
  addEntities(meetingId, entities) {
    if (this.meetings[meetingId]) {
      const existing = this.meetings[meetingId].extractedEntities;
      this.meetings[meetingId].extractedEntities = [...new Set([...existing, ...entities])];
    }
  }

  /**
   * Invalidate memory on complete.
   */
  clear(meetingId) {
    delete this.meetings[meetingId];
  }
}
