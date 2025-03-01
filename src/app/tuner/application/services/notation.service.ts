import { Injectable } from '@angular/core'
import { MusicalNotationDSL } from '../../domain/dsl'
import { TuningSession } from '../../domain/models'
import { NotationPort } from '../../domain/ports'

/**
 * Service for musical notation functionality.
 * Implements the NotationPort interface from the domain layer.
 * Uses the MusicalNotationDSL for serialization and deserialization.
 */
@Injectable({
  providedIn: 'root',
})
export class NotationService implements NotationPort {
  /**
   * Serializes a tuning session to a string representation in the musical notation DSL.
   * @param session The session to serialize
   * @returns The serialized session as a string
   */
  serializeSession(session: TuningSession): string {
    return MusicalNotationDSL.serialize(session)
  }

  /**
   * Deserializes a string representation in the musical notation DSL to a tuning session.
   * @param notation The notation string to deserialize
   * @returns The deserialized tuning session
   * @throws Error if the notation is invalid
   */
  deserializeSession(notation: string): TuningSession {
    return MusicalNotationDSL.deserialize(notation)
  }

  /**
   * Renders a tuning session as standard musical notation.
   * @param session The session to render
   * @returns The rendered notation as an SVG or HTML string
   */
  renderNotation(session: TuningSession): string {
    return MusicalNotationDSL.renderNotation(session)
  }

  /**
   * Exports a tuning session to a file.
   * @param session The session to export
   * @returns A Blob containing the serialized session
   */
  exportSession(session: TuningSession): Blob {
    const serialized = this.serializeSession(session)
    return new Blob([serialized], { type: 'text/plain' })
  }

  /**
   * Creates a download URL for a serialized session.
   * @param session The session to create a URL for
   * @returns A URL that can be used to download the session
   */
  createDownloadUrl(session: TuningSession): string {
    const blob = this.exportSession(session)
    return URL.createObjectURL(blob)
  }

  /**
   * Revokes a download URL to free up resources.
   * @param url The URL to revoke
   */
  revokeDownloadUrl(url: string): void {
    URL.revokeObjectURL(url)
  }
}
