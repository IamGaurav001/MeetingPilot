/**
 * Meeting controller.
 *
 * Thin layer — receives requests, calls service, returns responses.
 */

import * as meetingService from './meeting.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/response.js';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination.js';
import { MEETING_STATUS } from '../../shared/constants/meetingStatus.js';

/**
 * POST /api/meetings
 */
export async function create(req, res, next) {
  try {
    const meeting = await meetingService.createMeeting(req.user.userId, req.body);
    sendCreated(res, meeting);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/meetings
 */
export async function getAll(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { meetings, total } = await meetingService.getMeetings(req.user.userId, { skip, limit });
    const meta = buildPaginationMeta(total, page, limit);

    sendSuccess(res, { data: meetings, meta });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/meetings/:id
 */
export async function getById(req, res, next) {
  try {
    const meeting = await meetingService.getMeetingById(req.params.id, req.user.userId);
    sendSuccess(res, { data: meeting });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/meetings/:id
 */
export async function update(req, res, next) {
  try {
    const meeting = await meetingService.updateMeeting(req.params.id, req.user.userId, req.body);
    sendSuccess(res, { data: meeting });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/meetings/:id
 */
export async function remove(req, res, next) {
  try {
    await meetingService.deleteMeeting(req.params.id, req.user.userId);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/meetings/:id/start
 */
export async function start(req, res, next) {
  try {
    const meeting = await meetingService.transitionStatus(
      req.params.id,
      req.user.userId,
      MEETING_STATUS.ACTIVE,
    );
    sendSuccess(res, { data: meeting });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/meetings/:id/stop
 */
export async function stop(req, res, next) {
  try {
    const meeting = await meetingService.transitionStatus(
      req.params.id,
      req.user.userId,
      MEETING_STATUS.COMPLETED,
    );
    sendSuccess(res, { data: meeting });
  } catch (error) {
    next(error);
  }
}
