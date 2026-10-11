import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getSavedFuelLocations,
} from './fuelService'
import type {
  FuelSavedLocation,
} from './fuelTypes'

type SavedFuelLocationsState = {
  savedLocations: FuelSavedLocation[]

  isLoadingSavedLocations: boolean

  savedLocationsError: string | null

  refreshSavedLocations: () => Promise<void>
}

export function useSavedFuelLocations(): SavedFuelLocationsState {
  const [
    savedLocations,
    setSavedLocations,
  ] = useState<FuelSavedLocation[]>([])

  const [
    isLoadingSavedLocations,
    setIsLoadingSavedLocations,
  ] = useState(false)

  const [
    savedLocationsError,
    setSavedLocationsError,
  ] = useState<string | null>(null)

  const refreshSavedLocations =
    useCallback(async () => {
      try {
        setIsLoadingSavedLocations(true)
        setSavedLocationsError(null)

        const result =
          await getSavedFuelLocations()

        setSavedLocations(result)
      } catch (error) {
        setSavedLocations([])

        setSavedLocationsError(
          error instanceof Error
            ? error.message
            : 'Unable to load saved fuel locations.'
        )
      } finally {
        setIsLoadingSavedLocations(false)
      }
    }, [])

  useEffect(() => {
    refreshSavedLocations()
  }, [refreshSavedLocations])

  return {
    savedLocations,
    isLoadingSavedLocations,
    savedLocationsError,
    refreshSavedLocations,
  }
}