import { Pipe, PipeTransform } from '@angular/core';
import { Point } from './model/point';

@Pipe({
  name: 'scaleTo100',
  standalone: true
})
export class ScaleTo100Pipe implements PipeTransform {

  transform(value: number, maxValue:number, minRange:number = 0, maxRange:number = 100): unknown {
    const scalar = maxRange/maxValue

    return value * scalar;
  }

}
