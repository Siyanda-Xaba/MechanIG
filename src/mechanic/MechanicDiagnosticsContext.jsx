import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getMechanicDiagnosticsData,
} from './diagnosticsService'

const MechanicDiagnosticsContext =
  createContext(undefined)

export function MechanicDiagnosticsProvider({
  children,
}) {
  const [
    diagnosticsData,
    setDiagnosticsData,
  ] = useState(null)

  const [
    isLoadingDiagnostics,
    setIsLoadingDiagnostics,
  ] = useState(false)

  const [
    diagnosticsError,
    setDiagnosticsError,
  ] = useState(null)

  const refreshDiagnostics =
    useCallback(async () => {
      try {
        setIsLoadingDiagnostics(true)
        setDiagnosticsError(null)

        const data =
          await getMechanicDiagnosticsData()

        setDiagnosticsData(data)
      } catch {
        setDiagnosticsData(null)

        setDiagnosticsError(
          'Unable to load mechanic diagnostics.'
        )
      } finally {
        setIsLoadingDiagnostics(false)
      }
    }, [])

  useEffect(() => {
    refreshDiagnostics()
  }, [refreshDiagnostics])

  return (
    <MechanicDiagnosticsContext.Provider
      value={{
        diagnosticsData,
        isLoadingDiagnostics,
        diagnosticsError,
        refreshDiagnostics,
      }}
    >
      {children}
    </MechanicDiagnosticsContext.Provider>
  )
}

export function useMechanicDiagnostics() {
  const context =
    useContext(MechanicDiagnosticsContext)

  if (!context) {
    throw new Error(
      'useMechanicDiagnostics must be used inside MechanicDiagnosticsProvider'
    )
  }

  return context
}