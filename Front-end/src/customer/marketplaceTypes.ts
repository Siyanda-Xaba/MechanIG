export type MarketplaceCategory =
  | 'Brakes'
  | 'Engine'
  | 'Battery'
  | 'Tyres'
  | 'Fluids'

export type MarketplaceProduct = {
  id: string

  name: string
  subtitle: string

  category: MarketplaceCategory

  price: number | null

  rating: number | null
  reviewCount: number

  imageUrl: string | null

  compatibleWithSelectedVehicle: boolean | null

  sellerId: string | null
}

export type MarketplaceStore = {
  id: string

  name: string

  address: string | null

  latitude: number | null
  longitude: number | null

  distanceKm: number | null

  isOpen: boolean | null
  closingTime: string | null
}

export type MarketplaceActivity = {
  id: string

  title: string
  occurredAt: string

  price: number | null

  type:
    | 'cart'
    | 'saved'
    | 'viewed'
    | 'purchased'
}

export type CustomerMarketplaceData = {
  categories: MarketplaceCategory[]

  recommendedProducts: MarketplaceProduct[]

  nearbyStores: MarketplaceStore[]

  recentActivity: MarketplaceActivity[]
}