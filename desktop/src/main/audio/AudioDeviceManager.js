/* eslint-disable no-console */
/**
 * Audio Device Manager (Centralized).
 *
 * Coordinates system-level permissions and manages audio devices
 * in the Electron main process.
 */

import { systemPreferences } from 'electron';

class AudioDeviceManager {
  constructor() {
    this.selectedDeviceId = 'default';
    this.permissionsGranted = false;
  }

  /**
   * Check microphone access permissions.
   * On macOS, this uses systemPreferences.askForMediaAccess.
   */
  async checkPermissions() {
    if (process.platform !== 'darwin') {
      // Windows/Linux permissions are usually handled at runtime by Chromium
      this.permissionsGranted = true;
      return true;
    }

    try {
      const status = systemPreferences.getMediaAccessStatus('microphone');
      if (status === 'granted') {
        this.permissionsGranted = true;
        return true;
      }

      // If not determined, request media access
      if (status === 'not-determined') {
        const granted = await systemPreferences.askForMediaAccess('microphone');
        this.permissionsGranted = granted;
        return granted;
      }

      this.permissionsGranted = false;
      return false;
    } catch (error) {
      console.error('[AudioDeviceManager] Permission check failed:', error);
      this.permissionsGranted = false;
      return false;
    }
  }

  /**
   * Set the active input device ID.
   *
   * @param {string} deviceId - ID of the hardware microphone/device
   */
  selectDevice(deviceId) {
    this.selectedDeviceId = deviceId || 'default';
    console.log(`[AudioDeviceManager] Device selected: ${this.selectedDeviceId}`);
    return this.selectedDeviceId;
  }

  /**
   * Get currently active device configuration.
   */
  getActiveDeviceConfig() {
    return {
      deviceId: this.selectedDeviceId,
      permissionsGranted: this.permissionsGranted,
    };
  }
}

export const audioDeviceManager = new AudioDeviceManager();
