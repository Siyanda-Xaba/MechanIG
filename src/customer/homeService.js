/**
 * Customer Home data must come from authoritative
 * sources such as:
 *
 * - Real vehicle/OBD readings
 * - Confirmed backend service records
 * - Customer-entered maintenance information
 *
 * Development values must never be presented
 * as actual vehicle readings.
 *
 * Until those sources are connected, unavailable
 * information is represented by null.
 *
 * Recent activity and maintenance reminders
 * remain empty until corresponding records exist.
 */

const unavailableHomeData = {
    // Overall vehicle condition cannot be determined
    // without a supported assessment.
    vehicleHealthScore: null,
    vehicleHealthLabel: 'Not assessed',

    // These values require actual vehicle readings
    // or another clearly identified data source.
    fuelLevel: null,
    estimatedRangeKm: null,

    // Service scheduling requires confirmed
    // maintenance records or customer-entered data.
    nextServiceKm: null,
    nextServiceDays: null,

    // Do not invent component condition reports.
    batteryStatus: null,
    tyreStatus: null,

    // Do not invent scheduled power interruptions.
    nextOutageTime: null,

    // Display only genuine maintenance reminders.
    maintenanceReminders: [],

    // Display only genuine recorded activities.
    recentActivity: [],
};

/**
 * Retrieve Customer Home information for the
 * currently selected vehicle.
 *
 * Future backend integration should use vehicleId
 * to retrieve authoritative, vehicle-specific data.
 *
 * Vehicle health and diagnostic readings must
 * never be calculated from invented sensor values.
 *
 * When valid data is unavailable, the frontend
 * must display an unavailable/unassessed state.
 *
 * @param {string} vehicleId
 */
export async function getCustomerHomeData(vehicleId) {
    // Future:
    // GET /customer/vehicles/:vehicleId/home
    //
    // Backend response should provide:
    // - authoritative vehicle readings where supported
    // - reading timestamps and source information
    // - confirmed maintenance records
    // - genuine diagnostic history
    // - genuine fuel and service activity
    //
    // This function intentionally does not generate
    // simulated vehicle readings.

    void vehicleId;

    return {
        ...unavailableHomeData,
        maintenanceReminders: [],
        recentActivity: [],
    };
}