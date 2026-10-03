export const ESTIMATE_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
}

export const ESTIMATE_LINE_ITEM_TYPES = {
  LABOUR: 'labour',
  PART: 'part',
  OTHER: 'other',
}

/**
 * @typedef {
 *   'draft' |
 *   'submitted' |
 *   'approved' |
 *   'declined' |
 *   'expired' |
 *   'cancelled'
 * } EstimateStatus
 */

/**
 * @typedef {
 *   'labour' |
 *   'part' |
 *   'other'
 * } EstimateLineItemType
 */

/**
 * One item included in a mechanic estimate.
 *
 * Amounts entered by the mechanic are frontend input
 * until the MechanIQ backend validates and persists
 * the estimate.
 *
 * @typedef {{
 *   id: string,
 *   type: EstimateLineItemType,
 *   description: string,
 *   quantity: number,
 *   unitPrice: number
 * }} EstimateLineItem
 */

/**
 * Shared estimate entity associated with a mechanic
 * job and, where available, its booking/customer.
 *
 * The MechanIQ backend remains authoritative for:
 * - estimate IDs
 * - persisted pricing
 * - estimate status
 * - customer approval or rejection
 * - expiry
 * - currency validation
 * - job/booking relationships
 * - final service pricing
 *
 * @typedef {{
 *   id: string,
 *   jobId: string,
 *   bookingId: string | null,
 *   customerId: string | null,
 *   vehicleId: string | null,
 *   mechanicId: string,
 *   currency: string,
 *   lineItems: EstimateLineItem[],
 *   subtotal: number,
 *   notes: string | null,
 *   status: EstimateStatus,
 *   createdAt: string | null,
 *   updatedAt: string | null,
 *   submittedAt: string | null,
 *   respondedAt: string | null
 * }} Estimate
 */

/**
 * Frontend input used when a mechanic prepares an
 * estimate for linked service work.
 *
 * The frontend may calculate a preview subtotal from
 * line items for immediate UI feedback, but the
 * backend must recalculate and validate authoritative
 * monetary values before persistence.
 *
 * @typedef {{
 *   jobId: string,
 *   bookingId?: string | null,
 *   customerId?: string | null,
 *   vehicleId?: string | null,
 *   mechanicId: string,
 *   currency: string,
 *   lineItems: EstimateLineItem[],
 *   notes?: string | null
 * }} CreateEstimateInput
 */