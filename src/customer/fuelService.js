import { get, onValue, push, ref, update } from 'firebase/database';
import { auth, database } from '../firebase/firebase';

const ACTIVE_DELIVERY_STATUSES = new Set(['requested', 'scheduled', 'driver-assigned', 'en-route', 'arrived', 'delivering']);

function requireUser() {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to use fuel delivery.');
  return user;
}

function coordinate(value) {
  if (!value || !Number.isFinite(Number(value.latitude)) || !Number.isFinite(Number(value.longitude))) return null;
  return { latitude: Number(value.latitude), longitude: Number(value.longitude) };
}

function normalizeDelivery(id, value) {
  if (!value || typeof value !== 'object') return null;
  const deliveryLocation = value.deliveryLocation ?? {};
  const driver = value.driver ?? null;
  return {
    id, status: value.status ?? 'requested', requestType: value.requestType ?? 'standard',
    fuelType: value.fuelType ?? '', quantityLitres: Number(value.quantityLitres) || 0,
    vehicleId: value.vehicleId ?? null,
    destination: coordinate(value.destination ?? deliveryLocation.coordinate),
    destinationLabel: value.destinationLabel ?? deliveryLocation.label ?? deliveryLocation.address ?? null,
    estimatedArrivalMinutes: Number.isFinite(Number(value.estimatedArrivalMinutes)) ? Number(value.estimatedArrivalMinutes) : null,
    driver: driver ? { name: driver.name ?? 'Delivery driver', vehicle: driver.vehicle ?? null, phone: driver.phone ?? null, location: coordinate(driver.location) } : null,
    routeCoordinates: Array.isArray(value.routeCoordinates) ? value.routeCoordinates.map(coordinate).filter(Boolean) : [],
    updatedAt: value.updatedAt ?? value.createdAt ?? null, createdAt: value.createdAt ?? null,
  };
}

function historyFromDelivery(id, value) {
  const delivery = normalizeDelivery(id, value);
  if (!delivery) return null;
  const status = delivery.status.replace(/-/g, ' ');
  const label = status.replace(/\b\w/g, (letter) => letter.toUpperCase());
  return { id, title: `Fuel delivery ${label}`, description: `${delivery.quantityLitres} L of ${delivery.fuelType || 'fuel'}`, occurredAt: delivery.updatedAt ?? delivery.createdAt ?? '', status: label, timestamp: delivery.updatedAt ?? delivery.createdAt ?? '' };
}

export async function getCustomerFuelData(vehicleId) {
  const user = requireUser();
  if (!vehicleId) return null;
  const vehiclePath = vehicleId === 'primary-vehicle'
    ? `users/${user.uid}/vehicle`
    : `users/${user.uid}/vehicles/${vehicleId}`;
  const [vehicleSnapshot, deliveriesSnapshot] = await Promise.all([
    get(ref(database, vehiclePath)),
    get(ref(database, `users/${user.uid}/fuelDeliveries`)),
  ]);
  const vehicle = vehicleSnapshot.val() ?? {};
  const deliveries = Object.entries(deliveriesSnapshot.val() ?? {});
  const active = deliveries.map(([id, delivery]) => normalizeDelivery(id, delivery)).find((delivery) => delivery?.vehicleId === vehicleId && ACTIVE_DELIVERY_STATUSES.has(delivery.status));
  return {
    // The vehicle profile may contain old/manual values. These metrics only
    // count as live when they come from a current OBD session (PID 2F for fuel
    // level). This screen has no shared live OBD session, so keep them N/A.
    fuelLevel: null,
    estimatedRangeKm: null,
    fuelType: vehicle.fuelType ?? null,
    compatibleFuelTypes: Array.isArray(vehicle.compatibleFuelTypes) ? vehicle.compatibleFuelTypes : (vehicle.fuelType ? [vehicle.fuelType] : []),
    nearestStation: null, activeDeliveryId: active?.id ?? null, activeDeliveryStatus: active?.status ?? null,
    recentActivity: deliveries.map(([id, delivery]) => historyFromDelivery(id, delivery)).filter(Boolean).sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp))).slice(0, 5),
  };
}

export async function getFuelHistory(vehicleId) {
  const user = requireUser();
  if (!vehicleId) return [];
  const snapshot = await get(ref(database, `users/${user.uid}/fuelDeliveries`));
  return Object.entries(snapshot.val() ?? {}).filter(([, delivery]) => delivery?.vehicleId === vehicleId).map(([id, delivery]) => historyFromDelivery(id, delivery)).filter(Boolean).sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
}

export async function getSavedFuelLocations() {
  const user = requireUser();
  const snapshot = await get(ref(database, `users/${user.uid}/savedFuelLocations`));
  return Object.entries(snapshot.val() ?? {}).map(([id, location]) => ({ id, ...location }));
}

export async function createFuelDeliveryRequest(input) {
  const user = requireUser();
  const destination = coordinate(input.deliveryLocation?.coordinate);
  if (!input.vehicleId || !input.fuelType || !Number.isFinite(Number(input.quantityLitres)) || Number(input.quantityLitres) <= 0 || !destination) throw new Error('Complete the vehicle, fuel type, quantity, and delivery location before submitting.');
  const deliveryRef = push(ref(database, 'fuelDeliveries'));
  const deliveryId = deliveryRef.key;
  if (!deliveryId) throw new Error('Unable to create a delivery request. Please try again.');
  const createdAt = new Date().toISOString();
  const delivery = {
    customerId: user.uid, vehicleId: input.vehicleId, requestType: input.requestType === 'emergency' ? 'emergency' : 'standard', fuelType: input.fuelType, quantityLitres: Number(input.quantityLitres),
    deliveryLocation: { label: input.deliveryLocation.label ?? 'Delivery location', address: input.deliveryLocation.address ?? null, coordinate: destination },
    destination, destinationLabel: input.deliveryLocation.label ?? input.deliveryLocation.address ?? 'Delivery location', scheduledFor: input.scheduledFor ?? null,
    status: 'requested', createdAt, updatedAt: createdAt,
  };
  await update(ref(database), { [`fuelDeliveries/${deliveryId}`]: delivery, [`users/${user.uid}/fuelDeliveries/${deliveryId}`]: delivery });
  return { deliveryId, ...normalizeDelivery(deliveryId, delivery) };
}

export async function getFuelDeliveryTracking(deliveryId) {
  const user = requireUser();
  if (!deliveryId) return null;
  const snapshot = await get(ref(database, `fuelDeliveries/${deliveryId}`));
  const raw = snapshot.val();
  const delivery = normalizeDelivery(deliveryId, raw);
  if (!delivery || raw.customerId !== user.uid) throw new Error('This fuel delivery was not found.');
  return delivery;
}

export function subscribeToFuelDeliveryTracking(deliveryId, onChange, onError) {
  const user = requireUser();
  if (!deliveryId) return () => {};
  return onValue(ref(database, `fuelDeliveries/${deliveryId}`), (snapshot) => {
    const raw = snapshot.val();
    onChange(raw && raw.customerId === user.uid ? normalizeDelivery(deliveryId, raw) : null);
  }, onError);
}
