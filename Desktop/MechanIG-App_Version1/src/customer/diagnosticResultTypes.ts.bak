export type DiagnosticResultSeverity =
  | 'normal'
  | 'warning'
  | 'critical'

export type DiagnosticRepairLevel =
  | 'diy'
  | 'mechanic-required'
  | 'monitor'

export type DiagnosticDataSource =
  | 'obd'
  | 'sound'
  | 'image'
  | 'symptom'
  | 'manual'

export type DiagnosticEvidence = {
  id: string
  label: string
  value: string
  source: DiagnosticDataSource
  verified: boolean
}

export type DiagnosticResult = {
  id: string
  vehicleId: string

  title: string
  summary: string

  severity: DiagnosticResultSeverity
  repairLevel: DiagnosticRepairLevel

  detectedAt: string

  diagnosticCode?: string | null

  evidence: DiagnosticEvidence[]

  possibleCauses: string[]

  recommendedAction: string

  canDrive: boolean | null
  diyEligible: boolean

  confidence: number | null
}