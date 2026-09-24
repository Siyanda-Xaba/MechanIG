import { useCallback, useEffect, useState, } from 'react';
import { findMechanicsForService, } from './mechanicService';
export function useServiceMechanicSearch(request) {
    const [mechanicSearchResult, setMechanicSearchResult,] = useState(null);
    const [isLoadingMechanics, setIsLoadingMechanics,] = useState(false);
    const [mechanicSearchError, setMechanicSearchError,] = useState(null);
    const vehicleId = request?.vehicleId ?? null;
    const serviceId = request?.serviceId ?? null;
    const preferredDate = request?.preferredDate ?? null;
    const preferredTime = request?.preferredTime ?? null;
    const locationPreference = request?.locationPreference ?? null;
    const notes = request?.notes ?? null;
    const refreshMechanics = useCallback(async () => {
        if (!vehicleId ||
            !serviceId ||
            !preferredDate ||
            !preferredTime ||
            !locationPreference) {
            setMechanicSearchResult(null);
            setMechanicSearchError('Service preferences are incomplete.');
            return;
        }
        try {
            setIsLoadingMechanics(true);
            setMechanicSearchError(null);
            const result = await findMechanicsForService({
                vehicleId,
                serviceId,
                preferredDate,
                preferredTime,
                locationPreference,
                notes,
            });
            setMechanicSearchResult(result);
        }
        catch {
            setMechanicSearchResult(null);
            setMechanicSearchError('Unable to find service options for your preferences.');
        }
        finally {
            setIsLoadingMechanics(false);
        }
    }, [
        vehicleId,
        serviceId,
        preferredDate,
        preferredTime,
        locationPreference,
        notes,
    ]);
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
