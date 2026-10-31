/**
 * MechanIQ Shared Service Tracking Types
 *
 * Used by Customer and Mechanic frontend features.
 *
 * The MechanIQ backend is authoritative for:
 * - Request decisions
 * - Mechanic assignments
 * - Job progress
 * - Travel progress
 * - Location sharing
 * - Completion confirmation
 *
 * The frontend must never create fake production
 * request statuses or job progress events.
 */

export const SERVICE_REQUEST_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
}

export const SERVICE_REQUEST_STATUS_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
}

/**
 * @typedef {
 *   'pending' |
 *   'accepted' |
 *   'rejected' |
 *   'cancelled'
 * } ServiceRequestStatus
 */

/**
 * @typedef {import('../mechanic/jobsTypes').MechanicJobStatus}
 * MechanicJobStatus
 */

/**
 * @typedef {import('../mechanic/jobsTypes').MechanicJobTravelStatus}
 * MechanicJobTravelStatus
 */

/**
 * @typedef {import('../mechanic/jobsTypes').MechanicSharedLocation}
 * MechanicSharedLocation
 */

/**
 * A backend-confirmed snapshot of a service request.
 *
 * Request status, job status, and travel status
 * intentionally remain separate.
 *
 * A request can be accepted while the associated
 * job is still awaiting service.
 *
 * Travel progress does not imply job completion.
 *
 * @typedef {{
 *   requestId: string,
 *   customerId: string,
 *   vehicleId: string,
 *   mechanicId: string | null,
 *   jobId: string | null,
 *   bookingId: string | null,
 *   diagnosticId: string | null,
 *   requestStatus: ServiceRequestStatus,
 *   jobStatus: MechanicJobStatus | null,
 *   travelStatus: MechanicJobTravelStatus | null,
 *   locationSharingActive: boolean,
 *   mechanicLocation: MechanicSharedLocation | null,
 *   estimatedArrivalAt: string | null,
 *   rejectionReason: string | null,
 *   cancellationReason: string | null,
 *   createdAt: string | null,
 *   updatedAt: string | null
 * }} ServiceTrackingSnapshot
 */

/**
 * A service lifecycle event confirmed by
 * the authoritative MechanIQ backend.
 *
 * Events are read-only on the frontend.
 *
 * @typedef {{
 *   id: string,
 *   requestId: string,
 *   eventType: string,
 *   description: string | null,
 *   occurredAt: string,
 *   actorRole: 'customer' | 'mechanic' | 'system' | null
 * }} ServiceTrackingEvent
 */

/**
 * The result returned by the future
 * service tracking backend endpoint.
 *
 * @typedef {{
 *   tracking: ServiceTrackingSnapshot,
 *   events: ServiceTrackingEvent[]
 * }} ServiceTrackingData
 */