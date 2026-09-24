import { DiagnosticScan } from './diagnosticsTypes'

const developmentDiagnosticHistory: Record<
  string,
  DiagnosticScan[]
> = {
  'vehicle-001': [
    {
      id: 'scan-001',
      resultId: 'result-001',
      title: 'Diagnostics Scan',
      description: 'All systems normal',
      scannedAt: 'Today, 08:31',
      status: 'No Issues',
      severity: 'normal',
    },
    {
      id: 'scan-002',
      resultId: 'result-002',
      title: 'Brake Noise Check',
      description: 'Review needed',
      scannedAt: 'Yesterday, 17:45',
      status: 'Review',
      severity: 'warning',
    },
  ],
}

export async function getDiagnosticHistory(
  vehicleId: string
): Promise<DiagnosticScan[]> {
  // Later this will call the MechanIQ backend
  // and return the complete diagnostic history
  // for the selected vehicle.
  //
  // Only diagnostics that have real related
  // result identifiers should navigate to a
  // diagnostic result screen.

  return developmentDiagnosticHistory[vehicleId] ?? []
}