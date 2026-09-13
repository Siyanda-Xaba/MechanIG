import {
  useCallback,
  useState,
} from 'react'

import { useVehicle } from '../vehicles/VehicleContext'
import {
  analyzeProblemDescription,
} from './problemDescriptionService'
import {
  ProblemDescriptionAnalysisResult,
} from './problemDescriptionTypes'

type UseProblemDescriptionReturn = {
  description: string
  analysisResult:
    ProblemDescriptionAnalysisResult | null
  isSubmittingDescription: boolean
  problemDescriptionError: string | null
  setDescription: (value: string) => void
  submitDescription: (
    descriptionOverride?: string
  ) => Promise<ProblemDescriptionAnalysisResult | null>
  clearDescription: () => void
  clearProblemDescriptionError: () => void
  clearAnalysisResult: () => void
}

export function useProblemDescription():
  UseProblemDescriptionReturn {
  const {
    selectedVehicle,
  } = useVehicle()

  const [
    description,
    setDescriptionState,
  ] = useState('')

  const [
    analysisResult,
    setAnalysisResult,
  ] =
    useState<ProblemDescriptionAnalysisResult | null>(
      null
    )

  const [
    isSubmittingDescription,
    setIsSubmittingDescription,
  ] = useState(false)

  const [
    problemDescriptionError,
    setProblemDescriptionError,
  ] = useState<string | null>(null)

  const setDescription =
    useCallback((value: string) => {
      setDescriptionState(value)
      setProblemDescriptionError(null)
      setAnalysisResult(null)
    }, [])

  const submitDescription =
    useCallback(
      async (
        descriptionOverride?: string
      ) => {
        if (!selectedVehicle) {
          setProblemDescriptionError(
            'Select a vehicle before describing a problem.'
          )

          return null
        }

        const descriptionToSubmit =
          descriptionOverride ??
          description

        const trimmedDescription =
          descriptionToSubmit.trim()

        if (!trimmedDescription) {
          setProblemDescriptionError(
            'Describe what you are noticing before submitting.'
          )

          return null
        }

        try {
          setIsSubmittingDescription(true)
          setProblemDescriptionError(null)
          setAnalysisResult(null)

          const result =
            await analyzeProblemDescription({
              vehicleId:
                selectedVehicle.id,
              description:
                trimmedDescription,
              submittedAt:
                new Date().toISOString(),
            })

          setAnalysisResult(result)

          return result
        } catch {
          setProblemDescriptionError(
            'Unable to submit your problem description.'
          )

          return null
        } finally {
          setIsSubmittingDescription(false)
        }
      },
      [
        description,
        selectedVehicle,
      ]
    )

  const clearDescription =
    useCallback(() => {
      setDescriptionState('')
      setProblemDescriptionError(null)
      setAnalysisResult(null)
    }, [])

  const clearProblemDescriptionError =
    useCallback(() => {
      setProblemDescriptionError(null)
    }, [])

  const clearAnalysisResult =
    useCallback(() => {
      setAnalysisResult(null)
    }, [])

  return {
    description,
    analysisResult,
    isSubmittingDescription,
    problemDescriptionError,
    setDescription,
    submitDescription,
    clearDescription,
    clearProblemDescriptionError,
    clearAnalysisResult,
  }
}