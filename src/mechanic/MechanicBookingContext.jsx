import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

import {
  BOOKING_SERVICE_ERRORS,
  createBooking,
} from '../bookings/bookingService'

const MechanicBookingContext =
  createContext(undefined)

export function MechanicBookingProvider({
  children,
}) {
  const [
    createdBooking,
    setCreatedBooking,
  ] = useState(null)

  const [
    isCreatingBooking,
    setIsCreatingBooking,
  ] = useState(false)

  const [
    bookingError,
    setBookingError,
  ] = useState(null)

  const createMechanicBooking =
    useCallback(async (input) => {
      try {
        setIsCreatingBooking(true)
        setBookingError(null)

        const booking =
          await createBooking(input)

        setCreatedBooking(booking)

        return booking
      } catch (error) {
        setCreatedBooking(null)

        if (
          error?.code ===
          BOOKING_SERVICE_ERRORS
            .PERSISTENCE_NOT_CONNECTED
        ) {
          setBookingError(
            'Booking creation is not available until the MechanIQ booking backend is connected.'
          )
        } else {
          setBookingError(
            'Unable to create the booking.'
          )
        }

        return null
      } finally {
        setIsCreatingBooking(false)
      }
    }, [])

  const clearBookingError =
    useCallback(() => {
      setBookingError(null)
    }, [])

  const resetBooking =
    useCallback(() => {
      setCreatedBooking(null)
      setBookingError(null)
    }, [])

  return (
    <MechanicBookingContext.Provider
      value={{
        createdBooking,
        isCreatingBooking,
        bookingError,
        createMechanicBooking,
        clearBookingError,
        resetBooking,
      }}
    >
      {children}
    </MechanicBookingContext.Provider>
  )
}

export function useMechanicBooking() {
  const context =
    useContext(MechanicBookingContext)

  if (!context) {
    throw new Error(
      'useMechanicBooking must be used inside MechanicBookingProvider'
    )
  }

  return context
}