import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

import { auth } from '../firebase/firebase';

/**
 * MechanIQ Emergency Request Storage
 *
 * Stores locally prepared Emergency Fuel and
 * Emergency Mechanic requests using SecureStore.
 *
 * Emergency requests belong exclusively to
 * registered MechanIQ Customers.
 *
 * Important:
 * - Local records are NOT backend requests.
 * - Saving a request does NOT dispatch assistance.
 * - Submission requires explicit user confirmation.
 * - Records are separated by Firebase account UID.
 * - Backend authorization must enforce Customer access.
 */

const STORAGE_PREFIX = 'mechaniq.emergency.v1';

const MAX_REQUESTS_PER_OWNER = 20;

const MAX_REQUEST_LENGTH = 3500;

let storageQueue = Promise.resolve();

/**
 * Serialize storage operations to avoid overlapping
 * reads and writes within this JavaScript runtime.
 */
function serializeStorageOperation(operation) {
    const result = storageQueue.then(
        operation,
        operation
    );

    storageQueue = result.then(
        () => undefined,
        () => undefined
    );

    return result;
}

function isNonEmptyString(value) {
    return (
        typeof value === 'string' &&
        value.trim().length > 0
    );
}

/**
 * Only authenticated Customer ownership records
 * are supported.
 *
 * accountId must contain the Customer's Firebase UID.
 */
function isValidOwner(owner) {
    return (
        owner !== null &&
        typeof owner === 'object' &&
        !Array.isArray(owner) &&
        owner.type === 'customer' &&
        isNonEmptyString(owner.accountId)
    );
}

function ownersMatch(first, second) {
    return (
        isValidOwner(first) &&
        isValidOwner(second) &&
        first.accountId === second.accountId
    );
}

/**
 * Require a matching authenticated Firebase account
 * before accessing locally stored requests.
 *
 * A previously authenticated Firebase session may
 * remain available while the device is offline.
 *
 * This function does not independently verify the
 * user's Customer role. Role authorization must
 * also be enforced by the service and backend.
 *
 * @param {import('./emergencyTypes').EmergencyRequestOwner} owner
 */
async function requireStorageOwner(owner) {
    if (!isValidOwner(owner)) {
        throw new Error(
            'A valid Customer account is required for emergency request storage.'
        );
    }

    const firebaseUser = auth.currentUser;

    if (
        !firebaseUser ||
        firebaseUser.uid !== owner.accountId ||
        firebaseUser.emailVerified !== true
    ) {
        throw new Error(
            'Emergency request storage requires the matching verified Firebase account.'
        );
    }
}

function getOwnerIdentifier(owner) {
    return `customer:${owner.accountId}`;
}

/**
 * Generate a storage index key from the account UID.
 *
 * Hashing avoids exposing the Firebase UID directly
 * in the SecureStore key name.
 */
async function getOwnerIndexKey(owner) {
    const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        getOwnerIdentifier(owner)
    );

    return `${STORAGE_PREFIX}.index.${hash}`;
}

function getRequestKey(localId) {
    if (
        typeof localId !== 'string' ||
        !/^[a-f0-9-]{36}$/i.test(localId)
    ) {
        throw new Error(
            'Invalid emergency request identifier.'
        );
    }

    return `${STORAGE_PREFIX}.request.${localId}`;
}

/**
 * Validate the basic structure of a request.
 *
 * These checks protect local storage consistency.
 * They are not a substitute for backend validation.
 */
function validateRequest(request) {
    if (
        !request ||
        typeof request !== 'object' ||
        Array.isArray(request) ||
        !isValidOwner(request.owner) ||
        !isNonEmptyString(request.localId) ||
        !isNonEmptyString(request.clientRequestId) ||
        !isNonEmptyString(request.createdAt) ||
        !isNonEmptyString(request.updatedAt)
    ) {
        throw new Error(
            'Invalid emergency request information.'
        );
    }

    getRequestKey(request.localId);

    if (
        request.serviceType !== 'fuel' &&
        request.serviceType !== 'mechanic'
    ) {
        throw new Error(
            'Unsupported emergency service type.'
        );
    }

    const supportedStatuses = [
        'saved',
        'submitting',
        'submission_failed',
        'submitted',
        'cancelled',
    ];

    if (!supportedStatuses.includes(request.status)) {
        throw new Error(
            'Invalid emergency request status.'
        );
    }

    if (
        !request.contact ||
        typeof request.contact !== 'object' ||
        !request.location ||
        typeof request.location !== 'object' ||
        !request.details ||
        typeof request.details !== 'object'
    ) {
        throw new Error(
            'Emergency request details are incomplete.'
        );
    }

    if (
        request.backendRequestId !== null &&
        !isNonEmptyString(request.backendRequestId)
    ) {
        throw new Error(
            'Invalid backend request identifier.'
        );
    }

    if (
        request.status === 'submitted' &&
        !isNonEmptyString(request.backendRequestId)
    ) {
        throw new Error(
            'A submitted request requires a backend request identifier.'
        );
    }
}

/**
 * Read the saved request IDs belonging to one
 * authenticated Customer.
 */
