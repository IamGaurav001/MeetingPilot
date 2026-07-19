/**
 * Logger configuration using Pino.
 *
 * Structured JSON logging in production, pretty-printed in development.
 */

import pino from 'pino';
import config from './index.js';

const isDev = config.env === 'development';

export const logger = pino({
  level: config.log.level,

  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});
