/**
 * Customer Profile Service
 *
 * Profile metadata must originate from
 * authenticated and authoritative sources.
 *
 * Never fabricate account verification,
 * service bookings, profile changes,
 * or customer activity.
 */

const customerProfileData = {
    accountLabel: 'Driver Account',

    /*
     * Account verification is unknown until
     * confirmed by an authoritative source.
     *
     * The Profile screen must not display
     * a Verified badge based on mock data.
     */
    isVerified: null,

    /*
     * Quick Actions are static navigation
     * definitions, not backend records.
     */
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

    /*
     * Account Settings are frontend
     * navigation and configuration options.
     */
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

    /*
     * Recent Activity must contain only
     * confirmed customer actions.
     *
     * Examples:
     * - Genuine profile updates
     * - Confirmed service bookings
     *
     * Until persistent activity retrieval
     * is connected, return an empty list.
     */
    recentActivity: [],
};

/**
 * Retrieve profile information for the
 * authenticated customer.
 *
 * The future backend integration must:
 *
 * - Verify the authenticated account.
 * - Confirm the requested user ID.
 * - Retrieve authoritative verification status.
 * - Retrieve confirmed recent activity.
 * - Return account-specific information.
 *
 * Quick Actions and Settings remain
 * frontend-owned navigation definitions.
 */
export async function getCustomerProfileData(userId) {
    void userId;

    return {
        ...customerProfileData,
        quickActions: [...customerProfileData.quickActions],
        settings: [...customerProfileData.settings],
        recentActivity: [],
    };
}