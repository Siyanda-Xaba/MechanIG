import {
  MechanicRequestType,
  MechanicServiceRequest,
  ServiceLocation,
} from './mechanicRequestTypes'

type CreateMechanicRequestInput = {
  customerId: string
  vehicleId: string
  mechanicId: string

  diagnosticResultId?: string | null

  requestType: MechanicRequestType

  serviceLocation?: ServiceLocation | null

  scheduledAt?: string | null

  issueDescription?: string | null
}

export async function createMechanicRequest(
  input: CreateMechanicRequestInput
): Promise<MechanicServiceRequest> {
  // Later this will POST to the MechanIQ backend.
  //
  // The backend will be responsible for:
  // - creating the real request ID
  // - confirming mechanic availability
  // - setting the authoritative status
  // - pricing
  // - scheduling
  // - location validation
  // - notifications

  const developmentRequest: MechanicServiceRequest = {
    id: 'request-development-001',

    customerId: input.customerId,
    vehicleId: input.vehicleId,
    mechanicId: input.mechanicId,

    diagnosticResultId:
      input.diagnosticResultId ?? null,

    requestType: input.requestType,
    status: 'pending',

    serviceLocation:
      input.serviceLocation ?? null,

    scheduledAt:
      input.scheduledAt ?? null,

    issueDescription:
      input.issueDescription ?? null,

    estimatedPrice: null,
    finalPrice: null,

    createdAt: new Date().toISOString(),
  }

  return developmentRequest
}