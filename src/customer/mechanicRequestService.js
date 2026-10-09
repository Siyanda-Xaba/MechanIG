/**
 * Create a mobile mechanic service request.
 *
 * The request must be persisted and acknowledged
 * by the authoritative MechanIQ backend before
 * the frontend can display submission success.
 *
 * Never generate local production request IDs,
 * mechanic assignments or request statuses.
 */
export async function createMechanicRequest(input) {
  if (
    !input?.customerId ||
    !input?.vehicleId ||
    !input?.mechanicId
  ) {
    throw new Error(
      'A customer, vehicle and mechanic are required to create a request.'
    )
  }

  if (
    input.requestType === 'mobile' &&
    !input.serviceLocation?.address?.trim()
  ) {
    throw new Error(
      'Enter a valid service address before requesting a mechanic.'
    )
  }

  /*
   * Future backend integration:
   *
   * POST /mechanic-requests
   *
   * The backend must:
   *
   * - authenticate the current customer
   * - derive customer identity from authentication
   * - validate the selected vehicle
   * - validate mechanic availability
   * - validate the service location
   * - create the authoritative request ID
   * - assign the initial request status
   * - notify the mechanic
   * - return the persisted request
   *
   * The frontend must never assume that passing
   * a customerId proves the user's identity.
   */

  throw new Error(
    'Mechanic requests are not available until the MechanIQ request backend is connected.'
  )
}