/**
 * All mechanic job mutations are backend-owned.
 *
 * Communicates with the authoritative backend for:
 * - Accepting jobs atomically
 * - Starting travel trips
 * - Streaming mechanic live location
 * - Marking arrival
 * - Starting and completing jobs
 */

import {
  acceptFuelDelivery,
  declineFuelDelivery,
  startFuelDeliveryTrip,
  updateFuelDeliveryLocation,
  updateFuelDeliveryStatus,
} from './fuelDeliveryService';
import { acceptMechanicRequest } from '../customer/mechanicRequestService';

function requireJobId(jobId) {
  if (!jobId || typeof jobId !== 'string') {
    throw new Error('A valid job is required for this action.');
  }
}

export async function acceptMechanicJob(jobId) {
  requireJobId(jobId);
  try { return await acceptFuelDelivery(jobId); } catch (error) { if (error?.status === 404 || /not found/i.test(error?.message || '')) return await acceptMechanicRequest(jobId); throw error; }
}

export async function rejectMechanicJob(jobId) {
  requireJobId(jobId);
  return await declineFuelDelivery(jobId);
}

export async function startMechanicJobTrip(input) {
  requireJobId(input?.jobId);

  if (
    typeof input?.mechanicLocation?.latitude !== 'number' ||
    typeof input?.mechanicLocation?.longitude !== 'number'
  ) {
    throw new Error(
      'Your current location is required before starting the trip.'
    );
  }

  return await startFuelDeliveryTrip(input.jobId, input.mechanicLocation);
}

export async function updateMechanicJobLocation(input) {
  requireJobId(input?.jobId);

  if (
    typeof input?.mechanicLocation?.latitude !== 'number' ||
    typeof input?.mechanicLocation?.longitude !== 'number'
  ) {
    throw new Error('A valid mechanic location is required.');
  }

  return await updateFuelDeliveryLocation(input.jobId, input.mechanicLocation);
}

export async function markMechanicJobArrived(jobId) {
  requireJobId(jobId);
  return await updateFuelDeliveryStatus(jobId, 'arrived');
}

export async function startMechanicJob(jobId) {
  requireJobId(jobId);
  return await updateFuelDeliveryStatus(jobId, 'delivering');
}

export async function completeMechanicJob(jobId) {
  requireJobId(jobId);
  return await updateFuelDeliveryStatus(jobId, 'completed');
}
