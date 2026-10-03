import {
  MECHANIC_AVAILABILITY_DAY_ORDER,
} from './availabilityTypes'
import {
  MECHANIC_AVAILABILITY_STATUSES,
} from './profileTypes'

export const MECHANIC_AVAILABILITY_SERVICE_ERRORS = {
  PERSISTENCE_NOT_CONNECTED:
    'persistence-not-connected',
}

/**
 * Creates an unconfigured weekly schedule without
 * inventing working hours for the mechanic.
 *
 * Temporary development data belongs in the service
 * layer rather than screen JSX. Once the backend is
 * connected, the schedule returned by the API will
 * replace this development state.
 */
function createUnconfiguredWeeklySchedule() {
  return MECHANIC_AVAILABILITY_DAY_ORDER.map(
    (day) => ({
      day,
      isAvailable: false,
      windows: [],
    })
  )
}

const developmentAvailabilityData = {
  status:
    MECHANIC_AVAILABILITY_STATUSES.NOT_CONFIGURED,

  isAcceptingJobs: false,

  timezone: null,

  weeklySchedule:
    createUnconfiguredWeeklySchedule(),

  overrides: [],

  updatedAt: null,
}

/**
 * Loads detailed mechanic availability for the
 * authenticated mechanic.
 *
 * The backend will eventually return:
 * - whether the mechanic accepts new jobs
 * - recurring weekly availability
 * - date-specific overrides
 * - scheduling timezone
 * - backend-derived availability status
 *
 * Until that API is connected, this returns an
 * explicitly unconfigured state. It does not invent
 * working hours or persisted availability.
 *
 * @param {string} userId
 * @returns {Promise<import('./availabilityTypes').MechanicAvailabilityData>}
 */
export async function getMechanicAvailability(
  userId
) {
  // userId is intentionally retained as part of the
  // backend-ready authenticated mechanic contract.
  void userId

  return {
    ...developmentAvailabilityData,

    weeklySchedule:
      developmentAvailabilityData
        .weeklySchedule
        .map((day) => ({
          ...day,

          windows:
            day.windows.map(
              (window) => ({
                ...window,
              })
            ),
        })),

    overrides:
      developmentAvailabilityData
        .overrides
        .map((override) => ({
          ...override,

          windows:
            override.windows.map(
              (window) => ({
                ...window,
              })
            ),
        })),
  }
}

/**
 * Persists mechanic availability.
 *
 * This contract is intentionally present before the
 * backend endpoint exists so the Availability UI and
 * context can integrate without later architectural
 * changes.
 *
 * We must not pretend to save production availability
 * locally because customer booking and mechanic job
 * assignment will ultimately depend on authoritative
 * backend scheduling data.
 *
 * @param {string} userId
 * @param {import('./availabilityTypes').UpdateMechanicAvailabilityInput} input
 * @returns {Promise<import('./availabilityTypes').MechanicAvailabilityData>}
 */
export async function updateMechanicAvailability(
  userId,
  input
) {
  // These parameters are part of the future API
  // contract and will be passed to the backend once
  // mechanic availability persistence is connected.
  void userId
  void input

  const error = new Error(
    'Mechanic availability persistence is not connected yet.'
  )

  error.code =
    MECHANIC_AVAILABILITY_SERVICE_ERRORS
      .PERSISTENCE_NOT_CONNECTED

  throw error
}