const developmentMechanicDiagnostics = [
  {
    id: 'development-diagnostic-001',

    customerId: null,
    vehicleId: null,
    jobId: null,

    customerName: 'Customer',
    vehicleLabel: 'BMW 320i',

    source: 'customer-report',
    status: 'pending-review',
    severity: 'warning',

    reportedIssue:
      'Customer reports reduced engine performance and an intermittent warning light.',

    readings: [],
    troubleCodes: [],

    mechanicSummary: null,

    createdAt: null,
    updatedAt: null,
  },

  {
    id: 'development-diagnostic-002',

    customerId: null,
    vehicleId: null,
    jobId: null,

    customerName: 'Customer',
    vehicleLabel: 'Volkswagen Polo',

    source: 'workshop-inspection',
    status: 'in-review',
    severity: 'warning',

    reportedIssue:
      'Vehicle requires further inspection after abnormal braking behaviour was reported.',

    readings: [],
    troubleCodes: [],

    mechanicSummary: null,

    createdAt: null,
    updatedAt: null,
  },

  {
    id: 'development-diagnostic-003',

    customerId: null,
    vehicleId: null,
    jobId: null,

    customerName: 'Customer',
    vehicleLabel: 'Toyota Corolla',

    source: 'customer-report',
    status: 'completed',
    severity: 'info',

    reportedIssue:
      'Customer reported a recurring vibration during normal driving.',

    readings: [],
    troubleCodes: [],

    mechanicSummary:
      'Initial mechanic review completed. Further workshop inspection can be scheduled if the issue returns.',

    createdAt: null,
    updatedAt: null,
  },
]

function requireDiagnosticId(
  diagnosticId
) {
  if (!diagnosticId) {
    throw new Error(
      'A valid diagnostic record is required.'
    )
  }
}

function requireSessionId(
  sessionId
) {
  if (!sessionId) {
    throw new Error(
      'A valid diagnostic session is required.'
    )
  }
}

/**
 * Later this function will load diagnostic records
 * assigned to the authenticated mechanic from the
 * MechanIQ backend.
 *
 * OBD readings and diagnostic trouble codes must
 * come from authoritative vehicle, OBD or backend
 * sources. This service must never fabricate sensor
 * values or codes for production use.
 *
 * Temporary development records intentionally keep
 * readings and troubleCodes empty and leave customer,
 * vehicle and job identifiers null.
 *
 * @returns {Promise<import('./diagnosticsTypes').MechanicDiagnosticsData>}
 */
export async function getMechanicDiagnosticsData() {
  const diagnostics =
    developmentMechanicDiagnostics

  return {
    diagnostics,

    totalPendingReview:
      diagnostics.filter(
        (diagnostic) =>
          diagnostic.status ===
          'pending-review'
      ).length,

    totalInReview:
      diagnostics.filter(
        (diagnostic) =>
          diagnostic.status ===
          'in-review'
      ).length,

    totalCompleted:
      diagnostics.filter(
        (diagnostic) =>
          diagnostic.status ===
          'completed'
      ).length,
  }
}

/**
 * Starts a mechanic-performed diagnostic session.
 *
 * This is backend-owned because the session must
 * remain linked to the authoritative mechanic,
 * customer, vehicle, job and/or booking records.
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

  // Later:
  // POST /mechanic/diagnostics/:diagnosticId/sessions
  //
  // Backend responsibilities:
  // - confirm the authenticated mechanic has access
  // - confirm the diagnostic/customer/vehicle linkage
  // - create the authoritative session ID
  // - record the selected diagnostic mode
  // - return the created session
  //
  // Do not fabricate a production session locally.

  throw new Error(
    'Starting a diagnostic session is not available until the mechanic diagnostics backend is connected.'
  )
}

/**
 * Adds a mechanic-entered inspection finding.
 *
 * Manual findings are not OBD values. They must
 * remain clearly separate from authoritative vehicle
 * readings and diagnostic trouble codes.
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

  if (!input?.title?.trim()) {
    throw new Error(
      'A finding title is required.'
    )
  }

  if (!input?.severity) {
    throw new Error(
      'A finding severity is required.'
    )
  }

  // Later:
  // POST /mechanic/diagnostic-sessions/:sessionId/findings
  //
  // Backend responsibilities:
  // - validate session ownership/status
  // - persist the mechanic-entered finding
  // - timestamp and return the authoritative finding
  //
  // This endpoint must never be used for OBD readings
  // or DTCs.

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
    !input?.mechanicSummary?.trim()
  ) {
    throw new Error(
      'A mechanic summary is required before completing the diagnostic.'
    )
  }

  // Later:
  // POST /mechanic/diagnostic-sessions/:sessionId/complete
  //
  // Backend responsibilities:
  // - validate the session can be completed
  // - persist the mechanic summary
  // - preserve authoritative OBD readings/DTCs
  // - mark the diagnostic/session complete
  // - update the linked customer/job records
  // - notify the customer where appropriate
  // - return the authoritative completed session

  throw new Error(
    'Completing a diagnostic session is not available until the mechanic diagnostics backend is connected.'
  )
}