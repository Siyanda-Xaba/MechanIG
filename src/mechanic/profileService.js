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
 * Use verified performance, verification and availability fields
 * already saved on the mechanic profile. Return null for anything
 * the account does not contain; never invent profile data.
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
function numberOrNull(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue
    const number = Number(value)
    if (Number.isFinite(number)) return number
  }
  return null
}

function getSavedVerification(profile) {
  const saved = profile.verification || {}
  const documents = profile.documents || {}
  const accountVerified = profile.isVerified === true || profile.isMechanicApproved === true
  const accountStatus = String(profile.accountStatus || '').toLowerCase()
  const submitted = (key) => Boolean(documents[key]?.storagePath || documents[key]?.uploadedAt || documents[key]?.status)
  const identitySubmitted = submitted('idDocument')
  const tradeCertificateSubmitted = submitted('tradeCertificate')
  const businessSubmitted = submitted('workshopRegistration')
  const status = saved.status || profile.verificationStatus || (accountVerified ? 'verified' :
    (['pending', 'review', 'under_review'].includes(accountStatus) || identitySubmitted || tradeCertificateSubmitted || businessSubmitted) ? 'pending' : null)
  const identityVerified = typeof saved.identityVerified === 'boolean'
    ? saved.identityVerified : typeof profile.identityVerified === 'boolean' ? profile.identityVerified : null
  const tradeCertificateVerified = typeof saved.tradeCertificateVerified === 'boolean'
    ? saved.tradeCertificateVerified : typeof profile.tradeCertificateVerified === 'boolean' ? profile.tradeCertificateVerified : null
  const businessVerified = typeof saved.businessVerified === 'boolean'
    ? saved.businessVerified : typeof profile.businessVerified === 'boolean' ? profile.businessVerified : null
  if (!status && identityVerified === null && tradeCertificateVerified === null && businessVerified === null) return null
  return {
    status: status || 'pending',
    identityVerified,
    tradeCertificateVerified,
    businessVerified,
    identitySubmitted,
    tradeCertificateSubmitted,
    businessSubmitted,
  }
}

function getSavedAvailability(profile, professionalDetails) {
  const saved = profile.availability || {}
  let status = saved.status
  if (!status && typeof profile.isAcceptingJobs === 'boolean') status = profile.isAcceptingJobs ? 'available' : 'unavailable'
  if (!status && typeof profile.availabilityStatus === 'string') status = profile.availabilityStatus
  if (status === 'online') status = 'available'
  if (status === 'offline') status = 'unavailable'
  const serviceRadius = saved.serviceRadiusLabel || professionalDetails.serviceRadius || profile.serviceRadius
  if (!status && !serviceRadius) return null
  return {
    status: status || 'not-configured',
    isAcceptingJobs: profile.isAcceptingJobs === true || saved.isAcceptingJobs === true,
    serviceRadiusLabel: serviceRadius ? `Service area: ${serviceRadius}` : null,
  }
}

export async function getMechanicProfileData(mechanicId, mechanicProfile = {}) {
  if (
    typeof mechanicId !== 'string' ||
    !mechanicId.trim()
  ) {
    throw new Error(
      'An authenticated mechanic account is required to load profile information.'
    )
  }

  const profile = mechanicProfile && typeof mechanicProfile === 'object' ? mechanicProfile : {}
  const professionalDetails = profile.professionalDetails && typeof profile.professionalDetails === 'object'
    ? profile.professionalDetails
    : {}
  let homeData = null

  try {
    homeData = await getMechanicHomeData(mechanicId)
  } catch {
    // Performance is unavailable, not zero. Other profile
    // sections and frontend settings remain independent.
  }

  return {
    verification: getSavedVerification(profile),

    performance: {
      rating: numberOrNull(homeData?.rating, profile.performance?.rating, profile.rating, profile.averageRating),
      reviewCount: numberOrNull(profile.performance?.reviewCount, profile.reviewCount, profile.reviewsCount, profile.totalReviews),
      completedJobs: numberOrNull(homeData?.jobsCompleted, profile.performance?.completedJobs, profile.completedJobs, profile.jobsCompleted),
    },

    availability: getSavedAvailability(profile, professionalDetails),
    settings: MECHANIC_PROFILE_SETTINGS,
    recentActivity: Array.isArray(profile.recentActivity) ? profile.recentActivity : null,
  }
}
