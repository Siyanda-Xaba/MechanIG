export async function getCustomerSavedAddresses(customerId) {
    /*
     * Production implementation will retrieve the
     * authenticated customer's saved addresses from
     * persistent MechanIQ backend storage.
     *
     * Saved addresses may later be reused by:
     * - Fuel delivery
     * - Workshop bookings
     * - Roadside assistance
     *
     * The backend must validate the authenticated
     * customer and return only their saved addresses.
     *
     * Do not fabricate addresses or coordinates.
     *
     * Until the backend is connected, explicitly
     * report that saved addresses are unavailable
     * instead of returning a misleading empty list.
     */

    void customerId;

    throw new Error(
        'Saved addresses are not available until the customer backend is connected.'
    );
}

export async function createCustomerSavedAddress(input) {
    /*
     * Production implementation will submit a new
     * saved address to the MechanIQ backend.
     *
     * The backend should:
     * - Validate the authenticated customer
     * - Validate and normalize the address
     * - Geocode the address when appropriate
     * - Apply default-address rules
     * - Assign a persistent address ID
     * - Return the authoritative saved address
     *
     * Do not treat locally entered address data
     * as successfully saved until the backend
     * confirms it.
     */

    void input;

    throw new Error(
        'Saving addresses is not available until the customer backend is connected.'
    );
}