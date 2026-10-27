import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

const LOCATION_TIMEOUT_MS = 15000;
const LAST_KNOWN_TIMEOUT_MS = 3000;
function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  return Promise.race([promise, new Promise((_, reject) => { timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs); })]).finally(() => clearTimeout(timeoutId));
}

export function useForegroundLocation({ autoLoad = true } = {}) {
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(autoLoad);
  const [locationError, setLocationError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const watchRef = useRef(null);

  const refreshLocation = useCallback(async () => {
    try {
      setIsLoadingLocation(true); setLocationError(null);
      if (!(await Location.hasServicesEnabledAsync())) throw new Error('Location services are turned off. Enable location services and try again.');
      let permission = await Location.getForegroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) permission = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(permission.status);
      if (permission.status !== Location.PermissionStatus.GRANTED) throw new Error('Location permission is required to find mechanics and track fuel delivery.');
      let position = null;
      try { position = await withTimeout(Location.getLastKnownPositionAsync({ maxAge: 60000, requiredAccuracy: 1000 }), LAST_KNOWN_TIMEOUT_MS, 'Last known location timed out.'); } catch {}
      if (!position) position = await withTimeout(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), LOCATION_TIMEOUT_MS, 'Location request timed out. Check location services and try again.');
      const coordinate = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setLocation(coordinate); return coordinate;
    } catch (error) {
      setLocation(null); setLocationError(error instanceof Error ? error.message : 'Unable to determine your current location. Please retry.'); return null;
    } finally { setIsLoadingLocation(false); }
  }, []);

  const stopWatchingLocation = useCallback(() => { watchRef.current?.remove?.(); watchRef.current = null; }, []);
  const startWatchingLocation = useCallback(async (onLocation) => {
    stopWatchingLocation();
    const initial = await refreshLocation();
    if (!initial) return null;
    onLocation?.(initial);
    watchRef.current = await Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, distanceInterval: 15, timeInterval: 10000 }, (position) => {
      const coordinate = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setLocation(coordinate); onLocation?.(coordinate);
    });
    return initial;
  }, [refreshLocation, stopWatchingLocation]);

  useEffect(() => {
    const timer = autoLoad ? setTimeout(() => { void refreshLocation(); }, 0) : null;
    return () => { if (timer) clearTimeout(timer); stopWatchingLocation(); };
  }, [autoLoad, refreshLocation, stopWatchingLocation]);
  return { location, isLoadingLocation, locationError, permissionStatus, refreshLocation, startWatchingLocation, stopWatchingLocation };
}
