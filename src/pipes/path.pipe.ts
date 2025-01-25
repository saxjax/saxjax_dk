import { Pipe, PipeTransform } from '@angular/core';
import { Point } from '../app/model/point';
import { ScaleTo100Pipe } from './scale-to100.pipe';

@Pipe({
  name: 'path',
  standalone: true,
})
export class PathPipe implements PipeTransform {
  scalePipe!: ScaleTo100Pipe;

  transform(points: Point[],maxPoint:Point): string {
    let path = "M 0 0"
    const scalePipe = new ScaleTo100Pipe

    if (points.length > 0){
      const firstPoint = points[0]
      path = "M "+ scalePipe.transform(firstPoint.x,maxPoint.x)+" "+ scalePipe.transform(firstPoint.y,maxPoint.y)
      points.shift()
      points.forEach(point => path+= " L" + scalePipe.transform(point.x,maxPoint.x) + " " + scalePipe.transform(point.y,maxPoint.y))
      path += " L" + scalePipe.transform(firstPoint.x,maxPoint.x) + " " + scalePipe.transform(firstPoint.y,maxPoint.y)
    }
    console.log(path)
    return path;

  }
}
