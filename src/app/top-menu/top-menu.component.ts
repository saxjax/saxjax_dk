import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

const hidden = { transform: 'translateX(-120%)' }
const active = { transform: 'translateX(0%)' }
const dorment = { transform: 'translateX(-10%)' }
const timingIn = '0.3s ease-in'
const timingToActive = '0.3s ease-in'
const timingToDorment = '0.1s ease-out'

@Component({
    selector: 'top-menu',
    imports: [
        RouterLinkActive,
        RouterLink
    ],
    templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss',
  animations: [
    trigger("showMenu", [
      transition(':enter', [style(hidden),
        animate('0.3s ease-in', style(active))
      ]),
        state('initial',style(hidden)),
        state('closed',style(dorment)),
      state('open', style(active)),
      transition('initial => open', [animate(timingIn)]),
      transition('closed => open', [animate(timingToActive)]),
      transition('open => closed', [animate(timingToDorment)]),
      ])
    ]
})
export class TopMenuComponent {
  protected menuState: 'open' | 'closed' | 'initial' = 'initial';
}
