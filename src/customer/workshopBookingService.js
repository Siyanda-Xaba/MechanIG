import { push, ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebase';

export async function createWorkshopBooking(input) {
    const user = auth.currentUser;
    if (!user || user.uid !== input?.customerId) throw new Error('Sign in to the matching customer account before requesting a booking.');
    const vehicleId = String(input.vehicleId || '').trim();
    const mechanicId = String(input.mechanicId || '').trim();
    const serviceType = String(input.serviceType || '').trim().slice(0, 100);
    const scheduledDate = String(input.scheduledDate || '').trim();
    const scheduledTime = String(input.scheduledTime || '').trim();
    if (!vehicleId || !mechanicId || !serviceType || !scheduledDate || !scheduledTime) throw new Error('Complete the vehicle, mechanic, service, date, and time before submitting.');
    const bookingRef = push(ref(database, 'bookings'));
    const id = bookingRef.key;
    if (!id) throw new Error('Unable to create a booking request. Please try again.');
    const now = new Date().toISOString();
    const booking = {
        id,
        customerUid: user.uid,
        mechanicUid: mechanicId,
        vehicleId,
        diagnosticScanId: input.diagnosticResultId ? String(input.diagnosticResultId).slice(0, 128) : null,
        serviceType,
        issueDescription: typeof input.issueDescription === 'string' ? input.issueDescription.trim().slice(0, 1000) || null : null,
        scheduledDate,
        scheduledTime,
        serviceLocationType: 'workshop',
        status: 'requested',
        createdAt: now,
        updatedAt: now,
    };
    await set(bookingRef, booking);
    if (auth.currentUser?.uid !== user.uid) throw new Error('Your account changed while submitting the booking.');
    return { ...booking, customerId: user.uid, mechanicId, diagnosticResultId: booking.diagnosticScanId, status: 'pending', estimatedPrice: null, finalPrice: null };
}
