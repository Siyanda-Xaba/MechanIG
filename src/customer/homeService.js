export async function getCustomerHomeData(vehicleId) {
  // These values must come from an OBD session or a real service record.
  // No connection/history is available to this dashboard yet, so report them
  // as unavailable instead of showing fabricated demo values.
  void vehicleId;

  return {
    vehicleHealthScore: null,
    vehicleHealthLabel: null,
    fuelLevel: null,
    estimatedRangeKm: null,
    nextServiceKm: null,
    nextServiceDays: null,
    batteryStatus: null,
    tyreStatus: null,
    nextOutageTime: null,
    maintenanceReminders: [],
    recentActivity: [],
  };
}
