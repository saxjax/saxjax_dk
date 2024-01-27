import { Component } from '@angular/core';
import { ContentPageComponent } from "../../common/content-page/content-page.component";
import { ColorScheme } from '../../model/ColorScheme';
import { LinkFromParenthesisPipe } from "../../../pipes/link-from-parenthesis.pipe";
import { TitleFromSquareBracketsPipe } from "../../../pipes/title-from-square-brackets.pipe";
import { DescriptionAfterColonPipe } from "../../../pipes/description-after-colon.pipe";

@Component({
    selector: 'products-page',
    standalone: true,
    templateUrl: './products-page.component.html',
    styleUrl: './products-page.component.scss',
    imports: [ContentPageComponent, LinkFromParenthesisPipe, TitleFromSquareBracketsPipe, DescriptionAfterColonPipe]
})
export class ProductsPageComponent {
  readonly ColorScheme = ColorScheme;

  links = [
  "[Notio](https://musedlab.org/notio)::En web app som kan anvendes til at undervise og udforske skalaer i det musikalske univers::",
  "[Den Lille Tabel](https://apps.apple.com/dk/app/saxjax-den-lille-tabel/id1602361785)::En lille app til at øve tabelerne::",
  "[SAXJAX TUNER](https://itunes.apple.com/dk/app/saxjax-tuner/id1257573809?l=da&mt=8)::INTELLIGENT • TUNER • FOR • WINDINSTRUMENTS::",
  "[Colorfull todolist](https://apps.apple.com/us/app/saxjax-colorfull-todolist/id1643164134)::En af de mange todo list apps::"
]

}
