import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getFuelDeliveryTracking,
} from './fuelService'
import type {
  FuelDeliveryTracking,
} from './fuelTypes'

type FuelDeliveryTrackingState = {
  tracking: FuelDeliveryTracking | null

  isLoadingTracking: boolean

  trackingError: string | null

  refreshTracking: () => Promise<void>
}

export function useFuelDeliveryTracking(
  deliveryId: string | null
): FuelDeliveryTrackingState {
  const [
    tracking,
    setTracking,
  ] =
    useState<FuelDeliveryTracking | null>(
      null
    )

  const [
    isLoadingTracking,
    setIsLoadingTracking,
  ] = useState(false)

  const [
    trackingError,
    setTrackingError,
  ] = useState<string | null>(null)

  const refreshTracking =
    useCallback(async () => {
      if (!deliveryId) {
        setTracking(null)
        setTrackingError(null)
        setIsLoadingTracking(false)
        return
      }

      try {
        setIsLoadingTracking(true)
        setTrackingError(null)

        const result =
          await getFuelDeliveryTracking(
            deliveryId
          )

        setTracking(result)
      } catch (error) {
        setTracking(null)

        setTrackingError(
          error instanceof Error
            ? error.message
            : 'Unable to load fuel delivery tracking.'
        )
      } finally {
        setIsLoadingTracking(false)
      }
    }, [deliveryId])

  useEffect(() => {
    refreshTracking()
  }, [refreshTracking])

  return {
    tracking,
    isLoadingTracking,
    trackingError,
    refreshTracking,
  }
}