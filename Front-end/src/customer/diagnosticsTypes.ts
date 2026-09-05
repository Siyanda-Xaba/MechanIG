export type DiagnosticSeverity =
  | 'normal'
  | 'warning'
  | 'critical'

export type DiagnosticStatus =
  | 'No Issues'
  | 'Review'
  | 'Attention Required'

export type DiagnosticScan = {
  id: string
  resultId: string | null
  title: string
  description: string
  scannedAt: string
  status: DiagnosticStatus
  severity: DiagnosticSeverity
}

export type DiagnosticSymptom = {
  id: string
  label: string
  icon: string
}

export type VehicleDiagnosticSummary = {
  lastScanAt: string | null
  obdConnected: boolean
}

export type CustomerDiagnosticsData = {
  summary: VehicleDiagnosticSummary
  commonSymptoms: DiagnosticSymptom[]
  recentScans: DiagnosticScan[]
}