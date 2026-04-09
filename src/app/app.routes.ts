import { Routes } from '@angular/router'
import { MainPageComponent } from './pages/main-page/main-page.component'
import { MusicPageComponent } from './pages/music-page/music-page.component'
import { NotioPageComponent } from './pages/notio-page/notio-page.component'
import { NoviaPageComponent } from './pages/novia-page/novia-page.component'
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component'
import { ProductsPageComponent } from './pages/products-page/products-page.component'
import { TunerPageComponent } from './pages/tuner-page/tuner-page.component'

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'saxjaxtuner', component: TunerPageComponent },
  { path: 'about', component: MainPageComponent },
  { path: 'music', component: MusicPageComponent },
  { path: 'products', component: ProductsPageComponent },
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
  { path: 'notio', component: NotioPageComponent },
  { path: 'novia', component: NoviaPageComponent },
]
