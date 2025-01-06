import { Component } from '@angular/core';
import { ContentPageComponent } from "../../common/content-page/content-page.component";
import { ColorScheme } from '../../model/ColorScheme';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'main-page',
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.scss',
  imports: [ContentPageComponent, RouterLinkActive,
        RouterLink]

})
export class MainPageComponent {
readonly ColorScheme = ColorScheme
}
