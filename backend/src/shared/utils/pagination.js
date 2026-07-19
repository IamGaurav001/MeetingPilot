/**
 * Pagination helpers.
 *
 * Parses pagination params from query strings and builds
 * pagination metadata for responses.
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parses page and limit from query parameters.
 *
 * @param {object} query - Express req.query
 * @returns {{ page: number, limit: number, skip: number }}
 */
export function parsePagination(query) {
  let page = parseInt(query.page, 10) || DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (page < 1) {
    page = DEFAULT_PAGE;
  }

  if (limit < 1) {
    limit = DEFAULT_LIMIT;
  }

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Builds pagination metadata for API responses.
 *
 * @param {number} total - Total record count
 * @param {number} page - Current page
 * @param {number} limit - Records per page
 * @returns {object} Pagination meta object
 */
export function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
