import { deleteSavedObdScan, getSavedObdScanHistory } from './obdApiService';

function displayDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
}

export async function getDiagnosticHistory(vehicle) {
  const scans = await getSavedObdScanHistory(vehicle);
  return (Array.isArray(scans) ? scans : []).map((scan) => {
    const codes = Array.isArray(scan.problemCodes) ? scan.problemCodes : [];
    const hasProblems = codes.length > 0;
    const highestSeverity = scan.summary?.highestSeverity;
    const severity = highestSeverity === 'urgent'
      ? 'critical'
      : highestSeverity === 'warning'
        ? 'warning'
        : 'normal';

    return {
      id: scan.id,
      resultId: scan.id,
      title: 'OBD diagnostic scan',
      description: hasProblems
        ? `Trouble codes: ${codes.join(', ')}`
        : 'No diagnostic trouble codes were reported.',
      scannedAt: displayDate(scan.scannedAt),
      status: hasProblems ? 'Review' : 'No trouble codes',
      severity,
    };
  });
}

export async function deleteDiagnosticHistoryEntry(scanId) {
  return deleteSavedObdScan(scanId);
}
