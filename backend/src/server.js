/**
 * Server entry point.
 *
 * Starts the HTTP server and handles graceful shutdown.
 */

import app from './app.js';
import config from './config/index.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const server = app.listen(config.port, async () => {
  try {
    await connectDatabase();
    logger.info(`Server running on port ${config.port} [${config.env}]`);
  } catch (error) {
    logger.error({ msg: 'Failed to start server', error: error.message });
    process.exit(1);
  }
});

// ---- Graceful Shutdown ----

async function shutdown(signal) {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    await disconnectDatabase();
    logger.info('Server shut down gracefully');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown — timeout exceeded');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ msg: 'Unhandled Rejection', reason });
});

process.on('uncaughtException', (error) => {
  logger.error({ msg: 'Uncaught Exception', error: error.message, stack: error.stack });
  process.exit(1);
});
