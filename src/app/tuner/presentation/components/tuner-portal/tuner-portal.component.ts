import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Output } from '@angular/core'
import { TunerComponent } from '../../containers/tuner/tuner.component'

/**
 * Component for displaying the tuner in a floating portal window.
 */
@Component({
  selector: 'app-tuner-portal',
  standalone: true,
  imports: [CommonModule, TunerComponent],
  templateUrl: './tuner-portal.component.html',
  styleUrls: ['./tuner-portal.component.scss'],
})
export class TunerPortalComponent {
  @Output() close = new EventEmitter<void>()

  /**
   * Closes the portal.
   */
  onClose(): void {
    this.close.emit()
  }
}
