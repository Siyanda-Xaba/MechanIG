import {
  SERVICE_REQUEST_STATUSES,
} from './serviceTrackingTypes'

import {
  MECHANIC_JOB_FILTERS,
  MECHANIC_JOB_TRAVEL_STATUSES,
} from '../mechanic/jobsTypes'

const TRACKING_REQUEST_TIMEOUT_MS = 15000

const VALID_REQUEST_STATUSES = new Set(
  Object.values(SERVICE_REQUEST_STATUSES)
)

const VALID_JOB_STATUSES = new Set([
  ...Object.values(MECHANIC_JOB_FILTERS),
  'cancelled',
])

const VALID_TRAVEL_STATUSES = new Set(
  Object.values(MECHANIC_JOB_TRAVEL_STATUSES)
)

const VALID_ACTOR_ROLES = new Set([
  'customer',
  'mechanic',
  'system',
])

function isNonEmptyString(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  )
}

function isNullableString(value) {
  return (
    value === null ||
    typeof value === 'string'
  )
}

function isValidMechanicLocation(location) {
  if (location === null) {
    return true
  }

  if (
    !location ||
    typeof location !== 'object'
  ) {
    return false
  }

  return (
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180 &&
    isNullableString(location.capturedAt)
  )
}

function isValidTrackingSnapshot(
  tracking,
  requestId
) {
  if (
    !tracking ||
    typeof tracking !== 'object'
  ) {
    return false
  }

  if (
    tracking.requestId !== requestId ||
    !isNonEmptyString(tracking.customerId) ||
    !isNonEmptyString(tracking.vehicleId)
  ) {
    return false
  }

  if (
    !VALID_REQUEST_STATUSES.has(
      tracking.requestStatus
    )
  ) {
    return false
  }

  if (
    tracking.jobStatus !== null &&
    !VALID_JOB_STATUSES.has(
      tracking.jobStatus
    )
  ) {
    return false
  }

  if (
    tracking.travelStatus !== null &&
    !VALID_TRAVEL_STATUSES.has(
      tracking.travelStatus
    )
  ) {
    return false
  }

  const nullableFields = [
    'mechanicId',
    'jobId',
    'bookingId',
    'diagnosticId',
    'estimatedArrivalAt',
    'rejectionReason',
    'cancellationReason',
    'createdAt',
    'updatedAt',
  ]

  for (const field of nullableFields) {
    if (!isNullableString(tracking[field])) {
      return false
    }
  }

  if (
    typeof tracking.locationSharingActive !==
    'boolean'
  ) {
    return false
  }

  if (
    !isValidMechanicLocation(
      tracking.mechanicLocation
    )
  ) {
    return false
  }

  return true
}

function isValidTrackingEvent(
  event,
  requestId
) {
  if (
    !event ||
    typeof event !== 'object'
  ) {
    return false
  }

  return (
    isNonEmptyString(event.id) &&
    event.requestId === requestId &&
    isNonEmptyString(event.eventType) &&
    isNullableString(event.description) &&
    isNonEmptyString(event.occurredAt) &&
    (
      event.actorRole === null ||
      VALID_ACTOR_ROLES.has(event.actorRole)
    )
  )
}

function validateTrackingResponse(
  payload,
  requestId
) {
  if (
    !payload ||
    typeof payload !== 'object' ||
    !isValidTrackingSnapshot(
      payload.tracking,
      requestId
    ) ||
    !Array.isArray(payload.events) ||
    !payload.events.every(
      (event) =>
        isValidTrackingEvent(
          event,
          requestId
        )
    )
  ) {
    throw new Error(
      'The service tracking backend returned invalid tracking data.'
    )
  }

  return payload
}

/**
 * Retrieve backend-confirmed service tracking data.
 *
 * Authentication:
 * The caller supplies a function that retrieves
 * the current authenticated user's ID token.
 *
 * The backend MUST independently verify the token
 * and authorize access to the requested service.
 *
 * Request IDs and user IDs must never be accepted
 * as proof of ownership.
 *
 * @param {string} requestId
 * @param {{
 *   getIdToken?: () => Promise<string | null>,
 *   apiBaseUrl?: string
 * }} [options]
 *
 * @returns {
 *   Promise<
 *     import('./serviceTrackingTypes').ServiceTrackingData
 *   >
 * }
 */
export async function getServiceTrackingData(
  requestId,
  options = {}
) {
  if (!isNonEmptyString(requestId)) {
    throw new Error(
      'A valid service request ID is required.'
    )
  }

  const normalizedRequestId =
    requestId.trim()

  const apiBaseUrl = (
    options.apiBaseUrl ??
    process.env
      .EXPO_PUBLIC_SERVICE_TRACKING_API_URL ??
    ''
  )
    .trim()
    .replace(/\/+$/, '')

  if (!apiBaseUrl) {
    throw new Error(
      'Service tracking is unavailable until the MechanIQ backend is connected.'
    )
  }

  if (
    typeof options.getIdToken !== 'function'
  ) {
    throw new Error(
      'An authenticated session is required to view service tracking.'
    )
  }

  const token =
    await options.getIdToken()

  if (!isNonEmptyString(token)) {
    throw new Error(
      'Please sign in to view service tracking.'
    )
  }

  const controller =
    new AbortController()

  const timeoutId = setTimeout(
    () => controller.abort(),
    TRACKING_REQUEST_TIMEOUT_MS
  )

  const endpoint =
    `${apiBaseUrl}/mechanic-requests/` +
    `${encodeURIComponent(
      normalizedRequestId
    )}/tracking`

  try {
    const response = await fetch(endpoint, {
      method: 'GET',

      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },

      signal: controller.signal,
    })

    if (response.status === 401) {
      throw new Error(
        'Your session has expired. Please sign in again.'
      )
    }

    if (response.status === 403) {
      throw new Error(
        'You do not have permission to view this service request.'
      )
    }

    if (response.status === 404) {
      throw new Error(
        'Service request tracking was not found.'
      )
    }

    if (!response.ok) {
      throw new Error(
        'Unable to retrieve service tracking. Please try again.'
      )
    }

    let payload

    try {
      payload = await response.json()
    } catch {
      throw new Error(
        'The service tracking backend returned an invalid response.'
      )
    }

    return validateTrackingResponse(
      payload,
      normalizedRequestId
    )
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'Service tracking is taking too long. Please try again.'
      )
    }

    if (
      error instanceof TypeError
    ) {
      throw new Error(
        'Unable to connect to service tracking. Check your connection and try again.'
      )
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}