import { useCallback, useEffect, useState, } from 'react';
import { getSavedFuelLocations, } from './fuelService';
export function useSavedFuelLocations() {
    const [savedLocations, setSavedLocations,] = useState([]);
    const [isLoadingSavedLocations, setIsLoadingSavedLocations,] = useState(false);
    const [savedLocationsError, setSavedLocationsError,] = useState(null);
    const refreshSavedLocations = useCallback(async () => {
        try {
            setIsLoadingSavedLocations(true);
            setSavedLocationsError(null);
            const result = await getSavedFuelLocations();
            setSavedLocations(result);
        }
        catch (error) {
            setSavedLocations([]);
            setSavedLocationsError(error instanceof Error
                ? error.message
                : 'Unable to load saved fuel locations.');
        }
        finally {
            setIsLoadingSavedLocations(false);
        }
    }, []);
    useEffect(() => {
        refreshSavedLocations();
    }, [refreshSavedLocations]);
    return {
        savedLocations,
        isLoadingSavedLocations,
        savedLocationsError,
        refreshSavedLocations,
    };
}
