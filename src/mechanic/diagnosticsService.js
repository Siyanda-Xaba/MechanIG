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