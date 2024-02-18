import { Component } from '@angular/core';
import { ContentPageComponent } from "../../common/content-page/content-page.component";
import { ColorScheme } from '../../model/ColorScheme';
import { ConvexHullComponent } from './convex-hull/convex-hull.component';

@Component({
    selector: 'programing-page',
    standalone: true,
    templateUrl: './programing-page.component.html',
    styleUrl: './programing-page.component.scss',
    imports: [ContentPageComponent,ConvexHullComponent]
})
export class ProgramingPageComponent {
readonly ColorScheme =  ColorScheme
}
