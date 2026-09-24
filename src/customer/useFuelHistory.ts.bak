import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getFuelHistory,
} from './fuelService'
import type {
  FuelActivity,
} from './fuelTypes'

type FuelHistoryState = {
  history: FuelActivity[]

  isLoadingHistory: boolean

  historyError: string | null

  refreshHistory: () => Promise<void>
}

export function useFuelHistory(
  vehicleId: string | null
): FuelHistoryState {
  const [
    history,
    setHistory,
  ] = useState<FuelActivity[]>([])

  const [
    isLoadingHistory,
    setIsLoadingHistory,
  ] = useState(false)

  const [
    historyError,
    setHistoryError,
  ] = useState<string | null>(null)

  const refreshHistory =
    useCallback(async () => {
      if (!vehicleId) {
        setHistory([])
        setHistoryError(null)
        setIsLoadingHistory(false)
        return
      }

      try {
        setIsLoadingHistory(true)
        setHistoryError(null)

        const result =
          await getFuelHistory(
            vehicleId
          )

        setHistory(result)
      } catch (error) {
        setHistory([])

        setHistoryError(
          error instanceof Error
            ? error.message
            : 'Unable to load fuel history.'
        )
      } finally {
        setIsLoadingHistory(false)
      }
    }, [vehicleId])

  useEffect(() => {
    refreshHistory()
  }, [refreshHistory])

  return {
    history,
    isLoadingHistory,
    historyError,
    refreshHistory,
  }
}