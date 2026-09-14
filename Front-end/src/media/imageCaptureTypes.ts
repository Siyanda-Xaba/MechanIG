export type ImageCaptureSource =
  | 'camera'
  | 'library'

export type CapturedImage = {
  uri: string
  source: ImageCaptureSource
  fileName: string | null
  mimeType: string | null
  width: number
  height: number
}

export type ImageCaptureResult =
  | {
      status: 'selected'
      image: CapturedImage
    }
  | {
      status: 'cancelled'
      image: null
    }
  | {
      status: 'permission-denied'
      image: null
      message: string
    }
  | {
      status: 'error'
      image: null
      message: string
    }