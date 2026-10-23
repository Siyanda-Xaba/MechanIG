/**
 * MechanIQ Mechanic Home Service
 *
 * Dashboard information must come from authoritative backend
 * records associated with the authenticated mechanic.
 *
 * Never present development values as genuine jobs, bookings,
 * ratings, earnings, appointments, alerts, or business activity.
 *
 * A null statistic means its value has not been verified.
 * Null must not be interpreted as zero.
 *
 * Collection availability is tracked separately from collection data:
 * - false: the backend has not confirmed the collection contents.
 * - true: an authorized backend response confirmed the collection,
 *         including when the array is genuinely empty.
 *
 * An empty array without confirmed availability does NOT mean
 * that the mechanic has no scheduled work, alerts, or activity.
 */

const unavailableMechanicHomeData = {
  jobsCompleted: null,
  pendingJobs: null,
  bookings: null,
  rating: null,
  earnings: null,

  schedule: [],
  serviceAlerts: [],
  recentActivity: [],

  dataAvailability: {
    schedule: false,
    serviceAlerts: false,
    recentActivity: false,
  },
}

/**
 * Retrieve Mechanic Home dashboard information.
 *
 * @param {string} mechanicId
 * The authenticated mechanic's user ID.
 *
 * @returns {Promise<import('./homeTypes').MechanicHomeData>}
 *
 * Future backend integration must:
 * - Authenticate the requesting user and verify the mechanic role.
 * - Verify the requested mechanic ID belongs to that user.
 * - Retrieve verified job counts, bookings, ratings, and earnings.
 * - Retrieve genuine scheduled work, service alerts, and activity.
 * - Mark each collection as available ONLY after an authoritative,
 *   successful response for the current mechanic.
 * - Return retrieval timestamps for freshness/caching information.
 *
 * Frontend mechanic ID validation is NOT backend authorization.
 */
export async function getMechanicHomeData(mechanicId) {
  if (
    typeof mechanicId !== 'string' ||
    !mechanicId.trim()
  ) {
    throw new Error(
      'An authenticated mechanic account is required to load dashboard information.'
    )
  }

  // The backend isn't connected. Preserve unknown statistics and
  // keep collections unverified; do not fabricate mechanic records.
  return {
    ...unavailableMechanicHomeData,
    schedule: [],
    serviceAlerts: [],
    recentActivity: [],
    dataAvailability: {
      ...unavailableMechanicHomeData.dataAvailability,
    },
  }
}
