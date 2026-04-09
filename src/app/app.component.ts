import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { AudioPlayerService } from '../services/audio-player.service'
import { routeTransition } from './animations/route-transition'
import { showMenu } from './animations/show-menu'
import { PageFooterComponent } from './common/page-footer/page-footer.component'
import { TopMenuComponent } from './top-menu/top-menu.component'

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, TopMenuComponent, PageFooterComponent],
  animations: [routeTransition, showMenu],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected route = inject(ActivatedRoute)
  audioPlayer = inject(AudioPlayerService)
  title = 'saxjax.dk'
}
