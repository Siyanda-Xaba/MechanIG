export type FuelDeliveryStatus =
  | 'scheduled'
  | 'driver-assigned'
  | 'en-route'
  | 'arrived'
  | 'delivering'
  | 'completed'
  | 'cancelled'

export type FuelRequestType =
  | 'standard'
  | 'emergency'

export type FuelCoordinate = {
  latitude: number
  longitude: number
}

export type FuelStation = {
  id: string
  name: string

  address: string | null

  latitude: number | null
  longitude: number | null
  distanceKm: number | null

  isOpen: boolean | null
}

export type FuelSavedLocation = {
  id: string

  label: string

  address: string | null

  coordinate: FuelCoordinate

  isDefault: boolean
}

export type FuelDeliveryLocation = {
  label: string | null

  address: string | null

  coordinate: FuelCoordinate
}

export type FuelDeliveryRequestInput = {
  vehicleId: string

  requestType: FuelRequestType

  fuelType: string

  quantityLitres: number

  deliveryLocation: FuelDeliveryLocation

  scheduledFor: string | null
}

export type FuelDeliveryRequestResult = {
  deliveryId: string

  status: FuelDeliveryStatus
}

export type FuelDeliveryDriver = {
  id: string

  name: string | null
  phoneNumber: string | null

  vehicleDescription: string | null
  vehicleRegistration: string | null

  location: FuelCoordinate | null
}

export type FuelDeliveryTracking = {
  id: string

  status: FuelDeliveryStatus

  destinationLabel: string | null
  destination: FuelCoordinate | null

  driver: FuelDeliveryDriver | null

  estimatedArrivalMinutes: number | null

  routeCoordinates: FuelCoordinate[]

  updatedAt: string | null
}

export type FuelActivity = {
  id: string

  title: string
  description: string

  occurredAt: string
  status: string
}

export type CustomerFuelData = {
  fuelLevel: number | null

  estimatedRangeKm: number | null

  fuelType: string | null

  compatibleFuelTypes: string[]

  nearestStation: FuelStation | null

  activeDeliveryId: string | null

  activeDeliveryStatus:
    | FuelDeliveryStatus
    | null

  recentActivity: FuelActivity[]
}