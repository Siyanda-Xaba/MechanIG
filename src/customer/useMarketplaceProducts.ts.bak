import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { getMarketplaceProducts } from './marketplaceService'
import type { MarketplaceProduct } from './marketplaceTypes'

type MarketplaceProductsState = {
  products: MarketplaceProduct[]

  isLoadingProducts: boolean

  productsError: string | null

  refreshProducts: () => Promise<void>
}

export function useMarketplaceProducts(
  vehicleId: string | undefined
): MarketplaceProductsState {
  const [
    products,
    setProducts,
  ] = useState<MarketplaceProduct[]>([])

  const [
    isLoadingProducts,
    setIsLoadingProducts,
  ] = useState(false)

  const [
    productsError,
    setProductsError,
  ] = useState<string | null>(null)

  const refreshProducts =
    useCallback(async () => {
      if (!vehicleId) {
        setProducts([])
        setProductsError(
          'Select a vehicle to view compatible Marketplace products.'
        )
        return
      }

      try {
        setIsLoadingProducts(true)
        setProductsError(null)

        const result =
          await getMarketplaceProducts(
            vehicleId
          )

        setProducts(result)
      } catch (error) {
        setProducts([])

        setProductsError(
          error instanceof Error
            ? error.message
            : 'Unable to load Marketplace products.'
        )
      } finally {
        setIsLoadingProducts(false)
      }
    }, [vehicleId])

  useEffect(() => {
    refreshProducts()
  }, [refreshProducts])

  return {
    products,
    isLoadingProducts,
    productsError,
    refreshProducts,
  }
}