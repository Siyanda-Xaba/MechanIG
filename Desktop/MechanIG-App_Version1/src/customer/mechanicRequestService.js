export async function createMechanicRequest(input) {
    // Later this will POST to the MechanIQ backend.
    //
    // The backend will be responsible for:
    // - creating the real request ID
    // - confirming mechanic availability
    // - setting the authoritative status
    // - pricing
    // - scheduling
    // - location validation
    // - notifications
    const developmentRequest = {
        id: 'request-development-001',
        customerId: input.customerId,
        vehicleId: input.vehicleId,
        mechanicId: input.mechanicId,
        diagnosticResultId: input.diagnosticResultId ?? null,
        requestType: input.requestType,
        status: 'pending',
        serviceLocation: input.serviceLocation ?? null,
        scheduledAt: input.scheduledAt ?? null,
        issueDescription: input.issueDescription ?? null,
        estimatedPrice: null,
        finalPrice: null,
        createdAt: new Date().toISOString(),
    };
    return developmentRequest;
}
