export type MarketplaceCategory =
  | 'Brakes'
  | 'Engine'
  | 'Battery'
  | 'Tyres'
  | 'Fluids'

export type MarketplacePictureSource =
  | 'camera'
  | 'gallery'

export type MarketplaceProductSort =
  | 'recommended'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'rating-high-to-low'

export type MarketplaceProductFilters = {
  compatibleOnly: boolean
  sortBy: MarketplaceProductSort
}

export type MarketplaceProduct = {
  id: string

  name: string
  subtitle: string

  category: MarketplaceCategory

  price: number | null

  rating: number | null
  reviewCount: number

  imageUrl: string | null

  compatibleWithSelectedVehicle:
    | boolean
    | null

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

export type MarketplacePictureSelection = {
  uri: string

  source: MarketplacePictureSource

  fileName: string | null
  mimeType: string | null

  width: number | null
  height: number | null
}

export type MarketplacePartRecognitionResult = {
  recognitionId: string

  suggestedPartName: string

  suggestedCategory:
    | MarketplaceCategory
    | null

  confidence: number | null
}

export type MarketplaceCompatibilityCheckInput = {
  vehicleId: string

  recognitionId: string

  confirmedPartName: string

  confirmedCategory:
    | MarketplaceCategory
    | null
}

export type MarketplaceCompatibilityResult = {
  vehicleId: string

  recognitionId: string

  isCompatible: boolean | null

  message: string | null
}

export type CustomerMarketplaceData = {
  categories: MarketplaceCategory[]

  recommendedProducts: MarketplaceProduct[]

  nearbyStores: MarketplaceStore[]

  recentActivity: MarketplaceActivity[]
}