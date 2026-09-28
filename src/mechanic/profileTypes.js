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
 * @typedef {{
 *   status: MechanicVerificationStatus,
 *   identityVerified: boolean,
 *   tradeCertificateVerified: boolean,
 *   businessVerified: boolean
 * }} MechanicVerificationSummary
 */

/**
 * @typedef {{
 *   rating: number | null,
 *   reviewCount: number,
 *   completedJobs: number
 * }} MechanicPerformanceSummary
 */

/**
 * @typedef {{
 *   status: MechanicAvailabilityStatus,
 *   isAcceptingJobs: boolean,
 *   serviceRadiusLabel: string | null
 * }} MechanicAvailabilitySummary
 */

/**
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
 * Mechanic identity, contact, business and professional
 * details are intentionally not duplicated here.
 *
 * Those fields belong to the authenticated user profile
 * loaded through UserContext.
 *
 * @typedef {{
 *   verification: MechanicVerificationSummary,
 *   performance: MechanicPerformanceSummary,
 *   availability: MechanicAvailabilitySummary,
 *   settings: MechanicProfileSetting[],
 *   recentActivity: MechanicProfileActivity[]
 * }} MechanicProfileData
 */