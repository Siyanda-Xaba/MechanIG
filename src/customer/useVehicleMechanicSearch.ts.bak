import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  findMechanicsForVehicle,
} from './mechanicService'
import {
  MechanicSearchResult,
} from './mechanicTypes'

type UseVehicleMechanicSearchReturn = {
  mechanicSearchResult: MechanicSearchResult | null
  isLoadingMechanics: boolean
  mechanicSearchError: string | null
  refreshMechanics: () => Promise<void>
}

export function useVehicleMechanicSearch(
  vehicleId?: string
): UseVehicleMechanicSearchReturn {
  const [
    mechanicSearchResult,
    setMechanicSearchResult,
  ] = useState<MechanicSearchResult | null>(null)

  const [
    isLoadingMechanics,
    setIsLoadingMechanics,
  ] = useState(false)

  const [
    mechanicSearchError,
    setMechanicSearchError,
  ] = useState<string | null>(null)

  const refreshMechanics = useCallback(async () => {
    if (!vehicleId) {
      setMechanicSearchResult(null)
      setMechanicSearchError(
        'No vehicle was selected.'
      )
      return
    }

    try {
      setIsLoadingMechanics(true)
      setMechanicSearchError(null)

      const result =
        await findMechanicsForVehicle(vehicleId)

      setMechanicSearchResult(result)
    } catch {
      setMechanicSearchResult(null)

      setMechanicSearchError(
        'Unable to find mechanics for your vehicle.'
      )
    } finally {
      setIsLoadingMechanics(false)
    }
  }, [vehicleId])

  useEffect(() => {
    refreshMechanics()
  }, [refreshMechanics])

  return {
    mechanicSearchResult,
    isLoadingMechanics,
    mechanicSearchError,
    refreshMechanics,
  }
}