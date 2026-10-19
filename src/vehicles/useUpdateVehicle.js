import {
    useCallback,
    useRef,
    useState,
} from 'react';

import { useVehicle } from './VehicleContext';

export function useUpdateVehicle() {
    const {
        updateVehicle: saveVehicleToContext,
        isUpdatingVehicle: isUpdatingVehicleInContext,
    } = useVehicle();

    const [isSavingVehicle, setIsSavingVehicle] =
        useState(false);

    const [updateVehicleError, setUpdateVehicleError] =
        useState(null);

    const isSubmittingRef = useRef(false);

    const updateVehicle = useCallback(
        async (vehicleId, input) => {
            // Prevent duplicate submissions.
            if (isSubmittingRef.current) {
                return null;
            }

            isSubmittingRef.current = true;
            setIsSavingVehicle(true);
            setUpdateVehicleError(null);

            try {
                // VehicleContext handles Firebase persistence,
                // account isolation, and vehicle synchronization.
                const savedVehicle =
                    await saveVehicleToContext(
                        vehicleId,
                        input
                    );

                return savedVehicle;
            } catch (error) {
                setUpdateVehicleError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to update the vehicle.'
                );

                return null;
            } finally {
                isSubmittingRef.current = false;
                setIsSavingVehicle(false);
            }
        },
        [saveVehicleToContext]
    );

    const clearUpdateVehicleError = useCallback(() => {
        setUpdateVehicleError(null);
    }, []);

    return {
        isUpdatingVehicle:
            isSavingVehicle || isUpdatingVehicleInContext,

        updateVehicleError,
        updateVehicle,
        clearUpdateVehicleError,
    };
}