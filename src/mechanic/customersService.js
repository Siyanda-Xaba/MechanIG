/**
 * MechanIQ Mechanic Customers Service
 *
 * Customer records must originate from the
 * authoritative MechanIQ backend.
 *
 * This includes:
 *
 * - Customer identity and profile information
 * - Customer vehicles
 * - Bookings and appointments
 * - Assigned or open jobs
 * - Contact information
 * - Customer interaction history
 *
 * Development examples must never be presented
 * as genuine customer records.
 *
 * An unavailable backend does not mean that
 * the mechanic has zero customers.
 */

/**
 * Retrieve customer records associated with
 * the authenticated mechanic.
 *
 * @param {string} mechanicId
 * The authenticated mechanic's user ID.
 *
 * @returns {Promise<import('./customersTypes').MechanicCustomersData>}
 *
 * Future backend integration must:
 *
 * - Authenticate the requesting user.
 * - Verify that the user has the mechanic role.
 * - Confirm the mechanic ID belongs to that user.
 * - Retrieve only customers legitimately associated
 *   with the authenticated mechanic.
 * - Enforce authorization for customer details.
 * - Return verified customer and vehicle records.
 * - Return authoritative bookings and job statuses.
 * - Return genuine customer activity information.
 * - Return accurate customer statistics.
 * - Preserve the existing MechanicCustomersData
 *   structure.
 *
 * Backend authorization must never rely solely
 * on a mechanic ID supplied by the frontend.
 *
 * Customer personal information must only be
 * returned when the mechanic is authorized
 * to access that information.
 */
export async function getMechanicCustomersData(
  mechanicId
) {
  if (
    typeof mechanicId !== 'string' ||
    !mechanicId.trim()
  ) {
    throw new Error(
      'An authenticated mechanic account is required to load customers.'
    )
  }

  /*
   * Future backend integration:
   *
   * GET /mechanic/customers
   *
   * The backend must derive or verify the mechanic
   * identity from the authenticated session.
   *
   * It must independently enforce customer access
   * permissions before returning customer records.
   *
   * Do not fabricate customers, vehicles,
   * bookings, jobs, or interaction history.
   */

  throw new Error(
    'Verified mechanic customers are unavailable until the MechanIQ customers backend is connected.'
  )
}