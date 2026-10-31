import type {
  CustomerNotificationCategory,
} from './customerNotificationTypes'

export type CustomerNotificationChannel =
  | 'push'
  | 'email'

export type CustomerNotificationCategoryPreference = {
  category: CustomerNotificationCategory

  pushEnabled: boolean
  emailEnabled: boolean
}

export type CustomerNotificationPreferences = {
  customerId: string

  categoryPreferences:
    CustomerNotificationCategoryPreference[]
}

export type UpdateCustomerNotificationPreferencesInput = {
  customerId: string

  categoryPreferences:
    CustomerNotificationCategoryPreference[]
}