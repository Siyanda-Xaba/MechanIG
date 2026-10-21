import { useCallback, useEffect, useState, } from 'react';
import { getDiagnosticResult } from './diagnosticResultService';
export function useDiagnosticResult(resultId) {
    const [diagnosticResult, setDiagnosticResult,] = useState(null);
    const [isLoadingDiagnosticResult, setIsLoadingDiagnosticResult,] = useState(false);
    const [diagnosticResultError, setDiagnosticResultError,] = useState(null);
    const refreshDiagnosticResult = useCallback(async () => {
        if (!resultId) {
            setDiagnosticResult(null);
            setDiagnosticResultError('No diagnostic result was selected.');
            return;
        }
        try {
            setIsLoadingDiagnosticResult(true);
            setDiagnosticResultError(null);
            const result = await getDiagnosticResult(resultId);
            if (!result) {
                setDiagnosticResult(null);
                setDiagnosticResultError('Diagnostic result could not be found.');
                return;
            }
            setDiagnosticResult(result);
        }
        catch (error) {
            setDiagnosticResult(null);
            setDiagnosticResultError(error instanceof Error ? error.message : 'Unable to load the diagnostic result.');
        }
        finally {
            setIsLoadingDiagnosticResult(false);
        }
    }, [resultId]);
    useEffect(() => {
        refreshDiagnosticResult();
    }, [refreshDiagnosticResult]);
    return {
        diagnosticResult,
        isLoadingDiagnosticResult,
        diagnosticResultError,
        refreshDiagnosticResult,
    };
}
