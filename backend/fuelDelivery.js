/**
 * MechanIQ Fuel Delivery API Handler
 * 
 * Implements authoritative backend workflows for:
 * - Customer emergency fuel request creation
 * - Server-side distance & eligible nearby mechanic filtering (with customer privacy protection)
 * - Atomic mechanic acceptance race condition protection (compare-and-swap transaction)
 * - Conflicting active delivery prevention
 * - Driver location sharing lifecycle & live status transitions
 */

const crypto = require('node:crypto');

function fuelError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    !Number.isFinite(Number(lat1)) ||
    !Number.isFinite(Number(lon1)) ||
    !Number.isFinite(Number(lat2)) ||
    !Number.isFinite(Number(lon2))
  ) {
    return null;
  }
  const R = 6371; // Earth's mean radius in km
  const dLat = ((Number(lat2) - Number(lat1)) * Math.PI) / 180;
  const dLon = ((Number(lon2) - Number(lon1)) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((Number(lat1) * Math.PI) / 180) *
      Math.cos((Number(lat2) * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const ACTIVE_DELIVERY_STATUSES = new Set([
  'driver-assigned',
  'en-route',
  'arrived',
  'delivering',
]);

const VALID_STATUS_TRANSITIONS = {
  requested: new Set(['driver-assigned', 'cancelled']),
  'driver-assigned': new Set(['en-route', 'cancelled']),
  'en-route': new Set(['arrived', 'cancelled']),
  arrived: new Set(['delivering', 'cancelled']),
  delivering: new Set(['completed', 'cancelled']),
  completed: new Set(),
  declined: new Set(),
  cancelled: new Set(),
};

function validCoordinate(location) {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
    ? { latitude, longitude }
    : null;
}

function mechanicIsAvailable(profile) {
  if (!profile || profile.role !== 'mechanic') return false;
  // Respect existing moderation fields only when the profile stores them.
  if (Object.hasOwn(profile, 'isMechanicApproved') && profile.isMechanicApproved !== true) return false;
  if (Object.hasOwn(profile, 'isVerified') && profile.isVerified !== true) return false;
  if (['suspended', 'disabled', 'rejected'].includes(String(profile.accountStatus || '').toLowerCase())) return false;
  if (profile.isAvailable === false || profile.isAcceptingJobs === false || profile.availability?.isAcceptingJobs === false) return false;
  const status = String(profile.availability?.status || profile.availabilityStatus || '').toLowerCase();
  return !['offline', 'unavailable', 'busy', 'not_configured'].includes(status);
}

function nearbyMechanicSummary(id, profile, customerLocation, displayName) {
  if (!mechanicIsAvailable(profile)) return null;
  const location = validCoordinate(profile.location || profile.currentLocation || profile.lastKnownLocation);
  if (!location) return null;
  const serviceRadiusKm = Math.max(1, Math.min(Number(profile.serviceRadiusKm) || 30, 200));
  const distanceKm = calculateDistanceKm(customerLocation.latitude, customerLocation.longitude, location.latitude, location.longitude);
  if (distanceKm === null || distanceKm > serviceRadiusKm) return null;
  return { id, name: displayName(profile, 'Mechanic'), distanceKm, serviceRadiusKm, availability: 'available', rating: Number.isFinite(Number(profile.rating)) ? Number(profile.rating) : null, profileImageUrl: typeof profile.profileImageUrl === 'string' ? profile.profileImageUrl : null };
}

async function handleFuelDelivery({
  request,
  response,
  url,
  identity,
  db,
  readJsonBody,
  sendJson,
  getProfile,
  displayName,
}) {
  const userId = identity.uid;
  const profile = await getProfile(db, userId);
  const userRole = profile?.role || 'customer';

  // Normalize path relative to /api/v1/fuel-deliveries
  const subPath = url.pathname
    .replace(/^\/api\/v1\/fuel-deliveries\/?/, '')
    .trim();
  const pathParts = subPath.split('/').filter(Boolean);

  if (request.method === 'GET' && pathParts[0] === 'nearby-mechanics') {
    if (userRole !== 'customer') throw fuelError(403, 'Only customer accounts can find nearby mechanics.');
    const customerLocation = validCoordinate({ latitude: url.searchParams.get('latitude'), longitude: url.searchParams.get('longitude') });
    if (!customerLocation) throw fuelError(400, 'Valid current location coordinates are required.');
    const users = (await db.ref('users').get()).val() || {};
    const mechanics = Object.entries(users).map(([id, candidate]) => nearbyMechanicSummary(id, candidate, customerLocation, displayName)).filter(Boolean).sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name));
    return sendJson(response, 200, { mechanics });
  }

  // 1. POST /api/v1/fuel-deliveries (Customer submits fuel delivery request)
  if (request.method === 'POST' && pathParts.length === 0) {
    if (userRole !== 'customer') {
      throw fuelError(403, 'Only customer accounts can submit fuel delivery requests.');
    }

    const input = await readJsonBody(request);
    const vehicleId = typeof input.vehicleId === 'string' ? input.vehicleId.trim() : '';
    const fuelType = typeof input.fuelType === 'string' ? input.fuelType.trim() : '';
    const quantityLitres = Number(input.quantityLitres);
    const requestType = input.requestType === 'emergency' ? 'emergency' : 'standard';
    let targetMechanicId = typeof input.targetMechanicId === 'string' ? input.targetMechanicId.trim() : '';

    const coordinate = input.deliveryLocation?.coordinate;
    const lat = Number(coordinate?.latitude);
    const lon = Number(coordinate?.longitude);

    if (
      !vehicleId ||
      !fuelType ||
      fuelType.length > 40 ||
      !Number.isFinite(quantityLitres) ||
      quantityLitres <= 0 ||
      quantityLitres > 1000 ||
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90 ||
      !Number.isFinite(lon) ||
      lon < -180 ||
      lon > 180
    ) {
      throw fuelError(400, 'Valid vehicle, fuel type, quantity (> 0), location, and selected mechanic are required.');
    }

    if (!targetMechanicId) {
      const users = (await db.ref('users').get()).val() || {};
      const nearest = Object.entries(users)
        .map(([id, candidate]) => nearbyMechanicSummary(id, candidate, { latitude: lat, longitude: lon }, displayName))
        .filter(Boolean)
        .sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name))[0];
      if (!nearest) throw fuelError(409, 'No eligible mechanic is currently available near your delivery location.');
      targetMechanicId = nearest.id;
    }

    const targetProfile = await getProfile(db, targetMechanicId);
    if (!nearbyMechanicSummary(targetMechanicId, targetProfile, { latitude: lat, longitude: lon }, displayName)) {
      throw fuelError(400, 'The selected mechanic is no longer available for this location. Please choose another mechanic.');
    }

    const deliveryId = crypto.randomUUID();
    const now = new Date().toISOString();

    const delivery = {
      id: deliveryId,
      customerId: userId,
      customerName: displayName(profile, 'Customer'),
      customerPhone: profile.phone || null,
      vehicleId,
      requestType,
      fuelType,
      quantityLitres,
      destination: { latitude: lat, longitude: lon },
      destinationLabel: typeof input.deliveryLocation?.label === 'string'
        ? input.deliveryLocation.label.trim()
        : 'Delivery location',
      destinationAddress: typeof input.deliveryLocation?.address === 'string'
        ? input.deliveryLocation.address.trim()
        : null,
      scheduledFor: input.scheduledFor || null,
      status: 'requested',
      targetMechanicId,
      assignedMechanicId: null,
      driver: null,
      createdAt: now,
      updatedAt: now,
    };

    /// Authoritative RTDB writes
    await db.ref().update({
      [`fuelDeliveries/${deliveryId}`]: delivery,
      [`fuel_mechanic_pending/${targetMechanicId}/${deliveryId}`]: {
        createdAt: now,
        requestType,
        fuelType,
        quantityLitres,
      },
      [`users/${userId}/fuelDeliveries/${deliveryId}`]: delivery,
    });

    return sendJson(response, 201, { deliveryId, ...delivery });
  }

  // 2. GET /api/v1/fuel-deliveries/available (Mechanic lists nearby available requests)
  if (request.method === 'GET' && pathParts[0] === 'available') {
    if (userRole !== 'mechanic') {
      throw fuelError(403, 'Only mechanic accounts can view available fuel delivery requests.');
    }

    // Check if mechanic has an active assigned delivery
    const activeDeliveryIdSnap = await db.ref(`fuel_mechanic_active_delivery/${userId}`).get();
    const activeDeliveryId = activeDeliveryIdSnap.val();

    const pendingIndexSnap = await db.ref(`fuel_mechanic_pending/${userId}`).get();
    const pendingIndex = pendingIndexSnap.val() || {};
    const pendingIds = Object.keys(pendingIndex);

    const deliveries = [];
    for (const id of pendingIds) {
      const deliverySnap = await db.ref(`fuelDeliveries/${id}`).get();
      const raw = deliverySnap.val();

      // Clean up orphaned or accepted deliveries from index
      if (!raw || raw.status !== 'requested' || raw.assignedMechanicId) {
        await db.ref(`fuel_mechanic_pending/${userId}/${id}`).remove();
        continue;
      }

      if (raw.targetMechanicId !== userId) {
        await db.ref(`fuel_mechanic_pending/${userId}/${id}`).remove();
        continue;
      }

      // PRIVACY PROTECTION:
      // Do NOT expose exact customer coordinates, customer name, customer phone, or full address!
      deliveries.push({
        id: raw.id,
        requestType: raw.requestType,
        fuelType: raw.fuelType,
        quantityLitres: raw.quantityLitres,
        status: raw.status,
        distanceKm: null,
        approximateArea: raw.destinationLabel || 'Service location',
        createdAt: raw.createdAt,
      });
    }

    // Sort by creation time (closest first), then by newest
    deliveries.sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null) {
        return a.distanceKm - b.distanceKm;
      }
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });

    return sendJson(response, 200, {
      deliveries,
      activeDeliveryId: activeDeliveryId || null,
    });
  }

  // 3. GET /api/v1/fuel-deliveries (List requests for customer or mechanic)
  if (request.method === 'GET' && pathParts.length === 0) {
    if (userRole === 'customer') {
      const snap = await db.ref(`users/${userId}/fuelDeliveries`).get();
      const all = Object.values(snap.val() || {}).sort((a, b) =>
        String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
      );
      return sendJson(response, 200, { deliveries: all });
    } else {
      // Mechanic: get active delivery + past completed deliveries
      const activeDeliveryIdSnap = await db.ref(`fuel_mechanic_active_delivery/${userId}`).get();
      const activeDeliveryId = activeDeliveryIdSnap.val();
      const activeDelivery = activeDeliveryId
        ? (await db.ref(`fuelDeliveries/${activeDeliveryId}`).get()).val()
        : null;

      return sendJson(response, 200, {
        activeDelivery: activeDelivery || null,
      });
    }
  }

  // Routes below operate on a specific delivery: /api/v1/fuel-deliveries/:id/...
  const deliveryId = pathParts[0];
  if (!deliveryId) {
    throw fuelError(404, 'Fuel delivery endpoint not found.');
  }

  const deliveryRef = db.ref(`fuelDeliveries/${deliveryId}`);
  const deliverySnap = await deliveryRef.get();
  const delivery = deliverySnap.val();

  if (!delivery && pathParts[1] !== 'accept') {
    throw fuelError(404, 'Fuel delivery request not found.');
  }

  // 4. POST /api/v1/fuel-deliveries/:id/accept (Mechanic atomically accepts request)
  if (request.method === 'POST' && pathParts[1] === 'accept') {
    if (userRole !== 'mechanic') {
      throw fuelError(403, 'Only approved mechanics can accept fuel delivery requests.');
    }
    if (delivery?.targetMechanicId !== userId) {
      throw fuelError(403, 'This delivery was assigned to another mechanic.');
    }

    /// Guard: Prevent mechanic from accepting multiple conflicting active deliveries
    const activeDeliveryIdSnap = await db.ref(`fuel_mechanic_active_delivery/${userId}`).get();
    const existingActiveId = activeDeliveryIdSnap.val();
    if (existingActiveId && existingActiveId !== deliveryId) {
      const activeSnap = await db.ref(`fuelDeliveries/${existingActiveId}`).get();
      const activeData = activeSnap.val();
      if (activeData && ACTIVE_DELIVERY_STATUSES.has(activeData.status)) {
        throw fuelError(400, 'You already have an active fuel delivery in progress. Complete or cancel it first.');
      }
    }

    const now = new Date().toISOString();
    const mechanicLocation = validCoordinate(profile.location || profile.currentLocation || profile.lastKnownLocation);
    const mechanicDriver = {
      id: userId,
      name: displayName(profile, 'Mechanic'),
      phone: profile.phone || null,
      vehicle: profile.vehicle || null,
      location: mechanicLocation,
    };

    /// ATOMIC TRANSACTION: Compare-and-swap on fuelDeliveries/:deliveryId
    const txResult = await deliveryRef.transaction((current) => {
      // Abort if deleted or already accepted
      if (!current) return current;
      if (current.status !== 'requested' || current.assignedMechanicId) {
        return; // Aborts transaction
      }

      current.status = 'driver-assigned';
      current.assignedMechanicId = userId;
      current.driver = mechanicDriver;
      current.acceptedAt = now;
      current.updatedAt = now;
      return current;
    });

    const updatedDelivery = txResult.snapshot.val();
    if (!updatedDelivery || updatedDelivery.assignedMechanicId !== userId) {
      throw fuelError(409, 'This delivery request has already been accepted by another mechanic.');
    }

    // The transaction is the canonical acceptance decision. This idempotent
    // multi-location update repairs the customer mirror and indexes if a retry
    // follows a transient failure after that canonical transaction committed.
    await db.ref().update({
      [`fuel_mechanic_active_delivery/${userId}`]: deliveryId,
      [`fuel_mechanic_pending/${userId}/${deliveryId}`]: null,
      [`users/${updatedDelivery.customerId}/fuelDeliveries/${deliveryId}`]: updatedDelivery,
    });

    /// Customer exact location is now securely unlocked for the assigned mechanic
    return sendJson(response, 200, {
      success: true,
      delivery: updatedDelivery,
    });
  }

  // 4b. POST /api/v1/fuel-deliveries/:id/decline (target mechanic declines before acceptance)
  if (request.method === 'POST' && pathParts[1] === 'decline') {
    if (userRole !== 'mechanic' || delivery.targetMechanicId !== userId) {
      throw fuelError(403, 'Only the selected mechanic can decline this delivery.');
    }
    const now = new Date().toISOString();
    const txResult = await deliveryRef.transaction((current) => {
      if (!current || current.status !== 'requested' || current.assignedMechanicId) return;
      return { ...current, status: 'declined', declinedAt: now, updatedAt: now };
    });
    if (!txResult.committed) {
      throw fuelError(409, 'This delivery request is no longer pending.');
    }
    const declinedDelivery = txResult.snapshot.val();
    // The canonical record wins if a retry occurs after this mirror/index update.
    await db.ref().update({
      [`fuel_mechanic_pending/${userId}/${deliveryId}`]: null,
      [`users/${declinedDelivery.customerId}/fuelDeliveries/${deliveryId}`]: declinedDelivery,
    });
    return sendJson(response, 200, { success: true, delivery: declinedDelivery });
  }

  // Verify participant permissions for actions on an existing delivery
  const isCustomer = delivery.customerId === userId;
  const isAssignedMechanic = delivery.assignedMechanicId === userId;

  if (!isCustomer && !isAssignedMechanic) {
    throw fuelError(403, 'You do not have permission to view or manage this fuel delivery.');
  }

  // 5. GET /api/v1/fuel-deliveries/:id (Get full delivery status)
  if (request.method === 'GET' && pathParts.length === 1) {
    return sendJson(response, 200, { delivery });
  }

  // 6. POST /api/v1/fuel-deliveries/:id/travel/start (Mechanic starts trip)
  if (request.method === 'POST' && pathParts[1] === 'travel' && pathParts[2] === 'start') {
    if (!isAssignedMechanic) {
      throw fuelError(403, 'Only the assigned mechanic can start travel for this delivery.');
    }

    if (delivery.status !== 'driver-assigned') {
      throw fuelError(400, `Cannot start trip while delivery status is "${delivery.status}".`);
    }

    const input = await readJsonBody(request);
    const loc = input.mechanicLocation;
    const lat = Number(loc?.latitude);
    const lon = Number(loc?.longitude);

    if (!validCoordinate({ latitude: lat, longitude: lon })) {
      throw fuelError(400, 'Valid current GPS coordinates are required to start the trip.');
    }

    const now = new Date().toISOString();
    const updates = {
      status: 'en-route',
      'driver/location': { latitude: lat, longitude: lon, updatedAt: now },
      updatedAt: now,
    };

    await deliveryRef.update(updates);
    await db.ref(`users/${delivery.customerId}/fuelDeliveries/${deliveryId}`).update(updates);

    const freshDelivery = (await deliveryRef.get()).val();
    return sendJson(response, 200, { success: true, delivery: freshDelivery });
  }

  // 7. POST /api/v1/fuel-deliveries/:id/location (Live location broadcast)
  if (request.method === 'POST' && pathParts[1] === 'location') {
    if (!isAssignedMechanic) {
      throw fuelError(403, 'Only the assigned mechanic can publish live tracking locations.');
    }

    if (!ACTIVE_DELIVERY_STATUSES.has(delivery.status)) {
      throw fuelError(400, 'Location sharing is permitted only while the delivery is actively in progress.');
    }

    const input = await readJsonBody(request);
    const lat = Number(input.latitude);
    const lon = Number(input.longitude);

    if (!validCoordinate({ latitude: lat, longitude: lon })) {
      throw fuelError(400, 'Valid numeric latitude and longitude are required.');
    }

    const now = new Date().toISOString();
    const locationUpdate = {
      latitude: lat,
      longitude: lon,
      updatedAt: now,
    };

    await deliveryRef.child('driver/location').set(locationUpdate);
    await db.ref(`users/${delivery.customerId}/fuelDeliveries/${deliveryId}/driver/location`).set(locationUpdate);

    return sendJson(response, 200, { success: true });
  }

  // 8. POST /api/v1/fuel-deliveries/:id/status (Authoritative status transition)
  if (request.method === 'POST' && pathParts[1] === 'status') {
    const input = await readJsonBody(request);
    const nextStatus = typeof input.status === 'string' ? input.status.trim() : '';

    const allowedNext = VALID_STATUS_TRANSITIONS[delivery.status];
    if (!allowedNext || !allowedNext.has(nextStatus)) {
      throw fuelError(400, `Invalid status transition from "${delivery.status}" to "${nextStatus}".`);
    }

    /// Role verification for specific transitions
    if (nextStatus === 'cancelled') {
      // Customer can cancel before driver arrives
      // Mechanic can cancel if needed
      if (!isCustomer && !isAssignedMechanic) {
        throw fuelError(403, 'You are not authorized to cancel this delivery.');
      }
    } else {
      // Delivery progress transitions ('en-route', 'arrived', 'delivering', 'completed')
      // must only be made by the assigned mechanic
      if (!isAssignedMechanic) {
        throw fuelError(403, 'Only the assigned delivery mechanic can advance the delivery status.');
      }
    }

    const now = new Date().toISOString();
    const updates = {
      status: nextStatus,
      updatedAt: now,
    };

    if (nextStatus === 'completed') {
      updates.completedAt = now;
      // Stop location sharing upon completion
      updates['driver/location'] = null;
    } else if (nextStatus === 'cancelled') {
      updates.cancelledAt = now;
      updates.cancellationReason = input.reason || null;
      updates['driver/location'] = null;
    }

    await deliveryRef.update(updates);
    await db.ref(`users/${delivery.customerId}/fuelDeliveries/${deliveryId}`).update(updates);

    /// If delivery concluded, clear mechanic's active delivery lock
    if (nextStatus === 'completed' || nextStatus === 'cancelled') {
      if (delivery.assignedMechanicId) {
        await db.ref(`fuel_mechanic_active_delivery/${delivery.assignedMechanicId}`).remove();
      }
      await db.ref(`fuel_mechanic_pending/${delivery.targetMechanicId}/${deliveryId}`).remove();
    }

    const freshDelivery = (await deliveryRef.get()).val();
    return sendJson(response, 200, { success: true, delivery: freshDelivery });
  }

  throw fuelError(404, 'Fuel delivery endpoint not found.');
}

module.exports = {
  calculateDistanceKm,
  mechanicIsAvailable,
  nearbyMechanicSummary,
  handleFuelDelivery,
};

