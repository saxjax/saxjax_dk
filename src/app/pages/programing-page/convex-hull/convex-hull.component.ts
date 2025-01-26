import { Component } from '@angular/core'
import { convexHull } from '../../../algorithms/convexHull'
import { SaxjaxGraphPlotComponent } from '../../../saxjax-graph-plot/saxjax-graph-plot.component'

@Component({
  selector: 'convex-hull',
  imports: [SaxjaxGraphPlotComponent],
  templateUrl: './convex-hull.component.html',
  styleUrl: './convex-hull.component.scss',
})
export class ConvexHullComponent {
  convexHullAlgorithm = convexHull
  points = []
}
