import { auth } from '../firebase/firebase';

import { createEmergencyRequestIds } from './emergencyRequestId';

import { saveEmergencyRequest } from './emergencyStorage';

/**
 * MechanIQ Emergency Request Preparation
 *
 * Creates and securely saves local emergency requests
 * for registered MechanIQ Customers.
 *
 * This service:
 * - Works without internet.
 * - Supports Emergency Fuel and Emergency Mechanic.
 * - Preserves Firebase UID ownership.
 * - Generates stable request identifiers.
 * - Never submits requests automatically.
 *
 * Saving a request does NOT dispatch assistance.
 */

const MAX_CONTACT_NAME_LENGTH = 120;
const MAX_PHONE_NUMBER_LENGTH = 40;
const MAX_LOCATION_DESCRIPTION_LENGTH = 500;
const MAX_PROBLEM_DESCRIPTION_LENGTH = 1000;
const MAX_VEHICLE_TEXT_LENGTH = 120;
const MAX_FUEL_TYPE_LENGTH = 80;

/**
 * Validate a text value without silently
 * changing information entered by the Customer.
 */
function validateOptionalText(value, fieldName, maxLength) {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value !== 'string') {
        throw new Error(`${fieldName} must be text.`);
    }

    const normalized = value.trim();

    if (normalized.length > maxLength) {
        throw new Error(
            `${fieldName} must be ${maxLength} characters or fewer.`
        );
    }

    return normalized || null;
}

/**
 * Confirm that the existing Firebase session
 * matches the Customer profile supplied by
 * MechanIQ's UserContext.
 *
 * A cached Customer role may allow local offline
 * preparation, but it does not authorize backend
 * submission. The backend must independently
 * verify identity and role.
 */
function requireCustomerSession(owner, customerProfile) {
    const firebaseUser = auth.currentUser;

    if (
        !owner ||
        owner.type !== 'customer' ||
        typeof owner.accountId !== 'string' ||
        !owner.accountId.trim() ||
        !firebaseUser ||
        firebaseUser.emailVerified !== true ||
        firebaseUser.uid !== owner.accountId ||
        !customerProfile ||
        customerProfile.id !== firebaseUser.uid ||
        customerProfile.emailVerified !== true ||
        customerProfile.role !== 'customer'
    ) {
        throw new Error(
            'A verified MechanIQ Customer account is required.'
        );
    }
}

/**
 * Validate real coordinates when available.
 *
 * Coordinates are optional because GPS may
 * be unavailable in a remote area.
 *
 * Never create estimated or invented coordinates.
 */
function prepareCoordinates(coordinates) {
    if (coordinates === null || coordinates === undefined) {
        return null;
    }

    if (
        typeof coordinates !== 'object' ||
        !Number.isFinite(coordinates.latitude) ||
        !Number.isFinite(coordinates.longitude) ||
        coordinates.latitude < -90 ||
        coordinates.latitude > 90 ||
        coordinates.longitude < -180 ||
        coordinates.longitude > 180
    ) {
        throw new Error(
            'The provided GPS coordinates are invalid.'
        );
    }

    const accuracyMeters =
        coordinates.accuracyMeters ?? null;

    if (
        accuracyMeters !== null &&
        (!Number.isFinite(accuracyMeters) ||
            accuracyMeters < 0)
    ) {
        throw new Error(
            'The GPS accuracy value is invalid.'
        );
    }

    const capturedAt = coordinates.capturedAt ?? null;

    if (
        capturedAt !== null &&
        (typeof capturedAt !== 'string' ||
            Number.isNaN(Date.parse(capturedAt)))
    ) {
        throw new Error(
            'The GPS capture time is invalid.'
        );
    }

    return {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        accuracyMeters,
        capturedAt,
    };
}

/**
 * Prepare Customer-provided contact information.
 *
 * Missing values may be saved in a local draft,
 * but must be validated before backend submission.
 */
function prepareContact(contact) {
    if (!contact || typeof contact !== 'object') {
        throw new Error(
            'Emergency contact information is required.'
        );
    }

    return {
        name: validateOptionalText(
            contact.name,
            'Contact name',
            MAX_CONTACT_NAME_LENGTH
        ),
        phoneNumber: validateOptionalText(
            contact.phoneNumber,
            'Phone number',
            MAX_PHONE_NUMBER_LENGTH
        ),
    };
}

/**
 * Prepare a manually entered location description
 * and any actual device coordinates.
 *
 * Both may be temporarily missing in a local draft.
 * A usable location must be provided before submission.
 */
