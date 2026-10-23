const developmentNotifications = {
    unreadCount: 3,

    notifications: [
        {
            id: 'mechanic-notification-001',
            category: 'jobs',
            title: 'Pending jobs need review',
            message: 'Open your Jobs dashboard to review available mechanic work.',
            createdAt: 'Today, 09:15',
            isRead: false,

            action: {
                type: 'jobs',
            },
        },

        {
            id: 'mechanic-notification-002',
            category: 'diagnostics',
            title: 'Diagnostics workspace available',
            message: 'Review assigned diagnostics or begin a mechanic diagnostic workflow.',
            createdAt: 'Today, 08:40',
            isRead: false,

            action: {
                type: 'diagnostics',
            },
        },

        {
            id: 'mechanic-notification-003',
            category: 'account',
            title: 'Complete your mechanic profile',
            message: 'Review your workshop, verification and availability information.',
            createdAt: 'Yesterday, 16:20',
            isRead: false,

            action: {
                type: 'profile',
            },
        },
    ],
};

export async function getMechanicNotifications(
    mechanicId
) {
    // mechanicId is part of the backend-ready
    // notification contract.
    //
    // Later this will call the MechanIQ backend and
    // return authoritative notifications such as:
    //
    // - new job requests
    // - job status changes
    // - booking updates
    // - diagnostic assignments
    // - customer messages
    // - workshop/service updates
    // - earnings/payment events
    // - verification/account events
    //
    // Real cross-user events, push delivery and
    // read/unread synchronization must be owned by
    // the backend/provider.
    //
    // The records above are development-only UI
    // fixtures. They do not simulate real customer
    // activity or production push events.

    void mechanicId;

    return developmentNotifications;
}