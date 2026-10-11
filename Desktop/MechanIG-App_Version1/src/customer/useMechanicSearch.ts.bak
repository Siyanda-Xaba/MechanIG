import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  MechanicSearchResult,
} from './mechanicTypes'

import {
  findMechanicsForDiagnostic,
} from './mechanicService'

type UseMechanicSearchReturn = {
  mechanicSearchResult: MechanicSearchResult | null
  isLoadingMechanics: boolean
  mechanicSearchError: string | null
  refreshMechanics: () => Promise<void>
}

export function useMechanicSearch(
  diagnosticResultId: string | undefined
): UseMechanicSearchReturn {
  const [
    mechanicSearchResult,
    setMechanicSearchResult,
  ] = useState<MechanicSearchResult | null>(null)

  const [
    isLoadingMechanics,
    setIsLoadingMechanics,
  ] = useState(false)

  const [
    mechanicSearchError,
    setMechanicSearchError,
  ] = useState<string | null>(null)

  const refreshMechanics = useCallback(async () => {
    if (!diagnosticResultId) {
      setMechanicSearchResult(null)
      setMechanicSearchError(
        'No diagnostic result was selected.'
      )
      return
    }

    try {
      setIsLoadingMechanics(true)
      setMechanicSearchError(null)

      const result =
        await findMechanicsForDiagnostic(
          diagnosticResultId
        )

      setMechanicSearchResult(result)
    } catch {
      setMechanicSearchResult(null)
      setMechanicSearchError(
        'Unable to load mechanic recommendations.'
      )
    } finally {
      setIsLoadingMechanics(false)
    }
  }, [diagnosticResultId])

  useEffect(() => {
    refreshMechanics()
  }, [refreshMechanics])

  return {
    mechanicSearchResult,
    isLoadingMechanics,
    mechanicSearchError,
    refreshMechanics,
  }
}