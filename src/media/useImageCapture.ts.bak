import {
  useCallback,
  useState,
} from 'react'

import {
  captureImageFromCamera,
  selectImageFromLibrary,
} from './imageCaptureService'
import {
  CapturedImage,
  ImageCaptureSource,
} from './imageCaptureTypes'

type UseImageCaptureReturn = {
  image: CapturedImage | null
  isSelectingImage: boolean
  imageCaptureError: string | null
  selectImage: (
    source: ImageCaptureSource
  ) => Promise<CapturedImage | null>
  clearImage: () => void
  clearImageCaptureError: () => void
}

export function useImageCapture():
  UseImageCaptureReturn {
  const [
    image,
    setImage,
  ] = useState<CapturedImage | null>(
    null
  )

  const [
    isSelectingImage,
    setIsSelectingImage,
  ] = useState(false)

  const [
    imageCaptureError,
    setImageCaptureError,
  ] = useState<string | null>(null)

  const selectImage =
    useCallback(
      async (
        source: ImageCaptureSource
      ) => {
        try {
          setIsSelectingImage(true)
          setImageCaptureError(null)

          const result =
            source === 'camera'
              ? await captureImageFromCamera()
              : await selectImageFromLibrary()

          if (
            result.status ===
            'selected'
          ) {
            setImage(result.image)

            return result.image
          }

          if (
            result.status ===
              'permission-denied' ||
            result.status === 'error'
          ) {
            setImageCaptureError(
              result.message
            )
          }

          return null
        } catch {
          setImageCaptureError(
            'Unable to select an image.'
          )

          return null
        } finally {
          setIsSelectingImage(false)
        }
      },
      []
    )

  const clearImage =
    useCallback(() => {
      setImage(null)
      setImageCaptureError(null)
    }, [])

  const clearImageCaptureError =
    useCallback(() => {
      setImageCaptureError(null)
    }, [])

  return {
    image,
    isSelectingImage,
    imageCaptureError,
    selectImage,
    clearImage,
    clearImageCaptureError,
  }
}