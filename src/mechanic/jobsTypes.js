export const MECHANIC_JOB_FILTERS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

export const MECHANIC_JOB_FILTER_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

export const MECHANIC_JOB_PRIORITIES = {
  NORMAL: 'normal',
  URGENT: 'urgent',
}

export const MECHANIC_JOB_SERVICE_LOCATION_TYPES = {
  WORKSHOP: 'workshop',
  MOBILE: 'mobile',
  UNKNOWN: 'unknown',
}

export const MECHANIC_JOB_TRAVEL_STATUSES = {
  NOT_REQUIRED: 'not-required',
  NOT_STARTED: 'not-started',
  EN_ROUTE: 'en-route',
  ARRIVED: 'arrived',
}

export const MECHANIC_JOB_ACTIONS = {
  ACCEPT: 'accept',
  REJECT: 'reject',
  START_TRIP: 'start-trip',
  OPEN_MAP: 'open-map',
  MARK_ARRIVED: 'mark-arrived',
  START_JOB: 'start-job',
  COMPLETE_JOB: 'complete-job',
}

/**
 * @typedef {
 *   'pending' |
 *   'accepted' |
 *   'in-progress' |
 *   'completed' |
 *   'cancelled'
 * } MechanicJobStatus
 */

/**
 * @typedef {'normal' | 'urgent'} MechanicJobPriority
 */

/**
 * @typedef {
 *   'workshop' |
 *   'mobile' |
 *   'unknown'
 * } MechanicJobServiceLocationType
 */

/**
 * @typedef {
 *   'not-required' |
 *   'not-started' |
 *   'en-route' |
 *   'arrived'
 * } MechanicJobTravelStatus
 */

/**
 * @typedef {
 *   'accept' |
 *   'reject' |
 *   'start-trip' |
 *   'open-map' |
 *   'mark-arrived' |
 *   'start-job' |
 *   'complete-job'
 * } MechanicJobAction
 */

/**
 * Normalized job location used by the frontend.
 *
 * The backend remains authoritative for the service
 * destination. Latitude and longitude must never be
 * invented by the frontend.
 *
 * @typedef {{
 *   label: string | null,
 *   address: string | null,
 *   latitude: number | null,
 *   longitude: number | null
 * }} MechanicJobLocation
 */

/**
 * Mechanic position shared during an active mobile-job
 * travel session.
 *
 * This must come from real device location and backend
 * synchronization. It must not be fabricated locally.
 *
 * @typedef {{
 *   latitude: number,
 *   longitude: number,
 *   capturedAt: string | null
 * }} MechanicSharedLocation
 */

/**
 * @typedef {{
 *   id: string,
 *   requestId: string | null,
 *   customerId: string | null,
 *   vehicleId: string | null,
 *   bookingId: string | null,
 *   diagnosticId: string | null,
 *   customerName: string | null,
 *   vehicleLabel: string | null,
 *   serviceType: string,
 *   description: string | null,
 *   scheduledDate: string | null,
 *   scheduledTime: string | null,
 *   locationLabel: string | null,
 *   serviceLocationType: MechanicJobServiceLocationType,
 *   serviceLocation: MechanicJobLocation | null,
 *   status: MechanicJobStatus,
 *   travelStatus: MechanicJobTravelStatus,
 *   locationSharingActive: boolean,
 *   mechanicLocation: MechanicSharedLocation | null,
 *   distanceToServiceKm: number | null,
 *   estimatedArrivalAt: string | null,
 *   allowedActions: MechanicJobAction[],
 *   priority: MechanicJobPriority,
 *   estimatedAmount: number | null,
 *   currency: string | null,
 *   createdAt: string | null
 * }} MechanicJob
 */

/**
 * @typedef {{
 *   jobs: MechanicJob[],
 *   totalPending: number,
 *   totalAccepted: number,
 *   totalInProgress: number,
 *   totalCompleted: number
 * }} MechanicJobsData
 */