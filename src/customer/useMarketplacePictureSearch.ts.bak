import {
  useCallback,
  useState,
} from 'react'

import {
  checkMarketplacePartCompatibility,
  recognizeMarketplacePart,
} from './marketplaceService'
import type {
  MarketplaceCompatibilityResult,
  MarketplacePartRecognitionResult,
  MarketplacePictureSelection,
} from './marketplaceTypes'

type MarketplacePictureSearchState = {
  recognitionResult:
    | MarketplacePartRecognitionResult
    | null

  compatibilityResult:
    | MarketplaceCompatibilityResult
    | null

  isRecognizingPart: boolean

  isCheckingCompatibility: boolean

  recognitionError: string | null

  compatibilityError: string | null

  recognizePicture: (
    picture: MarketplacePictureSelection
  ) => Promise<MarketplacePartRecognitionResult | null>

  confirmPartAndCheckCompatibility: (
    vehicleId: string,
    confirmedPartName: string
  ) => Promise<MarketplaceCompatibilityResult | null>

  clearRecognitionResult: () => void

  clearCompatibilityResult: () => void

  resetPictureSearch: () => void
}

export function useMarketplacePictureSearch(): MarketplacePictureSearchState {
  const [
    recognitionResult,
    setRecognitionResult,
  ] =
    useState<MarketplacePartRecognitionResult | null>(
      null
    )

  const [
    compatibilityResult,
    setCompatibilityResult,
  ] =
    useState<MarketplaceCompatibilityResult | null>(
      null
    )

  const [
    isRecognizingPart,
    setIsRecognizingPart,
  ] = useState(false)

  const [
    isCheckingCompatibility,
    setIsCheckingCompatibility,
  ] = useState(false)

  const [
    recognitionError,
    setRecognitionError,
  ] = useState<string | null>(null)

  const [
    compatibilityError,
    setCompatibilityError,
  ] = useState<string | null>(null)

  const recognizePicture =
    useCallback(
      async (
        picture: MarketplacePictureSelection
      ) => {
        try {
          setIsRecognizingPart(true)

          setRecognitionError(null)

          setCompatibilityResult(null)

          setCompatibilityError(null)

          const result =
            await recognizeMarketplacePart(
              picture
            )

          setRecognitionResult(result)

          return result
        } catch (error) {
          setRecognitionResult(null)

          setRecognitionError(
            error instanceof Error
              ? error.message
              : 'Unable to identify the vehicle part.'
          )

          return null
        } finally {
          setIsRecognizingPart(false)
        }
      },
      []
    )

  const confirmPartAndCheckCompatibility =
    useCallback(
      async (
        vehicleId: string,
        confirmedPartName: string
      ) => {
        if (!recognitionResult) {
          setCompatibilityResult(null)

          setCompatibilityError(
            'Identify a part before checking vehicle compatibility.'
          )

          return null
        }

        const normalizedPartName =
          confirmedPartName.trim()

        if (
          normalizedPartName.length === 0
        ) {
          setCompatibilityResult(null)

          setCompatibilityError(
            'Confirm the identified part name before checking compatibility.'
          )

          return null
        }

        try {
          setIsCheckingCompatibility(
            true
          )

          setCompatibilityError(null)

          const result =
            await checkMarketplacePartCompatibility(
              {
                vehicleId,

                recognitionId:
                  recognitionResult.recognitionId,

                confirmedPartName:
                  normalizedPartName,

                confirmedCategory:
                  recognitionResult.suggestedCategory,
              }
            )

          setCompatibilityResult(
            result
          )

          return result
        } catch (error) {
          setCompatibilityResult(null)

          setCompatibilityError(
            error instanceof Error
              ? error.message
              : 'Unable to check vehicle compatibility.'
          )

          return null
        } finally {
          setIsCheckingCompatibility(
            false
          )
        }
      },
      [recognitionResult]
    )

  const clearRecognitionResult =
    useCallback(() => {
      setRecognitionResult(null)
      setRecognitionError(null)

      setCompatibilityResult(null)
      setCompatibilityError(null)
    }, [])

  const clearCompatibilityResult =
    useCallback(() => {
      setCompatibilityResult(null)
      setCompatibilityError(null)
    }, [])

  const resetPictureSearch =
    useCallback(() => {
      setRecognitionResult(null)
      setCompatibilityResult(null)

      setRecognitionError(null)
      setCompatibilityError(null)

      setIsRecognizingPart(false)
      setIsCheckingCompatibility(false)
    }, [])

  return {
    recognitionResult,
    compatibilityResult,

    isRecognizingPart,
    isCheckingCompatibility,

    recognitionError,
    compatibilityError,

    recognizePicture,
    confirmPartAndCheckCompatibility,

    clearRecognitionResult,
    clearCompatibilityResult,
    resetPictureSearch,
  }
}