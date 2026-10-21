import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useVehicle } from '../vehicles/VehicleContext'
import { CustomerHomeData } from './homeTypes'
import { getCustomerHomeData } from './homeService'

type CustomerHomeContextType = {
  homeData: CustomerHomeData | null
  isLoadingHome: boolean
  homeError: string | null
  refreshHomeData: () => Promise<void>
}

const CustomerHomeContext =
  createContext<CustomerHomeContextType | undefined>(undefined)

export function CustomerHomeProvider({
  children,
}: {
  children: ReactNode
}) {
  const { selectedVehicle } = useVehicle()

  const [homeData, setHomeData] =
    useState<CustomerHomeData | null>(null)

  const [isLoadingHome, setIsLoadingHome] = useState(false)

  const [homeError, setHomeError] =
    useState<string | null>(null)

  const refreshHomeData = useCallback(async () => {
    if (!selectedVehicle) {
      setHomeData(null)
      setHomeError(null)
      return
    }

    try {
      setIsLoadingHome(true)
      setHomeError(null)

      const data = await getCustomerHomeData(
        selectedVehicle.id
      )

      setHomeData(data)
    } catch {
      setHomeData(null)

      setHomeError(
        'Unable to load vehicle information.'
      )
    } finally {
      setIsLoadingHome(false)
    }
  }, [selectedVehicle])

  useEffect(() => {
    refreshHomeData()
  }, [refreshHomeData])

  return (
    <CustomerHomeContext.Provider
      value={{
        homeData,
        isLoadingHome,
        homeError,
        refreshHomeData,
      }}
    >
      {children}
    </CustomerHomeContext.Provider>
  )
}

export function useCustomerHome() {
  const context = useContext(CustomerHomeContext)

  if (!context) {
    throw new Error(
      'useCustomerHome must be used inside CustomerHomeProvider'
    )
  }

  return context
}