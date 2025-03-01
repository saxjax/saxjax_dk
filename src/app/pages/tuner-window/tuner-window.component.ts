import { Component, signal } from '@angular/core'
import { FloatingWindowComponent } from '../../floating-window/floating-window.component'
import { TunerComponent } from '../../tuner/presentation/containers/tuner/tuner.component'

@Component({
  selector: 'tuner-window',
  imports: [FloatingWindowComponent, TunerComponent],
  templateUrl: './tuner-window.component.html',
  styleUrl: './tuner-window.component.scss',
})
export class TunerWindowComponent {
  show = signal(true)
  closeTunerPortal() {
    this.show.update((current) => !current)
  }
}
