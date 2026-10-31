export type CustomerNotificationCategory =
  | 'diagnostics'
  | 'fuel'
  | 'service'
  | 'marketplace'
  | 'account'

export type CustomerNotificationAction =
  | {
      type: 'diagnostics'
      resultId?: string
    }
  | {
      type: 'fuel'
    }
  | {
      type: 'service'
      mechanicId?: string
    }
  | {
      type: 'marketplace'
    }
  | {
      type: 'profile'
    }

export type CustomerNotification = {
  id: string

  category: CustomerNotificationCategory

  title: string
  message: string

  createdAt: string

  isRead: boolean

  action: CustomerNotificationAction | null
}

export type CustomerNotificationsData = {
  notifications: CustomerNotification[]
  unreadCount: number
}