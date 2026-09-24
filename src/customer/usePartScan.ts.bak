import {
  useCallback,
  useState,
} from 'react'

import { CapturedImage } from '../media/imageCaptureTypes'
import { useVehicle } from '../vehicles/VehicleContext'
import { recognizeVehiclePart } from './partScanService'
import { PartScanResult } from './partScanTypes'

type UsePartScanReturn = {
  partScanResult: PartScanResult | null
  isRecognizingPart: boolean
  partScanError: string | null
  scanPart: (
    image: CapturedImage | null
  ) => Promise<PartScanResult | null>
  clearPartScanResult: () => void
  clearPartScanError: () => void
}

export function usePartScan():
  UsePartScanReturn {
  const {
    selectedVehicle,
  } = useVehicle()

  const [
    partScanResult,
    setPartScanResult,
  ] =
    useState<PartScanResult | null>(
      null
    )

  const [
    isRecognizingPart,
    setIsRecognizingPart,
  ] = useState(false)

  const [
    partScanError,
    setPartScanError,
  ] = useState<string | null>(null)

  const scanPart =
    useCallback(
      async (
        image: CapturedImage | null
      ) => {
        if (!selectedVehicle) {
          setPartScanError(
            'Select a vehicle before scanning a part.'
          )

          return null
        }

        if (!image) {
          setPartScanError(
            'Take or choose a photo before scanning a part.'
          )

          return null
        }

        try {
          setIsRecognizingPart(true)
          setPartScanError(null)
          setPartScanResult(null)

          const result =
            await recognizeVehiclePart({
              vehicleId:
                selectedVehicle.id,
              imageUri: image.uri,
              fileName:
                image.fileName,
              mimeType:
                image.mimeType,
            })

          setPartScanResult(result)

          return result
        } catch {
          setPartScanError(
            'Unable to submit the image for part recognition.'
          )

          return null
        } finally {
          setIsRecognizingPart(false)
        }
      },
      [selectedVehicle]
    )

  const clearPartScanResult =
    useCallback(() => {
      setPartScanResult(null)
    }, [])

  const clearPartScanError =
    useCallback(() => {
      setPartScanError(null)
    }, [])

  return {
    partScanResult,
    isRecognizingPart,
    partScanError,
    scanPart,
    clearPartScanResult,
    clearPartScanError,
  }
}