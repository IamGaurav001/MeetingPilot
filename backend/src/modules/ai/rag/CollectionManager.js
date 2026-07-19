/**
 * Qdrant Vector Collection Manager.
 *
 * Configures and maintains collections in Qdrant Vector DB.
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import config from '../../../config/index.js';
import { logger } from '../../../config/logger.js';

let client = null;

/**
 * Returns QdrantClient singleton.
 */
export function getQdrantClient() {
  if (!client) {
    client = new QdrantClient({
      url: config.qdrant.url,
      ...(config.qdrant.apiKey && { apiKey: config.qdrant.apiKey }),
    });
  }
  return client;
}

/**
 * Ensures the target collection exists in Qdrant.
 * Creates it with Cosine distance and correct dimensions if missing.
 *
 * @param {string} collectionName
 * @param {number} [vectorSize] - Vector size (default 768 for text-embedding-004)
 */
export async function ensureCollection(collectionName, vectorSize = 768) {
  const qdrant = getQdrantClient();

  try {
    const response = await qdrant.getCollections();
    const exists = response.collections.some((c) => c.name === collectionName);

    if (!exists) {
      logger.info({ msg: `Creating Qdrant collection: ${collectionName}`, vectorSize });
      await qdrant.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine',
        },
      });
      logger.info(`Collection ${collectionName} created successfully.`);
    }
  } catch (error) {
    logger.error({
      msg: `Failed to ensure Qdrant collection: ${collectionName}`,
      error: error.message,
    });
    throw error;
  }
}
