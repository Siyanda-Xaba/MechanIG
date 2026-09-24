import { useCallback, useState, } from 'react';
import { startCustomerDiagnosticScan, } from './diagnosticScanService';
import { useVehicle } from '../vehicles/VehicleContext';
export function useDiagnosticScan() {
    const { selectedVehicle, } = useVehicle();
    const [scanResult, setScanResult,] = useState(null);
    const [isStartingScan, setIsStartingScan,] = useState(false);
    const [scanError, setScanError,] = useState(null);
    const vehicleId = selectedVehicle?.id ?? null;
    const startScan = useCallback(async () => {
        if (!vehicleId) {
            const result = {
                status: 'unavailable',
                resultId: null,
                message: 'Select a vehicle before starting a diagnostic scan.',
            };
            setScanResult(result);
            setScanError(null);
            return result;
        }
        try {
            setIsStartingScan(true);
            setScanError(null);
            const result = await startCustomerDiagnosticScan({
                vehicleId,
                source: 'obd',
            });
            setScanResult(result);
            return result;
        }
        catch {
            setScanResult(null);
            setScanError('Unable to start the diagnostic scan.');
            return null;
        }
        finally {
            setIsStartingScan(false);
        }
    }, [vehicleId]);
    const clearScanResult = useCallback(() => {
        setScanResult(null);
        setScanError(null);
    }, []);
    return {
        scanResult,
        isStartingScan,
        scanError,
        startScan,
        clearScanResult,
    };
}
