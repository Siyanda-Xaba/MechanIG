import {
  CustomerMaintenanceData,
} from './maintenanceTypes'

const developmentMaintenanceData:
  CustomerMaintenanceData = {
    reminders: [
      {
        id: 'maintenance-001',

        vehicleId: 'vehicle-001',

        title: 'Oil Service',

        description:
          'Routine engine oil and filter service is approaching.',

        status: 'upcoming',

        serviceId: 'oil-service',

        dueInKm: 1240,
        dueInDays: 45,
      },
    ],
  }

export async function getCustomerMaintenanceData(
  vehicleId: string
): Promise<CustomerMaintenanceData> {
  // Later this will call the MechanIQ backend using
  // the selected vehicle as the source of context.
  //
  // Real maintenance information can eventually combine:
  // - manufacturer service intervals
  // - vehicle mileage
  // - completed service history
  // - diagnostic findings
  // - backend maintenance records
  //
  // OBD readings remain authoritative where applicable.
  // The frontend must not invent live sensor readings or
  // claim that maintenance has been completed.

  return {
    reminders:
      developmentMaintenanceData.reminders.map(
        (reminder) => ({
          ...reminder,
          vehicleId,
        })
      ),
  }
}