export const BOOKING_SERVICE_ERRORS = {
  PERSISTENCE_NOT_CONNECTED:
    'persistence-not-connected',
}

/**
 * Creates a booking through the authoritative
 * MechanIQ backend.
 *
 * Customer and Mechanic booking flows should both
 * eventually use this shared function so they create
 * the same backend booking entity.
 *
 * The frontend must not locally invent:
 * - booking IDs
 * - confirmed availability
 * - authoritative booking status
 * - pricing
 * - linked mechanic jobs
 * - workshop or mobile-service coordinates
 *
 * @param {import('./bookingTypes').CreateBookingInput} input
 * @returns {Promise<import('./bookingTypes').Booking>}
 */
export async function createBooking(
  input
) {
  void input

  const error = new Error(
    'Booking persistence is not connected yet.'
  )

  error.code =
    BOOKING_SERVICE_ERRORS.PERSISTENCE_NOT_CONNECTED

  throw error
}