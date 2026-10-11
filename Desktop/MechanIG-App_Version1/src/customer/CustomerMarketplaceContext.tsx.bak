import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useVehicle } from '../vehicles/VehicleContext'
import { CustomerMarketplaceData } from './marketplaceTypes'
import { getCustomerMarketplaceData } from './marketplaceService'

type CustomerMarketplaceContextType = {
  marketplaceData: CustomerMarketplaceData | null
  isLoadingMarketplace: boolean
  marketplaceError: string | null
  refreshMarketplaceData: () => Promise<void>
}

const CustomerMarketplaceContext =
  createContext<CustomerMarketplaceContextType | undefined>(undefined)

export function CustomerMarketplaceProvider({
  children,
}: {
  children: ReactNode
}) {
  const { selectedVehicle } = useVehicle()

  const [marketplaceData, setMarketplaceData] =
    useState<CustomerMarketplaceData | null>(null)

  const [isLoadingMarketplace, setIsLoadingMarketplace] =
    useState(false)

  const [marketplaceError, setMarketplaceError] =
    useState<string | null>(null)

  const refreshMarketplaceData = useCallback(async () => {
    if (!selectedVehicle) {
      setMarketplaceData(null)
      setMarketplaceError(null)
      return
    }

    try {
      setIsLoadingMarketplace(true)
      setMarketplaceError(null)

      const data = await getCustomerMarketplaceData(
        selectedVehicle.id
      )

      setMarketplaceData(data)
    } catch {
      setMarketplaceData(null)
      setMarketplaceError(
        'Unable to load marketplace information.'
      )
    } finally {
      setIsLoadingMarketplace(false)
    }
  }, [selectedVehicle])

  useEffect(() => {
    refreshMarketplaceData()
  }, [refreshMarketplaceData])

  return (
    <CustomerMarketplaceContext.Provider
      value={{
        marketplaceData,
        isLoadingMarketplace,
        marketplaceError,
        refreshMarketplaceData,
      }}
    >
      {children}
    </CustomerMarketplaceContext.Provider>
  )
}

export function useCustomerMarketplace() {
  const context = useContext(CustomerMarketplaceContext)

  if (!context) {
    throw new Error(
      'useCustomerMarketplace must be used inside CustomerMarketplaceProvider'
    )
  }

  return context
}