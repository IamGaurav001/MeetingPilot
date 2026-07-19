/**
 * Semantic chunker.
 *
 * Breaks transcript text into semantically meaningful chunks
 * for embedding and vector storage.
 * Stubbed for Phase 1.
 */

import { logger } from '../../../config/logger.js';

/**
 * Chunk transcript text into semantic segments.
 *
 * @param {string} text - Raw transcript text
 * @param {object} options
 * @param {number} [options.maxChunkSize] - Maximum characters per chunk
 * @param {number} [options.overlap] - Character overlap between chunks
 * @returns {Array<{text: string, metadata: object}>}
 */
export function chunkText(text, { maxChunkSize = 1000, overlap = 200 } = {}) {
  logger.info({ msg: 'Chunking text', length: text.length, maxChunkSize, overlap });

  // Phase 1: Simple character-based splitting
  // Phase 2: Replace with semantic chunking (sentence boundaries, topic shifts)
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length);
    chunks.push({
      text: text.slice(start, end),
      metadata: {
        startOffset: start,
        endOffset: end,
        chunkIndex: chunks.length,
      },
    });
    start = end - overlap;

    if (start >= text.length) {
      break;
    }
  }

  return chunks;
}
