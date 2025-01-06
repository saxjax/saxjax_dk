import { Component } from '@angular/core';
import {TlfFieldComponent} from "./tlf-field/tlf-field.component";
import {NameFieldComponent} from "./name-field/name-field.component";
import {MailFieldComponent} from "./mail-field/mail-field.component";
import {AddressFieldComponent} from "./address-field/address-field.component";
import { animate, stagger, state, style, transition, trigger, query } from '@angular/animations';

@Component({
    selector: 'page-footer',
    imports: [
        TlfFieldComponent,
        NameFieldComponent,
        MailFieldComponent,
        AddressFieldComponent
    ],
    templateUrl: './page-footer.component.html',
  styleUrl: './page-footer.component.scss',
  animations: [
    trigger('showInfo', [
      // state('showInfo', style({ opacity:1, height: '100%', scaleY:1 })),
      // state('hideInfo', style({ opacity:0.1, height: '10%', scaleY:0.1 })),
      transition('* <=> *', [
        query(':enter', [
          style({ transform: 'translateY(-120%)' }),
          animate('0.5s ease-in', style({ transform: 'translateY(0%)' }))
        ], {optional:true}),
      ])
    ])
  ]
})
export class PageFooterComponent {
  showInfoState: 'showInfo'|'hideInfo' = 'hideInfo'

}
