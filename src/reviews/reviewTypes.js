/**
 * MechanIQ Shared Ratings & Reviews Types
 *
 * Used by both Customer and Mechanic frontend features.
 *
 * Reviews must be associated with real,
 * backend-confirmed completed mechanic jobs.
 *
 * The backend is authoritative for:
 *
 * - Completed job verification
 * - Customer review eligibility
 * - Duplicate review prevention
 * - Review ownership
 * - Review persistence
 * - Mechanic rating calculations
 *
 * Frontend development data must never be
 * presented as verified production reviews.
 */

export const REVIEW_RATING_LIMITS = {
  MIN: 1,
  MAX: 5,
}

export const REVIEW_COMMENT_MAX_LENGTH = 1000

/**
 * A customer review saved by the MechanIQ backend.
 *
 * The backend derives the customer and mechanic
 * relationships from the completed job.
 *
 * @typedef {{
 *   id: string,
 *   jobId: string,
 *   requestId: string | null,
 *   bookingId: string | null,
 *   mechanicId: string,
 *   customerId: string,
 *   rating: number,
 *   comment: string | null,
 *   createdAt: string,
 *   updatedAt: string | null
 * }} MechanicReview
 */

/**
 * Review eligibility confirmed by the backend.
 *
 * The frontend must not determine eligibility
 * solely from locally displayed job statuses.
 *
 * @typedef {{
 *   jobId: string,
 *   canReview: boolean,
 *   reason: string | null,
 *   existingReviewId: string | null
 * }} MechanicReviewEligibility
 */

/**
 * Information submitted by the customer.
 *
 * The backend must determine customer identity
 * from authentication and resolve the mechanic
 * using the confirmed job record.
 *
 * @typedef {{
 *   jobId: string,
 *   rating: number,
 *   comment: string | null
 * }} CreateMechanicReviewInput
 */

/**
 * Rating summary calculated by the backend.
 *
 * Existing Mechanic Home, Mechanic Profile,
 * and booking screens can consume this data.
 *
 * @typedef {{
 *   mechanicId: string,
 *   averageRating: number | null,
 *   reviewCount: number
 * }} MechanicRatingSummary
 */

/**
 * Paginated reviews returned by the backend.
 *
 * @typedef {{
 *   reviews: MechanicReview[],
 *   nextCursor: string | null,
 *   hasMore: boolean
 * }} MechanicReviewsPage
 */

/**
 * Complete frontend review data for a mechanic.
 *
 * @typedef {{
 *   summary: MechanicRatingSummary,
 *   reviews: MechanicReviewsPage
 * }} MechanicReviewsData
 */