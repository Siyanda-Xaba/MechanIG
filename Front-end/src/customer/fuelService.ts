import type {
  CustomerFuelData,
  FuelActivity,
  FuelDeliveryRequestInput,
  FuelDeliveryRequestResult,
  FuelDeliveryTracking,
  FuelSavedLocation,
} from './fuelTypes'

const developmentFuelData: CustomerFuelData = {
  fuelLevel: 34,

  estimatedRangeKm: 238,

  fuelType: 'Petrol 95',

  // Temporary frontend development options.
  // Production-compatible fuel types must come
  // from validated vehicle/backend data.
  compatibleFuelTypes: [
    'Petrol 93',
    'Petrol 95',
  ],

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
  // - current/default fuel type
  // - compatible fuel types
  // - nearby fuel stations
  // - active delivery status
  // - fuel activity history

  void vehicleId

  return developmentFuelData
}

export async function getFuelHistory(
  vehicleId: string
): Promise<FuelActivity[]> {
  // Later this will call the MechanIQ backend
  // for the selected vehicle's complete fuel
  // activity history.
  //
  // This development response stays in the
  // service layer and does not simulate
  // cross-user or delivery lifecycle state.

  void vehicleId

  return developmentFuelData.recentActivity
}

export async function getSavedFuelLocations(): Promise<
  FuelSavedLocation[]
> {
  // Later this will call the MechanIQ backend
  // for the authenticated customer's saved
  // fuel delivery locations.
  //
  // Saved locations are customer-owned data
  // and must come from persistent backend
  // storage.
  //
  // We intentionally return no development
  // locations here because addresses and
  // coordinates must not be fabricated.

  return []
}

export async function createFuelDeliveryRequest(
  input: FuelDeliveryRequestInput
): Promise<FuelDeliveryRequestResult> {
  // This action must be completed by the
  // MechanIQ backend.
  //
  // The backend will eventually:
  // - validate the authenticated customer
  // - validate the selected vehicle
  // - validate fuel compatibility
  // - validate delivery coverage
  // - calculate authoritative pricing
  // - create the delivery request
  // - assign a delivery ID
  // - begin the delivery lifecycle
  //
  // Do not create a fake delivery ID or
  // locally simulate a successful request.

  void input

  throw new Error(
    'Fuel delivery requests are not available until the delivery backend is connected.'
  )
}

export async function getFuelDeliveryTracking(
  deliveryId: string
): Promise<FuelDeliveryTracking> {
  // This contract is intentionally backend-only.
  //
  // The delivery backend will eventually provide:
  // - authoritative delivery lifecycle status
  // - assigned driver details
  // - live driver coordinates
  // - delivery destination coordinates
  // - ETA
  // - route/polyline coordinates
  // - last tracking update timestamp
  //
  // Driver movement, ETA, and route data must not
  // be fabricated locally.

  void deliveryId

  throw new Error(
    'Live fuel delivery tracking is not available until the delivery backend is connected.'
  )
}