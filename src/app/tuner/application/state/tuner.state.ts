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
  readonly savedSessions = signal<TuningSession[]>([])
  readonly currentPlaybackSession = signal<TuningSession | null>(null)
  readonly isPlayingSession = signal<boolean>(false)
  readonly playbackPaused = signal<boolean>(false)
  readonly currentPlaybackIndex = signal<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly preferences = signal<any>(null) // Will be initialized in constructor
  readonly micSensitivity = signal<number>(0.5) // Default sensitivity value

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

      // Set the volume for reference tones and microphone sensitivity
      this.audioCaptureService.setSensitivity(prefs.micSensitivity) // Set microphone sensitivity
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

  setMicSensitivity(newMicSensitivity: number) {
    this.micSensitivity.set(newMicSensitivity)
    this.audioCaptureService.setSensitivity(newMicSensitivity) // Set microphone sensitivity
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
      // Reset the last recording time before starting a new session
      this.lastRecordingTime = 0

      // Create a new session
      const session = await this.tuningSessionService.createSession(name)
      this.currentSession.set(session)

      // Start audio capture if not already capturing
      if (!this.isCapturing()) {
        this.toggleCapture()

        // Wait a short time for audio capture to initialize before starting recording
        await new Promise((resolve) => setTimeout(resolve, 500))
      } else {
        // If already capturing, wait for the next animation frame to ensure
        // we're not in the middle of processing audio
        await new Promise((resolve) => requestAnimationFrame(resolve))
      }

      // Now that everything is set up, start recording
      this.isRecording.set(true)

      // Initialize the last recording time to now
      this.lastRecordingTime = Date.now()
    } catch (err) {
      this.error.set(`Failed to start new session: ${err}`)
    }
  }

  // Track the last recording time to calculate duration
  private lastRecordingTime = 0

  /**
   * Records the current pitch to the current session.
   */
  private async recordCurrentPitch(): Promise<void> {
    const pitch = this.currentPitch()
    const session = this.currentSession()

    if (!pitch || !session) return

    try {
      const now = Date.now()

      // Calculate duration based on time since last recording
      // Default to 500ms for the first recording, cap at 2000ms to prevent memory issues
      let duration = this.lastRecordingTime ? now - this.lastRecordingTime : 500

      // Cap the duration to prevent memory issues with very long durations
      duration = Math.min(duration, 2000)

      // Update last recording time
      this.lastRecordingTime = now

      // Create a new recording
      const recording = new PitchRecording(
        new Date(),
        pitch,
        pitch, // Using the same pitch as both actual and target for simplicity
        duration // Dynamic duration based on time between recordings with a cap
      )

      // Add the recording to the session
      const updatedSession = session.addPitchRecording(recording)
      this.currentSession.set(updatedSession)

      // Save the session
      await this.tuningSessionService.saveSession(updatedSession)

      // Limit the number of recordings per session to prevent memory issues
      if (updatedSession.pitchRecordings.length > 1000) {
        this.stopCurrentSession()
        this.error.set('Session recording limit reached (1000 recordings). Session has been stopped.')
      }
    } catch (err) {
      this.error.set(`Failed to record pitch: ${err}`)
    }
  }

  /**
   * Stops the current recording session.
   */
  stopCurrentSession(): void {
    this.isRecording.set(false)
    this.lastRecordingTime = 0 // Reset the last recording time
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

  /**
   * Loads all saved sessions.
   */
  async loadSessions(): Promise<void> {
    try {
      const sessions = await this.getAllSessions()

      // Sort sessions by creation date (newest first)
      sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      this.savedSessions.set(sessions)

      // Log the number of sessions loaded for debugging
      console.log(`Loaded ${sessions.length} sessions`)
      if (sessions.length > 0) {
        console.log(`First session: ${sessions[0].name}, recordings: ${sessions[0].pitchRecordings.length}`)
      }
    } catch (err) {
      this.error.set(`Failed to load sessions: ${err}`)
    }
  }

  /**
   * Plays back a session.
   * @param sessionId The ID of the session to play
   */
  async playSession(sessionId: string): Promise<void> {
    try {
      console.log(`Starting playback of session: ${sessionId}`)

      // Stop any current playback
      if (this.isPlayingSession()) {
        await this.stopSessionPlayback()
      }

      // Get the session
      const session = await this.tuningSessionService.getSession(sessionId)
      if (!session) {
        this.error.set(`Session not found: ${sessionId}`)
        return
      }

      console.log(`Found session: ${session.name} with ${session.pitchRecordings.length} recordings`)

      // Check if the session has any recordings
      if (session.pitchRecordings.length === 0) {
        this.error.set(`Session "${session.name}" has no recordings to play`)
        return
      }

      // Set the current playback session
      this.currentPlaybackSession.set(session)
      this.currentPlaybackIndex.set(0)
      this.isPlayingSession.set(true)
      this.playbackPaused.set(false)

      // Start playback
      console.log(`Starting playback of ${session.pitchRecordings.length} recordings`)
      this.playNextRecording()
    } catch (err) {
      console.error('Error playing session:', err)
      this.error.set(`Failed to play session: ${err}`)
    }
  }

  /**
   * Plays the next recording in the current playback session.
   */
  private async playNextRecording(): Promise<void> {
    const session = this.currentPlaybackSession()
    const index = this.currentPlaybackIndex()

    if (!session || !this.isPlayingSession() || this.playbackPaused()) {
      console.log('Playback stopped or paused, not playing next recording')
      return
    }

    if (index >= session.pitchRecordings.length) {
      // End of session
      console.log('Reached end of session, stopping playback')
      this.stopSessionPlayback()
      return
    }

    const recording = session.pitchRecordings[index]
    console.log(
      `Playing recording ${index + 1}/${session.pitchRecordings.length}, frequency: ${recording.actualPitch.frequency.toFixed(2)}Hz, note: ${recording.actualPitch.note.fullName}, duration: ${recording.duration}ms`
    )

    try {
      // Validate the recording
      if (!recording.actualPitch || !recording.actualPitch.frequency) {
        console.error('Invalid recording data:', recording)
        this.error.set('Invalid recording data encountered during playback')
        this.currentPlaybackIndex.update((i) => i + 1)
        this.playNextRecording()
        return
      }

      // Cap playback duration to prevent memory issues
      const safeDuration = Math.min(recording.duration, 2000)

      // Play the pitch
      await this.audioPlaybackService.playPitch(recording.actualPitch, safeDuration)

      // Update the current pitch for display
      this.currentPitch.set(recording.actualPitch)

      // Move to the next recording
      this.currentPlaybackIndex.update((i) => i + 1)

      // Use requestAnimationFrame instead of setTimeout for better performance
      // and to avoid memory issues with long timeouts
      const nextPlaybackTime = performance.now() + safeDuration + 50

      const scheduleNextRecording = (timestamp: number) => {
        if (timestamp >= nextPlaybackTime) {
          this.playNextRecording()
        } else if (this.isPlayingSession() && !this.playbackPaused()) {
          requestAnimationFrame(scheduleNextRecording)
        }
      }

      requestAnimationFrame(scheduleNextRecording)
    } catch (err) {
      console.error('Error during playback:', err)
      this.error.set(`Error during playback: ${err}`)

      // Try to continue with the next recording instead of stopping completely
      this.currentPlaybackIndex.update((i) => i + 1)
      this.playNextRecording()
    }
  }

  /**
   * Pauses the current session playback.
   */
  pauseSessionPlayback(): void {
    if (this.isPlayingSession()) {
      this.playbackPaused.set(true)
      this.audioPlaybackService.stopAll()
    }
  }

  /**
   * Resumes the current session playback.
   */
  resumeSessionPlayback(): void {
    if (this.currentPlaybackSession() && this.playbackPaused()) {
      this.playbackPaused.set(false)
      this.playNextRecording()
    }
  }

  /**
   * Stops the current session playback.
   */
  async stopSessionPlayback(): Promise<void> {
    this.isPlayingSession.set(false)
    this.playbackPaused.set(false)
    this.currentPlaybackIndex.set(0)
    await this.audioPlaybackService.stopAll()
    this.currentPitch.set(null)
  }
}
