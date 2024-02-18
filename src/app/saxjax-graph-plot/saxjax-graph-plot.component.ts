import { Component, Input, OnInit } from '@angular/core';
import { ScaleTo100Pipe } from "../scale-to100.pipe";
import { Point } from '../model/point';

@Component({
    selector: 'saxjax-graph-plot',
    standalone: true,
    templateUrl: './saxjax-graph-plot.component.html',
    styleUrl: './saxjax-graph-plot.component.scss',
    imports: [ScaleTo100Pipe]
})
export class SaxjaxGraphPlotComponent implements OnInit {

@Input() points:Point[] = [];
maxPoint: Point = {x: 100, y: 100};
minPoint:Point = {x: 0, y: 0};

ngOnInit(): void {
  this.maxPoint = {x: 1, y: 1};
  this.minPoint = {x: 0, y: 0};

  if(this.points.length > 0) {
    for(let point of this.points) {
      this.maxPoint = {x:Math.max(this.maxPoint.x, point.x), y:Math.max(this.maxPoint.y, point.y)}
      this.minPoint = {x:Math.min(this.maxPoint.x, point.x), y:Math.min(this.maxPoint.y, point.y)}
    }
  }
}

}
