import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { DiagnosticResult } from './diagnosticResultTypes'
import { getDiagnosticResult } from './diagnosticResultService'

type UseDiagnosticResultReturn = {
  diagnosticResult: DiagnosticResult | null
  isLoadingDiagnosticResult: boolean
  diagnosticResultError: string | null
  refreshDiagnosticResult: () => Promise<void>
}

export function useDiagnosticResult(
  resultId: string | undefined
): UseDiagnosticResultReturn {
  const [
    diagnosticResult,
    setDiagnosticResult,
  ] = useState<DiagnosticResult | null>(null)

  const [
    isLoadingDiagnosticResult,
    setIsLoadingDiagnosticResult,
  ] = useState(false)

  const [
    diagnosticResultError,
    setDiagnosticResultError,
  ] = useState<string | null>(null)

  const refreshDiagnosticResult = useCallback(async () => {
    if (!resultId) {
      setDiagnosticResult(null)
      setDiagnosticResultError(
        'No diagnostic result was selected.'
      )
      return
    }

    try {
      setIsLoadingDiagnosticResult(true)
      setDiagnosticResultError(null)

      const result = await getDiagnosticResult(resultId)

      if (!result) {
        setDiagnosticResult(null)
        setDiagnosticResultError(
          'Diagnostic result could not be found.'
        )
        return
      }

      setDiagnosticResult(result)
    } catch {
      setDiagnosticResult(null)
      setDiagnosticResultError(
        'Unable to load the diagnostic result.'
      )
    } finally {
      setIsLoadingDiagnosticResult(false)
    }
  }, [resultId])

  useEffect(() => {
    refreshDiagnosticResult()
  }, [refreshDiagnosticResult])

  return {
    diagnosticResult,
    isLoadingDiagnosticResult,
    diagnosticResultError,
    refreshDiagnosticResult,
  }
}