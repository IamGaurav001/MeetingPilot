/**
 * Centralized configuration loader.
 *
 * Reads environment variables and exposes a frozen config object.
 * Fails fast if required variables are missing.
 */

import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env relative to this config file (two levels up in backend root, or root workspace folder)
// First try backend root .env, then fallback to workspace root .env
dotenvConfig({ path: join(__dirname, '..', '..', '.env') });
dotenvConfig({ path: join(__dirname, '..', '..', '..', '.env') });

/**
 * Validates that all required environment variables are present.
 * Throws on missing values — fail fast at startup, not at runtime.
 */
function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Optional environment variable with a default fallback.
 */
function optionalEnv(name, fallback) {
  return process.env[name] || fallback;
}

const config = Object.freeze({
  env: optionalEnv('NODE_ENV', 'development'),
  port: parseInt(optionalEnv('PORT', '3001'), 10),

  database: {
    url: requireEnv('DATABASE_URL'),
  },

  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '15m'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  gemini: {
    apiKey: optionalEnv('GEMINI_API_KEY', ''),
  },

  qdrant: {
    url: optionalEnv('QDRANT_URL', 'http://localhost:6333'),
    apiKey: optionalEnv('QDRANT_API_KEY', ''),
  },

  kafka: {
    brokers: optionalEnv('KAFKA_BROKERS', 'localhost:9092').split(','),
    clientId: optionalEnv('KAFKA_CLIENT_ID', 'meetingpilot'),
  },

  log: {
    level: optionalEnv('LOG_LEVEL', 'info'),
  },
});

export default config;
