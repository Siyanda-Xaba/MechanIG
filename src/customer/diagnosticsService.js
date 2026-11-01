import { getDiagnosticHistory } from './diagnosticHistoryService';

const COMMON_SYMPTOMS = [
  { id: 'symptom-brake-noise', label: 'Brake noise', icon: 'disc' },
  { id: 'symptom-engine-light', label: 'Engine light', icon: 'engine' },
  { id: 'symptom-vibration', label: 'Vibration', icon: 'vibrate' },
  { id: 'symptom-battery', label: 'Battery issue', icon: 'battery-alert' },
  { id: 'symptom-overheating', label: 'Overheating', icon: 'thermometer-alert' },
  { id: 'symptom-starting', label: "Won't start", icon: 'car-key' },
];

export async function getCustomerDiagnosticsData(vehicle) {
  let recentScans = [];
  let lastScanAt = null;
  try {
    recentScans = await getDiagnosticHistory(vehicle);
    lastScanAt = recentScans[0]?.scannedAt ?? null;
  } catch {
    // Do not block the live diagnostic screen if saved history is unavailable.
    lastScanAt = 'Unavailable';
  }

  return {
    summary: { lastScanAt, obdConnected: false },
    commonSymptoms: COMMON_SYMPTOMS,
    recentScans,
  };
}
