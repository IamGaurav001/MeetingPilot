/**
 * Decision Agent.
 *
 * Detects decisions made during meetings.
 * Stubbed for Phase 1.
 */

import { logger } from '../../../config/logger.js';
import { withAgentLogging } from './shared/agentUtils.js';

const AGENT_NAME = 'DecisionAgent';

async function detectDecisions(state) {
  logger.info({ msg: `[${AGENT_NAME}] Analyzing transcript for decisions` });

  // Phase 2: Use Gemini to detect decisions
  return {
    ...state,
    decisions: [],
  };
}

export const decisionStep = withAgentLogging(AGENT_NAME, detectDecisions);
