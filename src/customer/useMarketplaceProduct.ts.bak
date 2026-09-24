import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { getMarketplaceProductById } from './marketplaceService'
import type { MarketplaceProduct } from './marketplaceTypes'

type MarketplaceProductState = {
  product: MarketplaceProduct | null

  isLoadingProduct: boolean

  productError: string | null

  refreshProduct: () => Promise<void>
}

export function useMarketplaceProduct(
  productId: string | undefined,
  vehicleId: string | undefined
): MarketplaceProductState {
  const [
    product,
    setProduct,
  ] = useState<MarketplaceProduct | null>(
    null
  )

  const [
    isLoadingProduct,
    setIsLoadingProduct,
  ] = useState(false)

  const [
    productError,
    setProductError,
  ] = useState<string | null>(null)

  const refreshProduct =
    useCallback(async () => {
      if (!productId) {
        setProduct(null)
        setProductError(
          'No marketplace product was selected.'
        )
        return
      }

      if (!vehicleId) {
        setProduct(null)
        setProductError(
          'Select a vehicle to view product compatibility.'
        )
        return
      }

      try {
        setIsLoadingProduct(true)
        setProductError(null)

        const result =
          await getMarketplaceProductById(
            productId,
            vehicleId
          )

        if (!result) {
          setProduct(null)
          setProductError(
            'Marketplace product not found.'
          )
          return
        }

        setProduct(result)
      } catch (error) {
        setProduct(null)

        setProductError(
          error instanceof Error
            ? error.message
            : 'Unable to load marketplace product.'
        )
      } finally {
        setIsLoadingProduct(false)
      }
    }, [productId, vehicleId])

  useEffect(() => {
    refreshProduct()
  }, [refreshProduct])

  return {
    product,
    isLoadingProduct,
    productError,
    refreshProduct,
  }
}