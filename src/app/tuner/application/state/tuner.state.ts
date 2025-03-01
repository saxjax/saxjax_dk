import { computed, effect, inject, signal } from '@angular/core'
import { Pitch, PitchRecording, TuningSession } from '../../domain/models'
import {
  AudioCaptureService,
  AudioPlaybackService,
  NotationService,
  PitchAnalysisService,
  PreferencesService,
  TuningSessionService,
} from '../services'

/**
 * State management for the tuner application.
 * Uses Angular signals for reactive state management.
 * Follows Clean Architecture principles by coordinating between the domain and presentation layers.
 */
export class TunerState {
  // Inject services
  private readonly audioCaptureService = inject(AudioCaptureService)
  private readonly pitchAnalysisService = inject(PitchAnalysisService)
  private readonly audioPlaybackService = inject(AudioPlaybackService)
  private readonly tuningSessionService = inject(TuningSessionService)
  private readonly notationService = inject(NotationService)
  private readonly preferencesService = inject(PreferencesService)

  // State signals
  readonly isCapturing = signal<boolean>(false)
  readonly currentPitch = signal<Pitch | null>(null)
  readonly pitchHistory = signal<Pitch[]>([])
  readonly currentSession = signal<TuningSession | null>(null)
  readonly isRecording = signal<boolean>(false)
  readonly error = signal<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly preferences = signal<any>(null) // Will be initialized in constructor

  // Computed values
  readonly isInTune = computed(() => {
    const pitch = this.currentPitch()
    const prefs = this.preferences()
    if (!pitch || !prefs) return false
    return Math.abs(pitch.deviation) <= prefs.tuningTolerance
  })

  readonly deviationInCents = computed(() => {
    return this.currentPitch()?.deviation ?? 0
  })

  readonly isPlaying = computed(() => {
    return this.audioPlaybackService.isPlaying()
  })

  constructor() {
    // Initialize preferences
    this.loadPreferences()

    // Set up effects for side effects
    effect(() => {
      if (this.isCapturing()) {
        this.startAudioCapture()
      } else {
        this.stopAudioCapture()
      }
    })

    effect(() => {
      if (this.isRecording() && this.currentPitch() && this.currentSession()) {
        this.recordCurrentPitch()
      }
    })
  }

  /**
   * Loads user preferences.
   */
  private async loadPreferences(): Promise<void> {
    try {
      const prefs = await this.preferencesService.getPreferences()
      this.preferences.set(prefs)

      // Set the preferred algorithm
      const strategies = this.pitchAnalysisService.getAvailableStrategies()
      const preferredStrategy = strategies.find((s) => s.name === prefs.preferredAlgorithm)
      if (preferredStrategy) {
        this.pitchAnalysisService.setStrategy(preferredStrategy)
      }

      // Set the volume for reference tones
      this.audioPlaybackService.setVolume(prefs.referenceTonesVolume)
    } catch (err) {
      this.error.set(`Failed to load preferences: ${err}`)
    }
  }

  /**
   * Updates user preferences.
   * @param newPreferences The new preferences
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updatePreferences(newPreferences: Partial<any>): Promise<void> {
    try {
      await this.preferencesService.updatePreferences(newPreferences)
      await this.loadPreferences()
    } catch (err) {
      this.error.set(`Failed to update preferences: ${err}`)
    }
  }

  /**
   * Toggles audio capture on/off.
   */
  toggleCapture(): void {
    this.isCapturing.update((current) => !current)
  }

  /**
   * Starts capturing audio from the microphone.
   */
  private async startAudioCapture(): Promise<void> {
    try {
      const hasPermission = await this.audioCaptureService.requestPermission()
      if (!hasPermission) {
        this.error.set('Microphone permission denied')
        this.isCapturing.set(false)
        return
      }

      await this.audioCaptureService.startCapture()
      this.processAudioStream()
    } catch (err) {
      this.error.set(`Failed to start audio capture: ${err}`)
      this.isCapturing.set(false)
    }
  }

