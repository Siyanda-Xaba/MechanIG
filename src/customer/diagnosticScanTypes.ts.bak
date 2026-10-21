export type DiagnosticScanSource =
  | 'obd'

export type DiagnosticScanStartStatus =
  | 'ready'
  | 'obd-not-connected'
  | 'obd-unsupported'
  | 'unavailable'

export type DiagnosticScanRequest = {
  vehicleId: string
  source: DiagnosticScanSource
}

export type DiagnosticScanStartResult = {
  status: DiagnosticScanStartStatus

  resultId: string | null

  message: string
}