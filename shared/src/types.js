/**
 * Shared JSDoc type definitions.
 *
 * These types are used for IDE autocompletion across backend and desktop.
 * No runtime impact — pure documentation.
 */

/**
 * @typedef {Object} Meeting
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} status - One of MEETING_STATUS values
 * @property {string[]} participants
 * @property {string|null} scheduledAt
 * @property {string|null} startedAt
 * @property {string|null} endedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} TranscriptChunk
 * @property {string} id
 * @property {string} speaker
 * @property {string} text
 * @property {number} startTime
 * @property {number} endTime
 * @property {number} confidence
 * @property {string} meetingId
 */

/**
 * @typedef {Object} ActionItem
 * @property {string} id
 * @property {string} text
 * @property {string|null} assignee
 * @property {string|null} dueDate
 * @property {boolean} isCompleted
 */

/**
 * @typedef {Object} Decision
 * @property {string} id
 * @property {string} text
 * @property {string|null} context
 * @property {string|null} madeBy
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} [data]
 * @property {Object} [error]
 * @property {string} error.code
 * @property {string} error.message
 * @property {Object} [meta]
 */
