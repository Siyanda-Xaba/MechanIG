export async function getCustomerHomeData(vehicleId) {
  // Backend health and maintenance values remain unavailable until a real
  // service record supplies them. Valid live OBD snapshots are shared with the
  // dashboard separately by CustomerHomeContext; never invent missing values.
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
