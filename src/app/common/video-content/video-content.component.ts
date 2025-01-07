import { Component, input, signal } from '@angular/core';
import { TrustPipe } from "../../../pipes/trust.pipe";
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { query } from 'express';

@Component({
  selector: 'video-content',
  imports: [TrustPipe],
  templateUrl: './video-content.component.html',
  styleUrl: './video-content.component.scss',
  animations: [
    trigger('animation', [
      transition(':enter', [
        animate('2s ease-in', keyframes([
          style({ scale: 0.7, opacity: 0.7, translate: '-100% 0', offset: 0 }),
          style({ scale: 0.7, opacity: 0.7, translate: '0 0', offset: 0.7 }),
          style({scale:1.1,opacity:0.7,translate:'10% 0', offset:0.8}),
          style({scale:1,opacity:1,translate:'0 0', offset:1})
        ]))
      ])
    ]),
    trigger('showvideo', [
      state('hide', style({  height: '*', width: '*'})),
      state('show', style({  height:'800px', width: '100%'})),
      transition('show <=> hide', [animate('1.2s ease-in')]),

    ])
  ],

})
export class VideoContentComponent {
  iframeUrl = input.required<string>()
  show = signal<'show' | 'hide'>('hide')

  toggleShow() {
    this.show() === 'hide' ? this.show.set('show') : this.show.set('hide')
  }
}
