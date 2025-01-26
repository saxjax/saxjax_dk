import { animate, group, keyframes, query, stagger, style, transition, trigger } from '@angular/animations'
import { DecimalPipe } from '@angular/common'
import { Component, input, model, OnInit } from '@angular/core'
import { PathPipe } from '../../pipes/path.pipe'
import { ScaleTo100Pipe } from '../../pipes/scale-to100.pipe'
import { Point } from '../model/point'

@Component({
  selector: 'saxjax-graph-plot',
  templateUrl: './saxjax-graph-plot.component.html',
  styleUrl: './saxjax-graph-plot.component.scss',
  imports: [ScaleTo100Pipe, PathPipe, DecimalPipe],
  animations: [
    trigger('profileAnimation', [
      transition(
        '* <=> *',
        group([
          query(
            ':enter',
            [
              style({ opacity: 0 }),
              stagger(1, [
                animate(
                  '1000ms ease-in',
                  keyframes([
                    style({ opacity: 0, offset: 0.3 }),
                    style({ opacity: 0.3, offset: 0.7 }),
                    style({ opacity: 1, offset: 1 }),
                  ])
                ),
              ]),
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              stagger(1, [
                animate(
                  '1000ms ease-in',
                  keyframes([style({ transform: 'translateX(-120%)', offset: 0.5 }), style({ opacity: 0, offset: 1 })])
                ),
              ]),
            ],
            { optional: true }
          ),
        ])
      ),
    ]),
  ],
})
export class SaxjaxGraphPlotComponent implements OnInit {
  points = model<Point[]>([])
  title = input('no name')
  algorithm = input((points: Point[]) => points)
  edges: Point[] = []
  maxPoint: Point = { x: 100, y: 100 }
  minPoint: Point = { x: 0, y: 0 }

  ngOnInit(): void {
    this.maxPoint = { x: 1, y: 1 }
    this.minPoint = { x: 0, y: 0 }

    if (this.points().length === 0) {
      this.generateNewPoints()
    }
    if (this.points().length > 0) {
      for (const point of this.points()) {
        this.maxPoint = { x: Math.max(this.maxPoint.x, point.x), y: Math.max(this.maxPoint.y, point.y) }
        this.minPoint = { x: Math.min(this.maxPoint.x, point.x), y: Math.min(this.maxPoint.y, point.y) }
      }
    }
  }

  generateNewPoints(count?: number) {
    if (!count) {
      count = this.generateRandomInteger(100)
      count = count > 5 ? count : 5
    }
    this.edges = []
    const points = new Array(count)
    console.log('New points:')
    for (let n = 0; n < count; n++) {
      points[n] = { x: Math.random() * 100, y: Math.random() * 100 }
      console.log('x:' + points[n].x + ' y:' + points[n].y)
    }
    this.points.set(points)
  }

  calculate() {
    this.edges = []
    this.edges = this.algorithm()(this.points())
  }

  generateRandomInteger(max: number) {
    const bytes = new Uint8Array(1)
    crypto.getRandomValues(bytes)
    return bytes[0] % max
  }
}
