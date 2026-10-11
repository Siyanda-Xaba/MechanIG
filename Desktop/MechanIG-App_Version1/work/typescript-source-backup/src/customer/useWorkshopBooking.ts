import {
  useCallback,
  useState,
} from 'react'

import {
  CreateWorkshopBookingInput,
  WorkshopBooking,
} from './workshopBookingTypes'

import {
  createWorkshopBooking,
} from './workshopBookingService'

type UseWorkshopBookingReturn = {
  workshopBooking: WorkshopBooking | null
  isSubmittingBooking: boolean
  workshopBookingError: string | null

  submitWorkshopBooking: (
    input: CreateWorkshopBookingInput
  ) => Promise<WorkshopBooking | null>

  resetWorkshopBooking: () => void
}

export function useWorkshopBooking():
  UseWorkshopBookingReturn {
  const [
    workshopBooking,
    setWorkshopBooking,
  ] = useState<WorkshopBooking | null>(null)

  const [
    isSubmittingBooking,
    setIsSubmittingBooking,
  ] = useState(false)

  const [
    workshopBookingError,
    setWorkshopBookingError,
  ] = useState<string | null>(null)

  const submitWorkshopBooking = useCallback(
    async (
      input: CreateWorkshopBookingInput
    ): Promise<WorkshopBooking | null> => {
      try {
        setIsSubmittingBooking(true)
        setWorkshopBookingError(null)

        const booking =
          await createWorkshopBooking(input)

        setWorkshopBooking(booking)

        return booking
      } catch {
        setWorkshopBooking(null)

        setWorkshopBookingError(
          'Unable to submit the workshop booking.'
        )

        return null
      } finally {
        setIsSubmittingBooking(false)
      }
    },
    []
  )

  const resetWorkshopBooking = useCallback(() => {
    setWorkshopBooking(null)
    setWorkshopBookingError(null)
  }, [])

  return {
    workshopBooking,
    isSubmittingBooking,
    workshopBookingError,
    submitWorkshopBooking,
    resetWorkshopBooking,
  }
}