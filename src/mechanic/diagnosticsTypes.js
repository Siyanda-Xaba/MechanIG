export const MECHANIC_DIAGNOSTIC_STATUSES = {
  PENDING_REVIEW: 'pending-review',
  IN_REVIEW: 'in-review',
  COMPLETED: 'completed',
}

export const MECHANIC_DIAGNOSTIC_STATUS_LABELS = {
  'pending-review': 'Pending Review',
  'in-review': 'In Review',
  completed: 'Completed',
}

export const MECHANIC_DIAGNOSTIC_SEVERITIES = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
}

export const MECHANIC_DIAGNOSTIC_SOURCES = {
  OBD: 'obd',
  CUSTOMER_REPORT: 'customer-report',
  WORKSHOP_INSPECTION: 'workshop-inspection',
}

export const MECHANIC_DIAGNOSTIC_SESSION_STATUSES = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

export const MECHANIC_DIAGNOSTIC_SESSION_STATUS_LABELS = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

export const MECHANIC_DIAGNOSTIC_MODES = {
  WORKSHOP_INSPECTION: 'workshop-inspection',
  OBD: 'obd',
  COMBINED: 'combined',
}

export const MECHANIC_DIAGNOSTIC_MODE_LABELS = {
  'workshop-inspection': 'Workshop Inspection',
  obd: 'OBD Diagnostic',
  combined: 'Inspection + OBD',
}

export const MECHANIC_DIAGNOSTIC_ACTIONS = {
  START_DIAGNOSTIC: 'start-diagnostic',
  CONNECT_OBD: 'connect-obd',
  ADD_FINDING: 'add-finding',
  COMPLETE_DIAGNOSTIC: 'complete-diagnostic',
}

/**
 * @typedef {
 *   'pending-review' |
 *   'in-review' |
 *   'completed'
 * } MechanicDiagnosticStatus
 */

/**
 * @typedef {
 *   'info' |
 *   'warning' |
 *   'critical'
 * } MechanicDiagnosticSeverity
 */

/**
 * @typedef {
 *   'obd' |
 *   'customer-report' |
 *   'workshop-inspection'
 * } MechanicDiagnosticSource
 */

/**
 * @typedef {
 *   'not-started' |
 *   'in-progress' |
 *   'completed'
 * } MechanicDiagnosticSessionStatus
 */

/**
 * @typedef {
 *   'workshop-inspection' |
 *   'obd' |
 *   'combined'
 * } MechanicDiagnosticMode
 */

/**
 * @typedef {
 *   'start-diagnostic' |
 *   'connect-obd' |
 *   'add-finding' |
 *   'complete-diagnostic'
 * } MechanicDiagnosticAction
 */

/**
 * A diagnostic reading must come from an
 * authoritative vehicle/OBD/backend source.
 *
 * The frontend must never fabricate values.
 *
 * @typedef {{
 *   id: string,
 *   pid: string | null,
 *   label: string,
 *   value: number | string,
 *   unit: string | null,
 *   capturedAt: string | null
 * }} MechanicDiagnosticReading
 */

/**
 * A trouble code must come from an
 * authoritative vehicle/OBD/backend source.
 *
 * AI may interpret verified codes later,
 * but it must never invent DTCs.
 *
 * @typedef {{
 *   code: string,
 *   description: string | null,
 *   severity: MechanicDiagnosticSeverity
 * }} MechanicDiagnosticTroubleCode
 */

/**
 * A mechanic finding is manually entered
 * inspection information.
 *
 * It is separate from OBD readings and
 * trouble codes so manually entered notes
 * can never be mistaken for vehicle data.
 *
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string | null,
 *   severity: MechanicDiagnosticSeverity,
 *   createdAt: string | null
 * }} MechanicDiagnosticFinding
 */

/**
 * Existing diagnostic record used for
 * assigned/reviewable diagnostics.
 *
 * @typedef {{
 *   id: string,
 *   customerId: string | null,
 *   vehicleId: string | null,
 *   jobId: string | null,
 *   customerName: string | null,
 *   vehicleLabel: string | null,
 *   source: MechanicDiagnosticSource,
 *   status: MechanicDiagnosticStatus,
 *   severity: MechanicDiagnosticSeverity,
 *   reportedIssue: string | null,
 *   readings: MechanicDiagnosticReading[],
 *   troubleCodes: MechanicDiagnosticTroubleCode[],
 *   mechanicSummary: string | null,
 *   createdAt: string | null,
 *   updatedAt: string | null
 * }} MechanicDiagnosticRecord
 */

/**
 * Active diagnostic session performed by
 * the mechanic.
 *
 * A session may be linked to a job,
 * booking or customer vehicle once the
 * backend provides authoritative IDs.
 *
 * OBD readings and DTCs must always come
 * from the real OBD/backend acquisition
 * path. Manual findings are mechanic-entered.
 *
 * @typedef {{
 *   id: string,
 *   diagnosticId: string | null,
 *   customerId: string | null,
 *   vehicleId: string | null,
 *   jobId: string | null,
 *   bookingId: string | null,
 *   customerName: string | null,
 *   vehicleLabel: string | null,
 *   mode: MechanicDiagnosticMode,
 *   status: MechanicDiagnosticSessionStatus,
 *   reportedIssue: string | null,
 *   findings: MechanicDiagnosticFinding[],
 *   readings: MechanicDiagnosticReading[],
 *   troubleCodes: MechanicDiagnosticTroubleCode[],
 *   mechanicSummary: string | null,
 *   allowedActions: MechanicDiagnosticAction[],
 *   startedAt: string | null,
 *   completedAt: string | null
 * }} MechanicDiagnosticSession
 */

/**
 * @typedef {{
 *   diagnostics: MechanicDiagnosticRecord[],
 *   totalPendingReview: number,
 *   totalInReview: number,
 *   totalCompleted: number
 * }} MechanicDiagnosticsData
 */