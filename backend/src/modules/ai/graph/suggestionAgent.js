/**
 * Suggestion Agent.
 *
 * Generates real-time AI suggestions during active meetings
 * based on the current conversation context.
 *
 * Stubbed for Phase 1 — agent graph will be wired in Phase 2.
 */

import { logger } from '../../../config/logger.js';
import { withAgentLogging, formatTranscriptForPrompt } from './shared/agentUtils.js';

const AGENT_NAME = 'SuggestionAgent';

/**
 * Generate suggestions based on recent transcript context.
 */
async function generateSuggestions(state) {
  const transcript = formatTranscriptForPrompt(state.transcriptChunks.slice(-10));

  logger.info({ msg: `[${AGENT_NAME}] Processing ${state.transcriptChunks.length} chunks` });

  // Phase 1: Stub
  // Phase 2: Use Gemini via LangGraph StateGraph
  return {
    ...state,
    suggestions: [
      {
        type: 'suggestion',
        content: '[Suggestion agent not yet connected — Phase 2]',
        confidence: 0,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export const suggestionStep = withAgentLogging(AGENT_NAME, generateSuggestions);
