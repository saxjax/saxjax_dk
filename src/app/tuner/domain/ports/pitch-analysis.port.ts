import { Pitch } from '../models'

/**
 * Strategy interface for pitch detection algorithms.
 * Follows the Strategy pattern to allow for different pitch detection implementations.
 */
export interface PitchDetectionStrategy {
  /**
   * The name of this pitch detection strategy.
   */
  name: string

  /**
   * Detects the pitch from the provided audio data.
   * @param audioData The audio data to analyze
   * @param sampleRate The sample rate of the audio data in Hz
   * @returns A promise that resolves to the detected pitch, or null if no pitch could be detected
   */
  detectPitch(audioData: Float32Array, sampleRate: number): Promise<Pitch | null>
}

/**
 * Port for pitch analysis functionality.
 * Follows the Port/Adapter pattern from Clean Architecture.
 */
export interface PitchAnalysisPort {
  /**
   * Sets the pitch detection strategy to use.
   * @param strategy The strategy to use
   */
  setStrategy(strategy: PitchDetectionStrategy): void

  /**
   * Gets the current pitch detection strategy.
   * @returns The current strategy
   */
  getCurrentStrategy(): PitchDetectionStrategy

  /**
   * Gets all available pitch detection strategies.
   * @returns An array of available strategies
   */
  getAvailableStrategies(): PitchDetectionStrategy[]

  /**
   * Analyzes the provided audio data to detect pitch.
   * Uses the current strategy for detection.
   * @param audioData The audio data to analyze
   * @param sampleRate The sample rate of the audio data in Hz
   * @returns A promise that resolves to the detected pitch, or null if no pitch could be detected
   */
  analyzePitch(audioData: Float32Array, sampleRate: number): Promise<Pitch | null>
}
