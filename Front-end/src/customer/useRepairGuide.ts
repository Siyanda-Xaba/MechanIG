import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { RepairGuide } from './repairGuideTypes'
import { getRepairGuideByDiagnosticResult } from './repairGuideService'

type UseRepairGuideReturn = {
  repairGuide: RepairGuide | null
  isLoadingRepairGuide: boolean
  repairGuideError: string | null
  refreshRepairGuide: () => Promise<void>
}

export function useRepairGuide(
  diagnosticResultId: string | undefined
): UseRepairGuideReturn {
  const [
    repairGuide,
    setRepairGuide,
  ] = useState<RepairGuide | null>(null)

  const [
    isLoadingRepairGuide,
    setIsLoadingRepairGuide,
  ] = useState(false)

  const [
    repairGuideError,
    setRepairGuideError,
  ] = useState<string | null>(null)

  const refreshRepairGuide = useCallback(async () => {
    if (!diagnosticResultId) {
      setRepairGuide(null)
      setRepairGuideError(
        'No diagnostic result was selected.'
      )
      return
    }

    try {
      setIsLoadingRepairGuide(true)
      setRepairGuideError(null)

      const guide =
        await getRepairGuideByDiagnosticResult(
          diagnosticResultId
        )

      setRepairGuide(guide)
    } catch {
      setRepairGuide(null)
      setRepairGuideError(
        'Unable to load the repair guide.'
      )
    } finally {
      setIsLoadingRepairGuide(false)
    }
  }, [diagnosticResultId])

  useEffect(() => {
    refreshRepairGuide()
  }, [refreshRepairGuide])

  return {
    repairGuide,
    isLoadingRepairGuide,
    repairGuideError,
    refreshRepairGuide,
  }
}