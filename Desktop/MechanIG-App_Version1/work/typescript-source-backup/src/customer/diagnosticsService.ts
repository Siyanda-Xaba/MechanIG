import {
  CustomerDiagnosticsData,
} from './diagnosticsTypes'

const developmentDiagnosticsData: CustomerDiagnosticsData = {
  summary: {
    lastScanAt: 'Today, 08:31',
    obdConnected: false,
  },

  commonSymptoms: [
    {
      id: 'symptom-001',
      label: 'Brake noise',
      icon: 'disc',
    },
    {
      id: 'symptom-002',
      label: 'Engine light',
      icon: 'engine',
    },
    {
      id: 'symptom-003',
      label: 'Vibration',
      icon: 'vibrate',
    },
    {
      id: 'symptom-004',
      label: 'Battery issue',
      icon: 'battery-alert',
    },
    {
      id: 'symptom-005',
      label: 'Overheating',
      icon: 'thermometer-alert',
    },
    {
      id: 'symptom-006',
      label: "Won't start",
      icon: 'car-key',
    },
  ],

  recentScans: [
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

export async function getCustomerDiagnosticsData(
  vehicleId: string
): Promise<CustomerDiagnosticsData> {
  // Later this will call the MechanIQ backend
  // using the selected vehicle ID.
  return developmentDiagnosticsData
}