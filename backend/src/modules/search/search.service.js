/**
 * Search service.
 *
 * Provides full-text search across meetings and transcripts.
 * Will be extended with vector search (Qdrant) in later phases.
 */

import { getPrisma } from '../../config/database.js';

/**
 * Search meetings by title or description.
 */
export async function searchMeetings(userId, query, { skip, limit }) {
  const prisma = getPrisma();

  const where = {
    userId,
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
  };

  const [results, total] = await Promise.all([
    prisma.meeting.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.meeting.count({ where }),
  ]);

  return { results, total };
}

/**
 * Search transcript chunks by text content.
 */
export async function searchTranscripts(userId, query, { skip, limit }) {
  const prisma = getPrisma();

  const where = {
    text: { contains: query, mode: 'insensitive' },
    meeting: { userId },
  };

  const [results, total] = await Promise.all([
    prisma.transcriptChunk.findMany({
      where,
      include: {
        meeting: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transcriptChunk.count({ where }),
  ]);

  return { results, total };
}
