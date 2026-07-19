/**
 * Prisma client singleton.
 *
 * Ensures only one PrismaClient instance exists across the application.
 * Provides connect/disconnect helpers for lifecycle management.
 */

import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

let prisma = null;

/**
 * Returns the singleton PrismaClient instance.
 * Creates it on first call.
 */
export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    prisma.$on('error', (event) => {
      logger.error({ msg: 'Prisma error', error: event.message });
    });

    prisma.$on('warn', (event) => {
      logger.warn({ msg: 'Prisma warning', warning: event.message });
    });
  }

  return prisma;
}

/**
 * Connects to the database.
 * Called once during server startup.
 */
export async function connectDatabase() {
  const client = getPrisma();
  await client.$connect();
  logger.info('Database connected');
}

/**
 * Disconnects from the database.
 * Called during graceful shutdown.
 */
export async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
}
