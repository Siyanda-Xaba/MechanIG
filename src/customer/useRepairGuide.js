import { useCallback, useEffect, useState, } from 'react';
import { getRepairGuideByDiagnosticResult } from './repairGuideService';
export function useRepairGuide(diagnosticResultId) {
    const [repairGuide, setRepairGuide,] = useState(null);
    const [isLoadingRepairGuide, setIsLoadingRepairGuide,] = useState(false);
    const [repairGuideError, setRepairGuideError,] = useState(null);
    const refreshRepairGuide = useCallback(async () => {
        if (!diagnosticResultId) {
            setRepairGuide(null);
            setRepairGuideError('No diagnostic result was selected.');
            return;
        }
        try {
            setIsLoadingRepairGuide(true);
            setRepairGuideError(null);
            const guide = await getRepairGuideByDiagnosticResult(diagnosticResultId);
            setRepairGuide(guide);
        }
        catch {
            setRepairGuide(null);
            setRepairGuideError('Unable to load the repair guide.');
        }
        finally {
            setIsLoadingRepairGuide(false);
        }
    }, [diagnosticResultId]);
    useEffect(() => {
        refreshRepairGuide();
    }, [refreshRepairGuide]);
    return {
        repairGuide,
        isLoadingRepairGuide,
        repairGuideError,
        refreshRepairGuide,
    };
}
