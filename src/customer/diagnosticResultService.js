import { getSavedObdScan } from './obdApiService';

export async function getDiagnosticResult(resultId) {
    const scan = await getSavedObdScan(resultId);
    const interpretation = scan.interpretation;
    const problems = interpretation.problems || [];
    const readings = interpretation.readings || [];
    const firstProblem = problems[0];
    const scannedAt = interpretation.scannedAt || scan.createdAt;
    const severity = interpretation.summary.highestSeverity === 'urgent'
        ? 'critical'
        : interpretation.summary.highestSeverity === 'warning'
            ? 'warning'
            : 'normal';
    const evidence = problems.map((problem, index) => ({
        id: `dtc-${index}-${problem.code}`,
        label: `Trouble code ${problem.code}`,
        value: `${problem.title}. ${problem.summary}`,
        source: 'obd',
        verified: true,
    }));
    readings.forEach((reading, index) => evidence.push({
        id: `reading-${index}-${reading.pid}`,
        label: reading.name,
    value: reading.supported === false
        ? 'Not provided by this vehicle'
        : reading.value == null ? reading.rawResponse : `${reading.value} ${reading.unit}`,
        source: 'obd',
    verified: reading.supported !== false,
    }));
    return {
        id: scan.id,
        vehicleId: scan.vehicleId,
        title: firstProblem?.title || 'OBD scan complete',
        summary: problems.length
            ? `${problems.length} trouble code${problems.length === 1 ? '' : 's'} found. ${firstProblem.summary}`
            : 'No diagnostic trouble codes were reported. Live data was read from the vehicle ECU.',
        severity,
        repairLevel: problems.length ? 'mechanic-required' : 'monitor',
        detectedAt: new Date(scannedAt).toLocaleString(),
        diagnosticCode: firstProblem?.code ?? null,
        evidence,
        possibleCauses: [],
        recommendedAction: firstProblem?.recommendedAction || 'Continue normal vehicle use and follow the scheduled maintenance plan.',
        canDrive: null,
        diyEligible: false,
        confidence: null,
    };
}
