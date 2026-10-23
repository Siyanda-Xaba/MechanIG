import {
    get,
    push,
    ref,
    runTransaction,
} from 'firebase/database';

import {
    auth,
    database,
} from '../firebase/firebase';

function normalizeVehicle(vehicle, id) {
    return {
        id,
        make: vehicle.make ?? 'Unknown make',
        model: vehicle.model ?? 'Unknown model',
        year:
            Number(vehicle.year) ||
            new Date().getFullYear(),
        color: vehicle.color ?? '',
        fuelType: vehicle.fuelType ?? '',
        registration:
            vehicle.registration ??
            vehicle.licensePlate ??
            '',
        isPrimary: vehicle.isPrimary === true,
        modelKey: vehicle.modelKey ?? null,
    };
}

function isValidLegacyVehicle(vehicle) {
    return Boolean(
        vehicle &&
        typeof vehicle === 'object' &&
        vehicle.make &&
        vehicle.model
    );
}

function getVehicleEntries(profile) {
    const storedVehicles =
        profile?.vehicles &&
        typeof profile.vehicles === 'object' &&
        !Array.isArray(profile.vehicles)
            ? profile.vehicles
            : {};

    const entries = Object.entries(
        storedVehicles
    ).filter(
        ([, vehicle]) =>
            vehicle &&
            typeof vehicle === 'object'
    );

    // Earlier accounts saved a vehicle at users/{uid}/vehicle.
    if (
        isValidLegacyVehicle(profile?.vehicle) &&
        !entries.some(
            ([id]) => id === 'primary-vehicle'
        )
    ) {
        const hasPrimary = entries.some(
            ([, vehicle]) =>
                vehicle.isPrimary === true
        );

        entries.unshift([
            'primary-vehicle',
            {
                ...profile.vehicle,
                isPrimary: !hasPrimary,
            },
        ]);
    }

    return entries;
}

export async function getUserVehicles() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        return [];
    }

    const snapshot = await get(
        ref(database, `users/${currentUser.uid}`)
    );

    if (!snapshot.exists()) {
        return [];
    }

    return getVehicleEntries(snapshot.val()).map(
        ([id, vehicle]) =>
            normalizeVehicle(vehicle, id)
    );
}

export async function createUserVehicle(input) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error(
            'You must be signed in to add a vehicle.'
        );
    }

    const userId = currentUser.uid;
    const profileRef = ref(database, `users/${userId}`);
    const profileSnapshot = await get(profileRef);

    if (!profileSnapshot.exists()) {
        throw new Error(
            'Your account profile could not be found.'
        );
    }

    const profile = profileSnapshot.val();

    if (auth.currentUser?.uid !== userId) {
        throw new Error(
            'Your account changed while adding the vehicle.'
        );
    }

    const vehiclesRef = ref(
        database,
        `users/${userId}/vehicles`
    );
    const newVehicleRef = push(vehiclesRef);
    const vehicleId = newVehicleRef.key;

    if (!vehicleId) {
        throw new Error('Unable to generate a vehicle ID.');
    }

    const vehicle = {
        ...input,
        registration:
            input.registration.trim().toUpperCase(),
        isPrimary: input.isPrimary === true,
        createdAt: new Date().toISOString(),
    };

    const result = await runTransaction(
        vehiclesRef,
        (currentVehicles) => {
            const updatedVehicles =
                currentVehicles &&
                typeof currentVehicles === 'object' &&
                !Array.isArray(currentVehicles)
                    ? { ...currentVehicles }
                    : {};

            if (
                isValidLegacyVehicle(profile.vehicle) &&
                !updatedVehicles['primary-vehicle']
            ) {
                const existingPrimary = Object.values(
                    updatedVehicles
                ).some(
                    (existingVehicle) =>
                        existingVehicle?.isPrimary === true
                );

                updatedVehicles['primary-vehicle'] = {
                    ...profile.vehicle,
                    isPrimary:
                        !vehicle.isPrimary &&
                        !existingPrimary,
                };
            }

            if (vehicle.isPrimary) {
                for (const id of Object.keys(updatedVehicles)) {
                    const existingVehicle = updatedVehicles[id];

                    if (
                        existingVehicle &&
                        typeof existingVehicle === 'object'
                    ) {
                        updatedVehicles[id] = {
                            ...existingVehicle,
                            isPrimary: false,
                        };
                    }
                }
            }

            updatedVehicles[vehicleId] = vehicle;
            return updatedVehicles;
        },
        { applyLocally: false }
    );

    if (!result.committed) {
        throw new Error(
            'The vehicle could not be saved. Please try again.'
        );
    }

    if (auth.currentUser?.uid !== userId) {
        throw new Error(
            'Your account changed while saving the vehicle.'
        );
    }

    return normalizeVehicle(vehicle, vehicleId);
}

