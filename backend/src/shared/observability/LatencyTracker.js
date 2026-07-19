/**
 * Observability Latency Tracker.
 *
 * Measures duration metrics for external API calls, DB requests, and pipeline events.
 */

class LatencyTracker {
  constructor() {
    this.metrics = {};
  }

  /**
   * Starts a timer for a specific operation.
   * Returns a function that, when called, stops the timer and saves the duration.
   *
   * @param {string} operationName - e.g. 'llm', 'embedding', 'database', 'socket'
   * @returns {Function} stopTimer function
   */
  startTimer(operationName) {
    const start = process.hrtime();

    return () => {
      const diff = process.hrtime(start);
      const durationMs = (diff[0] * 1e9 + diff[1]) / 1e6; // Convert nanoseconds to milliseconds

      if (!this.metrics[operationName]) {
        this.metrics[operationName] = [];
      }

      this.metrics[operationName].push({
        durationMs,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 100 entries to prevent memory leak
      if (this.metrics[operationName].length > 100) {
        this.metrics[operationName].shift();
      }

      return durationMs;
    };
  }

  /**
   * Get average and latest latency metrics.
   *
   * @param {string} operationName
   */
  getMetrics(operationName) {
    const history = this.metrics[operationName] || [];
    if (history.length === 0) {
      return { averageMs: 0, latestMs: 0, count: 0 };
    }

    const latestMs = history[history.length - 1].durationMs;
    const sum = history.reduce((acc, entry) => acc + entry.durationMs, 0);
    const averageMs = sum / history.length;

    return {
      averageMs: Math.round(averageMs * 100) / 100,
      latestMs: Math.round(latestMs * 100) / 100,
      count: history.length,
    };
  }

  /**
   * Get metrics summary for all monitored operations.
   */
  getSummary() {
    const summary = {};
    Object.keys(this.metrics).forEach((op) => {
      summary[op] = this.getMetrics(op);
    });
    return summary;
  }
}

export const latencyTracker = new LatencyTracker();
