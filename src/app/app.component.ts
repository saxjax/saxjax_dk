import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import {TopMenuComponent} from "./top-menu/top-menu.component";
import { routeTransition } from './animations/route-transition';
import { showMenu } from './animations/show-menu';
import { PageFooterComponent } from './common/page-footer/page-footer.component';
import { AudioPlayerService } from '../services/audio-player.service';

@Component({
    selector: 'app-root',
  imports: [CommonModule, RouterOutlet, TopMenuComponent, PageFooterComponent],
  animations: [
    routeTransition,
    showMenu
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',

})
export class AppComponent {
  protected route = inject(ActivatedRoute)
  audioPlayer = inject(AudioPlayerService)
  title = 'saxjax.dk';
  showFooter: 'showInfo' | 'hideInfo' = 'hideInfo';
  onClick = () => this.audioPlayer.playSample('src/assets/audio/Merserburger Sauberspruche.mp3');
}
