import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useUser } from '../users/UserContext'
import {
  getMechanicAvailability,
  MECHANIC_AVAILABILITY_SERVICE_ERRORS,
  updateMechanicAvailability,
} from './availabilityService'

const MechanicAvailabilityContext =
  createContext(undefined)

export function MechanicAvailabilityProvider({
  children,
}) {
  const { user } = useUser()

  const [
    availabilityData,
    setAvailabilityData,
  ] = useState(null)

  const [
    isLoadingAvailability,
    setIsLoadingAvailability,
  ] = useState(false)

  const [
    availabilityError,
    setAvailabilityError,
  ] = useState(null)

  const [
    isSavingAvailability,
    setIsSavingAvailability,
  ] = useState(false)

  const [
    availabilitySaveError,
    setAvailabilitySaveError,
  ] = useState(null)

  const refreshAvailability =
    useCallback(async () => {
      if (!user) {
        setAvailabilityData(null)
        setAvailabilityError(null)
        setAvailabilitySaveError(null)
        return
      }

      try {
        setIsLoadingAvailability(true)
        setAvailabilityError(null)

        const data =
          await getMechanicAvailability(
            user.id
          )

        setAvailabilityData(data)
      } catch {
        setAvailabilityData(null)

        setAvailabilityError(
          'Unable to load mechanic availability.'
        )
      } finally {
        setIsLoadingAvailability(false)
      }
    }, [user])

  const saveAvailability =
    useCallback(
      async (input) => {
        if (!user) {
          setAvailabilitySaveError(
            'A mechanic account is required to update availability.'
          )

          return false
        }

        try {
          setIsSavingAvailability(true)
          setAvailabilitySaveError(null)

          const updatedAvailability =
            await updateMechanicAvailability(
              user.id,
              input
            )

          setAvailabilityData(
            updatedAvailability
          )

          return true
        } catch (error) {
          if (
            error?.code ===
            MECHANIC_AVAILABILITY_SERVICE_ERRORS
              .PERSISTENCE_NOT_CONNECTED
          ) {
            setAvailabilitySaveError(
              'Availability changes cannot be saved until the mechanic availability backend is connected.'
            )
          } else {
            setAvailabilitySaveError(
              'Unable to save mechanic availability.'
            )
          }

          return false
        } finally {
          setIsSavingAvailability(false)
        }
      },
      [user]
    )

  const clearAvailabilitySaveError =
    useCallback(() => {
      setAvailabilitySaveError(null)
    }, [])

  useEffect(() => {
    refreshAvailability()
  }, [refreshAvailability])

  return (
    <MechanicAvailabilityContext.Provider
      value={{
        availabilityData,
        isLoadingAvailability,
        availabilityError,
        refreshAvailability,

        isSavingAvailability,
        availabilitySaveError,
        saveAvailability,
        clearAvailabilitySaveError,
      }}
    >
      {children}
    </MechanicAvailabilityContext.Provider>
  )
}

export function useMechanicAvailability() {
  const context =
    useContext(
      MechanicAvailabilityContext
    )

  if (!context) {
    throw new Error(
      'useMechanicAvailability must be used inside MechanicAvailabilityProvider'
    )
  }

  return context
}