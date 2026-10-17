/**
 * Customer Fuel Service
 *
 * Fuel information must come from authoritative sources:
 *
 * - Supported OBD/vehicle readings
 * - Validated backend records
 * - Verified fuel station providers
 * - Confirmed customer delivery history
 *
 * Never present development values as real readings,
 * station availability, or delivery activity.
 */

const unavailableFuelData = {
    // Requires an actual vehicle reading.
    fuelLevel: null,

    // Requires authoritative vehicle data or
    // a calculation based on verified inputs.
    estimatedRangeKm: null,

    // Must come from validated vehicle information
    // or an authoritative backend record.
    fuelType: null,

    // Fuel compatibility must be verified before
    // specific options are recommended.
    compatibleFuelTypes: [],

    // Nearby stations must come from a real
    // location-based station provider.
    nearestStation: null,

    // Delivery state must come from the backend.
    activeDeliveryId: null,
    activeDeliveryStatus: null,

    // Display only confirmed fuel activity.
    recentActivity: [],
};

/**
 * Retrieve fuel information for the
 * currently selected vehicle.
 *
 * Future backend integration will use vehicleId
 * to retrieve vehicle-specific fuel information.
 *
 * Missing information is represented by null
 * or an empty collection, never invented values.
 */
export async function getCustomerFuelData(vehicleId) {
    // Future backend integration:
    //
    // - Verify the authenticated customer.
    // - Verify ownership of the selected vehicle.
    // - Retrieve supported fuel readings.
    // - Retrieve verified vehicle fuel type.
    // - Retrieve validated fuel compatibility.
    // - Retrieve nearby stations from a provider.
    // - Retrieve actual delivery status.
    // - Retrieve confirmed fuel activity.
    //
    // Real readings should include their source
    // and measurement timestamp.
    //
    // Cached readings must be identified as cached
    // and must not be presented as live information.

    void vehicleId;

    return {
        ...unavailableFuelData,
        compatibleFuelTypes: [],
        recentActivity: [],
    };
}

/**
 * Retrieve confirmed fuel activity history
 * for the selected vehicle.
 *
 * No synthetic delivery or fuel purchase
 * records are generated.
 */
export async function getFuelHistory(vehicleId) {
    // Future:
    //
    // Retrieve persistent history records
    // belonging to the authenticated customer
    // and selected vehicle.
    //
    // Records must originate from genuine
    // customer activity or backend transactions.

    void vehicleId;

    return [];
}

/**
 * Retrieve the authenticated customer's
 * saved fuel delivery locations.
 */
export async function getSavedFuelLocations() {
    // Future:
    //
    // Retrieve customer-owned saved locations
    // from persistent backend storage.
    //
    // Addresses and coordinates must never
    // be fabricated.

    return [];
}

/**
 * Request fuel delivery.
 *
 * This operation requires a real backend.
 */
export async function createFuelDeliveryRequest(input) {
    // The backend must:
    //
    // - Authenticate the customer.
    // - Validate the selected vehicle.
    // - Validate fuel compatibility.
    // - Validate delivery coverage.
    // - Retrieve authoritative pricing.
    // - Confirm provider availability.
    // - Create the actual delivery request.
    // - Return a real delivery identifier.
    //
    // Do not create a fake delivery ID
    // or simulate a successful transaction.

    void input;

    throw new Error(
        'Fuel delivery requests are not available until the delivery backend is connected.'
    );
}

/**
 * Retrieve authoritative tracking information
 * for an existing fuel delivery.
 */
export async function getFuelDeliveryTracking(deliveryId) {
    // The delivery backend will eventually provide:
    //
    // - Authoritative delivery lifecycle status.
    // - Assigned driver information.
    // - Verified driver location.
    // - Delivery destination.
    // - Estimated arrival time.
    // - Route information.
    // - Last tracking update timestamp.
    //
    // Never fabricate driver movement,
    // delivery status, routes, or ETA.

    void deliveryId;

    throw new Error(
        'Live fuel delivery tracking is not available until the delivery backend is connected.'
    );
}