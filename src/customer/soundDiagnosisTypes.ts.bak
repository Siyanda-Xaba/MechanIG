export type SoundDiagnosisCaptureStatus =
  | 'idle'
  | 'requesting-permission'
  | 'recording'
  | 'recorded'

export type SoundDiagnosisRecording = {
  vehicleId: string
  uri: string
  durationMillis: number
  recordedAt: string
}

export type SoundDiagnosisAnalysisRequest = {
  vehicleId: string
  audioUri: string
  durationMillis: number
  recordedAt: string
}

export type SoundDiagnosisAnalysisStatus =
  | 'submitted'
  | 'unavailable'

export type SoundDiagnosisAnalysisResult = {
  status: SoundDiagnosisAnalysisStatus
  resultId: string | null
  message: string
}