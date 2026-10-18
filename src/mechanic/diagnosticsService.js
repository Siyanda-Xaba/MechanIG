/**
 * MechanIQ Mechanic Diagnostics Service
 *
 * Mechanic diagnostics must come from authoritative
 * customer, vehicle, OBD, workshop, or backend records.
 *
 * Never present development examples as genuine
 * customer diagnostics.
 *
 * OBD readings and diagnostic trouble codes must
 * originate from verified vehicle/OBD sources.
 *
 * Mechanic-entered inspection findings must remain
 * separate from authoritative OBD readings.
 *
 * An unavailable diagnostics backend must never
 * be interpreted as zero diagnostic records.
 */

function requireDiagnosticId(diagnosticId) {
  if (
    typeof diagnosticId !== 'string' ||
    !diagnosticId.trim()
  ) {
    throw new Error(
      'A valid diagnostic record is required.'
    )
  }
}

function requireSessionId(sessionId) {
  if (
    typeof sessionId !== 'string' ||
    !sessionId.trim()
  ) {
    throw new Error(
      'A valid diagnostic session is required.'
    )
  }
}

/**
 * Retrieve diagnostics assigned to the
 * authenticated mechanic.
 *
 * @param {string} mechanicId
 * The authenticated mechanic's user ID.
 *
 * @returns {Promise<import('./diagnosticsTypes').MechanicDiagnosticsData>}
 *
 * Future backend integration must:
 *
 * - Authenticate the requesting mechanic.
 * - Verify the mechanic's role.
 * - Verify the requested mechanic ID belongs to
 *   the authenticated user.
 * - Return only authorized diagnostic records.
 * - Preserve customer and vehicle associations.
 * - Return genuine diagnostic statuses.
 * - Return authoritative OBD readings and DTCs.
 * - Include verified diagnostic timestamps.
 * - Return confirmed diagnostic counts.
 *
 * The backend must independently enforce access
 * to customer, vehicle, and diagnostic information.
 *
 * Until the backend is connected, do not return
 * fabricated diagnostics or misleading empty data.
 */
export async function getMechanicDiagnosticsData(mechanicId) {
  // Frontend input validation is not authorization.
  // The backend must verify identity, role, and access.
  if (
    typeof mechanicId !== 'string' ||
    !mechanicId.trim()
  ) {
    throw new Error(
      'An authenticated mechanic account is required to load diagnostics.'
    )
  }

  throw new Error(
    'Verified mechanic diagnostics are unavailable until the MechanIQ diagnostics backend is connected.'
  )
}

/**
 * Starts a mechanic-performed diagnostic session.
 *
 * The backend must create the authoritative session
 * and associate it with the correct mechanic,
 * customer, vehicle, job, or booking.
 *
 * @param {{
 *   diagnosticId: string,
 *   mode: import('./diagnosticsTypes').MechanicDiagnosticMode
 * }} input
 *
 * @returns {Promise<import('./diagnosticsTypes').MechanicDiagnosticSession>}
 */
export async function startMechanicDiagnosticSession(
  input
) {
  requireDiagnosticId(
    input?.diagnosticId
  )

  if (!input?.mode) {
    throw new Error(
      'Choose a diagnostic mode before starting.'
    )
  }

  /*
   * Future backend endpoint:
   *
   * POST /mechanic/diagnostics/:diagnosticId/sessions
   *
   * Backend responsibilities:
   *
   * - Verify mechanic authentication and role.
   * - Confirm authorization for the diagnostic.
   * - Verify customer and vehicle associations.
   * - Validate the selected diagnostic mode.
   * - Create the authoritative session ID.
   * - Return the newly created session.
   *
   * Never fabricate a diagnostic session locally.
   */

  throw new Error(
    'Starting a diagnostic session is not available until the mechanic diagnostics backend is connected.'
  )
}

/**
 * Adds a mechanic-entered inspection finding.
 *
 * Manual findings are not authoritative OBD values.
 * They must remain separate from vehicle readings
 * and diagnostic trouble codes.
 *
 * @param {{
 *   sessionId: string,
 *   title: string,
 *   description?: string | null,
 *   severity: import('./diagnosticsTypes').MechanicDiagnosticSeverity
 * }} input
 */
export async function addMechanicDiagnosticFinding(
  input
) {
  requireSessionId(
    input?.sessionId
  )

  if (
    typeof input?.title !== 'string' ||
    !input.title.trim()
  ) {
    throw new Error(
      'A finding title is required.'
    )
  }

  if (!input?.severity) {
    throw new Error(
      'A finding severity is required.'
    )
  }

  /*
   * Future backend endpoint:
   *
   * POST /mechanic/diagnostic-sessions/:sessionId/findings
   *
   * Backend responsibilities:
   *
   * - Verify mechanic authentication.
   * - Confirm diagnostic session ownership.
   * - Validate the session status.
   * - Validate the submitted finding.
   * - Persist the mechanic-entered finding.
   * - Timestamp the finding.
   * - Return the authoritative saved finding.
   *
   * This endpoint must not be used to create
   * artificial OBD readings or trouble codes.
   */

  throw new Error(
    'Saving diagnostic findings is not available until the mechanic diagnostics backend is connected.'
  )
}

/**
 * Completes an active mechanic diagnostic session.
 *
 * @param {{
 *   sessionId: string,
 *   mechanicSummary: string
 * }} input
 */
export async function completeMechanicDiagnosticSession(
  input
) {
  requireSessionId(
    input?.sessionId
  )

  if (
    typeof input?.mechanicSummary !== 'string' ||
    !input.mechanicSummary.trim()
  ) {
    throw new Error(
      'A mechanic summary is required before completing the diagnostic.'
    )
  }

  /*
   * Future backend endpoint:
   *
   * POST /mechanic/diagnostic-sessions/:sessionId/complete
   *
   * Backend responsibilities:
   *
   * - Verify mechanic authentication.
   * - Confirm diagnostic session ownership.
   * - Validate that the session can be completed.
   * - Persist the mechanic's summary.
   * - Preserve authoritative OBD readings and DTCs.
   * - Mark the session complete.
   * - Update linked customer and job records.
   * - Notify the customer where appropriate.
   * - Return the authoritative completed session.
   *
   * Never mark a diagnostic complete locally
   * without backend confirmation.
   */

  throw new Error(
    'Completing a diagnostic session is not available until the mechanic diagnostics backend is connected.'
  )
}
