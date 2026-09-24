export async function analyzeCustomerVehicleSound(request) {
    // This service is the frontend boundary for future
    // sound-analysis backend integration.
    //
    // The recorded audio is real device data, but the
    // frontend must never invent an AI diagnosis.
    //
    // A production implementation will upload:
    // - vehicleId
    // - recorded audio file
    // - recording duration
    // - recording timestamp
    //
    // The backend may then return a real diagnostic resultId
    // after processing the recording.
    void request.vehicleId;
    void request.audioUri;
    void request.durationMillis;
    void request.recordedAt;
    return {
        status: 'unavailable',
        resultId: null,
        message: 'Sound analysis is not connected to the MechanIQ backend yet. Your recording was captured successfully but no diagnosis has been generated.',
    };
}
