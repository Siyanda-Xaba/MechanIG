import { useCallback, useEffect, useState, } from 'react';
import { useVehicle } from '../vehicles/VehicleContext';
import { deleteDiagnosticHistoryEntry, getDiagnosticHistory } from './diagnosticHistoryService';
export function useDiagnosticHistory() {
    const { selectedVehicle } = useVehicle();
    const [diagnosticHistory, setDiagnosticHistory] = useState([]);
    const [isLoadingDiagnosticHistory, setIsLoadingDiagnosticHistory,] = useState(false);
    const [diagnosticHistoryError, setDiagnosticHistoryError,] = useState(null);
    const deleteHistoryEntry = useCallback(async (scanId) => {
        await deleteDiagnosticHistoryEntry(scanId);
        setDiagnosticHistory((current) => current.filter((scan) => scan.id !== scanId));
    }, []);
    const refreshDiagnosticHistory = useCallback(async () => {
        if (!selectedVehicle) {
            setDiagnosticHistory([]);
            setDiagnosticHistoryError(null);
            return;
        }
        try {
            setIsLoadingDiagnosticHistory(true);
            setDiagnosticHistoryError(null);
            const history = await getDiagnosticHistory(selectedVehicle);
            setDiagnosticHistory(history);
        }
        catch {
            setDiagnosticHistory([]);
            setDiagnosticHistoryError('Unable to load diagnostic history.');
        }
        finally {
            setIsLoadingDiagnosticHistory(false);
        }
    }, [selectedVehicle]);
    useEffect(() => {
        void refreshDiagnosticHistory();
    }, [refreshDiagnosticHistory]);
    return {
        diagnosticHistory,
        isLoadingDiagnosticHistory,
        diagnosticHistoryError,
        refreshDiagnosticHistory,
        deleteHistoryEntry,
    };
}
