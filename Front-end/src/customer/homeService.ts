import { CustomerHomeData } from './homeTypes'

const developmentHomeData: CustomerHomeData = {
  vehicleHealthScore: 87,
  vehicleHealthLabel: 'Very Good',

  fuelLevel: 34,
  estimatedRangeKm: 238,

  nextServiceKm: 1240,
  nextServiceDays: 45,

  batteryStatus: 'Good',
  tyreStatus: 'Good',

  nextOutageTime: '18:00',

  maintenanceReminders: [
    {
      id: 'maintenance-001',

      title: 'Oil Service',

      description:
        'Due in 1,240 km or 45 days',
    },
  ],

  recentActivity: [
    {
      id: 'activity-001',

      title: 'Diagnostics Scan',

      description:
        'All systems normal',

      time: 'Today, 08:31',

      status: 'No Issues',

      action: {
        type: 'diagnostics',
      },
    },

    {
      id: 'activity-002',

      title: 'Fuel Top-up Scheduled',

      description:
        'Power Shield top-up set',

      time: 'Yesterday, 17:45',

      status: 'Scheduled',

      action: {
        type: 'fuel',
      },
    },
  ],
}

export async function getCustomerHomeData(
  vehicleId: string
): Promise<CustomerHomeData> {
  // Later this function will call the MechanIQ backend
  // using the selected vehicle ID.
  //
  // Activity actions should eventually be returned as
  // structured backend metadata rather than being inferred
  // from user-facing titles.
  //
  // resultId, deliveryId, mechanicId and similar identifiers
  // will only be included when a real corresponding backend
  // record exists.

  void vehicleId

  return developmentHomeData
}