import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'scaleTo100',
  standalone: true,
})
export class ScaleTo100Pipe implements PipeTransform {
  transform(value: number, maxValue: number, _minRange = 0, maxRange = 100): unknown {
    const scalar = maxRange / (maxRange - _minRange)

    return value * scalar
  }
}
