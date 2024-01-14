import { Routes } from '@angular/router';
import {MusicPageComponent} from "./music-page/music-page.component";
import {ProductsPageComponent} from "./products-page/products-page.component";
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
  {path: '',component:MainPageComponent},
  {path:'music', component:MusicPageComponent},
  {path:'products', component:ProductsPageComponent}
];