/**
 * Persist the default vehicle. The caller should select the
 * returned vehicle only after Firebase confirms the transaction.
 */
export async function setPrimaryUserVehicle(vehicleId) {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
        throw new Error(
            'You must be signed in to change your primary vehicle.'
        );
    }

    if (typeof vehicleId !== 'string' || !vehicleId.trim()) {
        throw new Error('Select a valid vehicle.');
    }

    const userId = firebaseUser.uid;
    const targetId = vehicleId.trim();
    const profileRef = ref(database, `users/${userId}`);
    const profileSnapshot = await get(profileRef);

    if (!profileSnapshot.exists()) {
        throw new Error('Your account profile could not be found.');
    }

    const profile = profileSnapshot.val();

    if (auth.currentUser?.uid !== userId) {
        throw new Error('Your account changed. Please try again.');
    }

    // Reject a vehicle not already associated with this account.
    const targetExists = getVehicleEntries(profile).some(
        ([id]) => id === targetId
    );

    if (!targetExists) {
        throw new Error('Vehicle not found. Refresh your vehicles and try again.');
    }

    const vehiclesRef = ref(database, `users/${userId}/vehicles`);

    const result = await runTransaction(
        vehiclesRef,
        (currentVehicles) => {
            const updatedVehicles =
                currentVehicles &&
                typeof currentVehicles === 'object' &&
                !Array.isArray(currentVehicles)
                    ? { ...currentVehicles }
                    : {};

            // A legacy vehicle must become a persisted record before
            // its primary status can be changed safely.
            if (
                isValidLegacyVehicle(profile.vehicle) &&
                !updatedVehicles['primary-vehicle']
            ) {
                updatedVehicles['primary-vehicle'] = {
                    ...profile.vehicle,
                    isPrimary: false,
                };
            }

            const target = updatedVehicles[targetId];

            // Returning undefined aborts if the vehicle was removed.
            if (!target || typeof target !== 'object') {
                return;
            }

            for (const id of Object.keys(updatedVehicles)) {
                const vehicle = updatedVehicles[id];

                if (vehicle && typeof vehicle === 'object') {
                    updatedVehicles[id] = {
                        ...vehicle,
                        isPrimary: id === targetId,
                    };
                }
            }

            return updatedVehicles;
        },
        { applyLocally: false }
    );

    if (!result.committed) {
        throw new Error('Unable to update the primary vehicle. Refresh and try again.');
    }

    if (auth.currentUser?.uid !== userId) {
        throw new Error('Your account changed while saving. Please sign in again.');
    }

    const savedVehicle = result.snapshot.val()?.[targetId];

    if (!savedVehicle?.isPrimary) {
        throw new Error('Unable to confirm the primary vehicle change.');
    }

    return normalizeVehicle(savedVehicle, targetId);
}

/**
 * Edit an existing vehicle belonging to the current Firebase account.
 *
 * This operation intentionally does not change the vehicle ID, primary
 * designation, creation time, or account association. Those have separate
 * flows. All edits are persisted before the updated vehicle is returned.
 *
 * Legacy registration vehicles are copied to the canonical vehicles map
 * when first edited, so subsequent reads use the same stable vehicle ID.
 */
