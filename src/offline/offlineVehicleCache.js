import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from '../firebase/firebase';

const STORAGE_PREFIX =
    '@mechaniq/offline/vehicles/v1/';

const CACHE_VERSION = 1;

function getStorageKey(uid) {
    return (
        STORAGE_PREFIX +
        encodeURIComponent(uid)
    );
}

function isCurrentUser(uid) {
    return (
        !!uid &&
        auth.currentUser?.uid === uid &&
        auth.currentUser?.emailVerified === true
    );
}

/**
 * Keep only the vehicle information needed
 * for basic offline dashboard display.
 *
 * Do not store registration numbers, VINs,
 * or other sensitive vehicle identifiers
 * in unencrypted AsyncStorage.
 */
function prepareVehicleForCache(vehicle) {
    if (
        !vehicle ||
        typeof vehicle.id !== 'string' ||
        typeof vehicle.make !== 'string' ||
        typeof vehicle.model !== 'string'
    ) {
        return null;
    }

    return {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,

        year:
            typeof vehicle.year === 'number' &&
            Number.isFinite(vehicle.year)
                ? vehicle.year
                : null,

        color:
            typeof vehicle.color === 'string'
                ? vehicle.color
                : '',

        fuelType:
            typeof vehicle.fuelType === 'string'
                ? vehicle.fuelType
                : '',

        isPrimary:
            vehicle.isPrimary === true,

        modelKey:
            typeof vehicle.modelKey === 'string'
                ? vehicle.modelKey
                : null,
    };
}

/**
 * Save vehicle information only for the
 * currently authenticated, verified user.
 *
 * The caller must only invoke this after
 * successfully retrieving trusted vehicle
 * information from the backend.
 *
 * This function does not perform synchronization
 * or verify that the backend is reachable.
 */
export async function saveOfflineVehicles(vehicles) {
    const uid = auth.currentUser?.uid;

    if (!isCurrentUser(uid)) {
        throw new Error(
            'A verified authenticated account is required.'
        );
    }

    if (!Array.isArray(vehicles)) {
        throw new Error(
            'Vehicle data must be an array.'
        );
    }

    const cachedVehicles =
        vehicles
            .map(prepareVehicleForCache)
            .filter(Boolean);

    if (cachedVehicles.length !== vehicles.length) {
        throw new Error(
            'Vehicle data contains invalid records.'
        );
    }

    const record = {
        version: CACHE_VERSION,
        uid,
        savedAt: new Date().toISOString(),
        vehicles: cachedVehicles,
    };

    if (!isCurrentUser(uid)) {
        throw new Error(
            'The authenticated account changed.'
        );
    }

    await AsyncStorage.setItem(
        getStorageKey(uid),
        JSON.stringify(record)
    );

    return record;
}

/**
 * Load previously cached vehicle information
 * for the currently authenticated account.
 *
 * Cached information is read-only and must
 * never be treated as current backend data.
 */
export async function loadOfflineVehicles() {
    const uid = auth.currentUser?.uid;

    if (!isCurrentUser(uid)) {
        return null;
    }

    const raw = await AsyncStorage.getItem(
        getStorageKey(uid)
    );

    if (!isCurrentUser(uid) || !raw) {
        return null;
    }

    let record;

    try {
        record = JSON.parse(raw);
    } catch {
        return null;
    }

    if (
        record?.version !== CACHE_VERSION ||
        record?.uid !== uid ||
        typeof record?.savedAt !== 'string' ||
        !Array.isArray(record?.vehicles)
    ) {
        return null;
    }

    const validatedVehicles =
        record.vehicles
            .map(prepareVehicleForCache)
            .filter(Boolean);

    if (
        validatedVehicles.length !==
        record.vehicles.length
    ) {
        return null;
    }

    return {
        vehicles: validatedVehicles,
        savedAt: record.savedAt,
    };
}