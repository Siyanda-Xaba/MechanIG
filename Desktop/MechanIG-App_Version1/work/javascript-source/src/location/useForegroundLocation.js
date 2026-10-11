import * as Location from 'expo-location';
import { useCallback, useEffect, useState, } from 'react';
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
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setLocation({
                latitude: currentLocation.coords
                    .latitude,
                longitude: currentLocation.coords
                    .longitude,
            });
        }
        catch {
            setLocation(null);
            setLocationError('Unable to determine your current location.');
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
