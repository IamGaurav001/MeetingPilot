/**
 * Kafka Retry and Dead Letter Queue (DLQ) Helper.
 *
 * Implements exponential backoff retry logic for Kafka consumers.
 * Routes permanently failed events to DLQ topic and PostgreSQL FailedEvent table.
 */

import { getPrisma } from '../../../config/database.js';
import { logger } from '../../../config/logger.js';
import { KAFKA_TOPICS } from '../../../shared/constants/kafkaTopics.js';
import { publishEvent } from '../kafka.producer.js';

const DEFAULT_MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;

/**
 * Executes a message handler with exponential backoff retry.
 *
 * @param {string} topic - Current topic
 * @param {object} payload - Event payload
 * @param {Function} handler - Message handler function
 * @param {number} [maxRetries] - Max retry limit (default 5)
 */
export async function runWithRetry(topic, payload, handler, maxRetries = DEFAULT_MAX_RETRIES) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await handler(payload);
      return; // Success, exit
    } catch (error) {
      attempt++;
      logger.warn({
        msg: `Handler failed on topic ${topic}, retrying...`,
        attempt,
        maxRetries,
        error: error.message,
      });

      if (attempt >= maxRetries) {
        logger.error({
          msg: `Max retries reached for topic ${topic}. Routing to DLQ.`,
          error: error.message,
          stack: error.stack,
        });

        await routeToDLQ(topic, payload, error);
        return;
      }

      // Exponential backoff delay
      const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Route permanently failed events to the Dead Letter Queue.
 */
async function routeToDLQ(topic, payload, error) {
  const dlqPayload = {
    originalTopic: topic,
    payload,
    error: error.message,
    errorStack: error.stack,
    failedAt: new Date().toISOString(),
  };

  try {
    // 1. Publish to Kafka DLQ topic
    await publishEvent(KAFKA_TOPICS.DLQ_AI_FAILED, dlqPayload);

    // 2. Persist to PostgreSQL FailedEvent table via Prisma
    const prisma = getPrisma();
    await prisma.failedEvent.create({
      data: {
        topic,
        payload: JSON.stringify(payload),
        errorStack: error.stack || error.message,
      },
    });

    logger.info({ msg: 'Failed event successfully persisted to DLQ database' });
  } catch (dlqError) {
    // Fallback: log to console/file if DB or Kafka is down
    logger.fatal({
      msg: 'CRITICAL: Failed to persist event to DLQ storage',
      originalEvent: dlqPayload,
      persistenceError: dlqError.message,
    });
  }
}
