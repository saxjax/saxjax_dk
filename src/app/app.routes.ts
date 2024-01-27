import { Routes } from '@angular/router';
import {MusicPageComponent} from "./pages/music-page/music-page.component";
import {ProductsPageComponent} from "./pages/products-page/products-page.component";
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ProgramingPageComponent } from './pages/programing-page/programing-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';

export const routes: Routes = [
  {path: '',component:MainPageComponent},
  {path:'music', component:MusicPageComponent},
  {path:'products', component:ProductsPageComponent},
  {path:'programming', component:ProgramingPageComponent},
  {path:'privacy-policy', component:PrivacyPolicyPageComponent},



];
