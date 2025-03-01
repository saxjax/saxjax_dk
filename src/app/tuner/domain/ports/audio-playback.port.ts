import { Note, Pitch } from '../models'

/**
 * Port for audio playback functionality.
 * Follows the Port/Adapter pattern from Clean Architecture.
 */
export interface AudioPlaybackPort {
  /**
   * Plays a tone for the given note.
   * @param note The note to play
   * @param duration The duration to play the note in milliseconds
   * @returns A promise that resolves when the note has started playing
   */
  playNote(note: Note, duration?: number): Promise<void>

  /**
   * Plays a tone for the given pitch.
   * @param pitch The pitch to play
   * @param duration The duration to play the pitch in milliseconds
   * @returns A promise that resolves when the pitch has started playing
   */
  playPitch(pitch: Pitch, duration?: number): Promise<void>

  /**
   * Plays a tone at the given frequency.
   * @param frequency The frequency to play in Hz
   * @param duration The duration to play the frequency in milliseconds
   * @returns A promise that resolves when the frequency has started playing
   */
  playFrequency(frequency: number, duration?: number): Promise<void>

  /**
   * Stops all currently playing tones.
   * @returns A promise that resolves when all tones have stopped
   */
  stopAll(): Promise<void>

  /**
   * Checks if audio is currently playing.
   * @returns True if audio is playing, false otherwise
   */
  isPlaying(): boolean
}
