export const WALK_IN_JOB_SERVICE_ERRORS = {
  PERSISTENCE_NOT_CONNECTED:
    'persistence-not-connected',
}

/**
 * Creates an unscheduled workshop job through the
 * authoritative MechanIQ backend.
 *
 * Walk-in intake must use real backend-linked customer
 * and vehicle identifiers. The frontend must not
 * create placeholder customer, vehicle or job records.
 *
 * Backend responsibilities will include:
 * - validating the authenticated mechanic
 * - validating customer/vehicle ownership
 * - validating workshop association
 * - generating the real job ID
 * - setting the authoritative job status
 * - assigning permitted job actions
 * - creating timestamps
 * - notifying the customer where appropriate
 * - returning the authoritative job record
 *
 * @param {import('./walkInJobTypes').CreateMechanicWalkInJobInput} input
 * @returns {Promise<import('./jobsTypes').MechanicJob>}
 */
export async function createMechanicWalkInJob(
  input
) {
  if (!input?.customerId) {
    throw new Error(
      'A backend-linked customer is required.'
    )
  }

  if (!input?.vehicleId) {
    throw new Error(
      'A backend-linked vehicle is required.'
    )
  }

  if (!input?.mechanicId) {
    throw new Error(
      'A signed-in mechanic is required.'
    )
  }

  if (!input?.serviceType?.trim()) {
    throw new Error(
      'A service type is required.'
    )
  }

  const error = new Error(
    'Walk-in job persistence is not connected yet.'
  )

  error.code =
    WALK_IN_JOB_SERVICE_ERRORS.PERSISTENCE_NOT_CONNECTED

  throw error
}