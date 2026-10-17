/**
 * MechanIQ Mechanic Home Service
 *
 * Dashboard information must come from
 * authoritative backend records associated
 * with the authenticated mechanic.
 *
 * Never present development values as
 * genuine jobs, bookings, ratings, earnings,
 * appointments, alerts, or business activity.
 *
 * A null statistic means that the value
 * has not been verified or retrieved.
 *
 * Null must not be interpreted as zero.
 */

const unavailableMechanicHomeData = {
  // Requires confirmed completed job records.
  jobsCompleted: null,

  // Requires confirmed pending job records.
  pendingJobs: null,

  // Requires confirmed booking records.
  bookings: null,

  // Requires authoritative customer ratings.
  rating: null,

  // Requires verified financial records.
  // Do not display R0 when earnings are unknown.
  earnings: null,

  // Do not generate fictitious appointments.
  schedule: [],

  // Do not generate fictitious service alerts.
  serviceAlerts: [],

  // Do not generate fictitious business activity.
  recentActivity: [],
}

/**
 * Retrieve Mechanic Home dashboard information.
 *
 * Future backend integration must:
 *
 * - Authenticate the mechanic.
 * - Verify the mechanic's role.
 * - Retrieve mechanic-specific job totals.
 * - Retrieve confirmed bookings.
 * - Retrieve authoritative customer ratings.
 * - Retrieve verified earnings.
 * - Retrieve scheduled work.
 * - Retrieve genuine service alerts.
 * - Retrieve recorded business activity.
 *
 * Backend responses should include timestamps
 * so cached information can be distinguished
 * from current information.
 *
 * Until the backend is connected, unavailable
 * values are returned instead of fabricated data.
 *
 * @returns {Promise<import('./homeTypes').MechanicHomeData>}
 */
export async function getMechanicHomeData() {
  return {
    ...unavailableMechanicHomeData,
    schedule: [],
    serviceAlerts: [],
    recentActivity: [],
  }
}