export const MECHANIC_VERIFICATION_STATUSES = {
  NOT_VERIFIED: 'not-verified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
}

export const MECHANIC_AVAILABILITY_STATUSES = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  UNAVAILABLE: 'unavailable',
  NOT_CONFIGURED: 'not-configured',
}

/**
 * @typedef {
 *   'not-verified' |
 *   'pending' |
 *   'verified' |
 *   'rejected'
 * } MechanicVerificationStatus
 */

/**
 * @typedef {
 *   'available' |
 *   'busy' |
 *   'unavailable' |
 *   'not-configured'
 * } MechanicAvailabilityStatus
 */

/**
 * Verified mechanic identity and business information.
 *
 * The complete verification summary is null when
 * the authoritative verification status is unknown.
 *
 * Individual boolean values must only come from
 * confirmed verification records.
 *
 * @typedef {{
 *   status: MechanicVerificationStatus,
 *   identityVerified: boolean,
 *   tradeCertificateVerified: boolean,
 *   businessVerified: boolean
 * }} MechanicVerificationSummary
 */

/**
 * Mechanic performance statistics.
 *
 * Null indicates unavailable or unverified data.
 *
 * Zero must only be returned when the backend
 * confirms that the actual count is zero.
 *
 * @typedef {{
 *   rating: number | null,
 *   reviewCount: number | null,
 *   completedJobs: number | null
 * }} MechanicPerformanceSummary
 */

/**
 * Mechanic availability information.
 *
 * The complete availability summary is null when
 * authoritative availability information cannot
 * be retrieved.
 *
 * The 'not-configured' status must only be used
 * when configuration is confirmed to be absent.
 *
 * @typedef {{
 *   status: MechanicAvailabilityStatus,
 *   isAcceptingJobs: boolean,
 *   serviceRadiusLabel: string | null
 * }} MechanicAvailabilitySummary
 */

/**
 * Frontend-owned Profile navigation setting.
 *
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string
 * }} MechanicProfileSetting
 */

/**
 * @typedef {{
 *   id: string,
 *   type: string,
 *   title: string,
 *   description: string,
 *   occurredAt: string | null
 * }} MechanicProfileActivity
 */

/**
 * Mechanic identity, contact, business and
 * professional details belong to UserContext.
 *
 * Verification, performance and availability
 * information must be authoritative.
 *
 * Null indicates unavailable backend information.
 *
 * An empty recentActivity array indicates that
 * the backend confirmed there are no activities.
 *
 * Frontend-owned settings remain available
 * independently of backend profile data.
 *
 * @typedef {{
 *   verification: MechanicVerificationSummary | null,
 *   performance: MechanicPerformanceSummary,
 *   availability: MechanicAvailabilitySummary | null,
 *   settings: MechanicProfileSetting[],
 *   recentActivity: MechanicProfileActivity[] | null
 * }} MechanicProfileData
 */