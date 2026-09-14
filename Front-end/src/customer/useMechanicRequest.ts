import {
  useCallback,
  useState,
} from 'react'

import {
  MechanicRequestType,
  MechanicServiceRequest,
  ServiceLocation,
} from './mechanicRequestTypes'

import {
  createMechanicRequest,
} from './mechanicRequestService'

type SubmitMechanicRequestInput = {
  customerId: string
  vehicleId: string
  mechanicId: string

  diagnosticResultId?: string | null

  requestType: MechanicRequestType

  serviceLocation?: ServiceLocation | null

  scheduledAt?: string | null

  issueDescription?: string | null
}

type UseMechanicRequestReturn = {
  mechanicRequest: MechanicServiceRequest | null
  isSubmittingRequest: boolean
  mechanicRequestError: string | null

  submitMechanicRequest: (
    input: SubmitMechanicRequestInput
  ) => Promise<MechanicServiceRequest | null>

  resetMechanicRequest: () => void
}

export function useMechanicRequest():
  UseMechanicRequestReturn {
  const [
    mechanicRequest,
    setMechanicRequest,
  ] = useState<MechanicServiceRequest | null>(null)

  const [
    isSubmittingRequest,
    setIsSubmittingRequest,
  ] = useState(false)

  const [
    mechanicRequestError,
    setMechanicRequestError,
  ] = useState<string | null>(null)

  const submitMechanicRequest = useCallback(
    async (
      input: SubmitMechanicRequestInput
    ): Promise<MechanicServiceRequest | null> => {
      try {
        setIsSubmittingRequest(true)
        setMechanicRequestError(null)

        const request =
          await createMechanicRequest(input)

        setMechanicRequest(request)

        return request
      } catch {
        setMechanicRequest(null)

        setMechanicRequestError(
          'Unable to submit the mechanic request.'
        )

        return null
      } finally {
        setIsSubmittingRequest(false)
      }
    },
    []
  )

  const resetMechanicRequest = useCallback(() => {
    setMechanicRequest(null)
    setMechanicRequestError(null)
  }, [])

  return {
    mechanicRequest,
    isSubmittingRequest,
    mechanicRequestError,
    submitMechanicRequest,
    resetMechanicRequest,
  }
}