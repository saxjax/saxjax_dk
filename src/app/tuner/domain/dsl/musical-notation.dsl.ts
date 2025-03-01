import { Note, Pitch, PitchRecording, TuningSession } from '../models'

/**
 * Domain Specific Language for musical notation.
 * Provides serialization and deserialization of tuning sessions.
 * Follows Clean Code principles with clear, intention-revealing names.
 */
export class MusicalNotationDSL {
  // Constants for the DSL syntax
  static readonly SESSION_START = 'SESSION:'
  static readonly SESSION_END = 'END_SESSION'
  static readonly RECORDING_START = 'RECORDING:'
  static readonly RECORDING_END = 'END_RECORDING'
  static readonly ACTUAL_PREFIX = 'ACTUAL:'
  static readonly TARGET_PREFIX = 'TARGET:'

  /**
   * Serializes a TuningSession to DSL format.
   * @param session The session to serialize
   * @returns The serialized session as a string
   */
  static serialize(session: TuningSession): string {
    let result = `${this.SESSION_START} ${session.id} "${session.name}" ${session.createdAt.toISOString()}\n`

    for (const recording of session.pitchRecordings) {
      result += `${this.RECORDING_START} ${recording.timestamp.toISOString()} ${recording.duration}\n`
      result += `${this.ACTUAL_PREFIX} ${recording.actualPitch.note.fullName} ${recording.actualPitch.frequency.toFixed(2)} ${recording.actualPitch.deviation.toFixed(2)}\n`
      result += `${this.TARGET_PREFIX} ${recording.targetPitch.note.fullName} ${recording.targetPitch.frequency.toFixed(2)} 0.00\n`
      result += `${this.RECORDING_END}\n`
    }

    result += this.SESSION_END
    return result
  }

  /**
   * Deserializes a string in DSL format to a TuningSession.
   * @param dsl The DSL string to deserialize
   * @returns The deserialized TuningSession
   * @throws Error if the DSL string is invalid
   */
  static deserialize(dsl: string): TuningSession {
    const lines = dsl.split('\n')
    const sessionLine = lines[0]

    if (!sessionLine.startsWith(this.SESSION_START)) {
      throw new Error('Invalid DSL: Missing SESSION_START')
    }

    // Parse session header
    const sessionHeaderRegex = new RegExp(`^${this.SESSION_START}\\s+([^\\s]+)\\s+"([^"]+)"\\s+(.+)$`)
    const sessionMatch = sessionLine.match(sessionHeaderRegex)

    if (!sessionMatch) {
      throw new Error('Invalid DSL: Malformed session header')
    }

    const id = sessionMatch[1]
    const name = sessionMatch[2]
    const createdAt = new Date(sessionMatch[3])

    // Parse recordings
    const recordings: PitchRecording[] = []
    let i = 1

    while (i < lines.length && lines[i] !== this.SESSION_END) {
      if (lines[i].startsWith(this.RECORDING_START)) {
        const recordingHeaderRegex = new RegExp(`^${this.RECORDING_START}\\s+(.+)\\s+(\\d+)$`)
        const recordingMatch = lines[i].match(recordingHeaderRegex)

        if (!recordingMatch) {
          throw new Error(`Invalid DSL: Malformed recording header at line ${i + 1}`)
        }

        const timestamp = new Date(recordingMatch[1])
        const duration = parseInt(recordingMatch[2], 10)

        // Parse actual pitch
        i++
        if (!lines[i].startsWith(this.ACTUAL_PREFIX)) {
          throw new Error(`Invalid DSL: Missing ACTUAL_PREFIX at line ${i + 1}`)
        }

        const actualPitchRegex = new RegExp(
          `^${this.ACTUAL_PREFIX}\\s+([A-G]#?\\d+)\\s+(\\d+\\.\\d+)\\s+([\\-\\+]?\\d+\\.\\d+)$`
        )
        const actualMatch = lines[i].match(actualPitchRegex)

        if (!actualMatch) {
          throw new Error(`Invalid DSL: Malformed actual pitch at line ${i + 1}`)
        }

        const actualNoteName = actualMatch[1].slice(0, -1)
        const actualNoteOctave = parseInt(actualMatch[1].slice(-1), 10)
        const actualFrequency = parseFloat(actualMatch[2])
        const deviation = parseFloat(actualMatch[3])

        const actualNote = new Note(actualNoteName, actualNoteOctave, actualFrequency)
        const actualPitch = new Pitch(actualFrequency, actualNote, deviation)

        // Parse target pitch
        i++
        if (!lines[i].startsWith(this.TARGET_PREFIX)) {
          throw new Error(`Invalid DSL: Missing TARGET_PREFIX at line ${i + 1}`)
        }

        const targetPitchRegex = new RegExp(
          `^${this.TARGET_PREFIX}\\s+([A-G]#?\\d+)\\s+(\\d+\\.\\d+)\\s+([\\-\\+]?\\d+\\.\\d+)$`
        )
        const targetMatch = lines[i].match(targetPitchRegex)

        if (!targetMatch) {
          throw new Error(`Invalid DSL: Malformed target pitch at line ${i + 1}`)
        }

        const targetNoteName = targetMatch[1].slice(0, -1)
        const targetNoteOctave = parseInt(targetMatch[1].slice(-1), 10)
        const targetFrequency = parseFloat(targetMatch[2])

        const targetNote = new Note(targetNoteName, targetNoteOctave, targetFrequency)
        const targetPitch = new Pitch(targetFrequency, targetNote, 0)

        // Check for recording end
        i++
        if (lines[i] !== this.RECORDING_END) {
          throw new Error(`Invalid DSL: Missing RECORDING_END at line ${i + 1}`)
        }

        // Create and add the recording
        const recording = new PitchRecording(timestamp, actualPitch, targetPitch, duration)
        recordings.push(recording)
      }

      i++
    }

    if (i >= lines.length || lines[i] !== this.SESSION_END) {
      throw new Error('Invalid DSL: Missing SESSION_END')
    }

    return new TuningSession(id, name, createdAt, recordings)
  }

  /**
   * Renders a TuningSession as standard musical notation.
   * This is a placeholder implementation that would be replaced with actual
   * musical notation rendering logic in a real implementation.
   * @param session The session to render
   * @returns The rendered notation as an SVG string
   */
  static renderNotation(session: TuningSession): string {
    // This is a placeholder implementation
    // In a real implementation, this would generate SVG or HTML
    // representing standard musical notation
    return `<svg width="800" height="200">
      <text x="10" y="20" font-family="Arial" font-size="16">
        ${session.name} (${session.pitchRecordings.length} notes)
      </text>
      <!-- Musical notation would be rendered here -->
    </svg>`
  }
}
