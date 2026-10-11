import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { getMarketplaceStores } from './marketplaceService'
import type { MarketplaceStore } from './marketplaceTypes'

type MarketplaceStoresState = {
  stores: MarketplaceStore[]

  isLoadingStores: boolean

  storesError: string | null

  refreshStores: () => Promise<void>
}

export function useMarketplaceStores(): MarketplaceStoresState {
  const [
    stores,
    setStores,
  ] = useState<MarketplaceStore[]>([])

  const [
    isLoadingStores,
    setIsLoadingStores,
  ] = useState(false)

  const [
    storesError,
    setStoresError,
  ] = useState<string | null>(null)

  const refreshStores =
    useCallback(async () => {
      try {
        setIsLoadingStores(true)
        setStoresError(null)

        const result =
          await getMarketplaceStores()

        setStores(result)
      } catch (error) {
        setStores([])

        setStoresError(
          error instanceof Error
            ? error.message
            : 'Unable to load nearby marketplace stores.'
        )
      } finally {
        setIsLoadingStores(false)
      }
    }, [])

  useEffect(() => {
    refreshStores()
  }, [refreshStores])

  return {
    stores,
    isLoadingStores,
    storesError,
    refreshStores,
  }
}