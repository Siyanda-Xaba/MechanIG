import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { getMarketplaceActivity } from './marketplaceService'
import type { MarketplaceActivity } from './marketplaceTypes'

type MarketplaceActivityState = {
  activity: MarketplaceActivity[]

  isLoadingActivity: boolean

  activityError: string | null

  refreshActivity: () => Promise<void>
}

export function useMarketplaceActivity(
  vehicleId: string | undefined
): MarketplaceActivityState {
  const [
    activity,
    setActivity,
  ] = useState<MarketplaceActivity[]>([])

  const [
    isLoadingActivity,
    setIsLoadingActivity,
  ] = useState(false)

  const [
    activityError,
    setActivityError,
  ] = useState<string | null>(null)

  const refreshActivity =
    useCallback(async () => {
      if (!vehicleId) {
        setActivity([])
        setActivityError(
          'Select a vehicle to view Marketplace activity.'
        )
        return
      }

      try {
        setIsLoadingActivity(true)
        setActivityError(null)

        const result =
          await getMarketplaceActivity(
            vehicleId
          )

        setActivity(result)
      } catch (error) {
        setActivity([])

        setActivityError(
          error instanceof Error
            ? error.message
            : 'Unable to load Marketplace activity.'
        )
      } finally {
        setIsLoadingActivity(false)
      }
    }, [vehicleId])

  useEffect(() => {
    refreshActivity()
  }, [refreshActivity])

  return {
    activity,
    isLoadingActivity,
    activityError,
    refreshActivity,
  }
}