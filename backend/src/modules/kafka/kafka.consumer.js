/**
 * Kafka consumer.
 *
 * Provides a simple interface to subscribe to Kafka topics
 * and process events.
 */

import { getKafkaClient } from './kafka.config.js';
import { logger } from '../../../config/logger.js';

let consumer = null;

/**
 * Create and connect a consumer for the given group.
 *
 * @param {string} groupId - Consumer group ID
 */
export async function connectConsumer(groupId = 'meetingpilot-group') {
  try {
    consumer = getKafkaClient().consumer({ groupId });
    await consumer.connect();
    logger.info(`Kafka consumer connected [group: ${groupId}]`);
  } catch (error) {
    logger.warn({ msg: 'Kafka consumer not available', error: error.message });
  }
}

/**
 * Subscribe to a topic and process messages.
 *
 * @param {string} topic - Topic to subscribe to
 * @param {Function} handler - Async function to handle each message
 */
export async function subscribe(topic, handler) {
  if (!consumer) {
    logger.warn({ msg: 'Kafka consumer not connected — cannot subscribe', topic });
    return;
  }

  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic: t, partition, message }) => {
      try {
        const payload = JSON.parse(message.value.toString());

        logger.info({ msg: 'Event received', topic: t, partition });

        await handler(payload);
      } catch (error) {
        logger.error({ msg: 'Failed to process event', topic: t, error: error.message });
      }
    },
  });
}

/**
 * Disconnect the consumer.
 */
export async function disconnectConsumer() {
  if (consumer) {
    await consumer.disconnect();
    logger.info('Kafka consumer disconnected');
  }
}
