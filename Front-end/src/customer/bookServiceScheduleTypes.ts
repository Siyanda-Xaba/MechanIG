import {
  CustomerServiceTypeId,
} from './bookServiceTypes'

export type BookServiceLocationPreference =
  | 'workshop'
  | 'mobile-service'

export type BookServiceScheduleDraft = {
  vehicleId: string
  serviceId: CustomerServiceTypeId

  preferredDate: string
  preferredTime: string

  locationPreference:
    BookServiceLocationPreference

  notes: string | null
}

export type BookServiceMatchRequest = {
  vehicleId: string
  serviceId: CustomerServiceTypeId

  preferredDate: string
  preferredTime: string

  locationPreference:
    BookServiceLocationPreference

  notes?: string | null
}