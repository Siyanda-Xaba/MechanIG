export async function analyzeProblemDescription(request) {
    // This service is the frontend boundary for future
    // text-based diagnostic analysis.
    //
    // The customer description is manual, unverified
    // evidence. It must not be treated as an OBD reading
    // or as a confirmed diagnosis.
    //
    // A production backend can later receive:
    // - vehicleId
    // - customer-written description
    // - submission timestamp
    //
    // and return a real diagnostic resultId when analysis
    // has actually been performed.
    void request.vehicleId;
    void request.description;
    void request.submittedAt;
    return {
        status: 'unavailable',
        resultId: null,
        message: 'This tool cannot assess written descriptions yet, so it has not identified a cause. Try the dashboard-symbol or sound checker, or contact a mechanic if you need help.',
    };
}
