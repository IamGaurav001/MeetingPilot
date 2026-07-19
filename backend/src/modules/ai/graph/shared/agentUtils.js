/**
 * Shared agent utilities.
 *
 * Common helpers used across all LangGraph agents.
 */

import { logger } from '../../../../config/logger.js';

/**
 * Wraps an agent step with logging and error handling.
 *
 * @param {string} agentName - Name of the agent for logging
 * @param {Function} stepFn - The agent step function
 * @returns {Function} Wrapped step function
 */
export function withAgentLogging(agentName, stepFn) {
  return async (state) => {
    logger.info({ msg: `[${agentName}] Starting` });

    try {
      const result = await stepFn(state);
      logger.info({ msg: `[${agentName}] Completed` });
      return {
        ...result,
        completedSteps: [...(state.completedSteps || []), agentName],
      };
    } catch (error) {
      logger.error({ msg: `[${agentName}] Failed`, error: error.message });
      return {
        ...state,
        errors: [...(state.errors || []), { agent: agentName, error: error.message }],
      };
    }
  };
}

/**
 * Formats transcript chunks into a single text block for prompt injection.
 *
 * @param {Array} chunks - Transcript chunks
 * @returns {string} Formatted transcript text
 */
export function formatTranscriptForPrompt(chunks) {
  return chunks.map((chunk) => `[${chunk.speaker}]: ${chunk.text}`).join('\n');
}
