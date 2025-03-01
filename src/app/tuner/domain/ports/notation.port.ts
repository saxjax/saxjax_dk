import { TuningSession } from '../models'

/**
 * Port for musical notation functionality.
 * Follows the Port/Adapter pattern from Clean Architecture.
 */
export interface NotationPort {
  /**
   * Serializes a tuning session to a string representation in the musical notation DSL.
   * @param session The session to serialize
   * @returns The serialized session as a string
   */
  serializeSession(session: TuningSession): string

  /**
   * Deserializes a string representation in the musical notation DSL to a tuning session.
   * @param notation The notation string to deserialize
   * @returns The deserialized tuning session
   * @throws Error if the notation is invalid
   */
  deserializeSession(notation: string): TuningSession

  /**
   * Renders a tuning session as standard musical notation.
   * @param session The session to render
   * @returns The rendered notation as an SVG or HTML string
   */
  renderNotation(session: TuningSession): string
}
