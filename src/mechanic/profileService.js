import {
  getMechanicHomeData,
} from './homeService'

const developmentProfileMetadata = {
  verification: {
    status: 'not-verified',

    identityVerified: false,
    tradeCertificateVerified: false,
    businessVerified: false,
  },

  availability: {
    status: 'not-configured',

    isAcceptingJobs: false,
    serviceRadiusLabel: null,
  },

  settings: [
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
  ],

  recentActivity: [],
}

/**
 * Later this function will load mechanic profile metadata
 * from the MechanIQ backend for the authenticated mechanic.
 *
 * Personal identity, contact information, workshop details,
 * business information and professional details are already
 * part of the authenticated user profile and must continue
 * to come through UserContext.
 *
 * Verification status must only be marked as verified when
 * confirmed by the mechanic verification backend.
 *
 * Performance data is currently derived from the existing
 * Mechanic Home service so the frontend does not maintain
 * conflicting development statistics.
 *
 * @param {string} userId
 * @returns {Promise<import('./profileTypes').MechanicProfileData>}
 */
export async function getMechanicProfileData(
  userId
) {
  // userId is intentionally part of the
  // backend-ready profile contract.
  void userId

  const homeData =
    await getMechanicHomeData()

  return {
    verification:
      developmentProfileMetadata
        .verification,

    performance: {
      rating:
        homeData.rating ?? null,

      reviewCount: 0,

      completedJobs:
        homeData.jobsCompleted ?? 0,
    },

    availability:
      developmentProfileMetadata
        .availability,

    settings:
      developmentProfileMetadata
        .settings,

    recentActivity:
      developmentProfileMetadata
        .recentActivity,
  }
}