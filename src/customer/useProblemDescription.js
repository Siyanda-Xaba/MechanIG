import { useCallback, useState, } from 'react';
import { useVehicle } from '../vehicles/VehicleContext';
import { analyzeProblemDescription, } from './problemDescriptionService';
export function useProblemDescription() {
    const { selectedVehicle, } = useVehicle();
    const [description, setDescriptionState,] = useState('');
    const [analysisResult, setAnalysisResult,] = useState(null);
    const [isSubmittingDescription, setIsSubmittingDescription,] = useState(false);
    const [problemDescriptionError, setProblemDescriptionError,] = useState(null);
    const setDescription = useCallback((value) => {
        setDescriptionState(value);
        setProblemDescriptionError(null);
        setAnalysisResult(null);
    }, []);
    const submitDescription = useCallback(async (descriptionOverride) => {
        if (!selectedVehicle) {
            setProblemDescriptionError('Select a vehicle before describing a problem.');
            return null;
        }
        const descriptionToSubmit = descriptionOverride ??
            description;
        const trimmedDescription = descriptionToSubmit.trim();
        if (!trimmedDescription) {
            setProblemDescriptionError('Describe what you are noticing before submitting.');
            return null;
        }
        try {
            setIsSubmittingDescription(true);
            setProblemDescriptionError(null);
            setAnalysisResult(null);
            const result = await analyzeProblemDescription({
                vehicleId: selectedVehicle.id,
                description: trimmedDescription,
                submittedAt: new Date().toISOString(),
            });
            setAnalysisResult(result);
            return result;
        }
        catch {
            setProblemDescriptionError('Unable to submit your problem description.');
            return null;
        }
        finally {
            setIsSubmittingDescription(false);
        }
    }, [
        description,
        selectedVehicle,
    ]);
    const clearDescription = useCallback(() => {
        setDescriptionState('');
        setProblemDescriptionError(null);
        setAnalysisResult(null);
    }, []);
    const clearProblemDescriptionError = useCallback(() => {
        setProblemDescriptionError(null);
    }, []);
    const clearAnalysisResult = useCallback(() => {
        setAnalysisResult(null);
    }, []);
    return {
        description,
        analysisResult,
        isSubmittingDescription,
        problemDescriptionError,
        setDescription,
        submitDescription,
        clearDescription,
        clearProblemDescriptionError,
        clearAnalysisResult,
    };
}
