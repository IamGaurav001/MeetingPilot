/**
 * AI Embedding Service.
 *
 * Generates vector embeddings for text chunks using Gemini text-embedding-004.
 */

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import config from '../../../config/index.js';
import { logger } from '../../../config/logger.js';
import { latencyTracker } from '../../../shared/observability/LatencyTracker.js'; // Note: observability path is shared/observability

let embeddingsModel = null;

/**
 * Returns the LangChain Google GenAI Embeddings model instance.
 */
function getEmbeddingsModel() {
  if (!config.gemini.apiKey) {
    logger.warn('Gemini API key missing — vector embeddings will use mocked fallback');
    return null;
  }

  if (!embeddingsModel) {
    embeddingsModel = new GoogleGenerativeAIEmbeddings({
      apiKey: config.gemini.apiKey,
      modelName: 'text-embedding-004',
    });
  }
  return embeddingsModel;
}

/**
 * Generates a vector embedding for a single text document.
 *
 * @param {string} text
 * @returns {Promise<Array<number>>} Vector representation (768 dimensions)
 */
export async function embedQuery(text) {
  const model = getEmbeddingsModel();

  if (!model) {
    // Return mock 768-dimension vector
    return new Array(768).fill(0).map(() => Math.random());
  }

  const stopTimer = latencyTracker.startTimer('embedding');
  try {
    const vector = await model.embedQuery(text);
    stopTimer();
    return vector;
  } catch (error) {
    stopTimer();
    logger.error({ msg: 'Embedding generation failed', error: error.message });
    throw error;
  }
}

/**
 * Generates vector embeddings for a batch of text documents.
 *
 * @param {Array<string>} documents
 * @returns {Promise<Array<Array<number>>>} Batch vector representation
 */
export async function embedDocuments(documents) {
  const model = getEmbeddingsModel();

  if (!model) {
    // Return mock 768-dimension vectors
    return documents.map(() => new Array(768).fill(0).map(() => Math.random()));
  }

  const stopTimer = latencyTracker.startTimer('embedding');
  try {
    const vectors = await model.embedDocuments(documents);
    stopTimer();
    return vectors;
  } catch (error) {
    stopTimer();
    logger.error({ msg: 'Batch embedding generation failed', error: error.message });
    throw error;
  }
}