async function readRequestIndex(owner) {
    await requireStorageOwner(owner);

    const indexKey = await getOwnerIndexKey(owner);

    await requireStorageOwner(owner);

    const stored = await SecureStore.getItemAsync(
        indexKey
    );

    await requireStorageOwner(owner);

    if (stored === null) {
        return [];
    }

    let requestIds;

    try {
        requestIds = JSON.parse(stored);
    } catch {
        throw new Error(
            'Unable to read saved emergency requests.'
        );
    }

    if (
        !Array.isArray(requestIds) ||
        requestIds.length > MAX_REQUESTS_PER_OWNER
    ) {
        throw new Error(
            'Saved emergency request index is invalid.'
        );
    }

    for (const requestId of requestIds) {
        getRequestKey(requestId);
    }

    if (new Set(requestIds).size !== requestIds.length) {
        throw new Error(
            'Duplicate emergency request identifiers were found.'
        );
    }

    return requestIds;
}

/**
 * Update one Customer's saved request index.
 */
async function writeRequestIndex(owner, requestIds) {
    await requireStorageOwner(owner);

    const indexKey = await getOwnerIndexKey(owner);

    await requireStorageOwner(owner);

    await SecureStore.setItemAsync(
        indexKey,
        JSON.stringify(requestIds)
    );

    await requireStorageOwner(owner);
}

/**
 * Load saved emergency requests belonging to
 * the specified authenticated Customer.
 *
 * @param {import('./emergencyTypes').EmergencyRequestOwner} owner
 * @returns {Promise<import('./emergencyTypes').EmergencyRequest[]>}
 */
export async function loadEmergencyRequests(owner) {
    return serializeStorageOperation(async () => {
        const requestIds = await readRequestIndex(owner);

        const requests = [];

        for (const requestId of requestIds) {
            await requireStorageOwner(owner);

            const stored = await SecureStore.getItemAsync(
                getRequestKey(requestId)
            );

            await requireStorageOwner(owner);

            if (stored === null) {
                throw new Error(
                    'A saved emergency request could not be found.'
                );
            }

            let request;

            try {
                request = JSON.parse(stored);
            } catch {
                throw new Error(
                    'Unable to read a saved emergency request.'
                );
            }

            validateRequest(request);

            if (
                request.localId !== requestId ||
                !ownersMatch(request.owner, owner)
            ) {
                throw new Error(
                    'Saved emergency request ownership is invalid.'
                );
            }

            requests.push(request);
        }

        return requests;
    });
}

/**
 * Save or update a locally prepared emergency
 * request for the authenticated Customer.
 *
 * This function performs no backend submission.
 *
 * @param {import('./emergencyTypes').EmergencyRequest} request
 */
export async function saveEmergencyRequest(request) {
    return serializeStorageOperation(async () => {
        validateRequest(request);

        await requireStorageOwner(request.owner);

        const requestIds = await readRequestIndex(
            request.owner
        );

        const existingIndex = requestIds.indexOf(
            request.localId
        );

        if (
            existingIndex < 0 &&
            requestIds.length >= MAX_REQUESTS_PER_OWNER
        ) {
            throw new Error(
                'The maximum number of saved emergency requests has been reached.'
            );
        }

        const requestKey = getRequestKey(
            request.localId
        );

        if (existingIndex >= 0) {
            const previousValue =
                await SecureStore.getItemAsync(
                    requestKey
                );

            await requireStorageOwner(request.owner);

            if (previousValue === null) {
                throw new Error(
                    'The existing emergency request could not be found.'
                );
            }

            let previous;

            try {
                previous = JSON.parse(previousValue);
            } catch {
                throw new Error(
                    'The existing emergency request is invalid.'
                );
            }

            validateRequest(previous);

            if (
                !ownersMatch(
                    previous.owner,
                    request.owner
                ) ||
                previous.clientRequestId !==
                    request.clientRequestId ||
                previous.serviceType !==
                    request.serviceType
            ) {
                throw new Error(
                    'Emergency request identity cannot change.'
                );
            }
        }

        const serialized = JSON.stringify(request);

        if (serialized.length > MAX_REQUEST_LENGTH) {
            throw new Error(
                'Emergency request details are too large to save securely.'
            );
        }

        await requireStorageOwner(request.owner);

        await SecureStore.setItemAsync(
            requestKey,
            serialized
        );

        await requireStorageOwner(request.owner);

        if (existingIndex < 0) {
            await writeRequestIndex(
                request.owner,
                [...requestIds, request.localId]
            );
        }

        return request;
    });
}

/**
 * Delete a locally saved emergency request.
 *
 * Deletion does not cancel any request that
 * may already exist on the backend.
 *
 * @param {import('./emergencyTypes').EmergencyRequestOwner} owner
 * @param {string} localId
 * @returns {Promise<boolean>}
 */
export async function deleteEmergencyRequest(
    owner,
    localId
) {
    return serializeStorageOperation(async () => {
        const requestIds = await readRequestIndex(owner);

        if (!requestIds.includes(localId)) {
            return false;
        }

        const remaining = requestIds.filter(
            (requestId) => requestId !== localId
        );

        /**
         * Remove the index reference first.
         *
         * If deletion is interrupted, an unreferenced
         * record may remain in SecureStore, but it
         * will no longer appear in the saved list.
         */
        await writeRequestIndex(
            owner,
            remaining
        );

        await requireStorageOwner(owner);

        await SecureStore.deleteItemAsync(
            getRequestKey(localId)
        );

        await requireStorageOwner(owner);

        return true;
    });
}