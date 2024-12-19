import { Component } from '@angular/core';
import { ContentPageComponent } from "../../common/content-page/content-page.component";
import { ColorScheme } from '../../model/ColorScheme';

@Component({
    selector: 'main-page',
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.scss',
    imports: [ContentPageComponent]
})
export class MainPageComponent {
readonly ColorScheme = ColorScheme
}
