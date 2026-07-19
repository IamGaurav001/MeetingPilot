/**
 * Kafka producer.
 *
 * Provides a simple interface to publish events to Kafka topics.
 */

import { getKafkaClient } from './kafka.config.js';
import { logger } from '../../../config/logger.js';

let producer = null;
let isConnected = false;

/**
 * Initialize and connect the producer.
 */
export async function connectProducer() {
  try {
    producer = getKafkaClient().producer();
    await producer.connect();
    isConnected = true;
    logger.info('Kafka producer connected');
  } catch (error) {
    logger.warn({ msg: 'Kafka producer not available', error: error.message });
    isConnected = false;
  }
}

/**
 * Publish an event to a Kafka topic.
 *
 * @param {string} topic - Topic name (use KAFKA_TOPICS constants)
 * @param {object} payload - Event payload (will be JSON.stringified)
 * @param {string} [key] - Optional partition key
 */
export async function publishEvent(topic, payload, key = undefined) {
  if (!isConnected || !producer) {
    logger.warn({ msg: 'Kafka producer not connected — event dropped', topic });
    return;
  }

  try {
    await producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(payload),
          timestamp: Date.now().toString(),
        },
      ],
    });

    logger.info({ msg: 'Event published', topic });
  } catch (error) {
    logger.error({ msg: 'Failed to publish event', topic, error: error.message });
  }
}

/**
 * Disconnect the producer.
 */
export async function disconnectProducer() {
  if (producer && isConnected) {
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
  }
}
