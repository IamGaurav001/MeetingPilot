/**
 * Conversation Memory.
 *
 * Manages short-term conversation logs, recent messages, and context caches.
 */

export class ConversationMemory {
  constructor() {
    this.history = {}; // Keyed by meetingId: array of chunks
  }

  /**
   * Add a chunk to short-term memory.
   *
   * @param {string} meetingId
   * @param {object} chunk
   */
  add(meetingId, chunk) {
    if (!this.history[meetingId]) {
      this.history[meetingId] = [];
    }

    this.history[meetingId].push(chunk);

    // Keep only last 20 chunks in active short-term sliding window
    if (this.history[meetingId].length > 20) {
      this.history[meetingId].shift();
    }
  }

  /**
   * Get recent conversation logs for prompt contexts.
   *
   * @param {string} meetingId
   * @param {number} [limit] - Max chunks to retrieve
   */
  getRecent(meetingId, limit = 10) {
    const list = this.history[meetingId] || [];
    return list.slice(-limit);
  }

  /**
   * Cleans memory on meeting end.
   */
  clear(meetingId) {
    delete this.history[meetingId];
  }
}
