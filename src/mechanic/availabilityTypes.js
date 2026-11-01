export const MECHANIC_AVAILABILITY_DAYS = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
}

export const MECHANIC_AVAILABILITY_DAY_LABELS = {
  [MECHANIC_AVAILABILITY_DAYS.MONDAY]:
    'Monday',

  [MECHANIC_AVAILABILITY_DAYS.TUESDAY]:
    'Tuesday',

  [MECHANIC_AVAILABILITY_DAYS.WEDNESDAY]:
    'Wednesday',

  [MECHANIC_AVAILABILITY_DAYS.THURSDAY]:
    'Thursday',

  [MECHANIC_AVAILABILITY_DAYS.FRIDAY]:
    'Friday',

  [MECHANIC_AVAILABILITY_DAYS.SATURDAY]:
    'Saturday',

  [MECHANIC_AVAILABILITY_DAYS.SUNDAY]:
    'Sunday',
}

export const MECHANIC_AVAILABILITY_DAY_ORDER = [
  MECHANIC_AVAILABILITY_DAYS.MONDAY,
  MECHANIC_AVAILABILITY_DAYS.TUESDAY,
  MECHANIC_AVAILABILITY_DAYS.WEDNESDAY,
  MECHANIC_AVAILABILITY_DAYS.THURSDAY,
  MECHANIC_AVAILABILITY_DAYS.FRIDAY,
  MECHANIC_AVAILABILITY_DAYS.SATURDAY,
  MECHANIC_AVAILABILITY_DAYS.SUNDAY,
]

/**
 * 24-hour local time in HH:mm format.
 *
 * Examples:
 * - 08:00
 * - 13:30
 *
 * @typedef {string} MechanicAvailabilityTime
 */

/**
 * @typedef {
 *   'monday' |
 *   'tuesday' |
 *   'wednesday' |
 *   'thursday' |
 *   'friday' |
 *   'saturday' |
 *   'sunday'
 * } MechanicAvailabilityDayKey
 */

/**
 * A single period during which the mechanic can
 * accept scheduled work.
 *
 * The backend should validate that time windows
 * do not overlap and that startTime is earlier
 * than endTime.
 *
 * @typedef {Object} MechanicAvailabilityTimeWindow
 * @property {string} id
 * @property {MechanicAvailabilityTime} startTime
 * @property {MechanicAvailabilityTime} endTime
 */

/**
 * Recurring availability for one weekday.
 *
 * A day may be disabled while still retaining its
 * configured windows so the frontend can restore
 * them if the mechanic enables the day again.
 *
 * @typedef {Object} MechanicWeeklyAvailability
 * @property {MechanicAvailabilityDayKey} day
 * @property {boolean} isAvailable
 * @property {MechanicAvailabilityTimeWindow[]} windows
 */

/**
 * A date-specific exception to the recurring weekly
 * availability schedule.
 *
 * Examples include:
 * - workshop closed for a specific date
 * - mechanic unavailable for leave
 * - extended hours for a particular date
 *
 * The date must use YYYY-MM-DD.
 *
 * @typedef {Object} MechanicAvailabilityOverride
 * @property {string} id
 * @property {string} date
 * @property {boolean} isAvailable
 * @property {MechanicAvailabilityTimeWindow[]} windows
 * @property {string | null} reason
 */

/**
 * Full availability configuration returned by the
 * MechanIQ backend for the authenticated mechanic.
 *
 * Time values represent local workshop/mechanic
 * scheduling times. The timezone identifies how
 * those times must be interpreted by the backend.
 *
 * @typedef {Object} MechanicAvailabilityData
 * @property {import('./profileTypes').MechanicAvailabilityStatus} status
 * @property {boolean} isAcceptingJobs
 * @property {string | null} timezone
 * @property {MechanicWeeklyAvailability[]} weeklySchedule
 * @property {MechanicAvailabilityOverride[]} overrides
 * @property {string | null} updatedAt
 */

/**
 * Payload used when availability persistence is
 * connected to the MechanIQ backend.
 *
 * The backend remains authoritative for the derived
 * availability status and update timestamp.
 *
 * @typedef {Object} UpdateMechanicAvailabilityInput
 * @property {boolean} isAcceptingJobs
 * @property {string | null} timezone
 * @property {MechanicWeeklyAvailability[]} weeklySchedule
 * @property {MechanicAvailabilityOverride[]} overrides
 */