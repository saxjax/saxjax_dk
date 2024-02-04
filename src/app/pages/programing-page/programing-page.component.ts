import { Component } from '@angular/core';
import { ContentPageComponent } from "../../common/content-page/content-page.component";
import { ColorScheme } from '../../model/ColorScheme';

@Component({
    selector: 'programing-page',
    standalone: true,
    templateUrl: './programing-page.component.html',
    styleUrl: './programing-page.component.scss',
    imports: [ContentPageComponent]
})
export class ProgramingPageComponent {
readonly ColorScheme =  ColorScheme
}
