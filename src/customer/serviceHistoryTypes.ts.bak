import type {
  WorkshopBookingStatus,
} from './workshopBookingTypes'

export type CustomerServiceHistoryRecord = {
  id: string

  customerId: string
  vehicleId: string
  mechanicId: string

  diagnosticResultId: string | null

  serviceType: string
  issueDescription: string | null

  scheduledDate: string
  scheduledTime: string

  status: WorkshopBookingStatus

  estimatedPrice: number | null
  finalPrice: number | null

  completedAt: string | null
  createdAt: string
}

export type CustomerServiceHistoryData = {
  records: CustomerServiceHistoryRecord[]
}