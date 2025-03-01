import { Injectable } from '@angular/core'
import { AudioCapturePort } from '../../domain/ports'

/**
 * Service for capturing audio from the microphone.
 * Implements the AudioCapturePort interface from the domain layer.
 * Follows Clean Architecture principles by adapting the Web Audio API to the domain.
 */
@Injectable({
  providedIn: 'root',
})
export class AudioCaptureService implements AudioCapturePort {
  private stream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private analyzer: AnalyserNode | null = null
  private dataStream: ReadableStream<Float32Array> | null = null

  /**
   * Requests permission to access the microphone.
   * @returns A promise that resolves to true if permission is granted, false otherwise
   */
  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Release the stream immediately, we just want to check permission
      stream.getTracks().forEach((track) => track.stop())
      return true
    } catch (err) {
      console.error('Error requesting microphone permission:', err)
      return false
    }
  }

  /**
   * Starts capturing audio from the microphone.
   * @returns A promise that resolves when capture has started
   * @throws Error if microphone access is denied or unavailable
   */
  async startCapture(): Promise<void> {
    if (this.isCapturing()) {
      return
    }

    try {
      // Request microphone access with optimal settings for pitch detection
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })

      // Create audio context and analyzer
      this.audioContext = new AudioContext()
      const source = this.audioContext.createMediaStreamSource(this.stream)
      this.analyzer = this.audioContext.createAnalyser()

      // Configure analyzer for optimal pitch detection
      this.analyzer.fftSize = 2048 // Large FFT for better frequency resolution
      this.analyzer.smoothingTimeConstant = 0.0 // No smoothing for real-time detection

      // Connect source to analyzer (but not to destination to avoid feedback)
      source.connect(this.analyzer)

      // Create a readable stream from the analyzer
      this.createDataStream()
    } catch (err) {
      throw new Error(`Failed to start audio capture: ${err}`)
    }
  }

  /**
   * Stops capturing audio from the microphone.
   * @returns A promise that resolves when capture has stopped
   */
  async stopCapture(): Promise<void> {
    // Stop all tracks in the media stream
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    // Close the audio context
    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
    }

    // Clear references
    this.analyzer = null
    this.dataStream = null
  }

  /**
   * Gets the audio stream as a readable stream of audio data.
   * @returns A readable stream of Float32Array audio data
   * @throws Error if capture has not been started
   */
  getAudioStream(): ReadableStream<Float32Array> {
    if (!this.dataStream) {
      throw new Error('Audio capture not started')
    }
    return this.dataStream
  }

  /**
   * Checks if audio capture is currently active.
   * @returns True if audio is being captured, false otherwise
   */
  isCapturing(): boolean {
    return this.stream !== null && this.audioContext !== null
  }

  /**
   * Creates a readable stream from the analyzer node.
   * @private
   */
  private createDataStream(): void {
    if (!this.analyzer) return

    const bufferLength = this.analyzer.frequencyBinCount

    this.dataStream = new ReadableStream<Float32Array>({
      start: (controller) => {
        const timeDomainData = new Float32Array(bufferLength)

        const processFrame = () => {
          if (!this.analyzer) return

          this.analyzer.getFloatTimeDomainData(timeDomainData)
          controller.enqueue(timeDomainData.slice(0))

          if (this.isCapturing()) {
            requestAnimationFrame(processFrame)
          } else {
            controller.close()
          }
        }

        processFrame()
      },
    })
  }
}
