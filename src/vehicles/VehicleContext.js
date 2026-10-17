import { jsx as _jsx } from 'react/jsx-runtime';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { auth } from '../firebase/firebase';

import { useUser } from '../users/UserContext';

import { useConnectivity } from '../offline/ConnectivityContext';

import {
    loadOfflineVehicles,
    saveOfflineVehicles,
} from '../offline/offlineVehicleCache';

import {
    getUserVehicles,
} from './vehicleService';

const VehicleContext = createContext(undefined);

function getPreferredVehicle(vehicles, previousVehicleId) {
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
        return null;
    }

    if (previousVehicleId) {
        const previousVehicle = vehicles.find(
            (vehicle) => vehicle.id === previousVehicleId
        );

        if (previousVehicle) {
            return previousVehicle;
        }
    }

    return (
        vehicles.find((vehicle) => vehicle.isPrimary) ??
        vehicles[0] ??
        null
    );
}

export function VehicleProvider({ children }) {
    const {
        user,
        isLoadingUser,
    } = useUser();

    const {
        isOffline,
    } = useConnectivity();

    const [
        vehicles,
        setVehicles,
    ] = useState([]);

    const [
        selectedVehicle,
        setSelectedVehicle,
    ] = useState(null);

    const [
        isLoadingVehicles,
        setIsLoadingVehicles,
    ] = useState(true);

    const [
        isOfflineVehicles,
        setIsOfflineVehicles,
    ] = useState(false);

    const [
        vehiclesError,
        setVehiclesError,
    ] = useState(null);

    const [
        lastVehiclesSyncedAt,
        setLastVehiclesSyncedAt,
    ] = useState(null);

    const requestVersionRef = useRef(0);

    const accountIdRef = useRef(null);

    const selectedVehicleRef = useRef(null);

    const isOfflineRef = useRef(isOffline);

    isOfflineRef.current = isOffline;

    const accountId = user?.id ?? null;

    const refreshVehicles = useCallback(async () => {
        const requestedAccountId = accountIdRef.current;

        const requestVersion = ++requestVersionRef.current;

        const isCurrentRequest = () => (
            requestVersion === requestVersionRef.current &&
            accountIdRef.current === requestedAccountId &&
            auth.currentUser?.uid === requestedAccountId
        );

        if (!requestedAccountId) {
            setVehicles([]);
            setSelectedVehicle(null);
            selectedVehicleRef.current = null;

            setIsOfflineVehicles(false);
            setVehiclesError(null);
            setLastVehiclesSyncedAt(null);
            setIsLoadingVehicles(false);

            return;
        }

        setIsLoadingVehicles(true);
        setVehiclesError(null);

        try {
            /*
             * When connectivity is known to be unavailable,
             * read the local vehicle cache immediately.
             *
             * Do not attempt a backend request that may
             * remain pending until connectivity returns.
             */
            if (isOfflineRef.current) {
                const cachedData = await loadOfflineVehicles();

                if (!isCurrentRequest()) {
                    return;
                }

                if (cachedData) {
                    setVehicles(cachedData.vehicles);

                    const preferredVehicle = getPreferredVehicle(
                        cachedData.vehicles,
                        selectedVehicleRef.current?.id
                    );

                    selectedVehicleRef.current = preferredVehicle;
                    setSelectedVehicle(preferredVehicle);

                    setIsOfflineVehicles(true);
                    setLastVehiclesSyncedAt(cachedData.savedAt);

                    setVehiclesError(
                        'You are offline. Showing previously saved vehicle information.'
                    );
                } else {
                    /*
                     * Preserve vehicle information already loaded
                     * during this session, if it belongs to the
                     * same authenticated account.
                     */
                    setIsOfflineVehicles(true);

                    setVehiclesError(
                        'You are offline. No saved vehicle information is available yet.'
                    );
                }

                return;
            }

            /*
             * Firebase remains the source of truth.
             *
             * A successful request provides current vehicle
             * information. Cached data is never treated
             * as a backend update.
             */
            const userVehicles = await getUserVehicles();

            if (!isCurrentRequest()) {
                return;
            }

            setVehicles(userVehicles);

            const preferredVehicle = getPreferredVehicle(
                userVehicles,
                selectedVehicleRef.current?.id
            );

            selectedVehicleRef.current = preferredVehicle;
            setSelectedVehicle(preferredVehicle);

            setIsOfflineVehicles(false);
            setVehiclesError(null);

            const syncedAt = new Date().toISOString();

            setLastVehiclesSyncedAt(syncedAt);

            /*
             * Cache only data retrieved successfully
             * from the existing vehicle service.
             *
             * Cache-writing failures must not prevent
             * customers from viewing live vehicle data.
             */
            void saveOfflineVehicles(userVehicles).catch(() => {});
        } catch {
            if (!isCurrentRequest()) {
                return;
            }

            /*
             * If Firebase cannot be reached, attempt
             * to restore previously saved vehicle data.
             *
             * Cached records are read-only and must not
             * authorize backend operations.
             */
            try {
                const cachedData = await loadOfflineVehicles();

                if (!isCurrentRequest()) {
                    return;
                }

                if (cachedData) {
                    setVehicles(cachedData.vehicles);

                    const preferredVehicle = getPreferredVehicle(
                        cachedData.vehicles,
                        selectedVehicleRef.current?.id
                    );

                    selectedVehicleRef.current = preferredVehicle;
                    setSelectedVehicle(preferredVehicle);

                    setIsOfflineVehicles(true);
                    setLastVehiclesSyncedAt(cachedData.savedAt);

                    setVehiclesError(
                        'Unable to refresh vehicles. Showing previously saved information.'
                    );
                } else {
                    /*
                     * Do not discard valid in-memory vehicle
                     * information simply because a refresh failed.
                     */
                    setVehiclesError(
                        'Unable to refresh vehicles. Please check your connection and try again.'
                    );
                }
            } catch {
                if (!isCurrentRequest()) {
                    return;
                }

                setVehiclesError(
                    'Vehicle information is currently unavailable.'
                );
            }
        } finally {
            if (isCurrentRequest()) {
                setIsLoadingVehicles(false);
            }
        }
    }, []);

    /*
     * Keep vehicle state isolated by authenticated account.
     * A profile revalidation for the SAME UID must not reset
     * the customer's currently selected vehicle.
     *
     * This single effect also refreshes vehicles when the
     * connection changes, avoiding duplicate initial requests.
     */
    useEffect(() => {
        if (isLoadingUser) {
            return;
        }

        const accountChanged = accountIdRef.current !== accountId;

        if (accountChanged) {
            /*
             * Invalidate outstanding requests before applying
             * another account's vehicle information.
             */
            requestVersionRef.current += 1;
            accountIdRef.current = accountId;
            selectedVehicleRef.current = null;

            setVehicles([]);
            setSelectedVehicle(null);
            setIsOfflineVehicles(false);
            setVehiclesError(null);
            setLastVehiclesSyncedAt(null);
        }

        if (!accountId) {
            setIsLoadingVehicles(false);
            return;
        }

        /*
         * On account changes, load that account's vehicles.
         * On connectivity changes or completed revalidation,
         * refresh without discarding the current selection.
         */
        void refreshVehicles();
    }, [
        accountId,
        isOffline,
        isLoadingUser,
        refreshVehicles,
    ]);

    function addVehicle(vehicle, shouldSelect = false) {
        setVehicles((currentVehicles) => {
            const existingVehicles = vehicle.isPrimary
                ? currentVehicles.map((currentVehicle) => ({
                    ...currentVehicle,
                    isPrimary: false,
                }))
                : currentVehicles;

            return [
                ...existingVehicles,
                vehicle,
            ];
        });

        setSelectedVehicle((currentVehicle) => {
            if (
                shouldSelect ||
                vehicle.isPrimary ||
                currentVehicle === null
            ) {
                selectedVehicleRef.current = vehicle;
                return vehicle;
            }

            return currentVehicle;
        });
    }

    function selectVehicle(vehicleId) {
        const vehicle = vehicles.find(
            (item) => item.id === vehicleId
        );

        if (vehicle) {
            selectedVehicleRef.current = vehicle;
            setSelectedVehicle(vehicle);
        }
    }

    return _jsx(VehicleContext.Provider, {
        value: {
            vehicles,
            selectedVehicle,
            isLoadingVehicles,

            isOfflineVehicles,
            vehiclesError,
            lastVehiclesSyncedAt,

            addVehicle,
            selectVehicle,
            refreshVehicles,
        },
        children,
    });
}

export function useVehicle() {
    const context = useContext(VehicleContext);

    if (!context) {
        throw new Error(
            'useVehicle must be used inside VehicleProvider'
        );
    }

    return context;
}