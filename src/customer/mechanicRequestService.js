import { push, ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebase';

export async function createMechanicRequest(input) {
    const user = auth.currentUser;
    if (!user || user.uid !== input?.customerId) throw new Error('Sign in to the matching customer account before requesting a mechanic.');
    const vehicleId = String(input.vehicleId || '').trim();
    const mechanicId = String(input.mechanicId || '').trim();
    const address = String(input.serviceLocation?.address || '').trim().slice(0, 300);
    if (!vehicleId || !mechanicId || !address) throw new Error('Complete the vehicle, mechanic, and service address before submitting.');
    const requestRef = push(ref(database, 'serviceRequests'));
    const id = requestRef.key;
    if (!id) throw new Error('Unable to create a mechanic request. Please try again.');
    const now = new Date().toISOString();
    const request = {
        id,
        customerUid: user.uid,
        mechanicUid: mechanicId,
        vehicleId,
        diagnosticScanId: input.diagnosticResultId ? String(input.diagnosticResultId).slice(0, 128) : null,
        requestType: 'mobile',
        serviceLocation: { address, latitude: null, longitude: null },
        scheduledAt: typeof input.scheduledAt === 'string' ? input.scheduledAt.slice(0, 80) : null,
        issueDescription: typeof input.issueDescription === 'string' ? input.issueDescription.trim().slice(0, 1000) || null : null,
        status: 'requested',
        createdAt: now,
        updatedAt: now,
    };
    await set(requestRef, request);
    if (auth.currentUser?.uid !== user.uid) throw new Error('Your account changed while submitting the request.');
    return { ...request, customerId: user.uid, mechanicId, diagnosticResultId: request.diagnosticScanId, status: 'pending' };
}