export async function updateUserVehicle(vehicleId, input) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error('You must be signed in to edit a vehicle.');
    }

    if (typeof vehicleId !== 'string' || !vehicleId.trim()) {
        throw new Error('Select a valid vehicle to edit.');
    }

    const userId = currentUser.uid;
    const targetId = vehicleId.trim();

    // Validate at the service boundary as well as in the form.
    // Only editable vehicle fields are accepted.
    const make = typeof input?.make === 'string' ? input.make.trim() : '';
    const model = typeof input?.model === 'string' ? input.model.trim() : '';
    const color = typeof input?.color === 'string' ? input.color.trim() : '';
    const fuelType = typeof input?.fuelType === 'string' ? input.fuelType.trim() : '';
    const registration = typeof input?.registration === 'string'
        ? input.registration.trim().toUpperCase()
        : '';
    const year = Number(input?.year);

    if (!make || !model || !color || !fuelType || !registration) {
        throw new Error('Complete all vehicle information before saving.');
    }

    if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > new Date().getFullYear() + 1
    ) {
        throw new Error('Enter a valid vehicle year.');
    }

    const profileRef = ref(database, `users/${userId}`);
    const profileSnapshot = await get(profileRef);

    if (!profileSnapshot.exists()) {
        throw new Error('Your account profile could not be found.');
    }

    const profile = profileSnapshot.val();

    if (auth.currentUser?.uid !== userId) {
        throw new Error('Your account changed while editing the vehicle.');
    }

    if (!getVehicleEntries(profile).some(([id]) => id === targetId)) {
        throw new Error('Vehicle not found. Refresh your vehicles and try again.');
    }

    const vehiclesRef = ref(database, `users/${userId}/vehicles`);
    const result = await runTransaction(
        vehiclesRef,
        (currentVehicles) => {
            const updatedVehicles =
                currentVehicles &&
                typeof currentVehicles === 'object' &&
                !Array.isArray(currentVehicles)
                    ? { ...currentVehicles }
                    : {};

            // A vehicle stored by older registrations may not yet have a
            // canonical record. Migrate it without changing another primary.
            if (
                targetId === 'primary-vehicle' &&
                !updatedVehicles[targetId] &&
                isValidLegacyVehicle(profile.vehicle)
            ) {
                const hasAnotherPrimary = Object.values(updatedVehicles).some(
                    (vehicle) => vehicle?.isPrimary === true
                );

                updatedVehicles[targetId] = {
                    ...profile.vehicle,
                    isPrimary: !hasAnotherPrimary,
                };
            }

            const existingVehicle = updatedVehicles[targetId];

            // Aborting here prevents a removed vehicle from being recreated.
            if (!existingVehicle || typeof existingVehicle !== 'object') {
                return;
            }

            const vehicleIdentityChanged =
                existingVehicle.make !== make ||
                existingVehicle.model !== model ||
                Number(existingVehicle.year) !== year;

            updatedVehicles[targetId] = {
                ...existingVehicle,
                make,
                model,
                year,
                color,
                fuelType,
                registration,
                // A model mapping associated with the previous make/model/year
                // cannot be assumed compatible with the edited vehicle.
                modelKey: vehicleIdentityChanged
                    ? null
                    : existingVehicle.modelKey ?? null,
                updatedAt: new Date().toISOString(),
            };

            return updatedVehicles;
        },
        { applyLocally: false }
    );

    if (!result.committed) {
        throw new Error('Unable to save vehicle changes. Refresh and try again.');
    }

    if (auth.currentUser?.uid !== userId) {
        throw new Error('Your account changed while saving the vehicle.');
    }

    const savedVehicle = result.snapshot.val()?.[targetId];

    if (!savedVehicle) {
        throw new Error('Unable to confirm the saved vehicle changes.');
    }

    return normalizeVehicle(savedVehicle, targetId);
}


/**
 * Delete a vehicle from the authenticated account.
 *
 * This is an explicit, irreversible user action: the UI must obtain
 * confirmation before calling this service. The same transaction also
 * updates the primary vehicle and removes legacy registration data when
 * the legacy vehicle is deleted.
 *
 * Other account details and service history are not modified here.
 */
