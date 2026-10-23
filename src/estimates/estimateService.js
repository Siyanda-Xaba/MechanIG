export const ESTIMATE_SERVICE_ERRORS = {
  PERSISTENCE_NOT_CONNECTED:
    'persistence-not-connected',
}

/**
 * Creates an estimate through the authoritative
 * MechanIQ backend.
 *
 * The frontend may calculate a preview subtotal for
 * display, but it must not locally pretend that an
 * estimate has been created, submitted or approved.
 *
 * Backend responsibilities will include:
 * - validating the authenticated mechanic
 * - validating the linked job
 * - validating booking/customer relationships
 * - recalculating monetary totals
 * - validating currency
 * - generating the estimate ID
 * - persisting line items and notes
 * - setting the authoritative estimate status
 * - notifying the customer
 * - handling approval or rejection
 * - updating linked job pricing where appropriate
 *
 * @param {import('./estimateTypes').CreateEstimateInput} input
 * @returns {Promise<import('./estimateTypes').Estimate>}
 */
export async function createEstimate(
  input
) {
  void input

  const error = new Error(
    'Estimate persistence is not connected yet.'
  )

  error.code =
    ESTIMATE_SERVICE_ERRORS.PERSISTENCE_NOT_CONNECTED

  throw error
}