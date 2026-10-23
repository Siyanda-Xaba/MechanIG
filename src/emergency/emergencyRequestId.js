import { randomUUID } from 'expo-crypto';

/**
 * MechanIQ Remote-Area Emergency Assistance
 *
 * Generates cryptographically secure identifiers
 * for locally prepared emergency requests.
 *
 * UUID generation works without internet access.
 *
 * These identifiers do not represent confirmed
 * backend requests or dispatched assistance.
 */

/**
 * Create identifiers for a new emergency request.
 *
 * The clientRequestId must remain unchanged
 * during retries and after app restarts.
 *
 * The backend must enforce idempotency using
 * clientRequestId.
 *
 * @returns {{
 *   localId: string,
 *   clientRequestId: string
 * }}
 */
export function createEmergencyRequestIds() {
    return {
        localId: randomUUID(),
        clientRequestId: randomUUID(),
    };
}