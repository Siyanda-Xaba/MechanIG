/**
 * MechanIQ Remote-Area Emergency Assistance
 *
 * Frontend types for locally prepared emergency requests.
 *
 * These records are NOT confirmed backend requests.
 *
 * A driver must explicitly review and confirm a request
 * before any backend submission is attempted.
 */

export type EmergencyServiceType =
    | 'fuel'
    | 'mechanic';

/**
 * Emergency requests belong exclusively to
 * registered MechanIQ Customers.
 *
 * accountId must be the authenticated
 * Customer's Firebase UID.
 *
 * Guest emergency requests are not supported.
 */
export type EmergencyRequestOwner = {
    type: 'customer';
    accountId: string;
};

/**
 * Coordinates must originate from a real device
 * location reading or explicitly supplied user data.
 *
 * Never generate or assume GPS coordinates.
 */
export interface EmergencyCoordinates {
    latitude: number;
    longitude: number;

    accuracyMeters?: number | null;
    capturedAt?: string | null;
}

export interface EmergencyLocation {
    coordinates: EmergencyCoordinates | null;
    description: string | null;
}

/**
 * Vehicle information is optional when preparing
 * an emergency request.
 *
 * A registered Customer may not have selected
 * a vehicle or may need help with another vehicle.
 *
 * Vehicle ownership and compatibility must be
 * validated before applicable backend operations.
 */
export interface EmergencyVehicleDetails {
    vehicleId: string | null;

    make: string | null;
    model: string | null;
    year: number | null;
}

/**
 * Basic contact details for requesting assistance.
 *
 * These details are sensitive and must not be
 * persisted in unencrypted AsyncStorage.
 */
export interface EmergencyContactDetails {
    name: string | null;
    phoneNumber: string | null;
}

/**
 * Emergency Fuel information.
 *
 * Fuel type and quantity must be validated before
 * submission. The backend must independently
 * validate compatibility, pricing and availability.
 */
export interface EmergencyFuelDetails {
    fuelType: string | null;
    quantityLitres: number | null;
}

/**
 * Roadside mechanic assistance information.
 *
 * A specific mechanic does not need to be selected
 * when preparing an offline emergency request.
 */
export interface EmergencyMechanicDetails {
    problemDescription: string;
}

/**
 * Local request status.
 *
 * SAVED:
 * The request exists only on the device.
 *
 * SUBMITTING:
 * Submission was explicitly approved and is
 * currently being attempted.
 *
 * SUBMISSION_FAILED:
 * A confirmed submission result was not obtained.
 * A retry requires the driver's confirmation.
 *
 * SUBMITTED:
 * The backend has acknowledged and persisted
 * the request.
 *
 * CANCELLED:
 * The driver cancelled the local request.
 *
 * Internet connectivity alone must never
 * transition a request to SUBMITTING.
 */
export const EMERGENCY_REQUEST_STATUSES = {
    SAVED: 'saved',
    SUBMITTING: 'submitting',
    SUBMISSION_FAILED: 'submission_failed',
    SUBMITTED: 'submitted',
    CANCELLED: 'cancelled',
} as const;

export type EmergencyRequestStatus =
    (typeof EMERGENCY_REQUEST_STATUSES)[keyof typeof EMERGENCY_REQUEST_STATUSES];

/**
 * Shared properties of locally saved requests.
 *
 * localId:
 * Identifies the record on this device.
 *
 * clientRequestId:
 * Stable identifier for backend idempotency.
 * It must not change during retries.
 *
 * backendRequestId:
 * Must remain null until an authoritative
 * backend response provides a real request ID.
 */
export interface EmergencyRequestBase {
    localId: string;
    clientRequestId: string;

    owner: EmergencyRequestOwner;

    contact: EmergencyContactDetails;
    location: EmergencyLocation;
    vehicle: EmergencyVehicleDetails | null;

    status: EmergencyRequestStatus;

    createdAt: string;
    updatedAt: string;

    backendRequestId: string | null;
    lastError: string | null;
}

/**
 * Locally prepared Emergency Fuel request.
 */
export interface EmergencyFuelRequest
    extends EmergencyRequestBase {
    serviceType: 'fuel';

    details: EmergencyFuelDetails;
}

/**
 * Locally prepared roadside mechanic request.
 */
export interface EmergencyMechanicRequest
    extends EmergencyRequestBase {
    serviceType: 'mechanic';

    details: EmergencyMechanicDetails;
}

/**
 * A saved emergency request can represent
 * either supported emergency service.
 */
export type EmergencyRequest =
    | EmergencyFuelRequest
    | EmergencyMechanicRequest;

/**
 * Data collected when preparing a request.
 *
 * The storage/service layer will assign the
 * local identifiers, timestamps and initial status.
 */
export type PrepareEmergencyRequestInput =
    | {
          serviceType: 'fuel';
          owner: EmergencyRequestOwner;
          contact: EmergencyContactDetails;
          location: EmergencyLocation;
          vehicle: EmergencyVehicleDetails | null;
          details: EmergencyFuelDetails;
      }
    | {
          serviceType: 'mechanic';
          owner: EmergencyRequestOwner;
          contact: EmergencyContactDetails;
          location: EmergencyLocation;
          vehicle: EmergencyVehicleDetails | null;
          details: EmergencyMechanicDetails;
      };