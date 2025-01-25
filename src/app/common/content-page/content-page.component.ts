import { NgClass } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { routeTransition } from '../../animations/route-transition'
import { ContentTitleComponent } from '../content-title/content-title.component'
import { ColorScheme } from './../../model/ColorScheme'

@Component({
  selector: 'content-page',
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.scss',
  imports: [ContentTitleComponent, NgClass],
  animations: [routeTransition],
})
export class ContentPageComponent implements OnInit {
  @Input() colorscheme: ColorScheme = ColorScheme.blue
  @Input() title?: string
  @Input() image?: string
  @Input() images: string[] = []
  @Input() altImgText = 'saxjax drinking coffee'
  @Input() imageWidth = '20%'

  ngOnInit(): void {
    if (this.image) {
      this.images.push(this.image)
    }
  }
}
