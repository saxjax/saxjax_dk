import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PitchDetectionStrategy } from '../../../../tuner/domain/ports'

/**
 * Component for providing user controls for the tuner.
 * Follows Clean Architecture principles as a presentational component.
 */
@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent {
  @Input() isCapturing = false
  @Input() isRecording = false
  @Input() isPlaying = false
  @Input() availableStrategies: PitchDetectionStrategy[] = []
  @Input() currentStrategy: PitchDetectionStrategy | null = null
  @Input() referenceFrequency = 440
  @Input() tuningTolerance = 5
  @Input() showFrequencyGraph = true
  @Input() playReferenceTones = false
  @Input() referenceTonesVolume = 0.5

  @Output() toggleCapture = new EventEmitter<void>()
  @Output() startSession = new EventEmitter<string>()
  @Output() stopSession = new EventEmitter<void>()
  @Output() playReferenceTone = new EventEmitter<void>()
  @Output() changeStrategy = new EventEmitter<PitchDetectionStrategy>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() updatePreferences = new EventEmitter<any>()

  sessionName = ''
  showSessionNameInput = false
  showSettings = false

  /**
   * Handles the toggle capture button click.
   */
  onToggleCapture(): void {
    this.toggleCapture.emit()
  }

  /**
   * Handles the start session button click.
   */
  onStartSession(): void {
    if (this.sessionName.trim()) {
      this.startSession.emit(this.sessionName.trim())
      this.sessionName = ''
      this.showSessionNameInput = false
    }
  }

  /**
   * Handles the stop session button click.
   */
  onStopSession(): void {
    this.stopSession.emit()
  }

  /**
   * Handles the play reference tone button click.
   */
  onPlayReferenceTone(): void {
    this.playReferenceTone.emit()
  }

  /**
   * Handles the change strategy select change.
   * @param strategy The selected strategy
   */
  onChangeStrategy(strategy: PitchDetectionStrategy): void {
    this.changeStrategy.emit(strategy)
  }

  /**
   * Handles the update preferences button click.
   */
  onUpdatePreferences(): void {
    this.updatePreferences.emit({
      referenceFrequency: this.referenceFrequency,
      tuningTolerance: this.tuningTolerance,
      preferredAlgorithm: this.currentStrategy?.name,
      showFrequencyGraph: this.showFrequencyGraph,
      playReferenceTones: this.playReferenceTones,
      referenceTonesVolume: this.referenceTonesVolume,
    })
    this.showSettings = false
  }

  /**
   * Toggles the session name input visibility.
   */
  toggleSessionNameInput(): void {
    this.showSessionNameInput = !this.showSessionNameInput
  }

  /**
   * Toggles the settings panel visibility.
   */
  toggleSettings(): void {
    this.showSettings = !this.showSettings
  }
}
