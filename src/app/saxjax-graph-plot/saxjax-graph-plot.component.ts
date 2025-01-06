import {
  Component, Input, OnInit } from '@angular/core';
import { ScaleTo100Pipe } from "../../pipes/scale-to100.pipe";
import { Point } from '../model/point';
import { randomInt } from 'crypto';
import { PathPipe } from "../../pipes/path.pipe";
import { animate, group, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'saxjax-graph-plot',
    templateUrl: './saxjax-graph-plot.component.html',
    styleUrl: './saxjax-graph-plot.component.scss',
  imports: [ScaleTo100Pipe, PathPipe, DecimalPipe],
    animations: [
  trigger('profileAnimation', [
    transition('* <=> *',
      group([
      query(':enter',[
        style({ opacity: 0 }),
        stagger(1, [
          animate('1000ms ease-in', keyframes([
            style({ opacity: 0, offset: 0.3 }),
            style({ opacity:0.3, offset:  0.7 }),
            style({ opacity:1, offset:1 }),
          ])
        )
      ])
      ],{optional:true}),
        query(':leave',[
        stagger(1, [
          animate('1000ms ease-in', keyframes([
            style({ transform: 'translateX(-120%)', offset:  0.5 }),
            style({ opacity:0, offset:1 }),
          ])
        )
      ])
        ], {optional:true}),

      ]),
    )],

  )]
})
export class SaxjaxGraphPlotComponent implements OnInit {
@Input() points:Point[] = [];
@Input() title:string = "no name";
@Input() algorithm!: (points: Point[]) => Point[];
edges:Point[] = []
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

generateNewPoints(count:number){
  this.edges = [];
  this.points = new Array(count);
  console.log("New points:")
  for(let n = 0;n < count; n++ ){
    this.points[n]={x:Math.random()*100,y:Math.random()*100};
    console.log("x:"+this.points[n].x+" y:"+this.points[n].y)
  }
}

calculate(){
  this.edges = []
  this.edges = this.algorithm(this.points)
}

}
