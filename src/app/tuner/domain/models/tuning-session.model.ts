import { PitchRecording } from './pitch-recording.model'

/**
 * Represents a tuning session with a collection of pitch recordings.
 * Immutable value object following Clean Code principles.
 */
export class TuningSession {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _createdAt: Date,
    private readonly _pitchRecordings: PitchRecording[] = []
  ) {}

  /**
   * Gets the unique identifier for this session.
   */
  get id(): string {
    return this._id
  }

  /**
   * Gets the name of this session.
   */
  get name(): string {
    return this._name
  }

  /**
   * Gets the creation timestamp of this session.
   */
  get createdAt(): Date {
    return this._createdAt
  }

  /**
   * Gets the pitch recordings in this session.
   * Returns a readonly copy to prevent mutation.
   */
  get pitchRecordings(): readonly PitchRecording[] {
    return [...this._pitchRecordings]
  }

  /**
   * Creates a new TuningSession with the given recording added.
   * @param recording The recording to add
   * @returns A new TuningSession instance with the recording added
   */
  addPitchRecording(recording: PitchRecording): TuningSession {
    return new TuningSession(this._id, this._name, this._createdAt, [...this._pitchRecordings, recording])
  }

  /**
   * Gets the total duration of all recordings in this session.
   */
  get totalDuration(): number {
    return this._pitchRecordings.reduce((total, recording) => total + recording.duration, 0)
  }

  /**
   * Gets the average deviation in cents across all recordings.
   */
  get averageDeviation(): number {
    if (this._pitchRecordings.length === 0) {
      return 0
    }

    const totalDeviation = this._pitchRecordings.reduce(
      (sum, recording) => sum + Math.abs(recording.deviationInCents),
      0
    )

    return totalDeviation / this._pitchRecordings.length
  }
}
