import { Component } from '@angular/core';
import { ContentPageComponent } from "../../common/content-page/content-page.component";
import { ColorScheme } from '../../model/ColorScheme';
import { LinkFromParenthesisPipe } from "../../../pipes/link-from-parenthesis.pipe";
import { TitleFromSquareBracketsPipe } from "../../../pipes/title-from-square-brackets.pipe";
import { DescriptionAfterColonPipe } from "../../../pipes/description-after-colon.pipe";
import { TrustPipe } from '../../../pipes/trust.pipe';

@Component({
    selector: 'products-page',
    templateUrl: './products-page.component.html',
    styleUrl: './products-page.component.scss',
    imports: [ContentPageComponent, LinkFromParenthesisPipe, TitleFromSquareBracketsPipe, DescriptionAfterColonPipe, TrustPipe]
})
export class ProductsPageComponent {
  readonly ColorScheme = ColorScheme;

  links = [
        "[SAXJAX TUNER](https://apps.apple.com/dk/app/saxjax-tuner-lite/id1308528794)::INTELLIGENT • TUNER • FOR • WINDINSTRUMENTS::",
        "[Notio](https://musedlab.org/notio)::En web app som kan anvendes til at undervise og udforske skalaer i det musikalske univers::",
        "[Den Lille Tabel](https://apps.apple.com/dk/app/saxjax-den-lille-tabel/id1602361785)::En lille app til at øve tabelerne::",
        "[Colorfull todolist](https://apps.apple.com/us/app/saxjax-colorfull-todolist/id1643164134)::En af de mange todo list apps::",
  ]

}
