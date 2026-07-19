/**
 * Summary Agent.
 *
 * Generates meeting summaries after a meeting ends.
 * Stubbed for Phase 1.
 */

import { logger } from '../../../config/logger.js';
import { withAgentLogging } from './shared/agentUtils.js';

const AGENT_NAME = 'SummaryAgent';

async function generateSummary(state) {
  logger.info({ msg: `[${AGENT_NAME}] Generating meeting summary` });

  // Phase 2: Use Gemini to generate comprehensive summary
  return {
    ...state,
    summary: {
      content: '[Summary agent not yet connected — Phase 2]',
      keyPoints: [],
      generatedAt: new Date().toISOString(),
    },
  };
}

export const summaryStep = withAgentLogging(AGENT_NAME, generateSummary);
