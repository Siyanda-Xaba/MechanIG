export type CustomerProfileQuickActionId =
  | 'vehicle-details'
  | 'service-history'
  | 'saved-addresses'
  | 'payment-methods'

export type CustomerProfileSettingId =
  | 'personal-information'
  | 'notifications'
  | 'security'
  | 'help-support'

export type CustomerProfileActivityType =
  | 'profile-updated'
  | 'service-booking-confirmed'

export type CustomerProfileQuickAction = {
  id: CustomerProfileQuickActionId
  title: string
}

export type CustomerProfileSetting = {
  id: CustomerProfileSettingId
  title: string
  description: string
}

export type CustomerProfileActivity = {
  id: string
  type: CustomerProfileActivityType
  title: string
  description: string
  occurredAt: string
}

export type CustomerProfileData = {
  accountLabel: string
  isVerified: boolean
  quickActions: CustomerProfileQuickAction[]
  settings: CustomerProfileSetting[]
  recentActivity: CustomerProfileActivity[]
}