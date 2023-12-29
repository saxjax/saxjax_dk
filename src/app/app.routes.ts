import { Routes } from '@angular/router';
import {MusicPageComponent} from "./music-page/music-page.component";
import {ProductsPageComponent} from "./products-page/products-page.component";

export const routes: Routes = [
  {path:'music', component:MusicPageComponent},
  {path:'products', component:ProductsPageComponent}
];
