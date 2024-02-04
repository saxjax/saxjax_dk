import { ColorScheme } from './../../model/ColorScheme';
import { Component, Input, OnInit } from '@angular/core';
import path from 'path';
import { ContentTitleComponent } from "../content-title/content-title.component";
import { NgClass } from '@angular/common';

@Component({
    selector: 'content-page',
    standalone: true,
    templateUrl: './content-page.component.html',
    styleUrl: './content-page.component.scss',
    imports: [ContentTitleComponent,NgClass]
})
export class ContentPageComponent implements OnInit {
  @Input() colorscheme:ColorScheme = ColorScheme.blue;
  @Input() title?:string;
  @Input() image? :string;
  @Input() images: string[] = [];
  @Input() altImgText = "saxjax drinking coffee";
  @Input() imageWidth = "20%";

  ngOnInit(): void {
    if(this.image){
      this.images.push(this.image)
    }
  }

}
