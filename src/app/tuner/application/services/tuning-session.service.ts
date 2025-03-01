import { Injectable } from '@angular/core'
import { TuningSession } from '../../domain/models'
import { TuningSessionPort } from '../../domain/ports'

/**
 * Service for managing tuning sessions.
 * Implements the TuningSessionPort interface from the domain layer.
 * Uses localStorage for persistence in this implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class TuningSessionService implements TuningSessionPort {
  private readonly STORAGE_KEY = 'tuner_sessions'

  /**
   * Creates a new tuning session with the given name.
   * @param name The name of the session
   * @returns A promise that resolves to the created session
   */
  async createSession(name: string): Promise<TuningSession> {
    const id = this.generateId()
    const createdAt = new Date()
    const session = new TuningSession(id, name, createdAt)

    await this.saveSession(session)
    return session
  }

  /**
   * Saves a tuning session.
   * @param session The session to save
   * @returns A promise that resolves when the session has been saved
   */
  async saveSession(session: TuningSession): Promise<void> {
    const sessions = await this.getAllSessions()

    // Find and replace existing session or add new one
    const index = sessions.findIndex((s) => s.id === session.id)
    if (index !== -1) {
      sessions[index] = session
    } else {
      sessions.push(session)
    }

    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.serializeSessions(sessions)))
  }

  /**
   * Gets a tuning session by its ID.
   * @param id The ID of the session to get
   * @returns A promise that resolves to the session, or null if not found
   */
  async getSession(id: string): Promise<TuningSession | null> {
    const sessions = await this.getAllSessions()
    return sessions.find((session) => session.id === id) || null
  }

  /**
   * Gets all tuning sessions.
   * @returns A promise that resolves to an array of all sessions
   */
  async getAllSessions(): Promise<TuningSession[]> {
    const sessionsJson = localStorage.getItem(this.STORAGE_KEY)
    if (!sessionsJson) {
      return []
    }

    try {
      const serializedSessions = JSON.parse(sessionsJson)
      return this.deserializeSessions(serializedSessions)
    } catch (error) {
      console.error('Error parsing sessions from localStorage:', error)
      return []
    }
  }

  /**
   * Deletes a tuning session by its ID.
   * @param id The ID of the session to delete
   * @returns A promise that resolves when the session has been deleted
   */
  async deleteSession(id: string): Promise<void> {
    const sessions = await this.getAllSessions()
    const filteredSessions = sessions.filter((session) => session.id !== id)

    if (filteredSessions.length !== sessions.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.serializeSessions(filteredSessions)))
    }
  }

  /**
   * Generates a unique ID for a new session.
   * @returns A unique ID
   * @private
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  /**
   * Serializes an array of TuningSession objects to a format suitable for JSON.stringify.
   * @param sessions The sessions to serialize
   * @returns An array of serialized sessions
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private serializeSessions(sessions: TuningSession[]): any[] {
    return sessions.map((session) => ({
      id: session.id,
      name: session.name,
      createdAt: session.createdAt.toISOString(),
      pitchRecordings: session.pitchRecordings.map((recording) => ({
        timestamp: recording.timestamp.toISOString(),
        duration: recording.duration,
        actualPitch: {
          frequency: recording.actualPitch.frequency,
          note: {
            name: recording.actualPitch.note.name,
            octave: recording.actualPitch.note.octave,
            frequency: recording.actualPitch.note.frequency,
          },
          deviation: recording.actualPitch.deviation,
        },
        targetPitch: {
          frequency: recording.targetPitch.frequency,
          note: {
            name: recording.targetPitch.note.name,
            octave: recording.targetPitch.note.octave,
            frequency: recording.targetPitch.note.frequency,
          },
          deviation: recording.targetPitch.deviation,
        },
      })),
    }))
  }

  /**
   * Deserializes an array of serialized sessions to TuningSession objects.
   * @param serializedSessions The serialized sessions to deserialize
   * @returns An array of TuningSession objects
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deserializeSessions(serializedSessions: any[]): TuningSession[] {
    return serializedSessions.map((serialized) => {
      const { id, name, createdAt, pitchRecordings } = serialized

      // Create TuningSession with empty recordings array
      const session = new TuningSession(id, name, new Date(createdAt), [])

      // Add each recording to the session
      if (Array.isArray(pitchRecordings)) {
        const recordings = pitchRecordings.map((recording) => {
          const { timestamp, duration, actualPitch, targetPitch } = recording

          // Create Note objects
          const actualNote = new Note(actualPitch.note.name, actualPitch.note.octave, actualPitch.note.frequency)

          const targetNote = new Note(targetPitch.note.name, targetPitch.note.octave, targetPitch.note.frequency)

          // Create Pitch objects
          const actualPitchObj = new Pitch(actualPitch.frequency, actualNote, actualPitch.deviation)

          const targetPitchObj = new Pitch(targetPitch.frequency, targetNote, targetPitch.deviation)

          // Create and return PitchRecording
          return new PitchRecording(new Date(timestamp), actualPitchObj, targetPitchObj, duration)
        })

        // Add all recordings to the session
        return recordings.reduce((session, recording) => session.addPitchRecording(recording), session)
      }

      return session
    })
  }
}

// Import these at the top to avoid circular dependencies
import { Note, Pitch, PitchRecording } from '../../domain/models'
