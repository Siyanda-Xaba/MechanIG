import {
  getMechanicHomeData,
} from './homeService'

/**
 * These are frontend navigation options, not backend records.
 * Account Settings must remain available even when profile
 * metadata or mechanic performance cannot be retrieved.
 */
export const MECHANIC_PROFILE_SETTINGS = [
  {
    id: 'personal-information',
    title: 'Personal Information',
    description:
      'View and update your personal and contact details.',
  },
  {
    id: 'business-information',
    title: 'Workshop & Business',
    description:
      'Manage your workshop, business and professional details.',
  },
  {
    id: 'availability',
    title: 'Availability',
    description:
      'Manage job availability and service preferences.',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description:
      'Manage mechanic alerts and notification preferences.',
  },
  {
    id: 'security',
    title: 'Security',
    description:
      'Password, authentication and account security settings.',
  },
  {
    id: 'help-support',
    title: 'Help & Support',
    description:
      'Get help and contact MechanIQ support.',
  },
]

/**
 * Retrieve metadata for the authenticated mechanic profile.
 *
 * Identity, contact, workshop and professional details belong to
 * UserContext rather than being duplicated in this service.
 *
 * Verification status, availability preferences, review counts,
 * and profile activity have no connected authoritative provider
 * yet. Return null for each unknown value, not invented defaults.
 *
 * Home statistics may be reused only when actually available for
 * the same mechanic. An unavailable Home service must not prevent
 * frontend Account Settings from being displayed.
 *
 * Future backend integration must authenticate the requesting
 * user, confirm the mechanic role and account association, and
 * authorize access to verification and availability records.
 *
 * @param {string} mechanicId
 * @returns {Promise<import('./profileTypes').MechanicProfileData>}
 */
export async function getMechanicProfileData(mechanicId) {
  if (
    typeof mechanicId !== 'string' ||
    !mechanicId.trim()
  ) {
    throw new Error(
      'An authenticated mechanic account is required to load profile information.'
    )
  }

  let homeData = null

  try {
    homeData = await getMechanicHomeData(mechanicId)
  } catch {
    // Performance is unavailable, not zero. Other profile
    // sections and frontend settings remain independent.
  }

  return {
    verification: null,

    performance: {
      rating: Number.isFinite(homeData?.rating)
        ? homeData.rating
        : null,
      reviewCount: null,
      completedJobs:
        Number.isFinite(homeData?.jobsCompleted) &&
        homeData.jobsCompleted >= 0
          ? homeData.jobsCompleted
          : null,
    },

    availability: null,
    settings: MECHANIC_PROFILE_SETTINGS,
    recentActivity: null,
  }
}
