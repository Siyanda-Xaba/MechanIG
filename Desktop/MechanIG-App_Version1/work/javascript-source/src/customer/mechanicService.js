const developmentMechanics = [
    {
        id: 'mechanic-001',
        name: 'Sipho Maseko',
        businessName: 'ZK Auto Care',
        profileImageUrl: null,
        rating: 4.8,
        reviewCount: 124,
        verified: true,
        specialties: [
            'Brakes',
            'Diagnostics',
            'General Service',
        ],
        availability: 'available',
        location: {
            address: 'Johannesburg, South Africa',
            latitude: null,
            longitude: null,
            distanceKm: null,
        },
        calloutFee: null,
        supportsMobileService: true,
        supportsWorkshopBooking: true,
    },
];
export async function findMechanicsForDiagnostic(diagnosticResultId) {
    // Later this will call the MechanIQ backend.
    //
    // The backend can combine:
    // - registered MechanIQ mechanics
    // - mechanic availability
    // - diagnostic specialty matching
    // - customer location
    // - distance
    // - ratings
    // - workshop/mobile-service support
    //
    // OBD/diagnostic data remains authoritative.
    // Real businesses and availability must come from
    // validated backend/provider data.
    return {
        diagnosticResultId,
        mechanics: developmentMechanics,
    };
}
export async function findMechanicsForVehicle(vehicleId) {
    // Generic mechanic search used when the customer
    // has not arrived from a diagnostic result.
    //
    // The backend will later use vehicleId together with:
    // - customer location
    // - vehicle make/model
    // - mechanic specialties
    // - mechanic availability
    // - ratings
    // - workshop/mobile-service capability
    //
    // No diagnostic result is fabricated here.
    void vehicleId;
    return {
        diagnosticResultId: null,
        mechanics: developmentMechanics,
    };
}
export async function findMechanicsForService(request) {
    // This is the Book Service matching contract.
    //
    // The backend will eventually validate:
    // - requested service support
    // - real workshop/mechanic availability
    // - preferred date/time
    // - workshop capacity
    // - customer/service location
    // - pricing
    // - vehicle compatibility
    //
    // The frontend preference values must never be treated
    // as a confirmed appointment until the backend or
    // mechanic/workshop confirms them.
    const capabilityFilteredMechanics = developmentMechanics.filter((mechanic) => {
        if (request.locationPreference ===
            'mobile-service') {
            return mechanic.supportsMobileService;
        }
        return mechanic.supportsWorkshopBooking;
    });
    // serviceId, preferredDate and preferredTime are
    // intentionally sent through this contract even though
    // temporary development data cannot validate them.
    void request.vehicleId;
    void request.serviceId;
    void request.preferredDate;
    void request.preferredTime;
    void request.notes;
    return {
        diagnosticResultId: null,
        mechanics: capabilityFilteredMechanics,
    };
}
