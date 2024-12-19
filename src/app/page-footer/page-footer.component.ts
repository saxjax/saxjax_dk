import { Component } from '@angular/core';
import {TlfFieldComponent} from "./tlf-field/tlf-field.component";
import {NameFieldComponent} from "./name-field/name-field.component";
import {MailFieldComponent} from "./mail-field/mail-field.component";
import {AddressFieldComponent} from "./address-field/address-field.component";

@Component({
    selector: 'page-footer',
    imports: [
        TlfFieldComponent,
        NameFieldComponent,
        MailFieldComponent,
        AddressFieldComponent
    ],
    templateUrl: './page-footer.component.html',
    styleUrl: './page-footer.component.scss'
})
export class PageFooterComponent {

}
