/**
 * RAG Vector Indexer.
 *
 * Embeds transcript chunks and indexes them into Qdrant vector database.
 */

import { getQdrantClient, ensureCollection } from './CollectionManager.js';
import { embedQuery } from './EmbeddingService.js';
import { logger } from '../../../config/logger.js';
import { metricsCollector } from '../../../shared/observability/MetricsCollector.js';

const COLLECTION_NAME = 'meeting_transcripts';

/**
 * Indexes a transcript chunk into Qdrant.
 *
 * @param {object} chunk - The transcript chunk object from PostgreSQL
 */
export async function indexChunk(chunk) {
  try {
    // 1. Ensure collection exists
    await ensureCollection(COLLECTION_NAME);

    // 2. Generate vector embedding
    const vector = await embedQuery(chunk.text);

    // 3. Upsert payload into Qdrant
    const qdrant = getQdrantClient();
    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: chunk.id,
          vector,
          payload: {
            meetingId: chunk.meetingId,
            speaker: chunk.speaker,
            text: chunk.text,
            startTime: chunk.startTime,
            endTime: chunk.endTime,
            createdAt: chunk.createdAt || new Date().toISOString(),
          },
        },
      ],
    });

    metricsCollector.increment('totalEmbeddingsGenerated');
    logger.info({ msg: 'Chunk successfully indexed in Qdrant', chunkId: chunk.id });
  } catch (error) {
    logger.error({ msg: `Failed to index chunk ${chunk.id} in Qdrant`, error: error.message });
    throw error;
  }
}
