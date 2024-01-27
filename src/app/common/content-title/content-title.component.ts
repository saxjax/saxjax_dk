import { Component, Input } from '@angular/core';
import { ColorScheme } from '../../model/ColorScheme';

@Component({
  selector: 'content-title',
  standalone: true,
  imports: [],
  templateUrl: './content-title.component.html',
  styleUrl: './content-title.component.scss'
})
export class ContentTitleComponent {
  @Input() colorscheme:ColorScheme = ColorScheme.blue;
  @Input() title:string = ""

}
