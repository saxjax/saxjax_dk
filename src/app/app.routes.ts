import { Routes } from '@angular/router'
import { JobsPageComponent } from './pages/jobs-page/jobs-page.component'
import { MainPageComponent } from './pages/main-page/main-page.component'
import { MathPageComponent } from './pages/math-page/math-page.component'
import { MusicPageComponent } from './pages/music-page/music-page.component'
import { NotioPageComponent } from './pages/notio-page/notio-page.component'
import { NoviaPageComponent } from './pages/novia-page/novia-page.component'
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component'
import { ProductsPageComponent } from './pages/products-page/products-page.component'
import { ProgramingPageComponent } from './pages/programing-page/programing-page.component'
import { TunerWindowComponent } from './pages/tuner-window/tuner-window.component'

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'music', component: MusicPageComponent },
  { path: 'products', component: ProductsPageComponent },
  { path: 'programming', component: ProgramingPageComponent },
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
  { path: 'math', component: MathPageComponent },
  { path: 'jobs', component: JobsPageComponent },
  { path: 'notio', component: NotioPageComponent },
  { path: 'novia', component: NoviaPageComponent },
  { path: 'tuner', component: TunerWindowComponent },
]
