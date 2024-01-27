import { ColorScheme } from './../../model/ColorScheme';
import { Component, Input } from '@angular/core';
import path from 'path';
import { ContentTitleComponent } from "../content-title/content-title.component";

@Component({
    selector: 'content-page',
    standalone: true,
    templateUrl: './content-page.component.html',
    styleUrl: './content-page.component.scss',
    imports: [ContentTitleComponent]
})
export class ContentPageComponent {
  @Input() colorscheme:ColorScheme = ColorScheme.blue;
  @Input() title?:string;
  @Input() image? :string;
  @Input() altImgText = "saxjax drinking coffee";
  @Input() imageWidth = "20%";
}
