/**
 * Audio capture manager.
 *
 * Pluggable interface for capturing audio from meetings.
 * Phase 1: Stubbed — actual implementation depends on audio strategy
 * (system audio, mic, or both).
 */

/**
 * @typedef {Object} AudioCaptureState
 * @property {boolean} isRecording
 * @property {string|null} deviceId
 * @property {number} sampleRate
 */

let state = {
  isRecording: false,
  deviceId: null,
  sampleRate: 16000,
};

/**
 * Start audio capture.
 */
export async function startCapture(deviceId = null) {
  state = { ...state, isRecording: true, deviceId };
  // Phase 2: Initialize actual audio capture
  return state;
}

/**
 * Stop audio capture.
 */
export async function stopCapture() {
  state = { ...state, isRecording: false };
  // Phase 2: Clean up audio resources
  return state;
}

/**
 * Get current capture state.
 */
export function getCaptureState() {
  return { ...state };
}
