import { useCallback, useEffect, useState, } from 'react';
import { findMechanicsForDiagnostic, } from './mechanicService';
export function useMechanicSearch(diagnosticResultId) {
    const [mechanicSearchResult, setMechanicSearchResult,] = useState(null);
    const [isLoadingMechanics, setIsLoadingMechanics,] = useState(false);
    const [mechanicSearchError, setMechanicSearchError,] = useState(null);
    const refreshMechanics = useCallback(async () => {
        if (!diagnosticResultId) {
            setMechanicSearchResult(null);
            setMechanicSearchError('No diagnostic result was selected.');
            return;
        }
        try {
            setIsLoadingMechanics(true);
            setMechanicSearchError(null);
            const result = await findMechanicsForDiagnostic(diagnosticResultId);
            setMechanicSearchResult(result);
        }
        catch {
            setMechanicSearchResult(null);
            setMechanicSearchError('Unable to load mechanic recommendations.');
        }
        finally {
            setIsLoadingMechanics(false);
        }
    }, [diagnosticResultId]);
    useEffect(() => {
        refreshMechanics();
    }, [refreshMechanics]);
    return {
        mechanicSearchResult,
        isLoadingMechanics,
        mechanicSearchError,
        refreshMechanics,
    };
}
