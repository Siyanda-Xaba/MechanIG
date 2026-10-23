export async function getCustomerMaintenanceData(vehicleId) {
  // No real maintenance-record service is connected yet. Do not fabricate
  // service dates or distances from the vehicle's OBD status.
  void vehicleId;
  return { reminders: [] };
}
