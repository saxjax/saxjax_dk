/**
 * Represents a musical note with its name, octave, and frequency.
 * Immutable value object following Clean Code principles.
 */
export class Note {
  constructor(
    private readonly _name: string,
    private readonly _octave: number,
    private readonly _frequency: number
  ) {}

  /**
   * Gets the name of the note (e.g., 'A', 'C#').
   */
  get name(): string {
    return this._name
  }

  /**
   * Gets the octave of the note.
   */
  get octave(): number {
    return this._octave
  }

  /**
   * Gets the frequency of the note in Hz.
   */
  get frequency(): number {
    return this._frequency
  }

  /**
   * Gets the full name of the note including octave (e.g., 'A4', 'C#5').
   */
  get fullName(): string {
    return `${this._name}${this._octave}`
  }

  /**
   * Creates a Note instance from a frequency value.
   * @param frequency The frequency in Hz
   * @returns A new Note instance
   */
  static fromFrequency(frequency: number): Note {
    // A4 is 440Hz, which is MIDI note 69
    const A4 = 440
    const A4Index = 69

    // Calculate the MIDI note number
    const noteIndex = Math.round(12 * Math.log2(frequency / A4) + A4Index)

    // Calculate the exact frequency of this note
    const exactFrequency = A4 * Math.pow(2, (noteIndex - A4Index) / 12)

    // Determine note name and octave
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const octave = Math.floor((noteIndex - 12) / 12)
    const noteName = noteNames[noteIndex % 12]

    return new Note(noteName, octave, exactFrequency)
  }
}
