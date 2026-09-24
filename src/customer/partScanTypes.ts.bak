export type PartScanRecognitionStatus =
  | 'identified'
  | 'uncertain'
  | 'unavailable'

export type PartScanRequest = {
  vehicleId: string
  imageUri: string
  fileName: string | null
  mimeType: string | null
}

export type PartScanRecognition = {
  partName: string
  confidence: number
}

export type PartScanResult = {
  status: PartScanRecognitionStatus
  recognition: PartScanRecognition | null
  message: string
}