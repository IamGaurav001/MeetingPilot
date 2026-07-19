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
 * Builds and compiles the LangGraph StateGraph.
 */
function buildGraph() {
  const workflow = new StateGraph({
    channels: graphState,
  });

  // Add processing nodes
  workflow.addNode('context', contextNode);
  workflow.addNode('suggestion', suggestionNode);
  workflow.addNode('actionItem', actionItemNode);
  workflow.addNode('decision', decisionNode);
  workflow.addNode('summary', summaryNode);

  // Set default entry point
  workflow.setEntryPoint('context');

  // Define edges: run suggestion, action items, and decisions in parallel, then finish
  workflow.addEdge('context', 'suggestion');
  workflow.addEdge('context', 'actionItem');
  workflow.addEdge('context', 'decision');

  // Terminate execution paths
  workflow.addEdge('suggestion', END);
  workflow.addEdge('actionItem', END);
  workflow.addEdge('decision', END);

  // Summary node is invoked separately on meeting.ended (direct or separate pipeline trigger)
  workflow.addEdge('summary', END);

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
