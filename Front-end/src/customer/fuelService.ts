import {
  CustomerFuelData,
} from './fuelTypes'

const developmentFuelData: CustomerFuelData = {
  fuelLevel: 34,

  estimatedRangeKm: 238,

  fuelType: 'Petrol 95',

  nearestStation: {
    id: 'station-development-001',

    name: 'Nearest Fuel Station',

    address: null,

    latitude: null,
    longitude: null,

    distanceKm: 3.2,

    isOpen: null,
  },

  activeDeliveryId: null,

  activeDeliveryStatus: null,

  recentActivity: [
    {
      id: 'fuel-activity-001',

      title: 'Fuel Top-up Scheduled',

      description: 'Power Shield top-up set',

      occurredAt: 'Today, 08:31',

      status: 'Scheduled',
    },

    {
      id: 'fuel-activity-002',

      title: 'Fuel Delivered',

      description: 'Fuel delivery completed',

      occurredAt: 'Yesterday, 17:45',

      status: 'Completed',
    },
  ],
}

export async function getCustomerFuelData(
  vehicleId: string
): Promise<CustomerFuelData> {
  // Later this will call the MechanIQ backend
  // using the selected vehicle ID.
  //
  // The backend will provide:
  // - verified fuel level where available
  // - estimated range
  // - vehicle fuel type
  // - nearby fuel stations
  // - active delivery status
  // - fuel activity history

  return developmentFuelData
}