export async function deleteUserVehicle(vehicleId) {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
        throw new Error('You must be signed in to delete a vehicle.');
    }

    if (typeof vehicleId !== 'string' || !vehicleId.trim()) {
        throw new Error('Select a valid vehicle to delete.');
    }

    const userId = firebaseUser.uid;
    const targetId = vehicleId.trim();
    const profileRef = ref(database, `users/${userId}`);

    // A transaction on the full profile lets us delete BOTH forms of a
    // legacy vehicle: users/{uid}/vehicle and vehicles/primary-vehicle.
    // It also keeps primary designation consistent within the same write.
    const result = await runTransaction(
        profileRef,
        (currentProfile) => {
            if (
                auth.currentUser?.uid !== userId ||
                !currentProfile ||
                typeof currentProfile !== 'object'
            ) {
                return; // Abort if the account changed or no longer exists.
            }

            const existingVehicles =
                currentProfile.vehicles &&
                typeof currentProfile.vehicles === 'object' &&
                !Array.isArray(currentProfile.vehicles)
                    ? currentProfile.vehicles
                    : {};

            const vehicles = { ...existingVehicles };
            const hasLegacyVehicle = isValidLegacyVehicle(
                currentProfile.vehicle
            );

            // If a legacy vehicle is still stored at profile.vehicle,
            // migrate it before deleting another vehicle. This prevents
            // the original vehicle from disappearing accidentally.
            if (
                hasLegacyVehicle &&
                targetId !== 'primary-vehicle' &&
                !vehicles['primary-vehicle']
            ) {
                const hasPrimary = Object.values(vehicles).some(
                    (vehicle) => vehicle?.isPrimary === true
                );

                vehicles['primary-vehicle'] = {
                    ...currentProfile.vehicle,
                    isPrimary: !hasPrimary,
                };
            }

            const hasStoredTarget =
                vehicles[targetId] &&
                typeof vehicles[targetId] === 'object';
            const deletingLegacy =
                targetId === 'primary-vehicle' && hasLegacyVehicle;

            if (!hasStoredTarget && !deletingLegacy) {
                return; // Already removed: never recreate a stale record.
            }

            delete vehicles[targetId];

            const nextProfile = {
                ...currentProfile,
                vehicles,
            };

            // Simply deleting the canonical record is insufficient:
            // getUserVehicles would otherwise restore the legacy entry.
            if (targetId === 'primary-vehicle') {
                delete nextProfile.vehicle;
            }

            const remainingIds = Object.keys(vehicles).filter(
                (id) => vehicles[id] && typeof vehicles[id] === 'object'
            );

            // Preserve an existing primary if possible. If it was the
            // deleted vehicle, promote another in the same transaction.
            // Having no vehicles is a valid empty state.
            if (remainingIds.length > 0) {
                const existingPrimaryId = remainingIds.find(
                    (id) => vehicles[id].isPrimary === true
                );
                const nextPrimaryId = existingPrimaryId ?? remainingIds[0];

                for (const id of remainingIds) {
                    vehicles[id] = {
                        ...vehicles[id],
                        isPrimary: id === nextPrimaryId,
                    };
                }
            }

            return nextProfile;
        },
        { applyLocally: false }
    );

    if (!result.committed) {
        throw new Error(
            'Unable to delete the vehicle. Refresh your vehicles and try again.'
        );
    }

    // Do not expose a result from a session that switched accounts.
    if (auth.currentUser?.uid !== userId) {
        throw new Error('Your account changed while deleting the vehicle.');
    }

    const confirmedProfile = result.snapshot.val();
    const remainingVehicles = getVehicleEntries(confirmedProfile).map(
        ([id, vehicle]) => normalizeVehicle(vehicle, id)
    );

    if (remainingVehicles.some((vehicle) => vehicle.id === targetId)) {
        throw new Error('Unable to confirm that the vehicle was removed.');
    }

    const primaryVehicle =
        remainingVehicles.find((vehicle) => vehicle.isPrimary) ?? null;

    return {
        deletedVehicleId: targetId,
        primaryVehicleId: primaryVehicle?.id ?? null,
    };
}
