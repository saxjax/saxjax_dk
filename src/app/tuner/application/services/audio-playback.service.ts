import { Injectable } from '@angular/core'
import { Note, Pitch } from '../../domain/models'
import { AudioPlaybackPort } from '../../domain/ports'

/**
 * Service for playing back audio tones.
 * Implements the AudioPlaybackPort interface from the domain layer.
 * Follows Clean Architecture principles by adapting the Web Audio API to the domain.
 */
@Injectable({
  providedIn: 'root',
})
export class AudioPlaybackService implements AudioPlaybackPort {
  private audioContext: AudioContext | null = null
  private oscillators: OscillatorNode[] = []
  private gainNode: GainNode | null = null
  private volume = 0.5

  /**
   * Gets or creates the audio context.
   * @returns The audio context
   * @private
   */
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.gain.value = this.volume
      this.gainNode.connect(this.audioContext.destination)
    }
    return this.audioContext
  }

  /**
   * Sets the volume for playback.
   * @param volume The volume level (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume
    }
  }

  /**
   * Plays a tone for the given note.
   * @param note The note to play
   * @param duration The duration to play the note in milliseconds (default: 1000)
   * @returns A promise that resolves when the note has started playing
   */
  async playNote(note: Note, duration = 1000): Promise<void> {
    return this.playFrequency(note.frequency, duration)
  }

  /**
   * Plays a tone for the given pitch.
   * @param pitch The pitch to play
   * @param duration The duration to play the pitch in milliseconds (default: 1000)
   * @returns A promise that resolves when the pitch has started playing
   */
  async playPitch(pitch: Pitch, duration = 1000): Promise<void> {
    return this.playFrequency(pitch.frequency, duration)
  }

  /**
   * Plays a tone at the given frequency.
   * @param frequency The frequency to play in Hz
   * @param duration The duration to play the frequency in milliseconds (default: 1000)
   * @returns A promise that resolves when the frequency has started playing
   */
  async playFrequency(frequency: number, duration = 1000): Promise<void> {
    const audioContext = this.getAudioContext()

    // Create oscillator
    const oscillator = audioContext.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency

    // Apply gentle attack and release to avoid clicks
    const now = audioContext.currentTime
    const attackTime = 0.01
    const releaseTime = 0.05

    // Create a gain node for this oscillator
    const noteGain = audioContext.createGain()
    noteGain.gain.setValueAtTime(0, now)
    noteGain.gain.linearRampToValueAtTime(1, now + attackTime)
    noteGain.gain.setValueAtTime(1, now + duration / 1000 - releaseTime)
    noteGain.gain.linearRampToValueAtTime(0, now + duration / 1000)

    // Connect oscillator to gain node and then to main gain
    oscillator.connect(noteGain)
    noteGain.connect(this.gainNode!)

    // Start oscillator
    oscillator.start()
    this.oscillators.push(oscillator)

    // Stop oscillator after duration
    oscillator.stop(now + duration / 1000)

    // Remove oscillator from array when it stops
    oscillator.onended = () => {
      const index = this.oscillators.indexOf(oscillator)
      if (index !== -1) {
        this.oscillators.splice(index, 1)
      }
    }
  }

  /**
   * Stops all currently playing tones.
   * @returns A promise that resolves when all tones have stopped
   */
  async stopAll(): Promise<void> {
    const now = this.audioContext?.currentTime || 0

    // Stop all oscillators
    this.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop(now)
      } catch {
        // Ignore errors if oscillator is already stopped
      }
    })

    // Clear oscillators array
    this.oscillators = []
  }

  /**
   * Checks if audio is currently playing.
   * @returns True if audio is playing, false otherwise
   */
  isPlaying(): boolean {
    return this.oscillators.length > 0
  }
}
