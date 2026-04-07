/**
 * saxjaxTuner Feature & Exercise Catalog
 *
 * Toggle `enabled: true/false` to show/hide features and exercises
 * on the website as they become tested and available in the app.
 */

// ── Exercise Status ──────────────────────────────────────────────

export type ExerciseStatus = 'released' | 'beta' | 'coming-soon' | 'hidden'

export interface Exercise {
  id: string
  name: string
  tagline: string
  description: string
  tier: 'core' | 'advanced' | 'game-theory'
  status: ExerciseStatus
  icon: string // emoji
}

// ── Feature Status ───────────────────────────────────────────────

export type FeatureStatus = 'released' | 'beta' | 'coming-soon' | 'hidden'

export interface Feature {
  id: string
  name: string
  headline: string
  description: string
  category: 'intelligence' | 'tuning' | 'audio' | 'practice' | 'analytics' | 'cloud'
  status: FeatureStatus
  icon: string
}

// ── Exercises ────────────────────────────────────────────────────

export const EXERCISES: Exercise[] = [
  // ── Core (13) ──────────────────────────────────────────────────
  {
    id: 'snipe',
    name: 'SNIPE',
    tagline: 'Lock the first attack',
    description: 'Single-note long tones — nail your pitch from the very first moment.',
    tier: 'core',
    status: 'released',
    icon: '🎯',
  },
  {
    id: 'mirror',
    name: 'MIRROR',
    tagline: 'Match ghost curves',
    description: 'Replay a previous intonation curve and try to match it exactly.',
    tier: 'core',
    status: 'released',
    icon: '🪞',
  },
  {
    id: 'dojo',
    name: 'DOJO',
    tagline: 'Heal weak notes',
    description: 'AI identifies your weakest notes and builds a targeted training zone.',
    tier: 'core',
    status: 'released',
    icon: '🥋',
  },
  {
    id: 'pulse',
    name: 'PULSE',
    tagline: 'Beat-synced pitch',
    description: 'Control your intonation in rhythm — pitch accuracy meets timing.',
    tier: 'core',
    status: 'released',
    icon: '💓',
  },
  {
    id: 'hunt',
    name: 'HUNT',
    tagline: 'Find the note blind',
    description: 'Ear-training game — find and hold the hidden target note using only your ears.',
    tier: 'core',
    status: 'released',
    icon: '🔍',
  },
  {
    id: 'drift',
    name: 'DRIFT',
    tagline: 'Sustain stability',
    description: 'Hold a perfectly centered pitch as long as possible without wandering.',
    tier: 'core',
    status: 'released',
    icon: '🌊',
  },
  {
    id: 'forge',
    name: 'FORGE',
    tagline: 'Center under pressure',
    description: 'Stay in tune while the heat rises — the longer you hold, the hotter it gets.',
    tier: 'core',
    status: 'released',
    icon: '🔥',
  },
  {
    id: 'sprint',
    name: 'SPRINT',
    tagline: 'Fast target practice',
    description: 'Rapid-fire weak note targeting — hit as many problem notes as you can.',
    tier: 'core',
    status: 'released',
    icon: '⚡',
  },
  {
    id: 'echo',
    name: 'ECHO',
    tagline: 'Beat your history',
    description: 'A/B comparison against your own past performance.',
    tier: 'core',
    status: 'released',
    icon: '📡',
  },
  {
    id: 'prism',
    name: 'PRISM',
    tagline: 'Balance all notes',
    description: 'Even out your deviation across the full chromatic spectrum.',
    tier: 'core',
    status: 'released',
    icon: '🔮',
  },
  {
    id: 'wave',
    name: 'WAVE',
    tagline: 'Vibrato control',
    description: 'Master vibrato depth and speed with real-time visual feedback.',
    tier: 'core',
    status: 'released',
    icon: '〰️',
  },
  {
    id: 'stack',
    name: 'STACK',
    tagline: 'Multi-lane consistency',
    description: 'Build consistency across multiple note lanes simultaneously.',
    tier: 'core',
    status: 'released',
    icon: '📊',
  },
  {
    id: 'scan',
    name: 'SCAN',
    tagline: 'Session inspection',
    description: 'Diagnostic awareness — inspect your whole session for patterns.',
    tier: 'core',
    status: 'released',
    icon: '🔬',
  },

  // ── Advanced (23) ──────────────────────────────────────────────
  {
    id: 'gravity',
    name: 'GRAVITY',
    tagline: 'Fight the pull',
    description: 'Resist pitch gravity while notes try to pull you off center.',
    tier: 'advanced',
    status: 'beta',
    icon: '🌑',
  },
  {
    id: 'telescope',
    name: 'TELESCOPE',
    tagline: 'Zoom into detail',
    description: 'Progressive zoom into finer and finer cent accuracy.',
    tier: 'advanced',
    status: 'beta',
    icon: '🔭',
  },
  {
    id: 'constellation',
    name: 'CONSTELLATION',
    tagline: 'Connect the pitches',
    description: 'Navigate a star map of notes — connect them in tune.',
    tier: 'advanced',
    status: 'beta',
    icon: '✨',
  },
  {
    id: 'tide',
    name: 'TIDE',
    tagline: 'Rise and fall',
    description: 'Control crescendo/diminuendo while maintaining perfect pitch.',
    tier: 'advanced',
    status: 'beta',
    icon: '🌙',
  },
  {
    id: 'bloom',
    name: 'BLOOM',
    tagline: 'Grow your tone',
    description: 'Expand from a single note into rich, stable resonance.',
    tier: 'advanced',
    status: 'beta',
    icon: '🌸',
  },
  {
    id: 'altitude',
    name: 'ALTITUDE',
    tagline: 'Climb the registers',
    description: 'Maintain intonation accuracy as you move through registers.',
    tier: 'advanced',
    status: 'beta',
    icon: '🏔️',
  },
  {
    id: 'weave',
    name: 'WEAVE',
    tagline: 'Interleave patterns',
    description: 'Weave between notes in complex melodic patterns.',
    tier: 'advanced',
    status: 'beta',
    icon: '🧵',
  },
  {
    id: 'volcano',
    name: 'VOLCANO',
    tagline: 'Explosive control',
    description: 'Master dramatic dynamic shifts without losing pitch center.',
    tier: 'advanced',
    status: 'beta',
    icon: '🌋',
  },
  {
    id: 'compass',
    name: 'COMPASS',
    tagline: 'Find true north',
    description: 'Navigate interval relationships with directional precision.',
    tier: 'advanced',
    status: 'beta',
    icon: '🧭',
  },
  {
    id: 'fossil',
    name: 'FOSSIL',
    tagline: 'Uncover patterns',
    description: 'Dig into your practice history to find buried habit patterns.',
    tier: 'advanced',
    status: 'beta',
    icon: '🦴',
  },
  {
    id: 'terrain',
    name: 'TERRAIN',
    tagline: 'Navigate landscapes',
    description: 'Traverse varying musical terrain with consistent intonation.',
    tier: 'advanced',
    status: 'beta',
    icon: '🏜️',
  },
  {
    id: 'ribbon',
    name: 'RIBBON',
    tagline: 'Smooth transitions',
    description: 'Create silky-smooth legato connections between notes.',
    tier: 'advanced',
    status: 'beta',
    icon: '🎀',
  },
  {
    id: 'fog',
    name: 'FOG',
    tagline: 'Play through uncertainty',
    description: 'Maintain accuracy when visual feedback fades away.',
    tier: 'advanced',
    status: 'beta',
    icon: '🌫️',
  },
  {
    id: 'spectrum',
    name: 'SPECTRUM',
    tagline: 'Full range mastery',
    description: 'Achieve consistent quality across your entire range.',
    tier: 'advanced',
    status: 'beta',
    icon: '🌈',
  },
  {
    id: 'bridge',
    name: 'BRIDGE',
    tagline: 'Cross the break',
    description: 'Master register transitions and break points.',
    tier: 'advanced',
    status: 'beta',
    icon: '🌉',
  },
  {
    id: 'orbit',
    name: 'ORBIT',
    tagline: 'Circular patterns',
    description: 'Maintain pitch while cycling through circular note sequences.',
    tier: 'advanced',
    status: 'beta',
    icon: '🪐',
  },
  {
    id: 'shadow',
    name: 'SHADOW',
    tagline: 'Follow the ghost',
    description: 'Shadow a reference performance and match every nuance.',
    tier: 'advanced',
    status: 'beta',
    icon: '👤',
  },
  {
    id: 'cipher',
    name: 'CIPHER',
    tagline: 'Decode the pattern',
    description: 'Figure out the hidden pitch pattern and reproduce it.',
    tier: 'advanced',
    status: 'beta',
    icon: '🔐',
  },
  {
    id: 'chrono',
    name: 'CHRONO',
    tagline: 'Race against time',
    description: 'Achieve target accuracy before the clock runs out.',
    tier: 'advanced',
    status: 'beta',
    icon: '⏱️',
  },
  {
    id: 'nexus',
    name: 'NEXUS',
    tagline: 'Connect everything',
    description: 'Link multiple skills together in compound challenges.',
    tier: 'advanced',
    status: 'beta',
    icon: '🔗',
  },
  {
    id: 'beacon',
    name: 'BEACON',
    tagline: 'Guide yourself home',
    description: 'Return to center pitch from increasingly wild deviations.',
    tier: 'advanced',
    status: 'beta',
    icon: '🗼',
  },
  {
    id: 'glide',
    name: 'GLIDE',
    tagline: 'Smooth portamento',
    description: 'Control pitch glides with precision between target notes.',
    tier: 'advanced',
    status: 'beta',
    icon: '🪂',
  },
  {
    id: 'mosaic',
    name: 'MOSAIC',
    tagline: 'Build the picture',
    description: 'Piece together a complete intonation picture from fragments.',
    tier: 'advanced',
    status: 'beta',
    icon: '🧩',
  },

  // ── Game Theory (6) ────────────────────────────────────────────
  {
    id: 'duel',
    name: 'DUEL',
    tagline: 'Beat your best',
    description: 'Zero-sum competition against your personal best — dominant strategy training.',
    tier: 'game-theory',
    status: 'beta',
    icon: '⚔️',
  },
  {
    id: 'auction',
    name: 'AUCTION',
    tagline: 'Bid on improvement',
    description: 'Allocate practice tokens to notes by priority — mechanism design for practice time.',
    tier: 'game-theory',
    status: 'beta',
    icon: '💰',
  },
  {
    id: 'alliance',
    name: 'ALLIANCE',
    tagline: 'Coalition training',
    description: 'Group registers into cooperative alliances — improve them together.',
    tier: 'game-theory',
    status: 'beta',
    icon: '🤝',
  },
  {
    id: 'rival',
    name: 'RIVAL',
    tagline: 'AI competition',
    description: 'Compete against an AI opponent calibrated to your skill level.',
    tier: 'game-theory',
    status: 'beta',
    icon: '🤖',
  },
  {
    id: 'budget',
    name: 'BUDGET',
    tagline: 'Optimal allocation',
    description: 'Find the Pareto-optimal balance for distributing practice time.',
    tier: 'game-theory',
    status: 'beta',
    icon: '📈',
  },
  {
    id: 'treaty',
    name: 'TREATY',
    tagline: 'Negotiate balance',
    description: 'Nash bargaining for register balance — find the equilibrium.',
    tier: 'game-theory',
    status: 'beta',
    icon: '📜',
  },
]

