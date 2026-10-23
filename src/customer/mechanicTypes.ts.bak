export type MechanicAvailability =
  | 'available'
  | 'busy'
  | 'unavailable'

export type MechanicLocation = {
  address: string
  latitude: number | null
  longitude: number | null
  distanceKm: number | null
}

export type MechanicProfile = {
  id: string

  name: string
  businessName: string | null

  profileImageUrl?: string | null

  rating: number | null
  reviewCount: number

  verified: boolean

  specialties: string[]

  availability: MechanicAvailability

  location: MechanicLocation

  calloutFee: number | null

  supportsMobileService: boolean
  supportsWorkshopBooking: boolean
}

export type MechanicSearchResult = {
  diagnosticResultId: string | null
  mechanics: MechanicProfile[]
}