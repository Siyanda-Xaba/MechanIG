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
    setPrimaryUserVehicle,
    updateUserVehicle,
    deleteUserVehicle,
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
        isSettingPrimaryVehicle,
        setIsSettingPrimaryVehicle,
    ] = useState(false);

    const [
        isUpdatingVehicle,
        setIsUpdatingVehicle,
    ] = useState(false);

    const [
        isDeletingVehicle,
        setIsDeletingVehicle,
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

    const primaryUpdateVersionRef = useRef(0);

    const primaryUpdateInProgressRef = useRef(false);

    const editUpdateVersionRef = useRef(0);

    const editUpdateInProgressRef = useRef(false);

    const deleteUpdateVersionRef = useRef(0);

    const deleteUpdateInProgressRef = useRef(false);

    // Keep confirmed deletions from reappearing through a stale offline cache.
    const deletedVehicleIdsRef = useRef(new Set());

    const vehiclesRef = useRef(vehicles);

    vehiclesRef.current = vehicles;

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
                    const visibleVehicles = cachedData.vehicles.filter(
                        (vehicle) => !deletedVehicleIdsRef.current.has(vehicle.id)
                    );
                    setVehicles(visibleVehicles);

                    const preferredVehicle = getPreferredVehicle(
                        visibleVehicles,
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

            // A successful authoritative read supersedes deletion tombstones.
            // The transaction already confirmed the deletion in Firebase.
            deletedVehicleIdsRef.current.clear();

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
                    const visibleVehicles = cachedData.vehicles.filter(
                        (vehicle) => !deletedVehicleIdsRef.current.has(vehicle.id)
                    );
                    setVehicles(visibleVehicles);

                    const preferredVehicle = getPreferredVehicle(
                        visibleVehicles,
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
            deletedVehicleIdsRef.current.clear();
            vehiclesRef.current = [];

            // Invalidate a primary-vehicle action from the prior account.
            primaryUpdateVersionRef.current += 1;
            primaryUpdateInProgressRef.current = false;
            setIsSettingPrimaryVehicle(false);

            // Prevent a previous account's completed edit from changing this account.
            editUpdateVersionRef.current += 1;
            editUpdateInProgressRef.current = false;
            setIsUpdatingVehicle(false);

            // Invalidate any deletion requested by the previous account.
            deleteUpdateVersionRef.current += 1;
            deleteUpdateInProgressRef.current = false;
            setIsDeletingVehicle(false);

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

    /**
     * Make a vehicle the persisted primary vehicle and select it.
     *
     * The service confirms the Firebase transaction before local state
     * changes. Account switching cannot apply another user's result.
     */
    const setPrimaryVehicle = useCallback(async (vehicleId) => {
        const userId = accountIdRef.current;

        if (!userId || auth.currentUser?.uid !== userId) {
            throw new Error('You must be signed in to change your primary vehicle.');
        }

        if (isOfflineRef.current) {
            throw new Error('Connect to the internet to change your primary vehicle.');
        }

        if (
            primaryUpdateInProgressRef.current ||
            editUpdateInProgressRef.current ||
            deleteUpdateInProgressRef.current
        ) {
            throw new Error('Finish the current vehicle change before setting a primary vehicle.');
        }

        primaryUpdateInProgressRef.current = true;
        const updateVersion = ++primaryUpdateVersionRef.current;
        setIsSettingPrimaryVehicle(true);

        try {
            const confirmedVehicle = await setPrimaryUserVehicle(vehicleId);

            if (
                primaryUpdateVersionRef.current !== updateVersion ||
                accountIdRef.current !== userId ||
                auth.currentUser?.uid !== userId
            ) {
                throw new Error('Your account changed while updating the primary vehicle.');
            }

            // Selecting the persisted primary vehicle was the chosen UX.
            selectedVehicleRef.current = confirmedVehicle;
            setSelectedVehicle(confirmedVehicle);

            setVehicles((currentVehicles) =>
                currentVehicles.map((vehicle) => ({
                    ...vehicle,
                    isPrimary: vehicle.id === confirmedVehicle.id,
                }))
            );

            // Reconcile other vehicle fields and the offline cache with Firebase.
            // Refresh errors already produce an explicit vehicle error state.
            void refreshVehicles();

            return confirmedVehicle;
        } finally {
            // A previous account's request must not change the next account's UI.
            if (primaryUpdateVersionRef.current === updateVersion) {
                primaryUpdateInProgressRef.current = false;
                setIsSettingPrimaryVehicle(false);
            }
        }
    }, [refreshVehicles]);

    /**
     * Persist edits to an existing vehicle before updating shared state.
     * A successful edit retains the vehicle ID and primary designation.
     * The selected vehicle is replaced only if it is still the edited one.
     */
    const updateVehicle = useCallback(async (vehicleId, input) => {
        const userId = accountIdRef.current;

        if (!userId || auth.currentUser?.uid !== userId) {
            throw new Error('You must be signed in to edit a vehicle.');
        }

        if (isOfflineRef.current) {
            throw new Error('Connect to the internet to edit a vehicle.');
        }

        if (
            editUpdateInProgressRef.current ||
            primaryUpdateInProgressRef.current ||
            deleteUpdateInProgressRef.current
        ) {
            throw new Error('Another vehicle change is already in progress.');
        }

        editUpdateInProgressRef.current = true;
        const updateVersion = ++editUpdateVersionRef.current;
        setIsUpdatingVehicle(true);

        try {
            const confirmedVehicle = await updateUserVehicle(vehicleId, input);

            if (
                editUpdateVersionRef.current !== updateVersion ||
                accountIdRef.current !== userId ||
                auth.currentUser?.uid !== userId
            ) {
                throw new Error('Your account changed while editing the vehicle.');
            }

            // Invalidate any refresh started before the confirmed edit.
            requestVersionRef.current += 1;

            setVehicles((currentVehicles) =>
                currentVehicles.map((vehicle) =>
                    vehicle.id === confirmedVehicle.id ? confirmedVehicle : vehicle
                )
            );

            // Preserve the customer's current selection if they switched
            // to another vehicle while the edit was being saved.
            if (selectedVehicleRef.current?.id === confirmedVehicle.id) {
                selectedVehicleRef.current = confirmedVehicle;
                setSelectedVehicle(confirmedVehicle);
            }

            // Reconcile the complete collection and offline cache with Firebase.
            void refreshVehicles();

            return confirmedVehicle;
        } finally {
            // Do not reset the next account's in-progress operation.
            if (editUpdateVersionRef.current === updateVersion) {
                editUpdateInProgressRef.current = false;
                setIsUpdatingVehicle(false);
            }
        }
    }, [refreshVehicles]);

    /**
     * Delete a vehicle only after the UI has obtained explicit confirmation.
     * The service transaction also assigns the next primary, if necessary.
     * Do not change local state until Firebase confirms deletion.
     */
    const deleteVehicle = useCallback(async (vehicleId) => {
        const userId = accountIdRef.current;

        if (!userId || auth.currentUser?.uid !== userId) {
            throw new Error('You must be signed in to delete a vehicle.');
        }

        if (isOfflineRef.current) {
            throw new Error('Connect to the internet to delete a vehicle.');
        }

        if (
            deleteUpdateInProgressRef.current ||
            primaryUpdateInProgressRef.current ||
            editUpdateInProgressRef.current
        ) {
            throw new Error('Another vehicle change is already in progress.');
        }

        if (!vehiclesRef.current.some((vehicle) => vehicle.id === vehicleId)) {
            throw new Error('Vehicle not found. Refresh your vehicles and try again.');
        }

        deleteUpdateInProgressRef.current = true;
        const updateVersion = ++deleteUpdateVersionRef.current;
        setIsDeletingVehicle(true);

        try {
            const result = await deleteUserVehicle(vehicleId);

            if (
                deleteUpdateVersionRef.current !== updateVersion ||
                accountIdRef.current !== userId ||
                auth.currentUser?.uid !== userId
            ) {
                throw new Error('Your account changed while deleting the vehicle.');
            }

            // Ignore refreshes begun before Firebase confirmed deletion.
            requestVersionRef.current += 1;
            deletedVehicleIdsRef.current.add(result.deletedVehicleId);

            const remainingVehicles = vehiclesRef.current
                .filter((vehicle) => vehicle.id !== result.deletedVehicleId)
                .map((vehicle) => ({
                    ...vehicle,
                    isPrimary: vehicle.id === result.primaryVehicleId,
                }));

            vehiclesRef.current = remainingVehicles;
            setVehicles(remainingVehicles);

            const previouslySelectedId = selectedVehicleRef.current?.id;
            const nextSelectedId = previouslySelectedId === result.deletedVehicleId
                ? result.primaryVehicleId
                : previouslySelectedId;
            const nextSelectedVehicle = getPreferredVehicle(
                remainingVehicles,
                nextSelectedId
            );

            selectedVehicleRef.current = nextSelectedVehicle;
            setSelectedVehicle(nextSelectedVehicle);
            setVehiclesError(null);
            setIsOfflineVehicles(false);
            setLastVehiclesSyncedAt(new Date().toISOString());

            // Replace cached vehicles so an offline refresh does not restore
            // the deleted record. Cache failures must not undo a saved deletion.
            await saveOfflineVehicles(remainingVehicles).catch(() => {});

            if (
                deleteUpdateVersionRef.current === updateVersion &&
                accountIdRef.current === userId &&
                auth.currentUser?.uid === userId
            ) {
                // Reconcile other devices' changes and confirm the latest list.
                void refreshVehicles();
            }

            return result;
        } finally {
            if (deleteUpdateVersionRef.current === updateVersion) {
                deleteUpdateInProgressRef.current = false;
                setIsDeletingVehicle(false);
            }
        }
    }, [refreshVehicles]);

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
            setPrimaryVehicle,
            isSettingPrimaryVehicle,
            updateVehicle,
            isUpdatingVehicle,
            deleteVehicle,
            isDeletingVehicle,
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
