const commonSymptoms = [
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
];

export async function getCustomerDiagnosticsData(vehicleId) {
    /*
     * Vehicle-specific diagnostic history will
     * eventually be retrieved from an authenticated
     * MechanIQ backend service using vehicleId.
     *
     * Until a verified diagnostic source is available,
     * never fabricate scan results, timestamps,
     * OBD readings, or vehicle health information.
     *
     * Common symptoms are predefined UI options,
     * not vehicle-specific diagnostic results.
     */

    return {
        summary: {
            lastScanAt: null,
            obdConnected: false,
        },

        commonSymptoms,

        recentScans: [],
    };
}