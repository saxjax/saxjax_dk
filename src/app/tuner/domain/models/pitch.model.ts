import { Note } from './note.model'

/**
 * Represents a detected pitch with its frequency, corresponding note, and deviation.
 * Immutable value object following Clean Code principles.
 */
export class Pitch {
  constructor(
    private readonly _frequency: number,
    private readonly _note: Note,
    private readonly _deviation: number
  ) {}

  /**
   * Gets the frequency of the pitch in Hz.
   */
  get frequency(): number {
    return this._frequency
  }

  /**
   * Gets the musical note closest to this pitch.
   */
  get note(): Note {
    return this._note
  }

  /**
   * Gets the deviation from the perfect pitch in cents.
   * Positive values mean the pitch is sharp, negative values mean it's flat.
   */
  get deviation(): number {
    return this._deviation
  }

  /**
   * Determines if the pitch is in tune within the specified tolerance.
   * @param toleranceInCents The tolerance in cents (default: 5)
   * @returns True if the pitch is within the tolerance, false otherwise
   */
  isInTune(toleranceInCents = 5): boolean {
    return Math.abs(this._deviation) <= toleranceInCents
  }

  /**
   * Creates a Pitch instance from a frequency value.
   * @param frequency The frequency in Hz
   * @returns A new Pitch instance
   */
  static fromFrequency(frequency: number): Pitch {
    const note = Note.fromFrequency(frequency)
    const deviation = Pitch.calculateDeviation(frequency, note.frequency)
    return new Pitch(frequency, note, deviation)
  }

  /**
   * Calculates the deviation between two frequencies in cents.
   * @param actual The actual frequency
   * @param target The target frequency
   * @returns The deviation in cents
   */
  private static calculateDeviation(actual: number, target: number): number {
    // Calculate the deviation in cents (100 cents = 1 semitone)
    return 1200 * Math.log2(actual / target)
  }
}
