import { useCallback, useEffect, useState, } from 'react';
import { findMechanicsForVehicle, } from './mechanicService';
export function useVehicleMechanicSearch(vehicleId) {
    const [mechanicSearchResult, setMechanicSearchResult,] = useState(null);
    const [isLoadingMechanics, setIsLoadingMechanics,] = useState(false);
    const [mechanicSearchError, setMechanicSearchError,] = useState(null);
    const refreshMechanics = useCallback(async () => {
        if (!vehicleId) {
            setMechanicSearchResult(null);
            setMechanicSearchError('No vehicle was selected.');
            return;
        }
        try {
            setIsLoadingMechanics(true);
            setMechanicSearchError(null);
            const result = await findMechanicsForVehicle(vehicleId);
            setMechanicSearchResult(result);
        }
        catch {
            setMechanicSearchResult(null);
            setMechanicSearchError('Unable to find mechanics for your vehicle.');
        }
        finally {
            setIsLoadingMechanics(false);
        }
    }, [vehicleId]);
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
