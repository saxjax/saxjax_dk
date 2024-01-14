import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descriptionAfterColon',
  standalone: true
})
export class DescriptionAfterColonPipe implements PipeTransform {
  doubleColonRegex = /\:\:/gm
  afterColonRegex = /\:\:(.*?)\:\:/g
  transform(inputString:string): string {
    const desc = inputString.match(this.afterColonRegex)
    return desc ? desc[0].replace(this.doubleColonRegex,'') : inputString;
  }

}
