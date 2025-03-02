/**
 * Represents user preferences for the tuner application.
 */
export interface TunerPreferences {
  /**
   * The reference frequency for A4 in Hz (default: 440).
   */
  referenceFrequency: number

  /**
   * The tolerance in cents for considering a pitch in tune (default: 5).
   */
  tuningTolerance: number

  /**
   * The name of the preferred pitch detection algorithm.
   */
  preferredAlgorithm: string

  /**
   * Whether to show the frequency graph (default: true).
   */
  showFrequencyGraph: boolean

  /**
   * Whether to play reference tones (default: false).
   */
  playReferenceTones: boolean

  /**
   * The volume for reference tones (0-1, default: 0.5).
   */
  referenceTonesVolume: number

  /**
   * The sensibility of the input source (0-1, default:0.5)
   */
  micSensitivity: number
}

/**
 * Port for user preferences functionality.
 * Follows the Port/Adapter pattern from Clean Architecture.
 */
export interface PreferencesPort {
  /**
   * Gets the current user preferences.
   * @returns A promise that resolves to the current preferences
   */
  getPreferences(): Promise<TunerPreferences>

  /**
   * Updates the user preferences.
   * @param preferences The new preferences
   * @returns A promise that resolves when the preferences have been updated
   */
  updatePreferences(preferences: Partial<TunerPreferences>): Promise<void>

  /**
   * Resets the user preferences to their default values.
   * @returns A promise that resolves when the preferences have been reset
   */
  resetPreferences(): Promise<void>
}
