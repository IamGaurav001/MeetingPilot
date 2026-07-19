/**
 * Observability Pipeline Logger.
 *
 * Implements structured logging wrappers for execution traces.
 */

import { logger } from '../../config/logger.js';
import { latencyTracker } from './LatencyTracker.js';
import { metricsCollector } from './MetricsCollector.js';

export const PipelineLogger = {
  /**
   * Log starting step of AI pipelines.
   */
  startPipeline(pipelineName, metadata = {}) {
    logger.info({
      msg: `[Pipeline] Starting: ${pipelineName}`,
      pipeline: pipelineName,
      ...metadata,
    });
  },

  /**
   * Log successful pipeline step completion along with tracking latency details.
   *
   * @param {string} pipelineName
   * @param {number} durationMs - execution timing in MS
   * @param {object} [metadata]
   */
  completePipeline(pipelineName, durationMs, metadata = {}) {
    logger.info({
      msg: `[Pipeline] Completed: ${pipelineName} | Latency: ${Math.round(durationMs)}ms`,
      pipeline: pipelineName,
      durationMs: Math.round(durationMs),
      ...metadata,
    });
  },

  /**
   * Log pipeline error with metrics tracking.
   */
  errorPipeline(pipelineName, error, metadata = {}) {
    metricsCollector.increment('totalErrorsCaught');
    logger.error({
      msg: `[Pipeline] Failed: ${pipelineName} | Error: ${error.message}`,
      pipeline: pipelineName,
      error: error.message,
      stack: error.stack,
      ...metadata,
    });
  },

  /**
   * Formulate standard debugging report object.
   */
  getObservabilitySummary() {
    return {
      metrics: metricsCollector.getSnapshot(),
      latency: latencyTracker.getSummary(),
      timestamp: new Date().toISOString(),
    };
  },
};
