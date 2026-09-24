import {
  useCallback,
  useState,
} from 'react'

import {
  createFuelDeliveryRequest,
} from './fuelService'
import type {
  FuelDeliveryRequestInput,
  FuelDeliveryRequestResult,
} from './fuelTypes'

type FuelDeliveryRequestState = {
  isSubmittingRequest: boolean

  requestError: string | null

  submitFuelRequest: (
    input: FuelDeliveryRequestInput
  ) => Promise<FuelDeliveryRequestResult | null>

  clearRequestError: () => void
}

export function useFuelDeliveryRequest(): FuelDeliveryRequestState {
  const [
    isSubmittingRequest,
    setIsSubmittingRequest,
  ] = useState(false)

  const [
    requestError,
    setRequestError,
  ] = useState<string | null>(null)

  const clearRequestError =
    useCallback(() => {
      setRequestError(null)
    }, [])

  const submitFuelRequest =
    useCallback(
      async (
        input: FuelDeliveryRequestInput
      ) => {
        try {
          setIsSubmittingRequest(true)
          setRequestError(null)

          const result =
            await createFuelDeliveryRequest(
              input
            )

          return result
        } catch (error) {
          setRequestError(
            error instanceof Error
              ? error.message
              : 'Unable to submit the fuel delivery request.'
          )

          return null
        } finally {
          setIsSubmittingRequest(false)
        }
      },
      []
    )

  return {
    isSubmittingRequest,
    requestError,
    submitFuelRequest,
    clearRequestError,
  }
}