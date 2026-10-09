import {
  useCallback,
  useState,
} from 'react'

import {
  createWorkshopBooking,
} from './workshopBookingService'

export function useWorkshopBooking() {
  const [
    workshopBooking,
    setWorkshopBooking,
  ] = useState(null)

  const [
    isSubmittingBooking,
    setIsSubmittingBooking,
  ] = useState(false)

  const [
    workshopBookingError,
    setWorkshopBookingError,
  ] = useState(null)

  const submitWorkshopBooking =
    useCallback(async (input) => {
      try {
        setIsSubmittingBooking(true)
        setWorkshopBookingError(null)

        const booking =
          await createWorkshopBooking(input)

        // Only a successfully persisted booking
        // returned by the authoritative backend
        // should reach this success state.

        setWorkshopBooking(booking)

        return booking
      } catch (error) {
        setWorkshopBooking(null)

        setWorkshopBookingError(
          error instanceof Error
            ? error.message
            : 'Unable to submit the workshop booking.'
        )

        return null
      } finally {
        setIsSubmittingBooking(false)
      }
    }, [])

  const resetWorkshopBooking =
    useCallback(() => {
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