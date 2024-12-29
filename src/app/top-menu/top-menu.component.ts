import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

const hidden = { opacity:0.5, height:'5%',transform: 'translateY(-10%)' }
const active = { opacity:1, height: '20%', transform: 'translateY(0%)' }
const dorment = { opacity: 0.5, height: '10%', transform: 'translateY(-10%)' }
// const pageSelected = { opacity: 0.5, height: '5%', 'min-height':'100px'}
// const noPageSelected = {opacity:1, height:'100%', 'min-height':'200px'}

const timingIn = '1s ease-in'
const timingToActive = '0.3s ease-in'
const timingToDorment = '0.5s ease-out'

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
        animate(timingIn, style(active))
      ]),
      state('initial',style(hidden)),
      state('closed',style(dorment)),
      state('open', style(active)),
      transition('initial => open', [animate(timingIn)]),
      transition('closed => open', [animate(timingToActive)]),
      transition('open => closed', [animate(timingToDorment)]),
    ]),
  //     trigger('pageSelected', [
  //       state('pageSelected', style(pageSelected)),
  //       state('noPageSelected', style(noPageSelected)),
  //       transition('pageSelected => noPageSelected', [animate(timingIn)])
  // ])

  ],
})
export class TopMenuComponent {
  protected menuState: 'open' | 'closed' | 'initial' = 'open';
  protected pageSelection:'pageSelected' | 'noPageSelected' = 'noPageSelected'
}
