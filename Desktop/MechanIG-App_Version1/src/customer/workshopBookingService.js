export async function createWorkshopBooking(input) {
    // Later this will POST to the MechanIQ backend.
    //
    // The backend will be responsible for:
    // - generating the real booking ID
    // - checking workshop availability
    // - confirming or rejecting the requested slot
    // - setting the authoritative booking status
    // - calculating pricing
    // - sending notifications
    // - handling rescheduling and cancellation
    const developmentBooking = {
        id: 'booking-development-001',
        customerId: input.customerId,
        vehicleId: input.vehicleId,
        mechanicId: input.mechanicId,
        diagnosticResultId: input.diagnosticResultId ?? null,
        serviceType: input.serviceType,
        issueDescription: input.issueDescription ?? null,
        scheduledDate: input.scheduledDate,
        scheduledTime: input.scheduledTime,
        status: 'pending',
        estimatedPrice: null,
        finalPrice: null,
        createdAt: new Date().toISOString(),
    };
    return developmentBooking;
}
