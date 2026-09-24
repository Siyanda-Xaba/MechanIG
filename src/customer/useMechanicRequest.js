import { useCallback, useState, } from 'react';
import { createMechanicRequest, } from './mechanicRequestService';
export function useMechanicRequest() {
    const [mechanicRequest, setMechanicRequest,] = useState(null);
    const [isSubmittingRequest, setIsSubmittingRequest,] = useState(false);
    const [mechanicRequestError, setMechanicRequestError,] = useState(null);
    const submitMechanicRequest = useCallback(async (input) => {
        try {
            setIsSubmittingRequest(true);
            setMechanicRequestError(null);
            const request = await createMechanicRequest(input);
            setMechanicRequest(request);
            return request;
        }
        catch {
            setMechanicRequest(null);
            setMechanicRequestError('Unable to submit the mechanic request.');
            return null;
        }
        finally {
            setIsSubmittingRequest(false);
        }
    }, []);
    const resetMechanicRequest = useCallback(() => {
        setMechanicRequest(null);
        setMechanicRequestError(null);
    }, []);
    return {
        mechanicRequest,
        isSubmittingRequest,
        mechanicRequestError,
        submitMechanicRequest,
        resetMechanicRequest,
    };
}
