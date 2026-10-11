export type MechanicRequestType =
  | 'mobile'
  | 'workshop'

export type MechanicRequestStatus =
  | 'draft'
  | 'pending'
  | 'accepted'
  | 'mechanic-en-route'
  | 'arrived'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export type ServiceLocation = {
  address: string
  latitude: number | null
  longitude: number | null
}

export type MechanicServiceRequest = {
  id: string

  customerId: string
  vehicleId: string
  mechanicId: string

  diagnosticResultId: string | null

  requestType: MechanicRequestType
  status: MechanicRequestStatus

  serviceLocation: ServiceLocation | null

  scheduledAt: string | null

  issueDescription: string | null

  estimatedPrice: number | null
  finalPrice: number | null

  createdAt: string
}