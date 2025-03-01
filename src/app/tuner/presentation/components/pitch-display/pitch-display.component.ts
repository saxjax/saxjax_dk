import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { Pitch } from '../../../../tuner/domain/models'

/**
 * Component for displaying the current pitch and its deviation.
 * Follows Clean Architecture principles as a presentational component.
 */
@Component({
  selector: 'app-pitch-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pitch-display.component.html',
  styleUrls: ['./pitch-display.component.scss'],
})
export class PitchDisplayComponent {
  @Input() pitch: Pitch | null = null
  @Input() isInTune = false
  @Input() deviationInCents = 0
  @Input() tuningTolerance = 5

  /**
   * Gets the note name for display.
   */
  get noteDisplay(): string {
    return this.pitch?.note.fullName || '--'
  }

  /**
   * Gets the frequency for display.
   */
  get frequencyDisplay(): string {
    return this.pitch ? `${this.pitch.frequency.toFixed(2)} Hz` : '--'
  }

  /**
   * Gets the deviation in cents for display.
   */
  get deviationDisplay(): string {
    if (!this.pitch) return '0'
    return `${this.deviationInCents > 0 ? '+' : ''}${this.deviationInCents.toFixed(1)}`
  }

  /**
   * Gets the CSS class for the tuning indicator.
   */
  get tuningClass(): string {
    if (!this.pitch) return 'neutral'
    if (this.isInTune) return 'in-tune'
    return this.deviationInCents < 0 ? 'flat' : 'sharp'
  }

  /**
   * Gets the percentage for the tuning indicator position.
   * Maps the deviation to a percentage between 0 and 100.
   */
  get tuningPosition(): number {
    if (!this.pitch) return 50 // Center position

    // Map deviation to percentage (0-100)
    // Use 3x the tuning tolerance as the full range
    const range = this.tuningTolerance * 3
    const percentage = 50 + (this.deviationInCents / range) * 50

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, percentage))
  }
}
