import { NgClass } from '@angular/common'
import { Component } from '@angular/core'
import { routeTransition } from '../../animations/route-transition'
import { StageBackgroundComponent } from './stage-background/stage-background.component'
import {
  exercisesByTier,
  featuresByCategory,
  visibleExercises,
  visibleFeatures,
  type Exercise,
  type Feature,
} from './tuner-catalog'

@Component({
  selector: 'tuner-page',
  templateUrl: './tuner-page.component.html',
  styleUrl: './tuner-page.component.scss',
  imports: [NgClass, StageBackgroundComponent],
  animations: [routeTransition],
})
export class TunerPageComponent {
  readonly exercises = visibleExercises()
  readonly features = visibleFeatures()

  readonly coreExercises = exercisesByTier('core')
  readonly advancedExercises = exercisesByTier('advanced')
  readonly gameTheoryExercises = exercisesByTier('game-theory')

  readonly intelligenceFeatures = featuresByCategory('intelligence')
  readonly tuningFeatures = featuresByCategory('tuning')
  readonly audioFeatures = featuresByCategory('audio')
  readonly analyticsFeatures = featuresByCategory('analytics')
  readonly cloudFeatures = featuresByCategory('cloud')

  readonly appStoreUrl = 'https://apps.apple.com/dk/app/saxjax-tuner-lite/id1308528794'

  readonly stats = {
    exercises: this.exercises.length,
    algorithms: 5,
    instruments: 10,
    levels: 11,
  }

  readonly screenshots = [
    {
      src: 'assets/images/screenshots/tuner-main.png',
      alt: 'Chromatic tuner view showing twelve note lanes with real-time pitch detection',
      caption: 'Twelve chromatic lanes show every note in real time — pitch accuracy you can actually read.',
    },
    {
      src: 'assets/images/screenshots/hunt-exercise.png',
      alt: 'Hunt ear-training exercise showing hidden target note with scoring',
      caption: 'HUNT: find and lock the hidden target note using nothing but your ears.',
    },
    {
      src: 'assets/images/screenshots/hunt-gameplay.png',
      alt: 'Hunt exercise gameplay with real-time scoring and adaptive difficulty',
      caption: 'Real-time scoring, adaptive difficulty, and ML-targeted note selection.',
    },
    {
      src: 'assets/images/screenshots/audio-mixer.png',
      alt: 'Audio mixer control panel with input faders and device profiles',
      caption: 'DAW-style floating mixer with input/output faders and per-device mic profiles.',
    },
  ]

  activeScreenshot = 0

  selectScreenshot(index: number): void {
    this.activeScreenshot = index
  }

  statusLabel(status: Exercise['status'] | Feature['status']): string {
    switch (status) {
      case 'released':
        return ''
      case 'beta':
        return 'BETA'
      case 'coming-soon':
        return 'SOON'
      default:
        return ''
    }
  }
}
