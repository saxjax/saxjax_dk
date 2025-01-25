import { animate, query, style, transition, trigger } from '@angular/animations'
import { Component, input } from '@angular/core'
import { AddressFieldComponent } from './address-field/address-field.component'
import { MailFieldComponent } from './mail-field/mail-field.component'
import { NameFieldComponent } from './name-field/name-field.component'
import { TlfFieldComponent } from './tlf-field/tlf-field.component'

@Component({
  selector: 'page-footer',
  imports: [TlfFieldComponent, NameFieldComponent, MailFieldComponent, AddressFieldComponent],
  templateUrl: './page-footer.component.html',
  styleUrl: './page-footer.component.scss',
  animations: [
    trigger('showInfo', [
      transition('* <=> *', [
        query(
          ':enter',
          [style({ transform: 'translateY(120%)' }), animate('0.5s ease-in', style({ transform: 'translateY(0%)' }))],
          { optional: true }
        ),
        query(
          '.page-footer',
          [
            style({ height: '0', transform: 'translateY(120%)' }),
            animate('0.5s ease-in', style({ height: '*', transform: 'translateY(0%)' })),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class PageFooterComponent {
  showInfoState = input<'showInfo' | 'hideInfo'>('hideInfo')
}
