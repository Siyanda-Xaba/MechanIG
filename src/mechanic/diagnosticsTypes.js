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
 * @typedef {{
 *   code: string,
 *   description: string | null,
 *   severity: MechanicDiagnosticSeverity
 * }} MechanicDiagnosticTroubleCode
 */

/**
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
 * @typedef {{
 *   diagnostics: MechanicDiagnosticRecord[],
 *   totalPendingReview: number,
 *   totalInReview: number,
 *   totalCompleted: number
 * }} MechanicDiagnosticsData
 */