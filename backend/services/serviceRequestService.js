const { calculateHaversineDistanceKm } = require('./distanceUtil');

// Configurable constants as specified
const DEFAULT_SEARCH_RADIUS_KM = 30;
const DEFAULT_LOCATION_FRESHNESS_MINUTES = 120; // 2 hours
const SELECTION_WINDOW_MS = 5000; // 5-second simultaneous-acceptance window
const REQUEST_EXPIRY_HOURS = 24;

function requestPaths(requestType = 'service') {
  return requestType === 'fuel'
    ? { collection: 'fuelRequests', broadcast: 'fuelRequests', incoming: 'mechanicIncomingFuelRequests', label: 'fuel request' }
    : { collection: 'serviceRequests', broadcast: 'broadcastRequests', incoming: 'mechanicIncomingRequests', label: 'mechanic request' };
}

async function writePlatformActivity(adminDb, { action, details, targetId, targetType, actorId }) {
  const timestamp = new Date().toISOString();
  await adminDb.collection('auditLogs').add({
    action,
    details,
    targetId: targetId || null,
    targetType: targetType || 'system',
    actorId: actorId || null,
    actorEmail: null,
    timestamp,
    createdAt: timestamp,
  });
}

let adminApp = null;
let adminDb = null; // Firestore
let adminRtdb = null; // Realtime Database

async function getFirebaseAdmin() {
  if (adminDb && adminRtdb) return { adminDb, adminRtdb };
  const [{ getApps, initializeApp }, { getFirestore }, { getDatabase }] = await Promise.all([
    import('firebase-admin/app'),
    import('firebase-admin/firestore'),
    import('firebase-admin/database'),
  ]);

  const appName = 'mechaniq-service-request-backend';
  adminApp =
    getApps().find((c) => c.name === appName) ||
    initializeApp(
      {
        projectId: process.env.GOOGLE_CLOUD_PROJECT || 'mechaniq-3a0f2',
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://mechaniq-3a0f2-default-rtdb.firebaseio.com',
      },
      appName
    );

  adminDb = getFirestore(adminApp);
  adminRtdb = getDatabase(adminApp);
  return { adminDb, adminRtdb };
}

/**
 * Identify approved, available mechanics within configured radius of customer coordinates.
 */
async function findEligibleMechanics(customerCoords, radiusKm = DEFAULT_SEARCH_RADIUS_KM) {
  const { adminRtdb } = await getFirebaseAdmin();
  const mechanicsSnapshot = await adminRtdb.ref('mechanics').once('value');
  const mechanicsData = mechanicsSnapshot.val() || {};

  const nowMs = Date.now();
  const maxLocationAgeMs = DEFAULT_LOCATION_FRESHNESS_MINUTES * 60 * 1000;
  const eligible = [];

  for (const [uid, mechanic] of Object.entries(mechanicsData)) {
    if (!mechanic || typeof mechanic !== 'object') continue;

    // 1. Account status must be Active (not Suspended or Deleted)
    const status = String(mechanic.accountStatus || mechanic.status || 'Active').trim().toLowerCase();
    if (status !== 'active' || mechanic.isActive === false || mechanic.isDisabled === true) {
      continue;
    }

    // 2. Availability status must be enabled / accepting jobs
    const isAvailable =
      mechanic.isAcceptingJobs === true ||
      mechanic.availability?.isAcceptingJobs === true ||
      mechanic.availability?.status === 'available';
    if (!isAvailable) {
      continue;
    }

    // 3. Location must be present, valid and fresh
    const location = mechanic.liveLocation || mechanic.location;
    if (!location || location.latitude == null || location.longitude == null) {
      continue;
    }

    // Check location freshness if updatedAt is provided
    if (location.updatedAt) {
      const locAgeMs = nowMs - new Date(location.updatedAt).getTime();
      if (!Number.isNaN(locAgeMs) && locAgeMs > maxLocationAgeMs) {
        continue;
      }
    }

    // 4. Calculate distance
    const distanceKm = calculateHaversineDistanceKm(
      customerCoords.latitude,
      customerCoords.longitude,
      Number(location.latitude),
      Number(location.longitude)
    );

    if (distanceKm <= radiusKm) {
      // Verified rating (default to 5.0 for newly approved mechanics with no reviews or averageRating)
      const rawRating = mechanic.performance?.rating ?? mechanic.rating ?? 5.0;
      const reviewCount = mechanic.performance?.reviewCount ?? mechanic.reviewCount ?? 0;
      const verifiedRating = Number(rawRating) || 5.0;

      eligible.push({
        uid,
        publicName: mechanic.publicName || `${mechanic.firstName || ''} ${mechanic.lastName || ''}`.trim() || 'Mechanic',
        distanceKm,
        verifiedRating,
        reviewCount,
        pushToken: mechanic.expoPushToken || mechanic.pushToken || null,
        phone: mechanic.phone || null,
      });
    }
  }

  // Sort initially by distance
  return eligible.sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Dispatch Expo Push Notifications to a list of tokens.
 */
async function sendExpoPushNotifications(messages) {
  if (!messages || !messages.length) return;
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to send push notifications:', error?.message || error);
  }
}

