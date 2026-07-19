/**
 * Transcript Buffer Aggregator.
 *
 * Accumulates real-time transcript chunks and batches them together
 * based on pause duration (timeout) or total words to optimize downstream LLM costs.
 */

export class TranscriptBuffer {
  /**
   * @param {Object} options
   * @param {number} [options.aggregationWindowMs] - Timeout after speech ceases to flush buffer (default 5s)
   * @param {number} [options.maxWordCount] - Max words before forcing a flush (default 100)
   * @param {Function} onFlush - Callback invoked with aggregated text
   */
  constructor({ aggregationWindowMs = 5000, maxWordCount = 100 } = {}, onFlush) {
    this.aggregationWindowMs = aggregationWindowMs;
    this.maxWordCount = maxWordCount;
    this.onFlush = onFlush;

    this.buffer = [];
    this.wordCount = 0;
    this.timer = null;
    this.speaker = 'Unknown';
    this.startTime = 0;
    this.meetingId = null;
  }

  /**
   * Add a single chunk of transcript.
   *
   * @param {object} chunk - { text, speaker, startTime, endTime, meetingId }
   */
  add(chunk) {
    this.meetingId = chunk.meetingId;

    // If speaker changes, flush current buffer immediately to keep conversations distinct
    if (this.buffer.length > 0 && this.speaker !== chunk.speaker) {
      this.flush();
    }

    if (this.buffer.length === 0) {
      this.speaker = chunk.speaker;
      this.startTime = chunk.startTime;
    }

    this.buffer.push(chunk.text);
    const chunkWords = chunk.text.split(/\s+/).filter(Boolean).length;
    this.wordCount += chunkWords;

    // Reset the silence aggregation timeout timer
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Force flush if word count limit exceeded
    if (this.wordCount >= this.maxWordCount) {
      this.flush();
    } else {
      this.timer = setTimeout(() => this.flush(), this.aggregationWindowMs);
    }
  }

  /**
   * Flush the buffered text and trigger the callback.
   */
  flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.buffer.length === 0) {
      return;
    }

    const aggregatedText = this.buffer.join(' ').trim();
    const result = {
      meetingId: this.meetingId,
      speaker: this.speaker,
      text: aggregatedText,
      startTime: this.startTime,
      endTime: Date.now() / 1000, // Current timestamp as logical end time
    };

    // Reset internal state
    this.buffer = [];
    this.wordCount = 0;

    // Invoke callback
    if (this.onFlush) {
      this.onFlush(result);
    }
  }

  /**
   * Cleanup timer on close.
   */
  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
