import * as Location from 'expo-location';
import { useCallback, useEffect, useState, } from 'react';

const LOCATION_TIMEOUT_MS = 15000;
const LAST_KNOWN_TIMEOUT_MS = 3000;

function withTimeout(promise, timeoutMs, message) {
    let timeoutId;
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
        }),
    ]).finally(() => clearTimeout(timeoutId));
}

export function useForegroundLocation() {
    const [location, setLocation,] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation,] = useState(true);
    const [locationError, setLocationError,] = useState(null);
    const [permissionStatus, setPermissionStatus,] = useState(null);
    const refreshLocation = useCallback(async () => {
        try {
            setIsLoadingLocation(true);
            setLocationError(null);
            const servicesEnabled = await Location.hasServicesEnabledAsync();
            if (!servicesEnabled) {
                setLocation(null);
                setLocationError('Location services are turned off. Enable location services to use map features.');
                return;
            }
            let permission = await Location.getForegroundPermissionsAsync();
            if (permission.status !==
                Location.PermissionStatus.GRANTED) {
                permission =
                    await Location.requestForegroundPermissionsAsync();
            }
            setPermissionStatus(permission.status);
            if (permission.status !==
                Location.PermissionStatus.GRANTED) {
                setLocation(null);
                setLocationError('Location permission is required to show your position, nearby fuel stations, and fuel delivery tracking.');
                return;
            }
            let currentLocation = null;
            try {
                currentLocation = await withTimeout(Location.getLastKnownPositionAsync({
                    maxAge: 60000,
                    requiredAccuracy: 1000,
                }), LAST_KNOWN_TIMEOUT_MS, 'Last-known location timed out.');
            }
            catch {
                // Continue with a live fix when a recent location is unavailable.
            }
            if (!currentLocation) {
                currentLocation = await withTimeout(Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                }), LOCATION_TIMEOUT_MS, 'Location request timed out. Check location services and try again.');
            }
            setLocation({
                latitude: currentLocation.coords
                    .latitude,
                longitude: currentLocation.coords
                    .longitude,
            });
        }
        catch (error) {
            setLocation(null);
            setLocationError(error instanceof Error && error.message === 'Location request timed out. Check location services and try again.'
                ? error.message
                : 'Unable to determine your current location. Please retry.');
        }
        finally {
            setIsLoadingLocation(false);
        }
    }, []);
    useEffect(() => {
        refreshLocation();
    }, [refreshLocation]);
    return {
        location,
        isLoadingLocation,
        locationError,
        permissionStatus,
        refreshLocation,
    };
}
