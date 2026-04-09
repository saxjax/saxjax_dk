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

  readonly appStoreUrl = 'https://apps.apple.com/dk/app/saxjax-tuner/id1257573809'

  readonly quickStartSteps = [
    {
      title: 'Start Recording',
      detail:
        'Open the tuner and swipe down to start recording. The app begins collecting pitch plots across all 12 chromatic lanes in real time.',
    },
    {
      title: 'Play Your Material',
      detail:
        'Play long tones, scales, or repertoire. Pitch points are logged per note lane so you can see stability, drift, and intonation patterns over time.',
    },
    {
      title: 'Change The View',
      detail:
        'Swipe up to cycle view modes while practicing, then use the timeline ruler to inspect where intonation changed during the session.',
    },
    {
      title: 'Review And Loop',
      detail:
        'In playback mode, scrub the session timeline, set A/B loop points, and use ±1s or ±5s jog controls to repeat difficult passages precisely.',
    },
  ]

  readonly swipeActions = [
    { gesture: 'Swipe Down', action: 'Start/stop recording. In playback mode, swipe down exits playback.' },
    { gesture: 'Swipe Up', action: 'Cycle through tuner view modes.' },
    { gesture: 'Swipe Right (left edge)', action: 'Open Settings (start near the left edge, below the top bars).' },
    { gesture: 'Swipe Left (right edge)', action: 'Open Analytics (start near the right edge, below the top bars).' },
    {
      gesture: 'Swipe Left (center area)',
      action: 'Open Exercise Overview when the swipe starts away from both edges and below the top bars.',
    },
  ]

  readonly capabilityHighlights = [
    'Timeline tap-to-jump navigation for fast review of any point in your session.',
    'Playback transport with speed options (0.5x, 1.0x, 2.0x).',
    'A/B loop markers for focused repetition and comparison.',
    'Original versus corrected playback mode for listening analysis when audio is available.',
  ]

  readonly quickViewIcons = [
    {
      key: 'kammertone',
      mark: '440',
      name: 'Reference Pitch',
      action: 'Opens the kammertone slider to set concert pitch (for example A=440 Hz).',
    },
    {
      key: 'tolerance',
      mark: '±',
      name: 'Tolerance',
      action: 'Opens cents tolerance control to decide how strict in-tune detection should be.',
    },
    {
      key: 'history',
      mark: '≋',
      name: 'History Mode',
      action: 'Opens history mode panel (Compact, Relative, or Hide timeline view).',
    },
    {
      key: 'transpose',
      mark: 'C/Bb',
      name: 'Transpose',
      action: 'Opens transposition slider to match your instrument key.',
    },
    {
      key: 'sound',
      mark: ')))',
      name: 'Response Tone',
      action: 'Toggles response tone on or off.',
    },
    {
      key: 'interval',
      mark: 'P5',
      name: 'Response Interval',
      action: 'Opens interval slider for response tone interval in semitones.',
    },
    {
      key: 'analytics',
      mark: '7d',
      name: 'Analytics',
      action: 'Opens practice analytics dashboard.',
    },
    {
      key: 'ml',
      mark: 'ML',
      name: 'Practice Intelligence',
      action: 'Opens ML-powered practice insights.',
    },
    {
      key: 'journey',
      mark: '▮▮▮',
      name: 'Journey Meter',
      action: 'Opens musician journey progression.',
    },
  ]

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
