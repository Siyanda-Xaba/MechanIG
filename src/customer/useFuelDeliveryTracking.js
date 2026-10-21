import { useCallback, useEffect, useState } from 'react';
import { getFuelDeliveryTracking, subscribeToFuelDeliveryTracking } from './fuelService';

export function useFuelDeliveryTracking(deliveryId) {
  const [tracking, setTracking] = useState(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(Boolean(deliveryId));
  const [trackingError, setTrackingError] = useState(null);
  const refreshTracking = useCallback(async () => {
    if (!deliveryId) return;
    try {
      setIsLoadingTracking(true); setTrackingError(null);
      setTracking(await getFuelDeliveryTracking(deliveryId));
    } catch (error) {
      setTrackingError(error instanceof Error ? error.message : 'Unable to load fuel delivery tracking.');
    } finally { setIsLoadingTracking(false); }
  }, [deliveryId]);
  useEffect(() => {
    if (!deliveryId) { setTracking(null); setTrackingError(null); setIsLoadingTracking(false); return undefined; }
    setIsLoadingTracking(true); setTrackingError(null);
    try {
      return subscribeToFuelDeliveryTracking(deliveryId, (nextTracking) => {
        setTracking(nextTracking);
        setTrackingError(nextTracking ? null : 'This fuel delivery was not found.');
        setIsLoadingTracking(false);
      }, (error) => { setTrackingError(error?.message ?? 'Unable to receive live tracking updates.'); setIsLoadingTracking(false); });
    } catch (error) {
      setTrackingError(error instanceof Error ? error.message : 'Unable to receive live tracking updates.');
      setIsLoadingTracking(false);
      return undefined;
    }
  }, [deliveryId]);
  return { tracking, isLoadingTracking, trackingError, refreshTracking };
}
