import { TuningSession } from '../models'

/**
 * Port for tuning session management functionality.
 * Follows the Port/Adapter pattern from Clean Architecture.
 */
export interface TuningSessionPort {
  /**
   * Creates a new tuning session with the given name.
   * @param name The name of the session
   * @returns A promise that resolves to the created session
   */
  createSession(name: string): Promise<TuningSession>

  /**
   * Saves a tuning session.
   * @param session The session to save
   * @returns A promise that resolves when the session has been saved
   */
  saveSession(session: TuningSession): Promise<void>

  /**
   * Gets a tuning session by its ID.
   * @param id The ID of the session to get
   * @returns A promise that resolves to the session, or null if not found
   */
  getSession(id: string): Promise<TuningSession | null>

  /**
   * Gets all tuning sessions.
   * @returns A promise that resolves to an array of all sessions
   */
  getAllSessions(): Promise<TuningSession[]>

  /**
   * Deletes a tuning session by its ID.
   * @param id The ID of the session to delete
   * @returns A promise that resolves when the session has been deleted
   */
  deleteSession(id: string): Promise<void>
}
