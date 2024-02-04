import { Component, Input } from '@angular/core';
import { LinkFromParenthesisPipe } from '../../../pipes/link-from-parenthesis.pipe';
import { TitleFromSquareBracketsPipe } from '../../../pipes/title-from-square-brackets.pipe';
import { DescriptionAfterColonPipe } from '../../../pipes/description-after-colon.pipe';
import { NgFor } from '@angular/common';
import { ContentPageComponent } from "../../common/content-page/content-page.component";
import { ColorScheme } from '../../model/ColorScheme';
@Component({
    selector: 'music-page',
    standalone: true,
    templateUrl: './music-page.component.html',
    styleUrl: './music-page.component.scss',
    imports: [NgFor, LinkFromParenthesisPipe, TitleFromSquareBracketsPipe, DescriptionAfterColonPipe, ContentPageComponent]
})
export class MusicPageComponent {
  @Input() title = "Orkestre som jeg har medvirket i:"
  @Input() bodyText?:string
  readonly ColorScheme = ColorScheme;


  links = ["[Saxjax Lunatic Orchestra]()::Alternativ folke jazz::",

  "[Martin Lutz Group](http://www.martinlutz-music.dk/martin-lutz-group.html)::Afronordisk soul jazz::",

  "[Sigurt Skallesmækker](http://www.bricksite.com/skallesmaekker)::Børneteater::",

  "[Bowie ALBUM Orchestra](https://www.facebook.com/events/1732521073718420/)::Bowie::",

  "[Ramashang](http://ramashang.dk/)::Middelalder og vikinge gøgl og musik::",

  "[Saxjax Solo]()::Alt fra kirkekoncerter til metal soloer::",

  "[Sloth og Skov](http://olesloth.dk/home/skov-sloth/)::Kirke koncerter::",

  "[Zinther](http://www.tzc.dk)::Festmusik::",

  "[Soulfunction](http://www.soulfunction.dk/)::Genuine Soul::",]
}
