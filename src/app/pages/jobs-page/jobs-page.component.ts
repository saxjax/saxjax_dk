import { Component, Input } from '@angular/core'
import { ColorScheme } from '../../model/ColorScheme'
import { ContentPageComponent } from './../../common/content-page/content-page.component'

@Component({
  selector: 'jobs-page',
  imports: [ContentPageComponent],
  templateUrl: './jobs-page.component.html',
  styleUrl: './jobs-page.component.scss',
})
export class JobsPageComponent {
  @Input() title = 'CV'
  @Input() bodyText?: string
  readonly ColorScheme = ColorScheme
}
