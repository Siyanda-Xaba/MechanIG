import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from '../firebase/firebase';

const STORAGE_PREFIX =
    '@mechaniq/offline/account-role/v1/';

const CACHE_VERSION = 1;

const SUPPORTED_ROLES = [
    'customer',
    'mechanic',
];

function getStorageKey(uid) {
    return (
        STORAGE_PREFIX +
        encodeURIComponent(uid)
    );
}

function isSupportedRole(role) {
    return SUPPORTED_ROLES.includes(role);
}

/**
 * Cache a role obtained from a verified backend
 * profile while the account is authenticated.
 *
 * This cache is only a navigation hint.
 * It must never authorize backend operations.
 */
export async function saveOfflineAccountRole(profile) {
    const uid = auth.currentUser?.uid;

    if (
        !uid ||
        profile?.id !== uid ||
        !isSupportedRole(profile?.role)
    ) {
        throw new Error(
            'A verified authenticated profile is required.'
        );
    }

    const record = {
        version: CACHE_VERSION,
        uid,
        role: profile.role,
        savedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
        getStorageKey(uid),
        JSON.stringify(record)
    );

    return record;
}

/**
 * Restore a previously verified role for the
 * currently restored Firebase session.
 *
 * A cached role is not proof that the user's
 * current backend permissions remain valid.
 */
export async function loadOfflineAccountRole() {
    const uid = auth.currentUser?.uid;

    if (!uid) {
        return null;
    }

    const raw = await AsyncStorage.getItem(
        getStorageKey(uid)
    );

    if (auth.currentUser?.uid !== uid) {
        return null;
    }

    if (!raw) {
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
        !isSupportedRole(record?.role) ||
        typeof record?.savedAt !== 'string'
    ) {
        return null;
    }

    return record;
}