import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkFromParenthesis',
  standalone: true
})
export class LinkFromParenthesisPipe implements PipeTransform {
  fromParenthesisRegex = /\((.*?)\)/g
  transform(inputString:string): string {
    const linkText = inputString.match(this.fromParenthesisRegex)
    return linkText ? linkText[0].replace(/\(|\)/g,'') : inputString;
  }

}
