/**
 * Kafka configuration.
 *
 * Initializes and manages the KafkaJS client.
 * Stubbed for Phase 1 — Kafka connection is optional for local dev.
 */

import { Kafka } from 'kafkajs';
import config from '../../../config/index.js';
import { logger } from '../../../config/logger.js';

let kafka = null;

/**
 * Returns the singleton Kafka client.
 */
export function getKafkaClient() {
  if (!kafka) {
    kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
      retry: {
        initialRetryTime: 300,
        retries: 5,
      },
    });
  }

  return kafka;
}

/**
 * Connect and verify Kafka is reachable.
 * Returns false if Kafka is unavailable (non-blocking).
 */
export async function connectKafka() {
  try {
    const admin = getKafkaClient().admin();
    await admin.connect();
    await admin.disconnect();
    logger.info('Kafka connected');
    return true;
  } catch (error) {
    logger.warn({ msg: 'Kafka not available — running without event streaming', error: error.message });
    return false;
  }
}