/**
 * Broadcast request creation to all eligible mechanics.
 */
async function createAndBroadcastServiceRequest(customerUid, requestData) {
  const { adminDb, adminRtdb } = await getFirebaseAdmin();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + REQUEST_EXPIRY_HOURS * 60 * 60 * 1000);

  const customerCoords = {
    latitude: Number(requestData.location?.latitude),
    longitude: Number(requestData.location?.longitude),
  };

  const eligibleMechanics = await findEligibleMechanics(customerCoords);

  const requestRecord = {
    customerId: customerUid,
    customerName: requestData.customerName || 'Customer',
    vehicle: {
      make: String(requestData.vehicle?.make || '').trim(),
      model: String(requestData.vehicle?.model || '').trim(),
      year: requestData.vehicle?.year ? Number(requestData.vehicle?.year) : null,
      registration: String(requestData.vehicle?.registration || '').trim(),
      vehicleId: requestData.vehicle?.id || null,
    },
    issueDescription: String(requestData.issueDescription || '').trim(),
    mediaUrls: Array.isArray(requestData.mediaUrls) ? requestData.mediaUrls : [],
    location: {
      latitude: customerCoords.latitude,
      longitude: customerCoords.longitude,
      address: String(requestData.location?.address || '').trim(),
    },
    status: eligibleMechanics.length ? 'broadcasting' : 'no_mechanics', // broadcasting -> awaiting_selection -> assigned
    eligibleMechanicCount: eligibleMechanics.length,
    assignedMechanicId: null,
    firstAcceptedAt: null,
    selectionWindowEndsAt: null,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    updatedAt: now.toISOString(),
  };

  // 1. Create document in Firestore
  const requestDocRef = await adminDb.collection('serviceRequests').add(requestRecord);
  const requestId = requestDocRef.id;

  // 2. Also register in RTDB for real-time customer and mechanic listeners
  await adminRtdb.ref(`broadcastRequests/${requestId}`).set({
    id: requestId,
    ...requestRecord,
  });

  // 3. Simultaneously broadcast push notifications & RTDB notifications to eligible mechanics
  const pushMessages = [];
  const rtdbNotifications = {};

  for (const mechanic of eligibleMechanics) {
    // RTDB mechanic incoming feed
    rtdbNotifications[`mechanicIncomingRequests/${mechanic.uid}/${requestId}`] = {
      requestId,
      customerName: requestRecord.customerName,
      vehicle: requestRecord.vehicle,
      issueDescription: requestRecord.issueDescription,
      mediaUrls: requestRecord.mediaUrls,
      approximateDistanceKm: mechanic.distanceKm,
      status: 'broadcasting',
      createdAt: requestRecord.createdAt,
      expiresAt: requestRecord.expiresAt,
    };

    if (mechanic.pushToken) {
      pushMessages.push({
        to: mechanic.pushToken,
        sound: 'default',
        title: 'New MechanIQ Service Request Nearby',
        body: `A customer needs assistance (${mechanic.distanceKm} km away). Open app to view details and respond.`,
        data: { requestId, type: 'mechanic_service_request' },
      });
    }
  }

  if (Object.keys(rtdbNotifications).length > 0) {
    await adminRtdb.ref().update(rtdbNotifications);
  }

  if (pushMessages.length > 0) {
    sendExpoPushNotifications(pushMessages).catch((err) =>
      console.warn('Expo push broadcast error:', err?.message || err)
    );
  }

  await writePlatformActivity(adminDb, {
    action: 'MECHANIC_REQUEST_CREATED',
    details: `${requestRecord.customerName} requested help for ${requestRecord.vehicle.make} ${requestRecord.vehicle.model}; sent to ${eligibleMechanics.length} mechanics within 30 km.`,
    targetId: requestId,
    targetType: 'mechanic_request',
    actorId: customerUid,
  });

  return {
    id: requestId,
    ...requestRecord,
    eligibleMechanicCount: eligibleMechanics.length,
  };
}

