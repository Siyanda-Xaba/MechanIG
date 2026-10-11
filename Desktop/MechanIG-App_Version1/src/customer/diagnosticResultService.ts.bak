import {
  DiagnosticResult,
} from './diagnosticResultTypes'

const developmentDiagnosticResults: DiagnosticResult[] = [
  {
    id: 'result-001',
    vehicleId: 'vehicle-001',

    title: 'Vehicle Systems Normal',

    summary:
      'No immediate issues were detected during the latest diagnostic scan.',

    severity: 'normal',
    repairLevel: 'monitor',

    detectedAt: 'Today, 08:31',

    diagnosticCode: null,

    evidence: [
      {
        id: 'evidence-001',
        label: 'Diagnostic scan',
        value: 'No active issues detected',
        source: 'obd',
        verified: true,
      },
    ],

    possibleCauses: [],

    recommendedAction:
      'Continue normal vehicle use and follow your scheduled maintenance plan.',

    canDrive: true,
    diyEligible: false,

    confidence: null,
  },

  {
    id: 'result-002',
    vehicleId: 'vehicle-001',

    title: 'Brake Noise Requires Review',

    summary:
      'A brake-related symptom has been reported and should be inspected before a repair recommendation is made.',

    severity: 'warning',
    repairLevel: 'mechanic-required',

    detectedAt: 'Yesterday, 17:45',

    diagnosticCode: null,

    evidence: [
      {
        id: 'evidence-002',
        label: 'Reported symptom',
        value: 'Brake noise',
        source: 'symptom',
        verified: false,
      },
    ],

    possibleCauses: [
      'Worn brake pads',
      'Brake disc wear',
      'Debris around braking components',
    ],

    recommendedAction:
      'Have the braking system inspected by a qualified mechanic before replacing any components.',

    canDrive: null,
    diyEligible: false,

    confidence: null,
  },
]

export async function getDiagnosticResult(
  resultId: string
): Promise<DiagnosticResult | null> {
  // Later this will call the MechanIQ backend.
  // The backend will return validated diagnostic evidence
  // and any AI-generated interpretation separately.

  return (
    developmentDiagnosticResults.find(
      (result) => result.id === resultId
    ) ?? null
  )
}