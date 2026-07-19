import { getQdrantClient } from './CollectionManager.js';
import { embedQuery } from './EmbeddingService.js';
import { logger } from '../../../config/logger.js';

const COLLECTION_NAME = 'meeting_transcripts';

/**
 * Retrieves semantically similar chunks.
 *
 * @param {string} query - The query string to search for
 * @param {object} options
 * @param {string} options.meetingId - Current meeting ID
 * @param {number} [options.topK] - Max chunks to retrieve (default 5)
 * @param {boolean} [options.globalSearch] - Search past meetings of the user (default false)
 */
export async function retrieve(query, { meetingId, topK = 5, globalSearch = false } = {}) {
  try {
    const vector = await embedQuery(query);
    const qdrant = getQdrantClient();

    // Configure filter settings
    const filter = {
      must: [],
    };

    if (!globalSearch && meetingId) {
      filter.must.push({
        key: 'meetingId',
        match: { value: meetingId },
      });
    } else if (globalSearch && meetingId) {
      // Exclude the current meeting if searching globally across past meetings
      filter.must.push({
        key: 'meetingId',
        match: { except: [meetingId] },
      });
    }

    const response = await qdrant.search(COLLECTION_NAME, {
      vector,
      limit: topK,
      filter: filter.must.length > 0 ? filter : undefined,
      with_payload: true,
    });

    return response.map((point) => ({
      id: point.id,
      score: point.score,
      ...point.payload,
    }));
  } catch (error) {
    logger.error({ msg: `Failed to retrieve context for query "${query}"`, error: error.message });
    return []; // Return empty array on failure (graceful fallback)
  }
}
