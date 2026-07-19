/**
 * Kafka topic name constants.
 *
 * Every topic has a clear purpose, producer, and consumer
 * documented here.
 */

export const KAFKA_TOPICS = Object.freeze({
  /**
   * New transcript chunk received.
   * Producer: Transcript module
   * Consumer: AI module (embedding, RAG indexing)
   */
  TRANSCRIPT_CHUNK_CREATED: 'transcript.chunk.created',

  /**
   * Meeting started — triggers listeners.
   * Producer: Meeting module
   * Consumer: Transcript module, AI module
   */
  MEETING_STARTED: 'meeting.started',

  /**
   * Meeting ended — triggers summary generation.
   * Producer: Meeting module
   * Consumer: AI module (summary agent)
   */
  MEETING_ENDED: 'meeting.ended',

  /**
   * AI suggestion generated for the current meeting.
   * Producer: AI module (suggestion agent)
   * Consumer: Desktop app (via WebSocket/IPC)
   */
  AI_SUGGESTION_GENERATED: 'ai.suggestion.generated',

  /**
   * Action item extracted from transcript.
   * Producer: AI module (action item agent)
   * Consumer: Meeting module (persists to DB)
   */
  ACTION_ITEM_EXTRACTED: 'ai.action-item.extracted',

  /**
   * Decision detected in transcript.
   * Producer: AI module (decision agent)
   * Consumer: Meeting module (persists to DB)
   */
  DECISION_DETECTED: 'ai.decision.detected',
});
