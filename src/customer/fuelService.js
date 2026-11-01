import { get, onValue, ref } from 'firebase/database';
import { auth, database } from '../firebase/firebase';
import { broadcastFuelRequest } from '../serviceRequests/broadcastServiceRequestService';
import { formatSouthAfricaDateTime } from '../utils/timeZone';

const ACTIVE_DELIVERY_STATUSES = new Set(['requested', 'scheduled', 'broadcasting', 'awaiting_selection', 'assigned', 'driver-assigned', 'en-route', 'arrived', 'delivering']);

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
    assignedMechanicId: value.assignedMechanicId ?? null,
    assignedMechanicName: value.assignedMechanicName ?? null,
    conversationId: value.conversationId ?? null,
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
  const timestamp = delivery.updatedAt ?? delivery.createdAt ?? '';
  return { id, title: `Fuel request ${label}`, description: `${delivery.quantityLitres} L of ${delivery.fuelType || 'fuel'}`, occurredAt: formatSouthAfricaDateTime(timestamp), status: label, timestamp };
}

export async function getCustomerFuelData(vehicleId) {
  const user = requireUser();
  if (!vehicleId) return null;
  const vehiclePath = vehicleId === 'primary-vehicle'
    ? `users/${user.uid}/vehicle`
    : `users/${user.uid}/vehicles/${vehicleId}`;
  const [vehicleSnapshot, deliveriesSnapshot, requestsSnapshot] = await Promise.all([
    get(ref(database, vehiclePath)),
    get(ref(database, `users/${user.uid}/fuelDeliveries`)),
    get(ref(database, `users/${user.uid}/fuelRequests`)),
  ]);
  const vehicle = vehicleSnapshot.val() ?? {};
  const deliveries = [
    ...Object.entries(deliveriesSnapshot.val() ?? {}),
    ...Object.entries(requestsSnapshot.val() ?? {}),
  ];
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
  const [deliveriesSnapshot, requestsSnapshot] = await Promise.all([
    get(ref(database, `users/${user.uid}/fuelDeliveries`)),
    get(ref(database, `users/${user.uid}/fuelRequests`)),
  ]);
  const all = [deliveriesSnapshot.val() ?? {}, requestsSnapshot.val() ?? {}];
  return all.flatMap((records) => Object.entries(records))
    .filter(([, delivery]) => delivery?.vehicleId === vehicleId)
    .map(([id, delivery]) => historyFromDelivery(id, delivery))
    .filter(Boolean)
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
}

export async function getSavedFuelLocations() {
  const user = requireUser();
  const snapshot = await get(ref(database, `users/${user.uid}/savedFuelLocations`));
  return Object.entries(snapshot.val() ?? {}).map(([id, location]) => ({ id, ...location }));
}

export async function createFuelDeliveryRequest(input) {
  requireUser();
  const destination = coordinate(input.deliveryLocation?.coordinate);
  if (!input.vehicleId || !input.fuelType || !Number.isFinite(Number(input.quantityLitres)) || Number(input.quantityLitres) <= 0 || !destination) throw new Error('Complete the vehicle, fuel type, quantity, and delivery location before submitting.');
  const result = await broadcastFuelRequest({
    vehicleId: input.vehicleId,
    vehicle: input.vehicle || { id: input.vehicleId },
    requestType: input.requestType === 'emergency' ? 'emergency' : 'standard',
    fuelType: input.fuelType,
    quantityLitres: Number(input.quantityLitres),
    location: {
      latitude: destination.latitude,
      longitude: destination.longitude,
      label: input.deliveryLocation.label ?? 'Current location',
      address: input.deliveryLocation.address ?? null,
    },
    scheduledFor: input.scheduledFor ?? null,
  });
  const requestId = result.requestId || result.id;
  return { ...normalizeDelivery(requestId, result), requestId, deliveryId: requestId };
}

export async function getFuelDeliveryTracking(deliveryId) {
  const user = requireUser();
  if (!deliveryId) return null;
  const [requestSnapshot, deliverySnapshot] = await Promise.all([
    get(ref(database, `fuelRequests/${deliveryId}`)),
    get(ref(database, `fuelDeliveries/${deliveryId}`)),
  ]);
  const raw = requestSnapshot.val() || deliverySnapshot.val();
  const delivery = normalizeDelivery(deliveryId, raw);
  if (!delivery || raw.customerId !== user.uid) throw new Error('This fuel delivery was not found.');
  return delivery;
}

export function subscribeToFuelDeliveryTracking(deliveryId, onChange, onError) {
  const user = requireUser();
  if (!deliveryId) return () => {};
  let request = null;
  let delivery = null;
  const publish = () => {
    const raw = request || delivery;
    onChange(raw && raw.customerId === user.uid ? normalizeDelivery(deliveryId, raw) : null);
  };
  const unsubscribeRequest = onValue(ref(database, `fuelRequests/${deliveryId}`), (snapshot) => {
    request = snapshot.val();
    publish();
  }, onError);
  const unsubscribeDelivery = onValue(ref(database, `fuelDeliveries/${deliveryId}`), (snapshot) => {
    delivery = snapshot.val();
    publish();
  }, onError);
  return () => {
    unsubscribeRequest();
    unsubscribeDelivery();
  };
}
