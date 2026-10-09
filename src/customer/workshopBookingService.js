/**
 * Create a workshop booking.
 *
 * Booking creation is backend-owned.
 *
 * The frontend must only display booking
 * confirmation after the authoritative
 * MechanIQ backend successfully creates
 * and acknowledges the booking.
 *
 * Never generate local production booking IDs,
 * confirmed appointments, or booking statuses.
 */
export async function createWorkshopBooking(input) {
  if (
    !input?.customerId ||
    !input?.vehicleId ||
    !input?.mechanicId
  ) {
    throw new Error(
      'A customer, vehicle and mechanic are required to create a workshop booking.'
    )
  }

  if (
    !input?.scheduledDate ||
    !input?.scheduledTime
  ) {
    throw new Error(
      'Select a booking date and time before continuing.'
    )
  }

  if (!input?.serviceType?.trim()) {
    throw new Error(
      'Select a service before booking a workshop.'
    )
  }

  /*
   * Future backend integration:
   *
   * POST /workshop-bookings
   *
   * The backend must:
   *
   * - authenticate the current customer
   * - derive customer identity from authentication
   * - validate the selected vehicle
   * - validate the mechanic or workshop
   * - confirm the requested appointment slot
   * - prevent conflicting bookings
   * - create an authoritative booking ID
   * - determine the initial booking status
   * - calculate applicable pricing
   * - notify the mechanic or workshop
   * - return the persisted booking record
   *
   * A customerId supplied by the frontend
   * must never be trusted as authentication.
   *
   * The backend must confirm the booking
   * before the frontend displays success.
   */

  throw new Error(
    'Workshop bookings are not available until the MechanIQ booking backend is connected.'
  )
}