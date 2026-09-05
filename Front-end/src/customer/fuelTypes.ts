export type FuelDeliveryStatus =
  | 'scheduled'
  | 'driver-assigned'
  | 'en-route'
  | 'arrived'
  | 'delivering'
  | 'completed'
  | 'cancelled'

export type FuelStation = {
  id: string
  name: string

  address: string | null

  latitude: number | null
  longitude: number | null
  distanceKm: number | null

  isOpen: boolean | null
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

  nearestStation: FuelStation | null

  activeDeliveryId: string | null
  activeDeliveryStatus: FuelDeliveryStatus | null

  recentActivity: FuelActivity[]
}