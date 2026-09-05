import {
  MechanicSearchResult,
} from './mechanicTypes'

const developmentMechanicSearchResult: MechanicSearchResult = {
  diagnosticResultId: 'result-002',

  mechanics: [
    {
      id: 'mechanic-001',

      name: 'Sipho Maseko',
      businessName: 'ZK Auto Care',

      profileImageUrl: null,

      rating: 4.8,
      reviewCount: 124,

      verified: true,

      specialties: [
        'Brakes',
        'Diagnostics',
        'General Service',
      ],

      availability: 'available',

      location: {
        address: 'Johannesburg, South Africa',
        latitude: null,
        longitude: null,
        distanceKm: null,
      },

      calloutFee: null,

      supportsMobileService: true,
      supportsWorkshopBooking: true,
    },
  ],
}

export async function findMechanicsForDiagnostic(
  diagnosticResultId: string
): Promise<MechanicSearchResult> {
  // Later this will call the MechanIQ backend.
  //
  // The backend can combine:
  // - registered MechanIQ mechanics
  // - mechanic availability
  // - diagnostic specialty matching
  // - customer location
  // - distance
  // - ratings
  // - workshop/mobile-service support
  //
  // Real businesses must come from validated backend/provider data.

  return {
    ...developmentMechanicSearchResult,
    diagnosticResultId,
  }
}