import { mechanicRequestsApi } from '../services/mechanicRequestsApi';
import { auth, database } from '../firebase/firebase';
import { onValue, ref } from 'firebase/database';
export async function createMechanicRequest(input) { const result = await mechanicRequestsApi('', { method: 'POST', body: input }); return result.request; }
export async function acceptMechanicRequest(requestId) { const result = await mechanicRequestsApi(String(requestId) + '/accept', { method: 'POST' }); return result.request; }

export async function getMyMechanicRequests() { const result = await mechanicRequestsApi('mine'); return Array.isArray(result?.requests) ? result.requests : []; }
export function subscribeToMechanicRequests(onChange, onError) { const user = auth.currentUser; return user ? onValue(ref(database, `mechanic_pending_requests/${user.uid}`), onChange, onError) : () => {}; }