async function createAndBroadcastFuelRequest(customerUid, requestData) {
  const { adminDb, adminRtdb } = await getFirebaseAdmin();
  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + REQUEST_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();
  const location = {
    latitude: Number(requestData.location.latitude),
    longitude: Number(requestData.location.longitude),
    address: String(requestData.location.address || requestData.location.label || 'Customer delivery location').trim(),
  };
  const eligibleMechanics = await findEligibleMechanics(location, 15);
  const vehicle = {
    id: String(requestData.vehicle?.id || requestData.vehicleId || ''),
    make: String(requestData.vehicle?.make || '').trim(),
    model: String(requestData.vehicle?.model || '').trim(),
    year: requestData.vehicle?.year ? Number(requestData.vehicle.year) : null,
    registration: String(requestData.vehicle?.registration || '').trim(),
  };
  const record = {
    customerId: customerUid,
    customerName: String(requestData.customerName || 'Customer').trim(),
    requestType: requestData.requestType === 'emergency' ? 'emergency' : 'standard',
    fuelType: String(requestData.fuelType || '').trim(),
    quantityLitres: Number(requestData.quantityLitres),
    vehicle,
    vehicleId: vehicle.id,
    deliveryLocation: {
      label: String(requestData.location.label || 'Current location').trim(),
      address: location.address,
      coordinate: { latitude: location.latitude, longitude: location.longitude },
    },
    location,
    scheduledFor: requestData.scheduledFor || null,
    status: eligibleMechanics.length ? 'broadcasting' : 'no_mechanics',
    eligibleMechanicCount: eligibleMechanics.length,
    assignedMechanicId: null,
    firstAcceptedAt: null,
    selectionWindowEndsAt: null,
    createdAt,
    updatedAt: createdAt,
    expiresAt,
  };
  const requestRef = adminDb.collection('fuelRequests').doc();
  const requestId = requestRef.id;
  await requestRef.set({ id: requestId, ...record });

  const rtdbUpdates = {
    [`fuelRequests/${requestId}`]: { id: requestId, ...record },
    [`users/${customerUid}/fuelRequests/${requestId}`]: { id: requestId, ownerUid: customerUid, ...record },
  };
  const pushMessages = [];
  for (const mechanic of eligibleMechanics) {
    rtdbUpdates[`mechanicIncomingFuelRequests/${mechanic.uid}/${requestId}`] = {
      id: requestId,
      requestId,
      requestType: 'fuel',
      customerName: record.customerName,
      vehicle,
      fuelType: record.fuelType,
      quantityLitres: record.quantityLitres,
      deliveryLocation: record.deliveryLocation,
      approximateDistanceKm: mechanic.distanceKm,
      status: 'broadcasting',
      createdAt,
      expiresAt,
    };
    if (mechanic.pushToken) {
      pushMessages.push({
        to: mechanic.pushToken,
        sound: 'default',
        title: 'Fuel delivery request nearby',
        body: `${record.quantityLitres} L of ${record.fuelType} is requested ${mechanic.distanceKm} km away.`,
        data: { requestId, type: 'mechanic_fuel_request' },
      });
    }
  }
  await adminRtdb.ref().update(rtdbUpdates);
  if (pushMessages.length) sendExpoPushNotifications(pushMessages).catch(() => {});
  await writePlatformActivity(adminDb, {
    action: 'FUEL_REQUEST_CREATED',
    details: `${record.customerName} requested ${record.quantityLitres} L of ${record.fuelType}; sent to ${eligibleMechanics.length} mechanics within 15 km.`,
    targetId: requestId,
    targetType: 'fuel_request',
    actorId: customerUid,
  });
  return { requestId, deliveryId: requestId, id: requestId, ...record };
}

/**
 * Handle mechanic acceptance attempt and manage 5-second simultaneous-acceptance window.
 */
