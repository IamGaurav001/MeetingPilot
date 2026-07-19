/* eslint-disable no-console */
/**
 * Transcription Provider Abstraction.
 *
 * Pluggable Speech-to-Text interface supporting:
 * - Deepgram (Default recommended)
 * - Gemini Speech
 * - OpenAI Whisper
 * - Browser Speech fallback
 */

/**
 * Base Transcription Provider.
 */
export class TranscriptionProvider {
  /**
   * Transcribe a chunk of audio or text input.
   *
   * @param {any} _chunk - Raw audio buffer or transcribed string chunk
   * @returns {Promise<{text: string, confidence: number}>}
   */
  async transcribe(_chunk) {
    throw new Error('Method "transcribe()" must be implemented.');
  }
}

/**
 * Browser Web Speech API fallback.
 * Passes client-transcribed text direct to pipeline.
 */
export class BrowserSpeechProvider extends TranscriptionProvider {
  async transcribe(chunk) {
    // If the client performs native transcription in Renderer,
    // it sends text directly.
    return {
      text: typeof chunk === 'string' ? chunk : chunk.text || '',
      confidence: chunk.confidence || 0.9,
    };
  }
}

/**
 * Deepgram Live Transcription API.
 */
export class DeepgramProvider extends TranscriptionProvider {
  async transcribe(chunk) {
    console.log('[DeepgramProvider] Transcribing audio buffer...');
    // Real implementation would make a WebSocket/REST call to Deepgram API
    // We'll mock the transcribe response for STT abstraction validation
    return {
      text: typeof chunk === 'string' ? chunk : '[Mocked Deepgram Transcription]',
      confidence: 0.98,
    };
  }
}

/**
 * Gemini Speech Transcription (Multimodal Audio).
 */
export class GeminiSpeechProvider extends TranscriptionProvider {
  async transcribe(chunk) {
    console.log('[GeminiSpeechProvider] Transcribing audio using Gemini Multimodal...');
    return {
      text: typeof chunk === 'string' ? chunk : '[Mocked Gemini Multimodal Transcription]',
      confidence: 0.92,
    };
  }
}

/**
 * OpenAI Whisper Transcription API.
 */
export class WhisperProvider extends TranscriptionProvider {
  async transcribe(chunk) {
    console.log('[WhisperProvider] Transcribing audio using OpenAI Whisper...');
    return {
      text: typeof chunk === 'string' ? chunk : '[Mocked Whisper Transcription]',
      confidence: 0.95,
    };
  }
}

/**
 * Factory class to retrieve active Transcription Provider based on config.
 */
export class TranscriptionProviderFactory {
  /**
   * Get provider instance.
   *
   * @param {string} [type] - Optional override, defaults to env provider config
   */
  static getProvider(type) {
    // Read from env (could default to deepgram)
    const providerType = type || process.env.TRANSCRIPTION_PROVIDER || 'deepgram';

    switch (providerType.toLowerCase()) {
      case 'browser':
        return new BrowserSpeechProvider();
      case 'gemini':
        return new GeminiSpeechProvider();
      case 'whisper':
        return new WhisperProvider();
      case 'deepgram':
      default:
        return new DeepgramProvider();
    }
  }
}
