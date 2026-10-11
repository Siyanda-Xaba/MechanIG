import { CustomerProfileData } from './customerProfileTypes'

const developmentProfileData: CustomerProfileData = {
  accountLabel: 'Driver Account',
  isVerified: true,

  quickActions: [
    {
      id: 'vehicle-details',
      title: 'Vehicle Details',
    },
    {
      id: 'service-history',
      title: 'Service History',
    },
    {
      id: 'saved-addresses',
      title: 'Saved Addresses',
    },
    {
      id: 'payment-methods',
      title: 'Payment Methods',
    },
  ],

  settings: [
    {
      id: 'personal-information',
      title: 'Personal Information',
      description:
        'View and update your personal details.',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description:
        'Manage your alerts and preferences.',
    },
    {
      id: 'security',
      title: 'Security',
      description:
        'Password, biometric login, and security settings.',
    },
    {
      id: 'help-support',
      title: 'Help & Support',
      description:
        'Get help and contact customer support.',
    },
  ],

  recentActivity: [
    {
      id: 'profile-activity-001',
      type: 'profile-updated',
      title: 'Profile updated',
      description:
        'Your personal information was updated.',
      occurredAt: 'Today, 10:23',
    },
    {
      id: 'profile-activity-002',
      type: 'service-booking-confirmed',
      title: 'Service booking confirmed',
      description:
        'Oil Service scheduled for 24 May 2025.',
      occurredAt: 'Yesterday, 17:45',
    },
  ],
}

export async function getCustomerProfileData(
  userId: string
): Promise<CustomerProfileData> {
  // userId is intentionally part of the API-ready contract.
  // The backend will later return profile metadata,
  // account settings and recent activity for this user.
  void userId

  return developmentProfileData
}