export const MECHANIC_WALK_IN_PRIORITIES = {
  NORMAL: 'normal',
  URGENT: 'urgent',
}

/**
 * @typedef {
 *   'normal' |
 *   'urgent'
 * } MechanicWalkInPriority
 */

/**
 * Frontend intake contract for an unscheduled
 * workshop job created by a mechanic.
 *
 * Walk-in intake is workshop-only. Mobile service
 * should use the normal booking/request workflow
 * because travel location and scheduling must be
 * validated separately.
 *
 * Customer and vehicle identifiers must refer to
 * real backend-linked records. The frontend must not
 * invent customer or vehicle identities.
 *
 * The MechanIQ backend remains authoritative for:
 * - the real job ID
 * - job status
 * - customer/vehicle relationships
 * - mechanic assignment
 * - workshop association
 * - timestamps
 * - pricing
 * - notifications
 * - allowed job actions
 *
 * @typedef {{
 *   customerId: string,
 *   vehicleId: string,
 *   mechanicId: string,
 *   serviceType: string,
 *   description?: string | null,
 *   priority: MechanicWalkInPriority
 * }} CreateMechanicWalkInJobInput
 */