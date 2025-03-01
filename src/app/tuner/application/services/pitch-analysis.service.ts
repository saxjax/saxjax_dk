import { Injectable } from '@angular/core'
import { Pitch } from '../../domain/models'
import { PitchAnalysisPort, PitchDetectionStrategy } from '../../domain/ports'

/**
 * Implementation of the Autocorrelation pitch detection algorithm.
 * Follows the Strategy pattern for interchangeable algorithms.
 */
class AutocorrelationStrategy implements PitchDetectionStrategy {
  name = 'Autocorrelation'

  /**
   * Detects pitch using the autocorrelation algorithm.
   * @param audioData The audio data to analyze
   * @param sampleRate The sample rate of the audio data in Hz
   * @returns A promise that resolves to the detected pitch, or null if no pitch could be detected
   */
  async detectPitch(audioData: Float32Array, sampleRate: number): Promise<Pitch | null> {
    // Find the fundamental frequency using autocorrelation
    const frequency = this.findFundamentalFrequency(audioData, sampleRate)
    if (!frequency) {
      return null
    }

    // Create a pitch object from the frequency
    return Pitch.fromFrequency(frequency)
  }

  /**
   * Finds the fundamental frequency using autocorrelation.
   * @param buffer The audio buffer to analyze
   * @param sampleRate The sample rate of the audio data in Hz
   * @returns The fundamental frequency in Hz, or null if none could be detected
   * @private
   */
  private findFundamentalFrequency(buffer: Float32Array, sampleRate: number): number | null {
    // Normalize the buffer
    const normalizedBuffer = this.normalizeBuffer(buffer)

    // Calculate autocorrelation
    const correlations = new Float32Array(normalizedBuffer.length / 2)

    for (let lag = 0; lag < correlations.length; lag++) {
      let sum = 0
      for (let i = 0; i < correlations.length; i++) {
        sum += normalizedBuffer[i] * normalizedBuffer[i + lag]
      }
      correlations[lag] = sum
    }

    // Find the highest peak after the initial drop
    let peakIndex = -1
    let peakValue = 0

    // Skip the first few values to avoid the initial peak at zero lag
    for (let i = 10; i < correlations.length; i++) {
      if (correlations[i] > peakValue) {
        peakValue = correlations[i]
        peakIndex = i
      }
    }

    if (peakIndex === -1 || peakValue < 0.1) {
      return null
    }

    // Convert peak index to frequency
    return sampleRate / peakIndex
  }

  /**
   * Normalizes an audio buffer to have values between -1 and 1.
   * @param buffer The buffer to normalize
   * @returns The normalized buffer
   * @private
   */
  private normalizeBuffer(buffer: Float32Array): Float32Array {
    // Find the maximum absolute value
    let max = 0
    for (const value of buffer) {
      const abs = Math.abs(value)
      if (abs > max) {
        max = abs
      }
    }

    // Normalize if max is greater than 0
    if (max > 0) {
      const normalized = new Float32Array(buffer.length)
      for (let i = 0; i < buffer.length; i++) {
        normalized[i] = buffer[i] / max
      }
      return normalized
    }

    return buffer
  }
}

/**
 * Implementation of the YIN pitch detection algorithm.
 * Follows the Strategy pattern for interchangeable algorithms.
 */
class YINStrategy implements PitchDetectionStrategy {
  name = 'YIN Algorithm'

  /**
   * Detects pitch using the YIN algorithm.
   * @param audioData The audio data to analyze
   * @param sampleRate The sample rate of the audio data in Hz
   * @returns A promise that resolves to the detected pitch, or null if no pitch could be detected
   */
  async detectPitch(audioData: Float32Array, sampleRate: number): Promise<Pitch | null> {
    // Find the fundamental frequency using YIN
    const frequency = this.findFundamentalFrequency(audioData, sampleRate)
    if (!frequency) return null

    // Create a pitch object from the frequency
    return Pitch.fromFrequency(frequency)
  }

  /**
   * Finds the fundamental frequency using the YIN algorithm.
   * @param buffer The audio buffer to analyze
   * @param sampleRate The sample rate of the audio data in Hz
   * @returns The fundamental frequency in Hz, or null if none could be detected
   * @private
   */
  private findFundamentalFrequency(buffer: Float32Array, sampleRate: number): number | null {
    // Implementation of the YIN algorithm
    // Based on the paper "YIN, a fundamental frequency estimator for speech and music"
    // by Alain de Cheveigné and Hideki Kawahara

    const threshold = 0.1 // Default threshold
    const bufferSize = buffer.length
    const yinBuffer = new Float32Array(bufferSize / 2)

    // Step 1: Calculate the difference function
    for (let tau = 0; tau < yinBuffer.length; tau++) {
      yinBuffer[tau] = 0
      for (let i = 0; i < yinBuffer.length; i++) {
        const delta = buffer[i] - buffer[i + tau]
        yinBuffer[tau] += delta * delta
      }
    }

    // Step 2: Calculate the cumulative mean normalized difference function
    yinBuffer[0] = 1
    let runningSum = 0
    for (let tau = 1; tau < yinBuffer.length; tau++) {
      runningSum += yinBuffer[tau]
      yinBuffer[tau] = (yinBuffer[tau] * tau) / runningSum
    }

    // Step 3: Find the first minimum below the threshold
    let tau = 2 // Start at tau = 2 to avoid very high frequencies
    while (tau < yinBuffer.length) {
      if (yinBuffer[tau] < threshold) {
        // Find the minimum in this region
        while (tau + 1 < yinBuffer.length && yinBuffer[tau + 1] < yinBuffer[tau]) {
          tau++
        }
        return sampleRate / tau
      }
      tau++
    }

    // No pitch found below threshold
    return null
  }
}

/**
 * Service for analyzing audio data to detect pitch.
 * Implements the PitchAnalysisPort interface from the domain layer.
 * Uses the Strategy pattern to support different pitch detection algorithms.
 */
@Injectable({
  providedIn: 'root',
})
export class PitchAnalysisService implements PitchAnalysisPort {
  private strategies: PitchDetectionStrategy[] = [new AutocorrelationStrategy(), new YINStrategy()]

  private currentStrategy: PitchDetectionStrategy = this.strategies[0]

  /**
   * Sets the pitch detection strategy to use.
   * @param strategy The strategy to use
   */
  setStrategy(strategy: PitchDetectionStrategy): void {
    this.currentStrategy = strategy
  }

  /**
   * Gets the current pitch detection strategy.
   * @returns The current strategy
   */
  getCurrentStrategy(): PitchDetectionStrategy {
    return this.currentStrategy
  }

  /**
   * Gets all available pitch detection strategies.
   * @returns An array of available strategies
   */
  getAvailableStrategies(): PitchDetectionStrategy[] {
    return [...this.strategies]
  }

  /**
   * Analyzes the provided audio data to detect pitch.
   * Uses the current strategy for detection.
   * @param audioData The audio data to analyze
   * @param sampleRate The sample rate of the audio data in Hz
   * @returns A promise that resolves to the detected pitch, or null if no pitch could be detected
   */
  async analyzePitch(audioData: Float32Array, sampleRate: number): Promise<Pitch | null> {
    return this.currentStrategy.detectPitch(audioData, sampleRate)
  }
}
