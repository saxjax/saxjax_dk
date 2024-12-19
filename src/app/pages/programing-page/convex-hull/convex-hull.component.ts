import { Component } from '@angular/core';
import { SaxjaxGraphPlotComponent } from '../../../saxjax-graph-plot/saxjax-graph-plot.component';
import { convexHull } from '../../../../pipes/algorithms/convexHull';

@Component({
    selector: 'convex-hull',
    imports: [SaxjaxGraphPlotComponent],
    templateUrl: './convex-hull.component.html',
    styleUrl: './convex-hull.component.scss'
})
export class ConvexHullComponent {
  convexHullAlgorithm = convexHull;
  points = [
    {x:10,y:10},
    {x:20,y:20},
    {x:30.6,y:30},
    {x:40,y:40},
    {x:50.6,y:50},
    {x:60.2,y:60},
    {x:70,y:70},
    {x:80,y:80},
    {x:90,y:90},
    {x:100.8,y:100},
    {x:30,y:23},
  ]
}
