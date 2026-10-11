export async function getCustomerSavedAddresses(customerId) {
    // Production implementation will retrieve the
    // authenticated customer's saved addresses from
    // persistent MechanIQ backend storage.
    //
    // These addresses may later be reused by flows such as
    // fuel delivery, workshop bookings, or roadside support
    // after the relevant backend service validates them.
    //
    // Do not fabricate addresses or coordinates locally.
    void customerId;
    return [];
}
export async function createCustomerSavedAddress(input) {
    // Production implementation will submit the new saved
    // address to the MechanIQ backend.
    //
    // The backend should:
    // - validate the authenticated customer
    // - validate / normalize the address
    // - geocode the address when appropriate
    // - apply default-address rules
    // - assign the persistent address ID
    // - return the authoritative saved address
    //
    // Do not add locally entered address data to the app as
    // a successfully saved address until the backend confirms it.
    void input;
    throw new Error('Saving addresses is not available until the customer backend is connected.');
}
