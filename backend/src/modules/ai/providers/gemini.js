/**
 * Gemini LLM provider.
 *
 * Wraps the Google Gemini API via LangChain for consistent usage
 * across all AI agents and pipelines.
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import config from '../../../config/index.js';
import { logger } from '../../../config/logger.js';

let model = null;

/**
 * Returns a singleton Gemini model instance.
 *
 * @param {object} options
 * @param {string} [options.modelName] - Gemini model name
 * @param {number} [options.temperature] - Sampling temperature
 * @returns {ChatGoogleGenerativeAI}
 */
export function getGeminiModel({ modelName = 'gemini-1.5-flash', temperature = 0.3 } = {}) {
  if (!config.gemini.apiKey) {
    logger.warn('Gemini API key not configured — AI features will not work');
    return null;
  }

  if (!model) {
    model = new ChatGoogleGenerativeAI({
      apiKey: config.gemini.apiKey,
      modelName,
      temperature,
    });

    logger.info(`Gemini model initialized: ${modelName}`);
  }

  return model;
}
