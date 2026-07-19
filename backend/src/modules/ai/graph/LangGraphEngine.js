/**
 * LangGraph Agent Orchestration Engine.
 *
 * Configures the StateGraph and routes execution across memory, retriever,
 * and specialized agent nodes.
 */

import { StateGraph, END } from '@langchain/langgraph';
import { suggestionStep } from './suggestionAgent.js';
import { actionItemStep } from './actionItemAgent.js';
import { decisionStep } from './decisionAgent.js';
import { summaryStep } from './summaryAgent.js';
import { createAgentState } from './shared/agentState.js';
import { latencyTracker } from '../../../shared/observability/LatencyTracker.js';

// Define graph channels (state schema structure)
const graphState = {
  meetingId: null,
  transcriptChunks: [],
  query: '',
  retrievedContext: [],
  suggestions: [],
  actionItems: [],
  decisions: [],
  summary: null,
  errors: [],
  completedSteps: [],
};

/**
 * Node: Context Builder. Formats retrieved vectors and memory contents.
 */
async function contextNode(state) {
  // Consolidate RAG data
  return {
    ...state,
    completedSteps: [...(state.completedSteps || []), 'ContextNode'],
  };
}

/**
 * Node: Suggestion Agent Node.
 */
async function suggestionNode(state) {
  return suggestionStep(state);
}

/**
 * Node: Action Item Node.
 */
async function actionItemNode(state) {
  return actionItemStep(state);
}

/**
 * Node: Decision Node.
 */
async function decisionNode(state) {
  return decisionStep(state);
}

/**
 * Node: Summary Node.
 */
async function summaryNode(state) {
  return summaryStep(state);
}

/**
 * Node: Standard Router.
 * Acts as a dummy no-op node to split execution path into parallel standard agents.
 */
async function standardRouterNode(state) {
  return state;
}

/**
 * Builds and compiles the LangGraph StateGraph.
 */
function buildGraph() {
  const workflow = new StateGraph({
    channels: graphState,
  });

  // Add processing nodes
  workflow.addNode('context', contextNode);
  workflow.addNode('standardRouter', standardRouterNode);
  workflow.addNode('suggestion', suggestionNode);
  workflow.addNode('actionItem', actionItemNode);
  workflow.addNode('decision', decisionNode);
  workflow.addNode('summaryAgent', summaryNode);

  // Set default entry point
  workflow.setEntryPoint('context');

  // Router logic to select path
  const routeFromContext = (state) => {
    if (state.query === 'Generate final meeting summary') {
      return 'summaryAgent';
    }
    return 'standard';
  };

  // Define conditional edge: route to summary agent or the standard router
  workflow.addConditionalEdges('context', routeFromContext, {
    summaryAgent: 'summaryAgent',
    standard: 'standardRouter',
  });

  // Static parallel edges from standardRouter to downstream analysis agents
  workflow.addEdge('standardRouter', 'suggestion');
  workflow.addEdge('standardRouter', 'actionItem');
  workflow.addEdge('standardRouter', 'decision');

  // Terminate execution paths
  workflow.addEdge('suggestion', END);
  workflow.addEdge('actionItem', END);
  workflow.addEdge('decision', END);
  workflow.addEdge('summaryAgent', END);

  return workflow.compile();
}

const compiledGraph = buildGraph();

/**
 * Runs the LangGraph multi-agent pipeline.
 *
 * @param {object} inputs - Initial state values
 * @returns {Promise<object>} Resulting agent state
 */
export async function runAgentPipeline(inputs) {
  const stopTimer = latencyTracker.startTimer('llm');

  const initialState = createAgentState({
    meetingId: inputs.meetingId,
    transcriptChunks: inputs.transcriptChunks,
    query: inputs.query,
  });

  // Assign inputs loaded from retriever / memory coordinator
  initialState.retrievedContext = inputs.retrievedContext || [];
  initialState.memoryContext = inputs.memoryContext || {};

  try {
    const result = await compiledGraph.invoke(initialState);
    stopTimer();
    return result;
  } catch (error) {
    stopTimer();
    console.error('[LangGraphEngine] Graph execution failed:', error);
    throw error;
  }
}
