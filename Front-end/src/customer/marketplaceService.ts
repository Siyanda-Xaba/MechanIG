import type {
  CustomerMarketplaceData,
  MarketplaceActivity,
  MarketplaceCompatibilityCheckInput,
  MarketplaceCompatibilityResult,
  MarketplacePartRecognitionResult,
  MarketplacePictureSelection,
  MarketplaceProduct,
  MarketplaceStore,
} from './marketplaceTypes'

const developmentMarketplaceData: CustomerMarketplaceData = {
  categories: [
    'Brakes',
    'Engine',
    'Battery',
    'Tyres',
    'Fluids',
  ],

  recommendedProducts: [
    {
      id: 'product-001',
      name: 'Front Brake Pads',
      subtitle: 'Premium Ceramic',
      category: 'Brakes',
      price: 1299,
      rating: 4.7,
      reviewCount: 128,
      imageUrl: null,
      compatibleWithSelectedVehicle: true,
      sellerId: null,
    },

    {
      id: 'product-002',
      name: 'Oil Filter',
      subtitle: 'High Performance',
      category: 'Engine',
      price: 249,
      rating: 4.8,
      reviewCount: 96,
      imageUrl: null,
      compatibleWithSelectedVehicle: true,
      sellerId: null,
    },

    {
      id: 'product-003',
      name: 'Car Battery',
      subtitle: '12V • 70Ah • AGM',
      category: 'Battery',
      price: 2199,
      rating: 4.8,
      reviewCount: 72,
      imageUrl: null,
      compatibleWithSelectedVehicle: true,
      sellerId: null,
    },

    {
      id: 'product-004',
      name: 'Tyre',
      subtitle: '205/55 R16 91V',
      category: 'Tyres',
      price: 1499,
      rating: 4.6,
      reviewCount: 63,
      imageUrl: null,
      compatibleWithSelectedVehicle: true,
      sellerId: null,
    },
  ],

  nearbyStores: [
    {
      id: 'store-development-001',
      name: 'Development Auto Store',
      address: 'Johannesburg, South Africa',
      latitude: null,
      longitude: null,
      distanceKm: 3.2,
      isOpen: true,
      closingTime: null,
    },

    {
      id: 'store-development-002',
      name: 'Development Parts Store',
      address: 'Johannesburg, South Africa',
      latitude: null,
      longitude: null,
      distanceKm: 4.5,
      isOpen: true,
      closingTime: null,
    },

    {
      id: 'store-development-003',
      name: 'Development Motor Parts',
      address: 'Johannesburg, South Africa',
      latitude: null,
      longitude: null,
      distanceKm: 6.8,
      isOpen: true,
      closingTime: '18:00',
    },
  ],

  recentActivity: [
    {
      id: 'marketplace-activity-001',
      title: 'Oil Filter added to cart',
      occurredAt: 'Today, 10:23',
      price: 249,
      type: 'cart',
    },

    {
      id: 'marketplace-activity-002',
      title: 'Front Brake Pads saved',
      occurredAt: 'Yesterday, 17:45',
      price: 1299,
      type: 'saved',
    },
  ],
}

export async function getCustomerMarketplaceData(
  vehicleId: string
): Promise<CustomerMarketplaceData> {
  // Later this will call the MechanIQ backend
  // using the selected vehicle ID.
  //
  // The backend will provide:
  // - compatible products
  // - seller/store data
  // - verified prices
  // - vehicle compatibility
  // - nearby businesses
  // - marketplace activity

  void vehicleId

  return developmentMarketplaceData
}

export async function getMarketplaceProducts(
  vehicleId: string
): Promise<MarketplaceProduct[]> {
  // Later this will call the MechanIQ backend
  // using the selected vehicle ID.
  //
  // Production results should contain validated:
  // - product details
  // - current pricing
  // - seller data
  // - availability
  // - selected-vehicle compatibility

  void vehicleId

  return developmentMarketplaceData.recommendedProducts
}

export async function getMarketplaceProductById(
  productId: string,
  vehicleId: string
): Promise<MarketplaceProduct | null> {
  // Later this will call the MechanIQ backend
  // using both the product ID and selected vehicle ID.
  //
  // Production data must provide authoritative:
  // - product details
  // - current price
  // - seller information
  // - availability / stock
  // - selected-vehicle compatibility

  void vehicleId

  return (
    developmentMarketplaceData.recommendedProducts.find(
      (product) => product.id === productId
    ) ?? null
  )
}

export async function getMarketplaceStores(): Promise<
  MarketplaceStore[]
> {
  // Later this will call the MechanIQ backend or
  // marketplace provider.
  //
  // Production nearby-store results should use:
  // - validated store/provider data
  // - authoritative coordinates
  // - the customer's permitted location where needed
  // - current opening status
  // - supported stock / pricing information

  return developmentMarketplaceData.nearbyStores
}

export async function getMarketplaceStoreById(
  storeId: string
): Promise<MarketplaceStore | null> {
  // Later this will call the MechanIQ backend or
  // marketplace provider using the store ID.
  //
  // Production data can then provide authoritative:
  // - store address and coordinates
  // - opening status and trading hours
  // - contact information
  // - available products
  // - live stock / pricing where supported

  return (
    developmentMarketplaceData.nearbyStores.find(
      (store) => store.id === storeId
    ) ?? null
  )
}

export async function getMarketplaceActivity(
  vehicleId: string
): Promise<MarketplaceActivity[]> {
  // Later this will call the MechanIQ backend
  // using the authenticated customer and, where
  // relevant, the selected vehicle.
  //
  // Production activity may include:
  // - viewed products
  // - saved products
  // - cart activity
  // - completed purchases
  //
  // This currently returns only the same temporary
  // development activity shown on the Marketplace tab.

  void vehicleId

  return developmentMarketplaceData.recentActivity
}

export async function recognizeMarketplacePart(
  picture: MarketplacePictureSelection
): Promise<MarketplacePartRecognitionResult> {
  // This must be completed by a real recognition
  // backend/service.
  //
  // Recognition confidence describes how confident
  // the service is about the pictured part. It does
  // NOT prove vehicle compatibility.

  void picture

  throw new Error(
    'Part recognition is not available until the marketplace recognition backend is connected.'
  )
}

export async function checkMarketplacePartCompatibility(
  input: MarketplaceCompatibilityCheckInput
): Promise<MarketplaceCompatibilityResult> {
  // Compatibility must be validated separately
  // from image recognition.
  //
  // A photo result alone must never be treated
  // as proof that a part fits the selected vehicle.

  void input

  throw new Error(
    'Vehicle compatibility checking is not available until the marketplace backend is connected.'
  )
}