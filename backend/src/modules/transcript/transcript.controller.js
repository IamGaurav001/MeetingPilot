import * as transcriptService from './transcript.service.js';
import { sendSuccess, sendCreated } from '../../shared/utils/response.js';
import { TranscriptionProviderFactory } from './providers/TranscriptionProvider.js';
import { TranscriptBuffer } from './utils/TranscriptBuffer.js';
import { aiPipelineCoordinator } from '../ai/AIPipelineCoordinator.js';
import { sendNotification } from '../../shared/services/NotificationService.js';

// Cache active buffers per meetingId to maintain separate sessions
const activeBuffers = new Map();

/**
 * POST /api/meetings/:meetingId/transcript/chunks
 */
export async function addChunk(req, res, next) {
  try {
    const { meetingId } = req.params;

    // 1. Resolve transcription provider
    const provider = TranscriptionProviderFactory.getProvider();

    // 2. Transcribe incoming chunk input
    const { text, confidence } = await provider.transcribe(req.body);

    // 3. Persist chunk text segment to PostgreSQL
    const chunkData = {
      speaker: req.body.speaker || 'Speaker',
      text,
      startTime: req.body.startTime || Date.now() / 1000,
      endTime: req.body.endTime || Date.now() / 1000 + 1,
      confidence,
    };
    const savedChunk = await transcriptService.addChunk(meetingId, req.user.userId, chunkData);

    // 4. Immediately notify React client for live transcript rendering
    sendNotification(meetingId, 'transcript:chunk', savedChunk).catch((err) => {
      console.error('[TranscriptController] Live socket broadcast failed:', err);
    });

    // 5. Retrieve or initialize TranscriptBuffer for aggregation (5s pause or 100 words limit)
    let buffer = activeBuffers.get(meetingId);
    if (!buffer) {
      buffer = new TranscriptBuffer(
        { aggregationWindowMs: 5000, maxWordCount: 100 },
        async (aggregatedChunk) => {
          try {
            // Trigger the AI pipeline coordinator asynchronously on flush
            await aiPipelineCoordinator.handleNewChunk(aggregatedChunk);
          } catch (err) {
            console.error('[TranscriptController] Buffered chunk AI pipeline failed:', err);
          }
        },
      );
      activeBuffers.set(meetingId, buffer);
    }

    // 6. Ingest chunk to buffer aggregator
    buffer.add({
      meetingId,
      speaker: savedChunk.speaker,
      text: savedChunk.text,
      startTime: savedChunk.startTime,
      endTime: savedChunk.endTime,
    });

    sendCreated(res, savedChunk);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/meetings/:meetingId/transcript
 */
export async function getTranscript(req, res, next) {
  try {
    const transcript = await transcriptService.getTranscript(req.params.meetingId, req.user.userId);
    sendSuccess(res, { data: transcript });
  } catch (error) {
    next(error);
  }
}
