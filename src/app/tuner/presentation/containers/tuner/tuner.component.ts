import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { TunerState } from '../../../../tuner/application/state'
import { PitchDetectionStrategy, TunerPreferences } from '../../../../tuner/domain/ports'
import { ControlPanelComponent } from '../../components/control-panel/control-panel.component'
import { FrequencyGraphComponent } from '../../components/frequency-graph/frequency-graph.component'
import { PitchDisplayComponent } from '../../components/pitch-display/pitch-display.component'

/**
 * Container component for the tuner application.
 * Orchestrates the data flow between services and presentation components.
 * Follows Clean Architecture principles as a smart container component.
 */
@Component({
  selector: 'app-tuner',
  standalone: true,
  imports: [CommonModule, PitchDisplayComponent, FrequencyGraphComponent, ControlPanelComponent],
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.scss'],
  providers: [TunerState],
})
export class TunerComponent implements OnInit, OnDestroy {
  private readonly tunerState = inject(TunerState)

  // Expose state to the template
  protected readonly isCapturing = this.tunerState.isCapturing
  protected readonly currentPitch = this.tunerState.currentPitch
  protected readonly pitchHistory = this.tunerState.pitchHistory
  protected readonly isInTune = this.tunerState.isInTune
  protected readonly deviationInCents = this.tunerState.deviationInCents
  protected readonly isRecording = this.tunerState.isRecording
  protected readonly isPlaying = this.tunerState.isPlaying
  protected readonly error = this.tunerState.error
  protected readonly preferences = this.tunerState.preferences

  // Strategies for pitch detection
  protected availableStrategies: PitchDetectionStrategy[] = []
  protected currentStrategy: PitchDetectionStrategy | null = null

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    // Load preferences
    this.loadPreferences()

    // Get available strategies
    this.loadStrategies()
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy(): void {
    // Stop audio capture if active
    if (this.isCapturing()) {
      this.tunerState.toggleCapture()
    }
  }

  /**
   * Loads user preferences.
   */
  private async loadPreferences(): Promise<void> {
    // Preferences are loaded automatically by the TunerState
  }

  /**
   * Loads available pitch detection strategies.
   */
  private loadStrategies(): void {
    const pitchAnalysisService = inject(PitchAnalysisService)
    this.availableStrategies = pitchAnalysisService.getAvailableStrategies()
    this.currentStrategy = pitchAnalysisService.getCurrentStrategy()
  }

  /**
   * Handles the toggle capture event from the control panel.
   */
  onToggleCapture(): void {
    this.tunerState.toggleCapture()
  }

  /**
   * Handles the start session event from the control panel.
   * @param name The name of the session
   */
  onStartSession(name: string): void {
    this.tunerState.startNewSession(name)
  }

  /**
   * Handles the stop session event from the control panel.
   */
  onStopSession(): void {
    this.tunerState.stopCurrentSession()
  }

  /**
   * Handles the play reference tone event from the control panel.
   */
  onPlayReferenceTone(): void {
    this.tunerState.playReferenceTone()
  }

  /**
   * Handles the change strategy event from the control panel.
   * @param strategy The selected strategy
   */
  onChangeStrategy(strategy: PitchDetectionStrategy): void {
    const pitchAnalysisService = inject(PitchAnalysisService)
    pitchAnalysisService.setStrategy(strategy)
    this.currentStrategy = strategy
  }

  /**
   * Handles the update preferences event from the control panel.
   * @param preferences The new preferences
   */
  onUpdatePreferences(preferences: Partial<TunerPreferences>): void {
    this.tunerState.updatePreferences(preferences)
  }

  /**
   * Clears any error message.
   */
  onClearError(): void {
    this.tunerState.clearError()
  }
}

// Import at the end to avoid circular dependencies
import { PitchAnalysisService } from '../../../../tuner/application/services'