async function handleAcceptanceAttempt(mechanicUid, requestId, requestType = 'service') {
  const { adminDb, adminRtdb } = await getFirebaseAdmin();
  const paths = requestPaths(requestType);

  // 1. Verify mechanic
  const mechanicSnapshot = await adminRtdb.ref(`mechanics/${mechanicUid}`).once('value');
  const mechanic = mechanicSnapshot.val();
  if (!mechanic) throw new Error('Mechanic profile not found.');

  const status = String(mechanic.accountStatus || mechanic.status || 'Active').trim().toLowerCase();
  if (status !== 'active') throw new Error('Your mechanic account is not active.');

  const incomingRef = adminRtdb.ref(`${paths.incoming}/${mechanicUid}/${requestId}`);
  const incomingSnapshot = await incomingRef.once('value');
  if (!incomingSnapshot.exists()) throw new Error('This request is no longer in your incoming requests. Go online and refresh nearby requests.');
  if (!['broadcasting', 'awaiting_selection'].includes(incomingSnapshot.val()?.status)) {
    throw new Error('This request is no longer available to accept.');
  }

  const requestRef = adminDb.collection(paths.collection).doc(requestId);

  // Firestore transaction to safely register attempt and trigger selection window
  const attemptResult = await adminDb.runTransaction(async (transaction) => {
    const docSnap = await transaction.get(requestRef);
    if (!docSnap.exists) {
      throw new Error('This request does not exist.');
    }
    const data = docSnap.data();

    // Check expiry
    if (new Date() > new Date(data.expiresAt) || data.status === 'expired') {
      throw new Error('This request has expired.');
    }

    // Check if already assigned
    if (data.status === 'assigned' || data.assignedMechanicId) {
      return { status: 'already_assigned', winnerId: data.assignedMechanicId };
    }

    if (data.status === 'cancelled') {
      throw new Error('This request has been cancelled by the customer.');
    }

    const now = Date.now();
    const serverTimestampStr = new Date(now).toISOString();

    // Calculate mechanic's distance to customer
    const requestLocation = data.location || data.deliveryLocation?.coordinate;
    const distanceKm = calculateHaversineDistanceKm(
      requestLocation?.latitude,
      requestLocation?.longitude,
      Number(mechanic.liveLocation?.latitude ?? mechanic.location?.latitude),
      Number(mechanic.liveLocation?.longitude ?? mechanic.location?.longitude)
    );

    const verifiedRating = Number(mechanic.performance?.rating ?? mechanic.rating ?? 5.0) || 5.0;

    const attemptData = {
      mechanicId: mechanicUid,
      mechanicName: mechanic.publicName || `${mechanic.firstName || ''} ${mechanic.lastName || ''}`.trim() || 'Mechanic',
      verifiedRating,
      distanceKm,
      acceptedAt: serverTimestampStr,
      acceptedAtMs: now,
    };

    // Record the attempt in subcollection
    const attemptDocRef = requestRef.collection('acceptanceAttempts').doc(mechanicUid);
    transaction.set(attemptDocRef, attemptData);

    let isFirstAcceptance = false;
    let windowEndsAtMs = data.selectionWindowEndsAt ? new Date(data.selectionWindowEndsAt).getTime() : null;

    if (!data.firstAcceptedAt) {
      isFirstAcceptance = true;
      windowEndsAtMs = now + SELECTION_WINDOW_MS;
      transaction.update(requestRef, {
        status: 'awaiting_selection',
        firstAcceptedAt: serverTimestampStr,
        selectionWindowEndsAt: new Date(windowEndsAtMs).toISOString(),
        updatedAt: serverTimestampStr,
      });
    }

    return {
      status: 'attempt_recorded',
      isFirstAcceptance,
      windowEndsAtMs,
    };
  });

  if (attemptResult.status === 'already_assigned') {
    return {
      success: false,
      message: 'This request has been assigned to another mechanic.',
      alreadyAssigned: true,
    };
  }

  await writePlatformActivity(adminDb, {
    action: requestType === 'fuel' ? 'FUEL_REQUEST_ACCEPTED' : 'MECHANIC_REQUEST_ACCEPTED',
    details: `Mechanic ${mechanicUid} accepted ${paths.label} ${requestId}.`,
    targetId: requestId,
    targetType: requestType === 'fuel' ? 'fuel_request' : 'mechanic_request',
    actorId: mechanicUid,
  });

  // Update RTDB broadcast status
  if (attemptResult.isFirstAcceptance) {
    await adminRtdb.ref(`${paths.broadcast}/${requestId}`).update({
      status: 'awaiting_selection',
      selectionWindowEndsAt: new Date(attemptResult.windowEndsAtMs).toISOString(),
    });
    const mechanicsSnapshot = await adminRtdb.ref('mechanics').once('value');
    const mechanicIds = Object.keys(mechanicsSnapshot.val() || {});
    await Promise.all(mechanicIds.map(async (uid) => {
      const feedItem = adminRtdb.ref(`${paths.incoming}/${uid}/${requestId}`);
      const feedSnapshot = await feedItem.once('value');
      if (feedSnapshot.exists()) await feedItem.update({ status: 'awaiting_selection' });
    }));

    // Schedule selection resolution in 5 seconds
    const delay = Math.max(100, attemptResult.windowEndsAtMs - Date.now());
    setTimeout(() => {
      resolveRequestWinner(requestId, requestType).catch((err) =>
        console.error(`Error resolving selection for request ${requestId}:`, err)
      );
    }, delay);
  }

  return {
    success: true,
    message: 'Your acceptance has been recorded. Evaluating selection window...',
    windowEndsAt: new Date(attemptResult.windowEndsAtMs).toISOString(),
  };
}

