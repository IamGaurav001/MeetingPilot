/**
 * Shared agent state schema.
 *
 * Defines the state object that flows through all LangGraph agents.
 * Every agent reads from and writes to this shared state.
 */

/**
 * Creates an initial agent state for a meeting context.
 *
 * @param {object} options
 * @param {string} options.meetingId - Current meeting ID
 * @param {Array} [options.transcriptChunks] - Transcript chunks so far
 * @param {string} [options.query] - User query (for suggestion agent)
 * @returns {object} Initial agent state
 */
export function createAgentState({ meetingId, transcriptChunks = [], query = '' }) {
  return {
    meetingId,
    transcriptChunks,
    query,

    // Populated by agents
    retrievedContext: [],
    suggestions: [],
    actionItems: [],
    decisions: [],
    summary: null,

    // Metadata
    errors: [],
    completedSteps: [],
  };
}
