/* eslint-disable no-console */
import { audioDeviceManager } from './AudioDeviceManager.js';
import { MicrophoneProvider, SystemAudioProvider, MixedAudioProvider } from './AudioProvider.js';

let activeProvider = new MicrophoneProvider(); // Default to Microphone

/**
 * Configure the active audio provider.
 *
 * @param {'mic' | 'system' | 'mixed'} type
 */
export function setAudioProviderType(type) {
  switch (type) {
    case 'system':
      activeProvider = new SystemAudioProvider();
      break;
    case 'mixed':
      activeProvider = new MixedAudioProvider();
      break;
    case 'mic':
    default:
      activeProvider = new MicrophoneProvider();
      break;
  }
  console.log(`[CaptureManager] Configured provider type: ${type}`);
}

/**
 * Start audio capture.
 */
export async function startCapture(deviceId = null) {
  if (deviceId) {
    audioDeviceManager.selectDevice(deviceId);
  }
  return activeProvider.start();
}

/**
 * Stop audio capture.
 */
export async function stopCapture() {
  return activeProvider.stop();
}

/**
 * Get current capture status.
 */
export function getCaptureState() {
  const status = activeProvider.status();
  const config = audioDeviceManager.getActiveDeviceConfig();
  return {
    isRecording: status.isRecording,
    provider: status.providerType,
    deviceId: config.deviceId,
    permissionsGranted: config.permissionsGranted,
  };
}
