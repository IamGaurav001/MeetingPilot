export const KAFKA_TOPICS = Object.freeze({
  /**
   * Meeting started — triggers listeners.
   */
  MEETING_STARTED: 'meeting.started',

  /**
   * Meeting ended — triggers summary generation.
   */
  MEETING_ENDED: 'meeting.ended',

  /**
   * New transcript chunk received.
   */
  TRANSCRIPT_CHUNK_CREATED: 'transcript.chunk.created',

  /**
   * Vector Embeddings generated for a transcript chunk.
   */
  EMBEDDING_CREATED: 'embedding.created',

  /**
   * RAG Vector database context index updated.
   */
  RAG_UPDATED: 'rag.updated',

  /**
   * AI suggestion generated for the current meeting.
   */
  SUGGESTION_GENERATED: 'suggestion.generated',

  /**
   * Action item extracted from transcript.
   */
  ACTION_DETECTED: 'action.detected',

  /**
   * Decision detected in transcript.
   */
  DECISION_DETECTED: 'decision.detected',

  /**
   * Meeting summary generated.
   */
  SUMMARY_GENERATED: 'summary.generated',

  /**
   * Dead Letter Queue (DLQ) topic for processing errors.
   */
  DLQ_AI_FAILED: 'dlq.ai.failed',
});
