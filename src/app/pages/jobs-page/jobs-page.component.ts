import { ContentPageComponent } from './../../common/content-page/content-page.component';
import { Component, inject, Input } from '@angular/core';
import { ColorScheme } from '../../model/ColorScheme';

@Component({
  selector: 'jobs-page',
  standalone: true,
  imports: [ContentPageComponent],
  templateUrl: './jobs-page.component.html',
  styleUrl: './jobs-page.component.scss'
})
export class JobsPageComponent {
  @Input() title = "CV"
  @Input() bodyText?:string
  readonly ColorScheme = ColorScheme;
}
