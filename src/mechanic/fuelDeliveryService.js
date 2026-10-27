import { auth, database } from '../firebase/firebase';
import { onValue, ref } from 'firebase/database';
import { fuelDeliveryApiRequest } from '../services/fuelDeliveryApi';

/**
 * Mechanic Fuel Delivery Client Service
 *
 * Communicates with the authoritative backend for:
 * - Fetching available requests within the mechanic's service radius
 * - Atomically accepting delivery jobs
 * - Starting travel and broadcasting live GPS coordinates
 * - Updating delivery lifecycle statuses
 */

export async function getAvailableFuelDeliveries(mechanicLocation = null) {
  let query = 'available';
  if (
    mechanicLocation &&
    Number.isFinite(Number(mechanicLocation.latitude)) &&
    Number.isFinite(Number(mechanicLocation.longitude))
  ) {
    query += `?latitude=${mechanicLocation.latitude}&longitude=${mechanicLocation.longitude}`;
  }

  const result = await fuelDeliveryApiRequest(query);
  return result?.deliveries || [];
}

export async function getActiveFuelDelivery() {
  const result = await fuelDeliveryApiRequest('');
  return result?.activeDelivery || null;
}

export async function declineFuelDelivery(deliveryId) {
  if (!deliveryId) throw new Error('A delivery ID is required to decline.');
  return await fuelDeliveryApiRequest(`${deliveryId}/decline`, { method: 'POST' });
}

export async function acceptFuelDelivery(deliveryId) {
  if (!deliveryId) throw new Error('A delivery ID is required to accept.');
  return await fuelDeliveryApiRequest(`${deliveryId}/accept`, {
    method: 'POST',
  });
}

export async function startFuelDeliveryTrip(deliveryId, mechanicLocation) {
  if (!deliveryId) throw new Error('A delivery ID is required.');
  if (
    !mechanicLocation ||
    !Number.isFinite(Number(mechanicLocation.latitude)) ||
    !Number.isFinite(Number(mechanicLocation.longitude))
  ) {
    throw new Error('Your current GPS location is required to start the trip.');
  }

  return await fuelDeliveryApiRequest(`${deliveryId}/travel/start`, {
    method: 'POST',
    body: {
      mechanicLocation: {
        latitude: Number(mechanicLocation.latitude),
        longitude: Number(mechanicLocation.longitude),
      },
    },
  });
}

export async function updateFuelDeliveryLocation(deliveryId, location) {
  if (!deliveryId) throw new Error('A delivery ID is required.');
  if (
    !location ||
    !Number.isFinite(Number(location.latitude)) ||
    !Number.isFinite(Number(location.longitude))
  ) {
    throw new Error('Valid GPS coordinates are required.');
  }

  return await fuelDeliveryApiRequest(`${deliveryId}/location`, {
    method: 'POST',
    body: {
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    },
  });
}

export async function updateFuelDeliveryStatus(deliveryId, status, reason = null) {
  if (!deliveryId) throw new Error('A delivery ID is required.');
  return await fuelDeliveryApiRequest(`${deliveryId}/status`, {
    method: 'POST',
    body: { status, reason },
  });
}


export function subscribeToMechanicFuelDeliveryChanges(onChange, onError) {
  const user = auth.currentUser;
  if (!user) return () => {};
  return onValue(ref(database, `fuel_mechanic_pending/${user.uid}`), () => onChange(), onError);
}
