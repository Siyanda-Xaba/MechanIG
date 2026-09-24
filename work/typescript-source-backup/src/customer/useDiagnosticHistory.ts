import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { useVehicle } from '../vehicles/VehicleContext'
import { getDiagnosticHistory } from './diagnosticHistoryService'
import { DiagnosticScan } from './diagnosticsTypes'

export function useDiagnosticHistory() {
  const { selectedVehicle } = useVehicle()

  const [diagnosticHistory, setDiagnosticHistory] =
    useState<DiagnosticScan[]>([])

  const [
    isLoadingDiagnosticHistory,
    setIsLoadingDiagnosticHistory,
  ] = useState(false)

  const [
    diagnosticHistoryError,
    setDiagnosticHistoryError,
  ] = useState<string | null>(null)

  const refreshDiagnosticHistory = useCallback(
    async () => {
      if (!selectedVehicle) {
        setDiagnosticHistory([])
        setDiagnosticHistoryError(null)
        return
      }

      try {
        setIsLoadingDiagnosticHistory(true)
        setDiagnosticHistoryError(null)

        const history = await getDiagnosticHistory(
          selectedVehicle.id
        )

        setDiagnosticHistory(history)
      } catch {
        setDiagnosticHistory([])
        setDiagnosticHistoryError(
          'Unable to load diagnostic history.'
        )
      } finally {
        setIsLoadingDiagnosticHistory(false)
      }
    },
    [selectedVehicle]
  )

  useEffect(() => {
    void refreshDiagnosticHistory()
  }, [refreshDiagnosticHistory])

  return {
    diagnosticHistory,
    isLoadingDiagnosticHistory,
    diagnosticHistoryError,
    refreshDiagnosticHistory,
  }
}