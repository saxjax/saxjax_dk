/**
 * Port for audio capture functionality.
 * Follows the Port/Adapter pattern from Clean Architecture.
 */
export interface AudioCapturePort {
  /**
   * Requests permission to access the microphone.
   * @returns A promise that resolves to true if permission is granted, false otherwise
   */
  requestPermission(): Promise<boolean>

  /**
   * Starts capturing audio from the microphone.
   * @returns A promise that resolves when capture has started
   * @throws Error if microphone access is denied or unavailable
   */
  startCapture(): Promise<void>

  /**
   * Stops capturing audio from the microphone.
   * @returns A promise that resolves when capture has stopped
   */
  stopCapture(): Promise<void>

  /**
   * Gets the audio stream as a readable stream of audio data.
   * @returns A readable stream of Float32Array audio data
   * @throws Error if capture has not been started
   */
  getAudioStream(): ReadableStream<Float32Array>

  /**
   * Checks if audio capture is currently active.
   * @returns True if audio is being captured, false otherwise
   */
  isCapturing(): boolean
}
