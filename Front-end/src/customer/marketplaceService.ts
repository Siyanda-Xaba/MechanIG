import {
  CustomerMarketplaceData,
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

  return developmentMarketplaceData
}