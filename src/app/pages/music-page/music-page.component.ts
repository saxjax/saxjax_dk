import { Component, Input } from '@angular/core'
import { DescriptionAfterColonPipe } from '../../../pipes/description-after-colon.pipe'
import { LinkFromParenthesisPipe } from '../../../pipes/link-from-parenthesis.pipe'
import { TitleFromSquareBracketsPipe } from '../../../pipes/title-from-square-brackets.pipe'
import { TrustPipe } from '../../../pipes/trust.pipe'
import { ContentPageComponent } from '../../common/content-page/content-page.component'
import { VideoContentComponent } from '../../common/video-content/video-content.component'
import { ColorScheme } from '../../model/ColorScheme'
@Component({
  selector: 'music-page',
  templateUrl: './music-page.component.html',
  styleUrl: './music-page.component.scss',
  imports: [
    LinkFromParenthesisPipe,
    TitleFromSquareBracketsPipe,
    DescriptionAfterColonPipe,
    TrustPipe,
    ContentPageComponent,
    VideoContentComponent,
  ],
})
export class MusicPageComponent {
  @Input() title = 'Orkestre som jeg har medvirket i:'
  @Input() bodyText?: string
  readonly ColorScheme = ColorScheme
  urls = [
    'https://www.youtube.com/embed/DfdKn2OPxdU?si=_dLv2yLjnDZdp_3b',
    'https://www.youtube.com/embed/AN4mBsFvv-M?si=YGwToGooBPG38CNA&amp;start=387',
    'https://www.youtube.com/embed/Hz-r6fUDMhY?si=fGLj3TTy-gwqu-CY',
    'https://www.youtube.com/embed/JHV9rtuYw_w?si=GshIh9v9zGLM5FYR&amp;start=115',
    'https://www.youtube.com/embed/FLtRNflt0Ec?si=hL8v0dszwIRJzzrW&amp;start=75',
    'https://www.youtube.com/embed/GTfFPsZRD0k?si=viJ8Sd9AgDob7jma&amp;start=895',
    'https://www.youtube.com/embed/LsGLLy5C2mg?si=L70wMMqtr-whIuhT&amp;start=154',
    'https://www.youtube.com/embed/NgdTN2xQ8Yg?si=auu1Rc8Jp88Vvt2u',
    'https://embed.music.apple.com/dk/album/tango-vista-vinterjazz-2010/945138776',
    'https://www.reverbnation.com/widget_code/html_widget/artist_405671?widget_id=55&pwc[included_songs]=1&context_type=page_object',
    'https://open.spotify.com/embed/artist/1uuhruxGCOa1hTI7i9fMHx?utm_source=generator',
  ]

  links = [
    '[Saxjax Lunatic Orchestra]()::Alternativ folke jazz::',

    '[Martin Lutz Group](http://www.martinlutz-music.dk/martin-lutz-group.html)::Afronordisk soul jazz::',

    '[Sigurt Skallesmækker](http://www.bricksite.com/skallesmaekker)::Børneteater::',

    '[Bowie ALBUM Orchestra](https://www.facebook.com/events/1732521073718420/)::Bowie::',

    '[Ramashang](http://ramashang.dk/)::Middelalder og vikinge gøgl og musik::',

    '[Saxjax Solo]()::Alt fra kirkekoncerter til metal soloer::',

    '[Sloth og Skov](http://olesloth.dk/home/skov-sloth/)::Kirke koncerter::',

    '[Zinther](http://www.tzc.dk)::Festmusik::',

    '[Soulfunction](http://www.soulfunction.dk/)::Genuine Soul::',
  ]
}
