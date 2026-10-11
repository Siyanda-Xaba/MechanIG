import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useVehicle } from '../vehicles/VehicleContext'
import { CustomerFuelData } from './fuelTypes'
import { getCustomerFuelData } from './fuelService'

type CustomerFuelContextType = {
  fuelData: CustomerFuelData | null
  isLoadingFuel: boolean
  fuelError: string | null
  refreshFuelData: () => Promise<void>
}

const CustomerFuelContext =
  createContext<CustomerFuelContextType | undefined>(undefined)

export function CustomerFuelProvider({
  children,
}: {
  children: ReactNode
}) {
  const { selectedVehicle } = useVehicle()

  const [fuelData, setFuelData] =
    useState<CustomerFuelData | null>(null)

  const [isLoadingFuel, setIsLoadingFuel] =
    useState(false)

  const [fuelError, setFuelError] =
    useState<string | null>(null)

  const refreshFuelData = useCallback(async () => {
    if (!selectedVehicle) {
      setFuelData(null)
      setFuelError(null)
      return
    }

    try {
      setIsLoadingFuel(true)
      setFuelError(null)

      const data = await getCustomerFuelData(
        selectedVehicle.id
      )

      setFuelData(data)
    } catch {
      setFuelData(null)
      setFuelError(
        'Unable to load fuel information.'
      )
    } finally {
      setIsLoadingFuel(false)
    }
  }, [selectedVehicle])

  useEffect(() => {
    refreshFuelData()
  }, [refreshFuelData])

  return (
    <CustomerFuelContext.Provider
      value={{
        fuelData,
        isLoadingFuel,
        fuelError,
        refreshFuelData,
      }}
    >
      {children}
    </CustomerFuelContext.Provider>
  )
}

export function useCustomerFuel() {
  const context = useContext(CustomerFuelContext)

  if (!context) {
    throw new Error(
      'useCustomerFuel must be used inside CustomerFuelProvider'
    )
  }

  return context
}