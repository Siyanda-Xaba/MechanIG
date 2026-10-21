import { get, push, ref, set, update } from 'firebase/database';
import { auth, database } from '../firebase/firebase';

function normalizeVehicle(vehicle, id) {
    return {
        id,
        make: vehicle.make?.trim() || 'N/A',
        model: vehicle.model?.trim() || 'N/A',
        year: Number.isInteger(Number(vehicle.year)) && Number(vehicle.year) >= 1900 ? Number(vehicle.year) : null,
        color: vehicle.color?.trim() || 'N/A',
        fuelType: vehicle.fuelType?.trim() || 'N/A',
        registration: vehicle.registration?.trim() || vehicle.licensePlate?.trim() || 'N/A',
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
    const year = Number(input.year);
    const currentYear = new Date().getFullYear() + 1;
    if (!input.make?.trim() || !input.model?.trim() || !Number.isInteger(year) || year < 1900 || year > currentYear || !input.color?.trim() || !input.fuelType?.trim() || !input.registration?.trim()) {
        throw new Error('Enter the vehicle make, model, year, colour, fuel type, and registration before saving.');
    }
    const vehiclesRef = ref(database, `users/${currentUser.uid}/vehicles`);
    const vehicleRef = push(vehiclesRef);
    const vehicle = {
        ...input,
        make: input.make.trim(),
        model: input.model.trim(),
        year,
        color: input.color.trim(),
        fuelType: input.fuelType.trim(),
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
