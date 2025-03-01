import { Pitch } from './pitch.model'

/**
 * Represents a recording of a pitch at a specific moment in time.
 * Includes both the actual pitch played and the target pitch for comparison.
 * Immutable value object following Clean Code principles.
 */
export class PitchRecording {
  constructor(
    private readonly _timestamp: Date,
    private readonly _actualPitch: Pitch,
    private readonly _targetPitch: Pitch,
    private readonly _duration: number
  ) {}

  /**
   * Gets the timestamp when this recording was made.
   */
  get timestamp(): Date {
    return this._timestamp
  }

  /**
   * Gets the actual pitch that was played/sung.
   */
  get actualPitch(): Pitch {
    return this._actualPitch
  }

  /**
   * Gets the target pitch that should have been played/sung.
   */
  get targetPitch(): Pitch {
    return this._targetPitch
  }

  /**
   * Gets the duration of this recording in milliseconds.
   */
  get duration(): number {
    return this._duration
  }

  /**
   * Gets the deviation between the actual and target pitch in cents.
   */
  get deviationInCents(): number {
    return this._actualPitch.deviation
  }

  /**
   * Determines if the actual pitch was in tune with the target pitch.
   * @param toleranceInCents The tolerance in cents (default: 5)
   * @returns True if the pitch was in tune, false otherwise
   */
  isInTune(toleranceInCents = 5): boolean {
    return this._actualPitch.isInTune(toleranceInCents)
  }
}