function prepareLocation(location) {
    if (!location || typeof location !== 'object') {
        throw new Error(
            'Emergency location information is required.'
        );
    }

    return {
        coordinates: prepareCoordinates(
            location.coordinates
        ),
        description: validateOptionalText(
            location.description,
            'Location description',
            MAX_LOCATION_DESCRIPTION_LENGTH
        ),
    };
}

/**
 * Preserve optional vehicle information.
 *
 * The backend must independently validate vehicle
 * ownership and fuel compatibility where applicable.
 */
function prepareVehicle(vehicle) {
    if (vehicle === null || vehicle === undefined) {
        return null;
    }

    if (typeof vehicle !== 'object') {
        throw new Error(
            'Invalid emergency vehicle information.'
        );
    }

    const year = vehicle.year ?? null;

    if (
        year !== null &&
        (!Number.isInteger(year) ||
            year < 1886 ||
            year > new Date().getFullYear() + 1)
    ) {
        throw new Error(
            'Invalid vehicle year.'
        );
    }

    return {
        vehicleId: validateOptionalText(
            vehicle.vehicleId,
            'Vehicle ID',
            MAX_VEHICLE_TEXT_LENGTH
        ),
        make: validateOptionalText(
            vehicle.make,
            'Vehicle make',
            MAX_VEHICLE_TEXT_LENGTH
        ),
        model: validateOptionalText(
            vehicle.model,
            'Vehicle model',
            MAX_VEHICLE_TEXT_LENGTH
        ),
        year,
    };
}

/**
 * Prepare service-specific information.
 *
 * Drafts may be incomplete.
 *
 * Fuel type, quantity, contact, location,
 * compatibility and service availability must
 * be validated before actual submission.
 */
function prepareDetails(input) {
    if (!input.details || typeof input.details !== 'object') {
        throw new Error(
            'Emergency service details are required.'
        );
    }

    if (input.serviceType === 'fuel') {
        const quantityLitres =
            input.details.quantityLitres ?? null;

        if (
            quantityLitres !== null &&
            (!Number.isFinite(quantityLitres) ||
                quantityLitres <= 0)
        ) {
            throw new Error(
                'Fuel quantity must be greater than zero.'
            );
        }

        return {
            fuelType: validateOptionalText(
                input.details.fuelType,
                'Fuel type',
                MAX_FUEL_TYPE_LENGTH
            ),
            quantityLitres,
        };
    }

    if (input.serviceType === 'mechanic') {
        const description = validateOptionalText(
            input.details.problemDescription,
            'Breakdown description',
            MAX_PROBLEM_DESCRIPTION_LENGTH
        );

        return {
            problemDescription: description ?? '',
        };
    }

    throw new Error(
        'Unsupported emergency service type.'
    );
}

/**
 * Prepare and securely save an emergency request.
 *
 * This creates a LOCAL DRAFT ONLY.
 *
 * A saved draft:
 * - Has no backend request ID.
 * - Has not been submitted.
 * - Has not contacted a mechanic or fuel provider.
 * - Must be reviewed before future submission.
 *
 * @param {import('./emergencyTypes').PrepareEmergencyRequestInput} input
 * @param {{id: string, role: string, emailVerified: boolean}} customerProfile
 * @returns {Promise<import('./emergencyTypes').EmergencyRequest>}
 */
export async function prepareAndSaveEmergencyRequest(
    input,
    customerProfile
) {
    if (!input || typeof input !== 'object') {
        throw new Error(
            'Emergency request details are required.'
        );
    }

    requireCustomerSession(
        input.owner,
        customerProfile
    );

    const identifiers = createEmergencyRequestIds();

    const timestamp = new Date().toISOString();

    const baseRequest = {
        ...identifiers,

        owner: {
            type: 'customer',
            accountId: input.owner.accountId,
        },

        contact: prepareContact(input.contact),
        location: prepareLocation(input.location),
        vehicle: prepareVehicle(input.vehicle),

        status: 'saved',

        createdAt: timestamp,
        updatedAt: timestamp,

        backendRequestId: null,
        lastError: null,
    };

    let request;

    if (input.serviceType === 'fuel') {
        request = {
            ...baseRequest,
            serviceType: 'fuel',
            details: prepareDetails(input),
        };
    } else if (input.serviceType === 'mechanic') {
        request = {
            ...baseRequest,
            serviceType: 'mechanic',
            details: prepareDetails(input),
        };
    } else {
        throw new Error(
            'Unsupported emergency service type.'
        );
    }

    // Recheck the account before writing sensitive data.
    requireCustomerSession(
        request.owner,
        customerProfile
    );

    await saveEmergencyRequest(request);

    return request;
}