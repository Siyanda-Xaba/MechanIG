import { useCallback, useState, } from 'react';
import { useVehicle } from './VehicleContext';
import { createUserVehicle } from './vehicleService';
export function useCreateVehicle() {
    const { addVehicle, } = useVehicle();
    const [isCreatingVehicle, setIsCreatingVehicle,] = useState(false);
    const [createVehicleError, setCreateVehicleError,] = useState(null);
    const createVehicle = useCallback(async (input) => {
        try {
            setIsCreatingVehicle(true);
            setCreateVehicleError(null);
            const savedVehicle = await createUserVehicle(input);
            addVehicle(savedVehicle, true);
            return savedVehicle;
        }
        catch (error) {
            setCreateVehicleError(error instanceof Error
                ? error.message
                : 'Unable to add the vehicle.');
            return null;
        }
        finally {
            setIsCreatingVehicle(false);
        }
    }, [
        addVehicle,
    ]);
    const clearCreateVehicleError = useCallback(() => {
        setCreateVehicleError(null);
    }, []);
    return {
        isCreatingVehicle,
        createVehicleError,
        createVehicle,
        clearCreateVehicleError,
    };
}
