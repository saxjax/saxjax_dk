import { Injectable } from '@angular/core'
import { PreferencesPort, TunerPreferences } from '../../domain/ports'

/**
 * Default preferences for the tuner application.
 */
const DEFAULT_PREFERENCES: TunerPreferences = {
  referenceFrequency: 440,
  tuningTolerance: 5,
  preferredAlgorithm: 'Autocorrelation',
  showFrequencyGraph: true,
  playReferenceTones: false,
  referenceTonesVolume: 0.5,
}

/**
 * Service for managing user preferences.
 * Implements the PreferencesPort interface from the domain layer.
 * Uses localStorage for persistence in this implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class PreferencesService implements PreferencesPort {
  private readonly STORAGE_KEY = 'tuner_preferences'
  private cachedPreferences: TunerPreferences | null = null

  /**
   * Gets the current user preferences.
   * @returns A promise that resolves to the current preferences
   */
  async getPreferences(): Promise<TunerPreferences> {
    // Return cached preferences if available
    if (this.cachedPreferences) {
      return { ...this.cachedPreferences }
    }

    // Try to load preferences from localStorage
    const preferencesJson = localStorage.getItem(this.STORAGE_KEY)
    if (!preferencesJson) {
      // No preferences found, return defaults
      this.cachedPreferences = { ...DEFAULT_PREFERENCES }
      return { ...DEFAULT_PREFERENCES }
    }

    try {
      // Parse preferences from localStorage
      const storedPreferences = JSON.parse(preferencesJson)

      // Merge with defaults to ensure all properties are present
      const mergedPreferences = {
        ...DEFAULT_PREFERENCES,
        ...storedPreferences,
      }

      // Cache preferences
      this.cachedPreferences = mergedPreferences

      return { ...mergedPreferences }
    } catch (error) {
      console.error('Error parsing preferences from localStorage:', error)

      // Return defaults on error
      this.cachedPreferences = { ...DEFAULT_PREFERENCES }
      return { ...DEFAULT_PREFERENCES }
    }
  }

  /**
   * Updates the user preferences.
   * @param preferences The new preferences
   * @returns A promise that resolves when the preferences have been updated
   */
  async updatePreferences(preferences: Partial<TunerPreferences>): Promise<void> {
    // Get current preferences
    const currentPreferences = await this.getPreferences()

    // Merge with new preferences
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
    }

    // Validate preferences
    this.validatePreferences(updatedPreferences)

    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPreferences))

    // Update cache
    this.cachedPreferences = updatedPreferences
  }

  /**
   * Resets the user preferences to their default values.
   * @returns A promise that resolves when the preferences have been reset
   */
  async resetPreferences(): Promise<void> {
    // Save defaults to localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES))

    // Update cache
    this.cachedPreferences = { ...DEFAULT_PREFERENCES }
  }

  /**
   * Validates preferences to ensure they are within acceptable ranges.
   * @param preferences The preferences to validate
   * @private
   */
  private validatePreferences(preferences: TunerPreferences): void {
    // Ensure reference frequency is within a reasonable range (400-500 Hz)
    preferences.referenceFrequency = Math.max(400, Math.min(500, preferences.referenceFrequency))

    // Ensure tuning tolerance is within a reasonable range (1-50 cents)
    preferences.tuningTolerance = Math.max(1, Math.min(50, preferences.tuningTolerance))

    // Ensure volume is within range (0-1)
    preferences.referenceTonesVolume = Math.max(0, Math.min(1, preferences.referenceTonesVolume))
  }
}
