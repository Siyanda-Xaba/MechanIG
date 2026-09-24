import { useCallback, useEffect, useState, } from 'react';
import { getFuelDeliveryTracking, } from './fuelService';
export function useFuelDeliveryTracking(deliveryId) {
    const [tracking, setTracking,] = useState(null);
    const [isLoadingTracking, setIsLoadingTracking,] = useState(false);
    const [trackingError, setTrackingError,] = useState(null);
    const refreshTracking = useCallback(async () => {
        if (!deliveryId) {
            setTracking(null);
            setTrackingError(null);
            setIsLoadingTracking(false);
            return;
        }
        try {
            setIsLoadingTracking(true);
            setTrackingError(null);
            const result = await getFuelDeliveryTracking(deliveryId);
            setTracking(result);
        }
        catch (error) {
            setTracking(null);
            setTrackingError(error instanceof Error
                ? error.message
                : 'Unable to load fuel delivery tracking.');
        }
        finally {
            setIsLoadingTracking(false);
        }
    }, [deliveryId]);
    useEffect(() => {
        refreshTracking();
    }, [refreshTracking]);
    return {
        tracking,
        isLoadingTracking,
        trackingError,
        refreshTracking,
    };
}
