import { get, push, ref, set, update } from 'firebase/database';
import { auth, database } from '../firebase/firebase';

function normalizeVehicle(vehicle, id) {
    return {
        id,
        make: vehicle.make ?? 'Unknown make',
        model: vehicle.model ?? 'Unknown model',
        year: Number(vehicle.year) || new Date().getFullYear(),
        color: vehicle.color ?? '',
        fuelType: vehicle.fuelType ?? '',
        registration: vehicle.registration ?? vehicle.licensePlate ?? '',
        isPrimary: vehicle.isPrimary === true,
        modelKey: vehicle.modelKey ?? null,
    };
}

export async function getUserVehicles() {
    const currentUser = auth.currentUser;
    if (!currentUser)
        return [];
    const snapshot = await get(ref(database, `users/${currentUser.uid}`));
    if (!snapshot.exists())
        return [];
    const profile = snapshot.val();
    if (profile.vehicles && typeof profile.vehicles === 'object') {
        return Object.entries(profile.vehicles).map(([id, vehicle]) => normalizeVehicle(vehicle, id));
    }
    // Accounts created before multiple vehicles were supported retain the
    // vehicle collected during registration at profile.vehicle.
    if (profile.vehicle?.make && profile.vehicle?.model) {
        return [normalizeVehicle(profile.vehicle, 'primary-vehicle')];
    }
    return [];
}

export async function createUserVehicle(input) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error('You must be signed in to add a vehicle.');
    }
    const vehiclesRef = ref(database, `users/${currentUser.uid}/vehicles`);
    const vehicleRef = push(vehiclesRef);
    const vehicle = {
        ...input,
        registration: input.registration.trim().toUpperCase(),
        createdAt: new Date().toISOString(),
    };
    if (vehicle.isPrimary) {
        const existingVehicles = await get(vehiclesRef);
        const updates = {};
        existingVehicles.forEach((child) => {
            updates[`${child.key}/isPrimary`] = false;
        });
        if (Object.keys(updates).length > 0) {
            await update(vehiclesRef, updates);
        }
    }
    await set(vehicleRef, vehicle);
    return normalizeVehicle(vehicle, vehicleRef.key);
}
