export const MECHANIC_CUSTOMER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

export const MECHANIC_CUSTOMER_BOOKING_STATUSES = {
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const MECHANIC_CUSTOMER_JOB_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

/**
 * @typedef {'active' | 'inactive'} MechanicCustomerStatus
 */

/**
 * @typedef {'upcoming' | 'completed' | 'cancelled'} MechanicCustomerBookingStatus
 */

/**
 * @typedef {'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'} MechanicCustomerJobStatus
 */

/**
 * @typedef {{
 *   id: string,
 *   make: string | null,
 *   model: string | null,
 *   year: number | null,
 *   registrationNumber: string | null,
 *   vehicleLabel: string
 * }} MechanicCustomerVehicle
 */

/**
 * @typedef {{
 *   id: string,
 *   bookingId: string | null,
 *   serviceType: string,
 *   dateLabel: string | null,
 *   timeLabel: string | null,
 *   status: MechanicCustomerBookingStatus
 * }} MechanicCustomerBookingSummary
 */

/**
 * @typedef {{
 *   id: string,
 *   jobId: string | null,
 *   serviceType: string,
 *   status: MechanicCustomerJobStatus
 * }} MechanicCustomerJobSummary
 */

/**
 * @typedef {{
 *   id: string,
 *   customerId: string | null,
 *   firstName: string | null,
 *   lastName: string | null,
 *   displayName: string,
 *   profileImageUrl: string | null,
 *   phone: string | null,
 *   email: string | null,
 *   status: MechanicCustomerStatus,
 *   vehicles: MechanicCustomerVehicle[],
 *   recentBooking: MechanicCustomerBookingSummary | null,
 *   openJob: MechanicCustomerJobSummary | null,
 *   lastInteractionLabel: string | null
 * }} MechanicCustomerRecord
 */

/**
 * @typedef {{
 *   customers: MechanicCustomerRecord[],
 *   totalCustomers: number,
 *   activeCustomers: number,
 *   customersWithOpenJobs: number,
 *   upcomingBookings: number
 * }} MechanicCustomersData
 */