// ── Features ─────────────────────────────────────────────────────

export const FEATURES: Feature[] = [
  // Intelligence
  {
    id: 'skill-detection',
    name: 'Skill Level Detection',
    headline: 'Knows where you are',
    description:
      'Automatically classifies your level from Beginner to Advanced based on deviation, variance, range, and consistency.',
    category: 'intelligence',
    status: 'released',
    icon: '🧠',
  },
  {
    id: 'focus-areas',
    name: 'Focus Area Analysis',
    headline: 'Finds your problems',
    description:
      'Identifies per-note issues, contextual patterns (note X after Y), and register-specific weaknesses — ranked by severity.',
    category: 'intelligence',
    status: 'released',
    icon: '🔎',
  },
  {
    id: 'equipment-diagnostics',
    name: 'Equipment Diagnostics',
    headline: 'Detects gear problems',
    description:
      'Identifies reed health issues, embouchure fatigue, and mechanical problems from pitch patterns alone.',
    category: 'intelligence',
    status: 'released',
    icon: '🔧',
  },
  {
    id: 'practice-recommendations',
    name: 'Practice Recommendations',
    headline: 'Tells you what to practice',
    description:
      'Auto-generated exercise suggestions adapted to your skill level: long tones, intervals, register development.',
    category: 'intelligence',
    status: 'released',
    icon: '📋',
  },
  {
    id: 'coach-chat',
    name: 'Interactive Coach',
    headline: 'Real-time coaching',
    description:
      'Live in-exercise chat engine that samples your playing every 3 seconds and gives adaptive coaching feedback.',
    category: 'intelligence',
    status: 'released',
    icon: '💬',
  },
  {
    id: 'startup-coach',
    name: 'Startup Tuning Coach',
    headline: 'Pre-practice warmup check',
    description: '10-second readiness evaluation when you open the app — are you warmed up and ready?',
    category: 'intelligence',
    status: 'released',
    icon: '🌅',
  },
  {
    id: 'instrument-knowledge',
    name: 'Instrument Knowledge Base',
    headline: '10 wind instrument profiles',
    description:
      'Evidence-based intonation profiles with per-note tendencies, register characteristics, and correction hints.',
    category: 'intelligence',
    status: 'released',
    icon: '🎷',
  },
  {
    id: 'concept-explainer',
    name: 'Progressive Concept Explainer',
    headline: 'Theory when you need it',
    description:
      'Drip-feeds music theory concepts as they become relevant — tracks what you\'ve already learned.',
    category: 'intelligence',
    status: 'released',
    icon: '📚',
  },

  // Tuning
  {
    id: 'multi-algorithm',
    name: '5 Pitch Detection Algorithms',
    headline: 'Professional-grade accuracy',
    description:
      'HPS, YIN FFT, FFT Direct Peak, AudioKit, and Adaptive — choose the best for your instrument.',
    category: 'tuning',
    status: 'released',
    icon: '🎯',
  },
  {
    id: 'deep-bass',
    name: 'Deep Bass Detection',
    headline: 'Low register accuracy',
    description:
      'Specialized low-register pitch correction with octave-jump prevention for bass instruments.',
    category: 'tuning',
    status: 'released',
    icon: '🎵',
  },
  {
    id: 'calibration',
    name: 'Algorithm Calibration',
    headline: 'Fine-tune your detector',
    description:
      'Per-algorithm frequency correction factors with auto-calibration from test tones.',
    category: 'tuning',
    status: 'released',
    icon: '⚙️',
  },
  {
    id: 'ambitus',
    name: 'Instrument Range Setup',
    headline: 'Your range, your rules',
    description:
      'Auto-detect or manually set your instrument range with visual piano strip. Exercises adapt automatically.',
    category: 'tuning',
    status: 'released',
    icon: '🎹',
  },

  // Audio
  {
    id: 'daw-mixer',
    name: 'DAW-Style Mixer',
    headline: 'Pro audio controls',
    description: 'Floating input/output channel strips with faders, meters, and mute buttons — in a tuner app.',
    category: 'audio',
    status: 'released',
    icon: '🎛️',
  },
  {
    id: 'recording',
    name: 'Session Recording',
    headline: 'Capture everything',
    description: 'Records your practice audio with synchronized pitch data for later review and playback.',
    category: 'audio',
    status: 'released',
    icon: '🔴',
  },
  {
    id: 'dual-playback',
    name: 'Dual Playback Mode',
    headline: 'Hear the difference',
    description: 'Play back your original recording or a pitch-corrected version side by side.',
    category: 'audio',
    status: 'released',
    icon: '🔊',
  },
  {
    id: 'device-profiles',
    name: 'Per-Device Mic Profiles',
    headline: 'Smart mic adaptation',
    description:
      'Remembers gain, sensitivity, and boost settings for each microphone or audio device you use.',
    category: 'audio',
    status: 'released',
    icon: '🎙️',
  },

  // Analytics
  {
    id: 'session-analytics',
    name: 'Session Analytics',
    headline: 'Deep practice data',
    description:
      'Duration, in-tune %, deviation stats, note distribution, detected range — per session.',
    category: 'analytics',
    status: 'released',
    icon: '📊',
  },
  {
    id: 'trend-analysis',
    name: 'Cross-Session Trends',
    headline: 'Track real progress',
    description:
      'See if you\'re improving, stable, or declining — per instrument, per piece, over weeks and months.',
    category: 'analytics',
    status: 'released',
    icon: '📈',
  },
  {
    id: 'journey-meter',
    name: 'Journey Meter',
    headline: 'Lifetime progression',
    description:
      '11 levels from Curious Beginner to Virtuoso — track your 10,000-hour journey and beyond.',
    category: 'analytics',
    status: 'released',
    icon: '🏆',
  },
  {
    id: 'practice-streaks',
    name: 'Practice Streaks',
    headline: 'Build the habit',
    description: 'Track consecutive practice days and maintain your streak.',
    category: 'analytics',
    status: 'released',
    icon: '🔥',
  },

  // Cloud
  {
    id: 'icloud-sync',
    name: 'iCloud Sync',
    headline: 'Practice anywhere',
    description:
      'Settings, instrument profiles, and recordings sync across all your Apple devices.',
    category: 'cloud',
    status: 'released',
    icon: '☁️',
  },
]

// ── Helpers ──────────────────────────────────────────────────────

export function visibleExercises(): Exercise[] {
  return EXERCISES.filter(e => e.status !== 'hidden')
}

export function visibleFeatures(): Feature[] {
  return FEATURES.filter(f => f.status !== 'hidden')
}

export function exercisesByTier(tier: Exercise['tier']): Exercise[] {
  return visibleExercises().filter(e => e.tier === tier)
}

export function featuresByCategory(category: Feature['category']): Feature[] {
  return visibleFeatures().filter(f => f.category === category)
}
