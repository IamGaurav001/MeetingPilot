/**
 * Observability Metrics Collector.
 *
 * Tracks pipeline counters, errors, and system status markers.
 */

class MetricsCollector {
  constructor() {
    this.counters = {
      totalTranscriptsIngested: 0,
      totalEmbeddingsGenerated: 0,
      totalSuggestionsServed: 0,
      totalActionItemsDetected: 0,
      totalDecisionsDetected: 0,
      totalSummariesGenerated: 0,
      totalErrorsCaught: 0,
      activeWebSocketConnections: 0,
    };
  }

  /**
   * Increment a counter metric.
   *
   * @param {string} name - Name of the counter
   * @param {number} [val] - Value increment (default 1)
   */
  increment(name, val = 1) {
    if (name in this.counters) {
      this.counters[name] += val;
    }
  }

  /**
   * Decrement a counter metric.
   */
  decrement(name, val = 1) {
    if (name in this.counters) {
      this.counters[name] = Math.max(0, this.counters[name] - val);
    }
  }

  /**
   * Set directly.
   */
  set(name, value) {
    if (name in this.counters) {
      this.counters[name] = value;
    }
  }

  /**
   * Get all counters.
   */
  getSnapshot() {
    return { ...this.counters };
  }
}

export const metricsCollector = new MetricsCollector();
