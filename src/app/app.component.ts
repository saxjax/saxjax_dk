import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { TopMenuComponent } from './top-menu/top-menu.component'
import { routeTransition } from './animations/route-transition'
import { showMenu } from './animations/show-menu'
import { AudioPlayerService } from '../services/audio-player.service'

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, TopMenuComponent],
  animations: [routeTransition, showMenu],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected route = inject(ActivatedRoute)
  audioPlayer = inject(AudioPlayerService)
  title = 'saxjax.dk'
}
