/**
 * AI Pipeline Coordinator.
 *
 * Coordinates processing flow:
 * Ingest chunk -> Embed & Index -> Memory check -> RAG context -> LangGraph -> Socket notify.
 */

import { indexChunk } from './rag/Indexer.js';
import { retrieve } from './rag/retriever.js';
import { memoryManager } from './memory/MemoryManager.js';
import { runAgentPipeline } from './graph/LangGraphEngine.js';
import { sendNotification } from '../../shared/services/NotificationService.js'; // Note: notify path is shared/services
import { PipelineLogger } from '../../shared/observability/PipelineLogger.js';
import { latencyTracker } from '../../shared/observability/LatencyTracker.js';

class AIPipelineCoordinator {
  /**
   * Process a newly ingested transcript chunk.
   *
   * @param {object} chunk - The raw database chunk { id, meetingId, speaker, text, startTime, endTime }
   */
  async handleNewChunk(chunk) {
    const start = latencyTracker.startTimer('pipeline');
    PipelineLogger.startPipeline('handleNewChunk', {
      chunkId: chunk.id,
      meetingId: chunk.meetingId,
    });

    try {
      // 1. Embed and index chunk in Qdrant (RAG Storage)
      await indexChunk(chunk);

      // 2. Remember chunk in conversation memory
      memoryManager.rememberChunk(chunk.meetingId, chunk);

      // 3. Perform semantic RAG search across past contexts
      const pastContexts = await retrieve(chunk.text, {
        meetingId: chunk.meetingId,
        globalSearch: true, // Search past meetings
        topK: 3,
      });

      // 4. Load consolidated memory and context variables
      const memoryContext = memoryManager.getPromptContext(chunk.meetingId);

      // 5. Build consolidated LangGraph agent state inputs
      const resultState = await runAgentPipeline({
        meetingId: chunk.meetingId,
        transcriptChunks: [chunk], // Process current chunk context
        query: chunk.text,
        retrievedContext: pastContexts,
        memoryContext,
      });

      // 6. Broadcast suggestions, action items, and decisions to client
      if (resultState.suggestions && resultState.suggestions.length > 0) {
        await sendNotification(chunk.meetingId, 'ai:suggestion', resultState.suggestions);
      }

      if (resultState.actionItems && resultState.actionItems.length > 0) {
        await sendNotification(chunk.meetingId, 'ai:action-items', resultState.actionItems);
      }

      if (resultState.decisions && resultState.decisions.length > 0) {
        await sendNotification(chunk.meetingId, 'ai:decisions', resultState.decisions);
      }

      const durationMs = start();
      PipelineLogger.completePipeline('handleNewChunk', durationMs, { chunkId: chunk.id });
    } catch (error) {
      start();
      PipelineLogger.errorPipeline('handleNewChunk', error, { chunkId: chunk.id });
      throw error; // Let retry queues intercept the exception
    }
  }

  /**
   * Run meeting end procedures (e.g. summaries generation).
   */
  async handleMeetingEnd(meetingId) {
    const start = latencyTracker.startTimer('pipeline');
    PipelineLogger.startPipeline('handleMeetingEnd', { meetingId });

    try {
      // 1. Trigger final graph execution for summary
      const finalState = await runAgentPipeline({
        meetingId,
        transcriptChunks: [],
        query: 'Generate final meeting summary',
      });

      // 2. Notify clients of summary update
      if (finalState.summary) {
        await sendNotification(meetingId, 'ai:summary', finalState.summary);
      }

      // 3. Clear memory caches
      memoryManager.forgetMeeting(meetingId);

      const durationMs = start();
      PipelineLogger.completePipeline('handleMeetingEnd', durationMs, { meetingId });
    } catch (error) {
      start();
      PipelineLogger.errorPipeline('handleMeetingEnd', error, { meetingId });
      throw error;
    }
  }
}

export const aiPipelineCoordinator = new AIPipelineCoordinator();
