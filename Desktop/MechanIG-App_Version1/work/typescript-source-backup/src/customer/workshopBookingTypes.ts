export type WorkshopBookingStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export type WorkshopBooking = {
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

  createdAt: string
}

export type CreateWorkshopBookingInput = {
  customerId: string
  vehicleId: string
  mechanicId: string

  diagnosticResultId?: string | null

  serviceType: string
  issueDescription?: string | null

  scheduledDate: string
  scheduledTime: string
}