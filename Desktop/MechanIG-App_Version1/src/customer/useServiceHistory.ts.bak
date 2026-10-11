import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getCustomerServiceHistory,
} from './serviceHistoryService'
import type {
  CustomerServiceHistoryRecord,
} from './serviceHistoryTypes'

type CustomerServiceHistoryState = {
  records: CustomerServiceHistoryRecord[]

  isLoadingServiceHistory: boolean

  serviceHistoryError: string | null

  refreshServiceHistory: () => Promise<void>
}

export function useServiceHistory(
  customerId: string | null,
  vehicleId?: string | null
): CustomerServiceHistoryState {
  const [
    records,
    setRecords,
  ] = useState<
    CustomerServiceHistoryRecord[]
  >([])

  const [
    isLoadingServiceHistory,
    setIsLoadingServiceHistory,
  ] = useState(false)

  const [
    serviceHistoryError,
    setServiceHistoryError,
  ] = useState<string | null>(null)

  const refreshServiceHistory =
    useCallback(async () => {
      if (!customerId) {
        setRecords([])
        setServiceHistoryError(null)
        setIsLoadingServiceHistory(false)
        return
      }

      try {
        setIsLoadingServiceHistory(true)
        setServiceHistoryError(null)

        const result =
          await getCustomerServiceHistory(
            customerId,
            vehicleId
          )

        setRecords(result.records)
      } catch (error) {
        setRecords([])

        setServiceHistoryError(
          error instanceof Error
            ? error.message
            : 'Unable to load service history.'
        )
      } finally {
        setIsLoadingServiceHistory(false)
      }
    }, [
      customerId,
      vehicleId,
    ])

  useEffect(() => {
    refreshServiceHistory()
  }, [refreshServiceHistory])

  return {
    records,
    isLoadingServiceHistory,
    serviceHistoryError,
    refreshServiceHistory,
  }
}