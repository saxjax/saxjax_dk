import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";


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
      transition(':enter', [style({ transform: 'translateX(-120%)' }),
        animate('0.3s ease-in', style({ transform: 'translateX(0%)'}))
      ]),
        state('initial',style({transform: 'translateX(-120%)'})),
        state('closed',style({transform: 'translateY(-10%)'})),
      state('open', style({
        transform: 'translateY(0%)'
      })),
      transition('initial => open', [animate('0.3s ease-in')]),
      transition('closed => open', [animate('0.3s ease-in')]),
      transition('open => closed', [animate('0.1s ease-out')]),
      ])
    ]
})
export class TopMenuComponent {
  protected menuState: 'open' | 'closed' | 'initial' = 'initial';
}