async function declineMechanicRequest(mechanicUid, requestId, requestType = 'service') {
  const { adminDb, adminRtdb } = await getFirebaseAdmin();
  const paths = requestPaths(requestType);
  const mechanicSnapshot = await adminRtdb.ref(`mechanics/${mechanicUid}`).once('value');
  const mechanic = mechanicSnapshot.val();
  if (!mechanic) throw new Error('Mechanic profile not found.');
  const accountStatus = String(mechanic.accountStatus || mechanic.status || 'Active').trim().toLowerCase();
  if (accountStatus !== 'active') throw new Error('Your mechanic account is not active.');
  const feedRef = adminRtdb.ref(`${paths.incoming}/${mechanicUid}/${requestId}`);
  const feedSnapshot = await feedRef.once('value');
  if (!feedSnapshot.exists() || !['broadcasting', 'awaiting_selection'].includes(feedSnapshot.val()?.status)) {
    throw new Error('This request is no longer available to decline.');
  }
  await feedRef.update({ status: 'declined', declinedAt: new Date().toISOString() });
  await writePlatformActivity(adminDb, {
    action: requestType === 'fuel' ? 'FUEL_REQUEST_DECLINED' : 'MECHANIC_REQUEST_DECLINED',
    details: `Mechanic ${mechanicUid} declined ${paths.label} ${requestId}.`,
    targetId: requestId,
    targetType: requestType === 'fuel' ? 'fuel_request' : 'mechanic_request',
    actorId: mechanicUid,
  });
  return { success: true };
}

/**
 * Resolve winner after 5-second simultaneous-acceptance window.
 * Selection priority:
 * 1. Rating (highest verified rating)
 * 2. Distance (closest to customer)
 * 3. Earliest server timestamp
 */
