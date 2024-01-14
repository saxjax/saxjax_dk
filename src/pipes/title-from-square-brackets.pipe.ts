import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleFromSquareBrackets',
  standalone: true
})
export class TitleFromSquareBracketsPipe implements PipeTransform {
  fromSquareBracketsRegex: RegExp = /\[(.*?)\]/gm
  transform(inputString:string): string {
    const title = inputString.match(this.fromSquareBracketsRegex)
    return title ? title[0].replace(/\[|\]/g,'') : inputString;
  }

}
