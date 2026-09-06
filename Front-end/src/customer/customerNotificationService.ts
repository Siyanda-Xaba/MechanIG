import {
  CustomerNotificationsData,
} from './customerNotificationTypes'

const developmentNotifications: CustomerNotificationsData = {
  unreadCount: 3,

  notifications: [
    {
      id: 'notification-001',

      category: 'diagnostics',

      title: 'Vehicle health check available',

      message:
        'Review the latest diagnostic information for your selected vehicle.',

      createdAt: 'Today, 09:30',

      isRead: false,

      action: {
        type: 'diagnostics',
      },
    },

    {
      id: 'notification-002',

      category: 'service',

      title: 'Service reminder',

      message:
        'Your vehicle is approaching its next recommended service interval.',

      createdAt: 'Today, 08:10',

      isRead: false,

      action: {
        type: 'service',
      },
    },

    {
      id: 'notification-003',

      category: 'fuel',

      title: 'Fuel level reminder',

      message:
        'Check your current fuel level and available fuel options.',

      createdAt: 'Yesterday, 18:45',

      isRead: false,

      action: {
        type: 'fuel',
      },
    },

    {
      id: 'notification-004',

      category: 'marketplace',

      title: 'Marketplace activity',

      message:
        'Continue browsing parts and accessories for your vehicle.',

      createdAt: 'Yesterday, 14:20',

      isRead: true,

      action: {
        type: 'marketplace',
      },
    },
  ],
}

export async function getCustomerNotifications(
  userId: string
): Promise<CustomerNotificationsData> {
  // userId is part of the backend-ready contract.
  //
  // Later this will call the MechanIQ backend and return:
  // - real notification records
  // - real read/unread state
  // - service/job updates
  // - mechanic responses
  // - diagnostics alerts
  // - fuel updates
  // - marketplace updates
  //
  // Push delivery and cross-user events must remain
  // backend/provider-owned rather than being simulated
  // as production behavior in the frontend.

  void userId

  return developmentNotifications
}