async function resolveRequestWinner(requestId, requestType = 'service') {
  const { adminDb, adminRtdb } = await getFirebaseAdmin();
  const paths = requestPaths(requestType);
  const requestRef = adminDb.collection(paths.collection).doc(requestId);

  let winner = null;
  let allAttempts = [];
  let requestData = null;

  await adminDb.runTransaction(async (transaction) => {
    const docSnap = await transaction.get(requestRef);
    if (!docSnap.exists) return;
    requestData = docSnap.data();

    if (requestData.status === 'assigned' && requestData.assignedMechanicId) {
      winner = { mechanicId: requestData.assignedMechanicId };
      return;
    }

    const attemptsSnap = await requestRef.collection('acceptanceAttempts').get();
    if (attemptsSnap.empty) {
      // Revert to broadcasting if no one accepted
      transaction.update(requestRef, {
        status: 'broadcasting',
        firstAcceptedAt: null,
        selectionWindowEndsAt: null,
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    allAttempts = attemptsSnap.docs.map((d) => d.data());

    // Priority sorting:
    // Priority 1: Verified Rating DESC
    // Priority 2: Distance ASC
    // Priority 3: Server acceptedAtMs ASC
    allAttempts.sort((a, b) => {
      if (b.verifiedRating !== a.verifiedRating) {
        return b.verifiedRating - a.verifiedRating;
      }
      if (a.distanceKm !== b.distanceKm) {
        return a.distanceKm - b.distanceKm;
      }
      return a.acceptedAtMs - b.acceptedAtMs;
    });

    winner = allAttempts[0];
    const nowIso = new Date().toISOString();

    transaction.update(requestRef, {
      status: 'assigned',
      assignedMechanicId: winner.mechanicId,
      assignedMechanicName: winner.mechanicName,
      assignedAt: nowIso,
      updatedAt: nowIso,
    });
  });

  if (!winner || !requestData) return;

  // 1. Create linked conversation in Firestore
  const conversationRef = await adminDb.collection('conversations').add({
    requestId,
    requestType,
    customerId: requestData.customerId,
    customerName: requestData.customerName,
    mechanicId: winner.mechanicId,
    mechanicName: winner.mechanicName,
    lastMessageText: requestType === 'fuel' ? 'Fuel delivery request accepted. Chat opened.' : 'Service request created. Chat opened.',
    lastMessageAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const conversationId = conversationRef.id;

  // 2. Mirror status update into RTDB
  const assignmentUpdate = {
    status: 'assigned',
    assignedMechanicId: winner.mechanicId,
    assignedMechanicName: winner.mechanicName,
    conversationId,
    assignedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await adminRtdb.ref(`${paths.broadcast}/${requestId}`).update(assignmentUpdate);
  if (requestType === 'fuel') {
    await adminRtdb.ref(`users/${requestData.customerId}/fuelRequests/${requestId}`).update(assignmentUpdate);
  }
  await writePlatformActivity(adminDb, {
    action: requestType === 'fuel' ? 'FUEL_REQUEST_ASSIGNED' : 'MECHANIC_REQUEST_ASSIGNED',
    details: `${paths.label} ${requestId} was assigned to ${winner.mechanicName}.`,
    targetId: requestId,
    targetType: requestType === 'fuel' ? 'fuel_request' : 'mechanic_request',
    actorId: winner.mechanicId,
  });

  // 3. Notify the assigned mechanic and customer
  const customerSnap = await adminRtdb.ref(`users/${requestData.customerId}`).once('value');
  const customerData = customerSnap.val() || {};

  const mechanicSnap = await adminRtdb.ref(`mechanics/${winner.mechanicId}`).once('value');
  const mechanicData = mechanicSnap.val() || {};

  // Push to customer
  if (customerData.expoPushToken || customerData.pushToken) {
    sendExpoPushNotifications([
      {
        to: customerData.expoPushToken || customerData.pushToken,
        sound: 'default',
        title: 'Mechanic Assigned!',
        body: `Good news! ${winner.mechanicName} has accepted your MechanIQ service request.`,
        data: { requestId, conversationId, type: 'mechanic_assigned' },
      },
    ]);
  }

  // Push to winning mechanic
  if (mechanicData.expoPushToken || mechanicData.pushToken) {
    sendExpoPushNotifications([
      {
        to: mechanicData.expoPushToken || mechanicData.pushToken,
        sound: 'default',
        title: 'Request Assigned!',
        body: 'Congratulations! You have been assigned this service request.',
        data: { requestId, conversationId, type: 'request_won' },
      },
    ]);
  }

  // Clean incoming feeds for other mechanics
  for (const attempt of allAttempts) {
    if (attempt.mechanicId !== winner.mechanicId) {
      await adminRtdb.ref(`${paths.incoming}/${attempt.mechanicId}/${requestId}`).update({
        status: 'assigned_to_other',
      });
    }
  }
  const mechanicSnapshot = await adminRtdb.ref('mechanics').once('value');
  await Promise.all(Object.keys(mechanicSnapshot.val() || {}).map(async (uid) => {
    const feedRef = adminRtdb.ref(`${paths.incoming}/${uid}/${requestId}`);
    const feedSnapshot = await feedRef.once('value');
    if (!feedSnapshot.exists() || feedSnapshot.val()?.status === 'declined') return;
    await feedRef.update(uid === winner.mechanicId
      ? { status: 'assigned', assignedMechanicId: winner.mechanicId, assignedMechanicName: winner.mechanicName, conversationId }
      : { status: 'assigned_to_other' });
  }));

  return {
    assignedMechanicId: winner.mechanicId,
    conversationId,
  };
}

async function syncMechanicOpenRequests(mechanicUid) {
  const { adminDb, adminRtdb } = await getFirebaseAdmin();
  const mechanicSnapshot = await adminRtdb.ref(`mechanics/${mechanicUid}`).once('value');
  const mechanic = mechanicSnapshot.val();
  if (!mechanic) throw new Error('Mechanic profile not found.');
  const accountStatus = String(mechanic.accountStatus || mechanic.status || 'Active').trim().toLowerCase();
  if (accountStatus !== 'active' || mechanic.isActive === false || mechanic.isDisabled === true) {
    throw new Error('Only an active, approved mechanic can receive requests.');
  }
  if (mechanic.isAcceptingJobs !== true && mechanic.availability?.isAcceptingJobs !== true && mechanic.availability?.status !== 'available') {
    throw new Error('Go online before refreshing nearby requests.');
  }
  const location = mechanic.liveLocation || mechanic.location;
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('A valid current mechanic location is required.');
  }

  const refreshed = { service: 0, fuel: 0 };
  const now = Date.now();
  const feeds = [
    { requestType: 'service', collection: 'serviceRequests', feed: 'mechanicIncomingRequests', radiusKm: DEFAULT_SEARCH_RADIUS_KM },
    { requestType: 'fuel', collection: 'fuelRequests', feed: 'mechanicIncomingFuelRequests', radiusKm: 15 },
  ];
  for (const config of feeds) {
    const snapshot = await adminDb.collection(config.collection).get();
    for (const document of snapshot.docs) {
      const request = document.data();
      if (!['broadcasting', 'awaiting_selection', 'no_mechanics'].includes(request.status)) continue;
      if (request.assignedMechanicId || (request.expiresAt && new Date(request.expiresAt).getTime() <= now)) continue;
      const requestLocation = request.location || request.deliveryLocation?.coordinate;
      const distanceKm = calculateHaversineDistanceKm(
        Number(requestLocation?.latitude),
        Number(requestLocation?.longitude),
        latitude,
        longitude,
      );
      if (distanceKm > config.radiusKm) continue;

      const requestId = document.id;
      const feedData = config.requestType === 'fuel'
        ? {
            requestId,
            requestType: 'fuel',
            customerName: request.customerName || 'Customer',
            vehicle: request.vehicle || null,
            fuelType: request.fuelType || '',
            quantityLitres: Number(request.quantityLitres) || 0,
            deliveryLocation: request.deliveryLocation || null,
            approximateDistanceKm: distanceKm,
            status: request.status === 'awaiting_selection' ? 'awaiting_selection' : 'broadcasting',
            createdAt: request.createdAt,
            expiresAt: request.expiresAt,
          }
        : {
            requestId,
            requestType: 'service',
            customerName: request.customerName || 'Customer',
            vehicle: request.vehicle || null,
            issueDescription: request.issueDescription || '',
            mediaUrls: Array.isArray(request.mediaUrls) ? request.mediaUrls : [],
            approximateDistanceKm: distanceKm,
            status: request.status === 'awaiting_selection' ? 'awaiting_selection' : 'broadcasting',
            createdAt: request.createdAt,
            expiresAt: request.expiresAt,
          };
      await adminRtdb.ref(`${config.feed}/${mechanicUid}/${requestId}`).set(feedData);
      if (request.status === 'no_mechanics') {
        const updatedAt = new Date().toISOString();
        await document.ref.update({ status: 'broadcasting', eligibleMechanicCount: (Number(request.eligibleMechanicCount) || 0) + 1, updatedAt });
        const broadcastNode = config.requestType === 'fuel' ? 'fuelRequests' : 'broadcastRequests';
        await adminRtdb.ref(`${broadcastNode}/${requestId}`).update({ status: 'broadcasting', updatedAt });
        if (config.requestType === 'fuel' && request.customerId) {
          await adminRtdb.ref(`users/${request.customerId}/fuelRequests/${requestId}`).update({ status: 'broadcasting', updatedAt });
        }
      }
      refreshed[config.requestType] += 1;
    }
  }
  return { success: true, refreshed };
}

module.exports = {
  findEligibleMechanics,
  createAndBroadcastServiceRequest,
  createAndBroadcastFuelRequest,
  handleAcceptanceAttempt,
  declineMechanicRequest,
  resolveRequestWinner,
  syncMechanicOpenRequests,
  getFirebaseAdmin,
  calculateHaversineDistanceKm,
};
