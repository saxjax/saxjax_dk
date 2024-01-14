import { Component } from '@angular/core';
import { LinkFromParenthesisPipe } from '../../pipes/link-from-parenthesis.pipe';
import { TitleFromSquareBracketsPipe } from '../../pipes/title-from-square-brackets.pipe';
import { DescriptionAfterColonPipe } from '../../pipes/description-after-colon.pipe';
import { NgFor } from '@angular/common';

@Component({
  selector: 'main-page',
  standalone: true,
  imports: [NgFor ,LinkFromParenthesisPipe,TitleFromSquareBracketsPipe,DescriptionAfterColonPipe],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
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
