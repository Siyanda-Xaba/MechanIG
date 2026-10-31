import { fetchWithPictureSearchFallback, getPictureSearchAuthHeaders } from '../config/pictureSearchApi';
import { auth, database, db } from '../firebase/firebase';
import { ref, onValue, off, update } from 'firebase/database';
import { collection, doc, onSnapshot } from 'firebase/firestore';

/**
 * Submit a service request to be broadcast to mechanics within 30 km.
 */
export async function broadcastServiceRequest(payload) {
  const headers = await getPictureSearchAuthHeaders();
  headers['Content-Type'] = 'application/json';

  const response = await fetchWithPictureSearchFallback('/api/v1/service-requests', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.error || 'Unable to broadcast service request.');
  }

  return await response.json();
}

/**
 * Mechanic accepts an incoming service request.
 */
export async function acceptServiceRequest(requestId) {
  const headers = await getPictureSearchAuthHeaders();
  headers['Content-Type'] = 'application/json';

  const response = await fetchWithPictureSearchFallback('/api/v1/service-requests/accept', {
    method: 'POST',
    headers,
    body: JSON.stringify({ requestId }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.error || 'Unable to submit acceptance.');
  }

  return await response.json();
}

/**
 * Update mechanic live location in Realtime Database.
 */
export async function updateMechanicLiveLocation(coords) {
  const user = auth.currentUser;
  if (!user) return;
  const now = new Date().toISOString();
  await update(ref(database, `mechanics/${user.uid}/liveLocation`), {
    latitude: coords.latitude,
    longitude: coords.longitude,
    updatedAt: now,
  });
}

/**
 * Update mechanic availability status in Realtime Database.
 */
export async function setMechanicAcceptingJobs(isAccepting) {
  const user = auth.currentUser;
  if (!user) return;
  await update(ref(database, `mechanics/${user.uid}`), {
    isAcceptingJobs: Boolean(isAccepting),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Subscribe to a service request status via Realtime Database.
 */
export function subscribeServiceRequest(requestId, onData, onError) {
  const requestRef = ref(database, `broadcastRequests/${requestId}`);
  const callback = (snapshot) => {
    onData(snapshot.val());
  };
  onValue(requestRef, callback, onError);
  return () => off(requestRef, 'value', callback);
}

/**
 * Subscribe to mechanic's incoming requests feed via Realtime Database.
 */
export function subscribeMechanicIncomingRequests(mechanicUid, onData, onError) {
  const feedRef = ref(database, `mechanicIncomingRequests/${mechanicUid}`);
  const callback = (snapshot) => {
    const val = snapshot.val() || {};
    const list = Object.entries(val).map(([id, item]) => ({
      id,
      ...item,
    }));
    onData(list);
  };
  onValue(feedRef, callback, onError);
  return () => off(feedRef, 'value', callback);
}

/**
 * Decline an incoming service request (dismisses from mechanic's feed).
 */
export async function declineServiceRequest(mechanicUid, requestId) {
  await update(ref(database, `mechanicIncomingRequests/${mechanicUid}/${requestId}`), {
    status: 'declined',
    declinedAt: new Date().toISOString(),
  });
}
