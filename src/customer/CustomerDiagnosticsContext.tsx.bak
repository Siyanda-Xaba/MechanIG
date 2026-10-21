import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useVehicle } from '../vehicles/VehicleContext'
import { CustomerDiagnosticsData } from './diagnosticsTypes'
import { getCustomerDiagnosticsData } from './diagnosticsService'

type CustomerDiagnosticsContextType = {
  diagnosticsData: CustomerDiagnosticsData | null
  isLoadingDiagnostics: boolean
  diagnosticsError: string | null
  refreshDiagnostics: () => Promise<void>
}

const CustomerDiagnosticsContext =
  createContext<CustomerDiagnosticsContextType | undefined>(undefined)

export function CustomerDiagnosticsProvider({
  children,
}: {
  children: ReactNode
}) {
  const { selectedVehicle } = useVehicle()

  const [diagnosticsData, setDiagnosticsData] =
    useState<CustomerDiagnosticsData | null>(null)

  const [isLoadingDiagnostics, setIsLoadingDiagnostics] =
    useState(false)

  const [diagnosticsError, setDiagnosticsError] =
    useState<string | null>(null)

  const refreshDiagnostics = useCallback(async () => {
    if (!selectedVehicle) {
      setDiagnosticsData(null)
      setDiagnosticsError(null)
      return
    }

    try {
      setIsLoadingDiagnostics(true)
      setDiagnosticsError(null)

      const data = await getCustomerDiagnosticsData(
        selectedVehicle.id
      )

      setDiagnosticsData(data)
    } catch {
      setDiagnosticsData(null)
      setDiagnosticsError(
        'Unable to load diagnostic information.'
      )
    } finally {
      setIsLoadingDiagnostics(false)
    }
  }, [selectedVehicle])

  useEffect(() => {
    refreshDiagnostics()
  }, [refreshDiagnostics])

  return (
    <CustomerDiagnosticsContext.Provider
      value={{
        diagnosticsData,
        isLoadingDiagnostics,
        diagnosticsError,
        refreshDiagnostics,
      }}
    >
      {children}
    </CustomerDiagnosticsContext.Provider>
  )
}

export function useCustomerDiagnostics() {
  const context = useContext(CustomerDiagnosticsContext)

  if (!context) {
    throw new Error(
      'useCustomerDiagnostics must be used inside CustomerDiagnosticsProvider'
    )
  }

  return context
}