  /**
   * Stops capturing audio from the microphone.
   */
  private async stopAudioCapture(): Promise<void> {
    try {
      await this.audioCaptureService.stopCapture()
      this.currentPitch.set(null)
    } catch (err) {
      this.error.set(`Failed to stop audio capture: ${err}`)
    }
  }

  /**
   * Processes the audio stream to detect pitch.
   */
  private async processAudioStream(): Promise<void> {
    try {
      const stream = this.audioCaptureService.getAudioStream()
      const reader = stream.getReader()

      while (this.isCapturing()) {
        const { value, done } = await reader.read()
        if (done) break

        try {
          // Get the sample rate from the audio context
          const sampleRate = 48000 // This should be dynamically determined in a real implementation

          // Analyze the pitch
          const pitch = await this.pitchAnalysisService.analyzePitch(value, sampleRate)

          if (pitch) {
            this.currentPitch.set(pitch)
            this.pitchHistory.update((history) => {
              const newHistory = [...history, pitch]
              // Keep only the last 100 pitches
              return newHistory.slice(-100)
            })

            // Play reference tone if enabled
            const prefs = this.preferences()
            if (prefs?.playReferenceTones && this.isInTune()) {
              this.playReferenceTone()
            }
          }
        } catch (err) {
          this.error.set(`Error analyzing pitch: ${err}`)
        }
      }

      reader.releaseLock()
    } catch (err) {
      this.error.set(`Error processing audio stream: ${err}`)
      this.isCapturing.set(false)
    }
  }

  /**
   * Plays a reference tone for the current pitch.
   */
  playReferenceTone(): void {
    const pitch = this.currentPitch()
    if (pitch) {
      this.audioPlaybackService.playPitch(pitch, 500)
    }
  }

  /**
   * Starts a new recording session.
   * @param name The name of the session
   */
  async startNewSession(name: string): Promise<void> {
    try {
      const session = await this.tuningSessionService.createSession(name)
      this.currentSession.set(session)
      this.isRecording.set(true)
    } catch (err) {
      this.error.set(`Failed to start new session: ${err}`)
    }
  }

  /**
   * Stops the current recording session.
   */
  stopCurrentSession(): void {
    this.isRecording.set(false)
  }

  /**
   * Records the current pitch to the current session.
   */
  private async recordCurrentPitch(): Promise<void> {
    const pitch = this.currentPitch()
    const session = this.currentSession()

    if (!pitch || !session) return

    try {
      // Create a new recording
      const recording = new PitchRecording(
        new Date(),
        pitch,
        pitch, // Using the same pitch as both actual and target for simplicity
        100 // Duration in ms
      )

      // Add the recording to the session
      const updatedSession = session.addPitchRecording(recording)
      this.currentSession.set(updatedSession)

      // Save the session
      await this.tuningSessionService.saveSession(updatedSession)
    } catch (err) {
      this.error.set(`Failed to record pitch: ${err}`)
    }
  }

  /**
   * Gets all saved sessions.
   * @returns A promise that resolves to an array of all sessions
   */
  async getAllSessions(): Promise<TuningSession[]> {
    try {
      return await this.tuningSessionService.getAllSessions()
    } catch (err) {
      this.error.set(`Failed to get sessions: ${err}`)
      return []
    }
  }

  /**
   * Deletes a session.
   * @param id The ID of the session to delete
   */
  async deleteSession(id: string): Promise<void> {
    try {
      await this.tuningSessionService.deleteSession(id)

      // If the current session was deleted, clear it
      if (this.currentSession()?.id === id) {
        this.currentSession.set(null)
        this.isRecording.set(false)
      }
    } catch (err) {
      this.error.set(`Failed to delete session: ${err}`)
    }
  }

  /**
   * Exports a session as a file.
   * @param session The session to export
   * @returns A URL that can be used to download the session
   */
  exportSession(session: TuningSession): string {
    return this.notationService.createDownloadUrl(session)
  }

  /**
   * Clears any error message.
   */
  clearError(): void {
    this.error.set(null)
  }
}
