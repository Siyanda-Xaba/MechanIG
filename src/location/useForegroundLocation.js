import * as Location from 'expo-location';
import { useCallback, useEffect, useState, } from 'react';

export function useForegroundLocation(
    options = {}
) {
    const {
        autoLoad = true,
    } = options;

    const [location, setLocation,] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation,] = useState(false);
    const [locationError, setLocationError,] = useState(null);
    const [permissionStatus, setPermissionStatus,] = useState(null);

    const refreshLocation = useCallback(async () => {
        try {
            setIsLoadingLocation(true);
            setLocationError(null);

            const servicesEnabled =
                await Location.hasServicesEnabledAsync();

            if (!servicesEnabled) {
                setLocation(null);
                setLocationError(
                    'Location services are turned off. Enable location services to use location-based features.'
                );

                return null;
            }

            let permission =
                await Location.getForegroundPermissionsAsync();

            if (
                permission.status !==
                Location.PermissionStatus.GRANTED
            ) {
                permission =
                    await Location.requestForegroundPermissionsAsync();
            }

            setPermissionStatus(
                permission.status
            );

            if (
                permission.status !==
                Location.PermissionStatus.GRANTED
            ) {
                setLocation(null);
                setLocationError(
                    'Location permission is required to use location-based features.'
                );

                return null;
            }

            const currentLocation =
                await Location.getCurrentPositionAsync({
                    accuracy:
                        Location.Accuracy.Balanced,
                });

            const nextLocation = {
                latitude:
                    currentLocation.coords.latitude,
                longitude:
                    currentLocation.coords.longitude,
            };

            setLocation(nextLocation);

            return nextLocation;
        }
        catch {
            setLocation(null);

            setLocationError(
                'Unable to determine your current location.'
            );

            return null;
        }
        finally {
            setIsLoadingLocation(false);
        }
    }, []);

    useEffect(() => {
        if (!autoLoad) {
            return;
        }

        refreshLocation();
    }, [
        autoLoad,
        refreshLocation,
    ]);

    return {
        location,
        isLoadingLocation,
        locationError,
        permissionStatus,
        refreshLocation,
    };
}