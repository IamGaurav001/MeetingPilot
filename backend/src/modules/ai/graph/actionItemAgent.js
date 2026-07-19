/**
 * Action Item Agent.
 *
 * Extracts action items from meeting transcripts.
 * Stubbed for Phase 1.
 */

import { logger } from '../../../config/logger.js';
import { withAgentLogging } from './shared/agentUtils.js';

const AGENT_NAME = 'ActionItemAgent';

async function extractActionItems(state) {
  logger.info({ msg: `[${AGENT_NAME}] Analyzing transcript for action items` });

  // Phase 2: Use Gemini to extract action items
  return {
    ...state,
    actionItems: [],
  };
}

export const actionItemStep = withAgentLogging(AGENT_NAME, extractActionItems);
