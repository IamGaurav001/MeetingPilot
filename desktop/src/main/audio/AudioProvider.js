/* eslint-disable no-console */
/**
 * Audio Provider Abstractions.
 *
 * Defines the AudioProvider base interface and concrete providers:
 * - MicrophoneProvider
 * - SystemAudioProvider (loopback)
 * - MixedAudioProvider (merged inputs)
 */

import { audioDeviceManager } from './AudioDeviceManager.js';

/**
 * Base Audio Provider interface.
 */
export class AudioProvider {
  constructor() {
    this.isRecording = false;
  }

  async start() {
    throw new Error('Method "start()" must be implemented.');
  }

  async stop() {
    throw new Error('Method "stop()" must be implemented.');
  }

  status() {
    return {
      isRecording: this.isRecording,
      providerType: this.constructor.name,
    };
  }
}

/**
 * Capture microphone inputs.
 */
export class MicrophoneProvider extends AudioProvider {
  async start() {
    const hasPermission = await audioDeviceManager.checkPermissions();
    if (!hasPermission) {
      throw new Error('Microphone permission denied.');
    }

    const { deviceId } = audioDeviceManager.getActiveDeviceConfig();
    this.isRecording = true;
    console.log(`[MicrophoneProvider] Recording started on device: ${deviceId}`);
    return { recording: true, deviceId };
  }

  async stop() {
    this.isRecording = false;
    console.log('[MicrophoneProvider] Recording stopped.');
    return { recording: false };
  }
}

/**
 * Capture system desktop audio (loopback).
 */
export class SystemAudioProvider extends AudioProvider {
  async start() {
    this.isRecording = true;
    console.log('[SystemAudioProvider] Desktop audio loopback capture started.');
    // Phase 2: Connect native desktop audio loopback (e.g. via desktopCapturer)
    return { recording: true, deviceId: 'system-loopback' };
  }

  async stop() {
    this.isRecording = false;
    console.log('[SystemAudioProvider] Desktop audio loopback capture stopped.');
    return { recording: false };
  }
}

/**
 * Capture and mix Microphone + System audio inputs.
 */
export class MixedAudioProvider extends AudioProvider {
  constructor() {
    super();
    this.micProvider = new MicrophoneProvider();
    this.systemProvider = new SystemAudioProvider();
  }

  async start() {
    const micRes = await this.micProvider.start();
    const systemRes = await this.systemProvider.start();
    this.isRecording = true;
    console.log('[MixedAudioProvider] Combined mic and system audio capture started.');
    return {
      recording: true,
      micDevice: micRes.deviceId,
      systemDevice: systemRes.deviceId,
    };
  }

  async stop() {
    await this.micProvider.stop();
    await this.systemProvider.stop();
    this.isRecording = false;
    console.log('[MixedAudioProvider] Combined audio capture stopped.');
    return { recording: false };
  }
}
