import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { showMenu } from '../animations/show-menu';

@Component({
    selector: 'top-menu',
    imports: [
        RouterLinkActive,
        RouterLink
    ],
    templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss',
  animations: [
    showMenu,
  ],
})
export class TopMenuComponent {
  protected menuState: 'open' | 'closed' | 'initial' = 'open';
  protected pageSelection:'pageSelected' | 'noPageSelected' = 'noPageSelected'
}
