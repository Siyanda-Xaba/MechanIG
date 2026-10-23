const developmentProfileData = {
    accountLabel: 'Driver Account',
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
            description: 'View and update your personal details.',
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Manage your alerts and preferences.',
        },
        {
            id: 'security',
            title: 'Security',
            description: 'Password, biometric login, and security settings.',
        },
        {
            id: 'help-support',
            title: 'Help & Support',
            description: 'Get help and contact customer support.',
        },
    ],
    recentActivity: [],
};
export async function getCustomerProfileData(userId) {
    // userId is intentionally part of the API-ready contract.
    // The backend will later return profile metadata,
    // account settings and recent activity for this user.
    void userId;
    return developmentProfileData;
}
