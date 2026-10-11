const developmentBookServiceData = {
    services: [
        {
            id: 'oil-service',
            title: 'Oil Service',
            description: 'Engine oil and oil filter service.',
            estimatedDurationMinutes: 60,
        },
        {
            id: 'brake-service',
            title: 'Brake Service',
            description: 'Brake inspection, pads, discs, or related servicing.',
            estimatedDurationMinutes: 90,
        },
        {
            id: 'battery-service',
            title: 'Battery Service',
            description: 'Battery inspection, testing, or replacement.',
            estimatedDurationMinutes: 45,
        },
        {
            id: 'tyre-service',
            title: 'Tyre Service',
            description: 'Tyre inspection, replacement, balancing, or alignment.',
            estimatedDurationMinutes: 60,
        },
        {
            id: 'general-service',
            title: 'General Service',
            description: 'Routine scheduled vehicle maintenance.',
            estimatedDurationMinutes: 120,
        },
        {
            id: 'vehicle-inspection',
            title: 'Vehicle Inspection',
            description: 'General condition and safety inspection.',
            estimatedDurationMinutes: 60,
        },
        {
            id: 'other',
            title: 'Other',
            description: 'Describe a service that is not listed.',
            estimatedDurationMinutes: null,
        },
    ],
};
export async function getCustomerBookServiceData(vehicleId) {
    // vehicleId is deliberately part of the backend-ready contract.
    //
    // Later the MechanIQ backend can return service options based on:
    // - vehicle make/model/year
    // - supported workshop services
    // - maintenance schedule
    // - customer location
    //
    // Pricing and availability must come from validated
    // mechanic/workshop/backend data, not from this frontend service.
    void vehicleId;
    return developmentBookServiceData;
}
