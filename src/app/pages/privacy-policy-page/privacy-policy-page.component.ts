import { ColorScheme } from './../../model/ColorScheme'
import { Component } from '@angular/core'
import { ContentPageComponent } from '../../common/content-page/content-page.component'

@Component({
  selector: 'privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.scss',
  imports: [ContentPageComponent],
})
export class PrivacyPolicyPageComponent {
  readonly ColorScheme = ColorScheme
}
