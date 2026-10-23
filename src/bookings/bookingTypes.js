export const BOOKING_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  RESCHEDULED: 'rescheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const BOOKING_SERVICE_LOCATION_TYPES = {
  WORKSHOP: 'workshop',
  MOBILE: 'mobile',
}

/**
 * @typedef {
 *   'draft' |
 *   'pending' |
 *   'confirmed' |
 *   'rescheduled' |
 *   'in-progress' |
 *   'completed' |
 *   'cancelled'
 * } BookingStatus
 */

/**
 * @typedef {
 *   'workshop' |
 *   'mobile'
 * } BookingServiceLocationType
 */

/**
 * Normalized service destination associated with a
 * booking.
 *
 * Address and coordinate data must come from real
 * customer, mechanic, device or backend-authoritative
 * location data. The frontend must never invent
 * latitude or longitude values.
 *
 * Workshop bookings may leave this null when the
 * workshop location is resolved by the backend from
 * the selected mechanic.
 *
 * @typedef {{
 *   label: string | null,
 *   address: string | null,
 *   latitude: number | null,
 *   longitude: number | null
 * }} BookingServiceLocation
 */

/**
 * Shared booking entity used by Customer and Mechanic
 * frontend flows.
 *
 * The MechanIQ backend remains authoritative for:
 * - booking IDs
 * - availability
 * - confirmation or rejection
 * - authoritative status
 * - pricing
 * - service destination
 * - rescheduling
 * - cancellation
 * - linked jobs
 *
 * @typedef {{
 *   id: string,
 *   customerId: string,
 *   vehicleId: string,
 *   mechanicId: string,
 *   diagnosticResultId: string | null,
 *   serviceType: string,
 *   issueDescription: string | null,
 *   scheduledDate: string,
 *   scheduledTime: string,
 *   serviceLocationType: BookingServiceLocationType,
 *   serviceLocation: BookingServiceLocation | null,
 *   status: BookingStatus,
 *   estimatedPrice: number | null,
 *   finalPrice: number | null,
 *   currency: string | null,
 *   createdAt: string | null,
 *   updatedAt: string | null
 * }} Booking
 */

/**
 * Shared booking creation contract.
 *
 * Customer and Mechanic screens may collect this data
 * differently, but both ultimately create the same
 * backend booking entity.
 *
 * A mobile booking must eventually resolve to a real
 * service destination. Validation of that destination
 * remains a backend concern once persistence is
 * connected.
 *
 * @typedef {{
 *   customerId: string,
 *   vehicleId: string,
 *   mechanicId: string,
 *   diagnosticResultId?: string | null,
 *   serviceType: string,
 *   issueDescription?: string | null,
 *   scheduledDate: string,
 *   scheduledTime: string,
 *   serviceLocationType: BookingServiceLocationType,
 *   serviceLocation?: BookingServiceLocation | null
 * }} CreateBookingInput
 */