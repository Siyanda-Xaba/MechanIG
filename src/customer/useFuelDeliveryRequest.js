import {
    useCallback,
    useRef,
    useState,
} from 'react';

import {
    createFuelDeliveryRequest,
} from './fuelService';

export function useFuelDeliveryRequest() {
    const [
        isSubmittingRequest,
        setIsSubmittingRequest,
    ] = useState(false);

    const [
        requestError,
        setRequestError,
    ] = useState(null);

    /*
     * Synchronous guard to prevent multiple
     * delivery requests being submitted
     * before React updates the loading state.
     */
    const submissionInProgressRef = useRef(false);

    const clearRequestError = useCallback(() => {
        setRequestError(null);
    }, []);

    const submitFuelRequest = useCallback(async (input) => {
        /*
         * Never allow overlapping submissions.
         *
         * This prevents accidental duplicate
         * delivery requests from rapid button taps.
         */
        if (submissionInProgressRef.current) {
            return null;
        }

        submissionInProgressRef.current = true;

        try {
            setIsSubmittingRequest(true);
            setRequestError(null);

            /*
             * The service must create an actual
             * backend delivery request.
             *
             * The frontend must never manufacture
             * a delivery ID or successful response.
             */
            const result = await createFuelDeliveryRequest(
                input
            );

            /*
             * Only a valid backend-generated
             * delivery ID permits the caller
             * to navigate to delivery tracking.
             */
            if (
                !result ||
                typeof result.deliveryId !== 'string' ||
                result.deliveryId.trim().length === 0
            ) {
                throw new Error(
                    'Fuel delivery was not confirmed. Please try again when the service is available.'
                );
            }

            return result;
        } catch (error) {
            setRequestError(
                error instanceof Error
                    ? error.message
                    : 'Unable to submit the fuel delivery request.'
            );

            return null;
        } finally {
            submissionInProgressRef.current = false;

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