import { useCallback, useState, } from 'react';
import { createFuelDeliveryRequest, } from './fuelService';
export function useFuelDeliveryRequest() {
    const [isSubmittingRequest, setIsSubmittingRequest,] = useState(false);
    const [requestError, setRequestError,] = useState(null);
    const clearRequestError = useCallback(() => {
        setRequestError(null);
    }, []);
    const submitFuelRequest = useCallback(async (input) => {
        try {
            setIsSubmittingRequest(true);
            setRequestError(null);
            const result = await createFuelDeliveryRequest(input);
            return result;
        }
        catch (error) {
            setRequestError(error instanceof Error
                ? error.message
                : 'Unable to submit the fuel delivery request.');
            return null;
        }
        finally {
            setIsSubmittingRequest(false);
        }
    }, []);
    return {
        isSubmittingRequest,
        requestError,
        submitFuelRequest,
        clearRequestError,
    };
}
