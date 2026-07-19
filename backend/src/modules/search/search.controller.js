/**
 * Search controller.
 */

import * as searchService from './search.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination.js';

/**
 * GET /api/search?q=...&type=meetings|transcripts
 */
export async function search(req, res, next) {
  try {
    const { q, type = 'meetings' } = req.query;

    if (!q || q.trim().length === 0) {
      return sendSuccess(res, { data: [], meta: buildPaginationMeta(0, 1, 20) });
    }

    const { page, limit, skip } = parsePagination(req.query);

    let results;
    let total;

    if (type === 'transcripts') {
      const data = await searchService.searchTranscripts(req.user.userId, q, { skip, limit });
      results = data.results;
      total = data.total;
    } else {
      const data = await searchService.searchMeetings(req.user.userId, q, { skip, limit });
      results = data.results;
      total = data.total;
    }

    const meta = buildPaginationMeta(total, page, limit);
    sendSuccess(res, { data: results, meta });
  } catch (error) {
    next(error);
  }
}
