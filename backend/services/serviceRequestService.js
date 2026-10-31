const { calculateHaversineDistanceKm } = require('./distanceUtil');

// Configurable constants as specified
const DEFAULT_SEARCH_RADIUS_KM = 30;
const DEFAULT_LOCATION_FRESHNESS_MINUTES = 120; // 2 hours
const SELECTION_WINDOW_MS = 5000; // 5-second simultaneous-acceptance window
const REQUEST_EXPIRY_HOURS = 24;

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
        databaseURL: 'https://mechaniq-3a0f2-default-rtdb.firebaseio.com',
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
    status: 'broadcasting', // broadcasting -> awaiting_selection -> assigned -> completed / cancelled / expired
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

  return {
    id: requestId,
    ...requestRecord,
    eligibleMechanicCount: eligibleMechanics.length,
  };
}

/**
 * Handle mechanic acceptance attempt and manage 5-second simultaneous-acceptance window.
 */
async function handleAcceptanceAttempt(mechanicUid, requestId) {
  const { adminDb, adminRtdb } = await getFirebaseAdmin();

  // 1. Verify mechanic
  const mechanicSnapshot = await adminRtdb.ref(`mechanics/${mechanicUid}`).once('value');
  const mechanic = mechanicSnapshot.val();
  if (!mechanic) throw new Error('Mechanic profile not found.');

  const status = String(mechanic.accountStatus || mechanic.status || 'Active').trim().toLowerCase();
  if (status !== 'active') throw new Error('Your mechanic account is not active.');

  const requestRef = adminDb.collection('serviceRequests').doc(requestId);

  // Firestore transaction to safely register attempt and trigger selection window
  const attemptResult = await adminDb.runTransaction(async (transaction) => {
    const docSnap = await transaction.get(requestRef);
    if (!docSnap.exists) {
      throw new Error('Service request does not exist.');
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
    const distanceKm = calculateHaversineDistanceKm(
      data.location?.latitude,
      data.location?.longitude,
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

  // Update RTDB broadcast status
  if (attemptResult.isFirstAcceptance) {
    await adminRtdb.ref(`broadcastRequests/${requestId}`).update({
      status: 'awaiting_selection',
      selectionWindowEndsAt: new Date(attemptResult.windowEndsAtMs).toISOString(),
    });

    // Schedule selection resolution in 5 seconds
    const delay = Math.max(100, attemptResult.windowEndsAtMs - Date.now());
    setTimeout(() => {
      resolveRequestWinner(requestId).catch((err) =>
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

/**
 * Resolve winner after 5-second simultaneous-acceptance window.
 * Selection priority:
 * 1. Rating (highest verified rating)
 * 2. Distance (closest to customer)
 * 3. Earliest server timestamp
 */
async function resolveRequestWinner(requestId) {
  const { adminDb, adminRtdb } = await getFirebaseAdmin();
  const requestRef = adminDb.collection('serviceRequests').doc(requestId);

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
    customerId: requestData.customerId,
    customerName: requestData.customerName,
    mechanicId: winner.mechanicId,
    mechanicName: winner.mechanicName,
    lastMessageText: 'Service request created. Chat opened.',
    lastMessageAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const conversationId = conversationRef.id;

  // 2. Mirror status update into RTDB
  await adminRtdb.ref(`broadcastRequests/${requestId}`).update({
    status: 'assigned',
    assignedMechanicId: winner.mechanicId,
    assignedMechanicName: winner.mechanicName,
    conversationId,
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
      await adminRtdb.ref(`mechanicIncomingRequests/${attempt.mechanicId}/${requestId}`).update({
        status: 'assigned_to_other',
      });
    }
  }

  return {
    assignedMechanicId: winner.mechanicId,
    conversationId,
  };
}

module.exports = {
  findEligibleMechanics,
  createAndBroadcastServiceRequest,
  handleAcceptanceAttempt,
  resolveRequestWinner,
  getFirebaseAdmin,
  calculateHaversineDistanceKm,
};
