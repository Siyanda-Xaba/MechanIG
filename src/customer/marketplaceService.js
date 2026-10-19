import { File } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import {
    auth,
} from '../firebase/firebase';

import {
    fetchMarketplaceJson,
    MARKETPLACE_REQUEST_TIMEOUTS,
} from './marketplaceRequest';

/**
 * Marketplace activity is local, account-specific data.
 *
 * Each authenticated Firebase account gets its own
 * storage key.
 *
 * The previous shared key:
 *
 *   mechaniq-marketplace-activity
 *
 * is intentionally not migrated because its entries
 * cannot be reliably attributed to a specific account.
 */
const MARKETPLACE_ACTIVITY_STORAGE_PREFIX =
    '@mechaniq/marketplace/activity/v1/';

const MAX_MARKETPLACE_ACTIVITY_ITEMS = 20;

function getMarketplaceActivityStorageKey(uid) {
    return (
        MARKETPLACE_ACTIVITY_STORAGE_PREFIX +
        encodeURIComponent(uid)
    );
}

function getAuthenticatedUserId() {
    return auth.currentUser?.uid ?? null;
}

function isCurrentAuthenticatedUser(uid) {
    return (
        !!uid &&
        auth.currentUser?.uid === uid
    );
}

/**
 * Development Marketplace data.
 *
 * These products demonstrate the frontend catalogue,
 * search, filtering, cards, and product details.
 *
 * They are NOT verified retailer listings.
 *
 * Prices, ratings, reviews, seller information,
 * availability, and vehicle compatibility must
 * come from validated backend/provider data.
 *
 * Sample products must remain visibly identifiable
 * as development examples.
 */
const developmentMarketplaceData = {
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
            name: 'Sample: Front Brake Pads',
            subtitle: 'Premium Ceramic - Example Product',
            category: 'Brakes',

            price: null,
            rating: null,
            reviewCount: null,

            imageUrl: null,
            compatibleWithSelectedVehicle: null,
            sellerId: null,

            isDevelopmentSample: true,
        },
        {
            id: 'product-002',
            name: 'Sample: Oil Filter',
            subtitle: 'High Performance - Example Product',
            category: 'Engine',

            price: null,
            rating: null,
            reviewCount: null,

            imageUrl: null,
            compatibleWithSelectedVehicle: null,
            sellerId: null,

            isDevelopmentSample: true,
        },
        {
            id: 'product-003',
            name: 'Sample: Car Battery',
            subtitle: '12V - 70Ah - AGM - Example Product',
            category: 'Battery',

            price: null,
            rating: null,
            reviewCount: null,

            imageUrl: null,
            compatibleWithSelectedVehicle: null,
            sellerId: null,

            isDevelopmentSample: true,
        },
        {
            id: 'product-004',
            name: 'Sample: Tyre',
            subtitle: '205/55 R16 91V - Example Product',
            category: 'Tyres',

            price: null,
            rating: null,
            reviewCount: null,

            imageUrl: null,
            compatibleWithSelectedVehicle: null,
            sellerId: null,

            isDevelopmentSample: true,
        },
    ],

    /*
     * Legacy development store fixtures are retained
     * as inert data for now. Neither the Marketplace
     * list nor store-detail lookup returns these as
     * real nearby stores.
     */
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

    /*
     * Never create fabricated customer activity.
     *
     * Actual activity is loaded separately from
     * account-specific AsyncStorage.
     */
    recentActivity: [],
};

/**
 * Retrieve nearby stores from the configured
 * Marketplace API.
 *
 * This function uses actual foreground location
 * permission and device coordinates.
 */
async function getLiveNearbyStores() {
    const permission =
        await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
        return [];
    }

    const position =
        await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

    const {
        getPictureSearchEndpoint,
    } = await import('../config/pictureSearchApi');

    const {
        response,
        payload,
    } = await fetchMarketplaceJson(
        getPictureSearchEndpoint('/api/v1/nearby-stores'),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }),
        },
        MARKETPLACE_REQUEST_TIMEOUTS.NEARBY_STORES
    );

    if (!response.ok) {
        throw new Error(
            payload?.error ||
            'Nearby stores could not be loaded.'
        );
    }

    return payload.stores || [];
}

/**
 * Read Marketplace activity for the currently
 * authenticated account.
 *
 * Signed-out users receive an empty list.
 *
 * Data belonging to another account is never
 * returned, even if authentication changes
 * while AsyncStorage is being read.
 */
export async function getMarketplaceActivity() {
    const uid = getAuthenticatedUserId();

    if (!uid) {
        return [];
    }

    const storageKey =
        getMarketplaceActivityStorageKey(uid);

    const rawActivity =
        await AsyncStorage.getItem(storageKey);

    if (!isCurrentAuthenticatedUser(uid)) {
        return [];
    }

    if (!rawActivity) {
        return [];
    }

    try {
        const parsedActivity =
            JSON.parse(rawActivity);

        if (!Array.isArray(parsedActivity)) {
            return [];
        }

        return parsedActivity.slice(
            0,
            MAX_MARKETPLACE_ACTIVITY_ITEMS
        );
    } catch {
        return [];
    }
}

/**
 * Save an activity entry only for the currently
 * authenticated account.
 *
 * Activity remains local development data.
 *
 * This function does not claim that a backend
 * cart, purchase, or saved-item operation
 * succeeded.
 */
export async function recordMarketplaceActivity(activity) {
    const uid = getAuthenticatedUserId();

    if (!uid) {
        throw new Error(
            'You must be signed in to record Marketplace activity.'
        );
    }

    const current =
        await getMarketplaceActivity();

    if (!isCurrentAuthenticatedUser(uid)) {
        throw new Error(
            'Your account changed before Marketplace activity could be saved.'
        );
    }

    const next = [
        {
            id: (
                `${Date.now()}-` +
                Math.random().toString(16).slice(2)
            ),
            title: activity.title,
            type: activity.type || 'viewed',
            price: activity.price ?? null,
            occurredAt: new Date().toLocaleString(),
        },
        ...current,
    ].slice(
        0,
        MAX_MARKETPLACE_ACTIVITY_ITEMS
    );

    const storageKey =
        getMarketplaceActivityStorageKey(uid);

    if (!isCurrentAuthenticatedUser(uid)) {
        throw new Error(
            'Your account changed before Marketplace activity could be saved.'
        );
    }

    await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(next)
    );
}

/**
 * Retrieve Marketplace dashboard information.
 *
 * Sample catalogue products are clearly labelled
 * and contain no fabricated pricing, ratings,
 * or compatibility results.
 *
 * Nearby stores are requested from the configured
 * live provider.
 *
 * Recent Activity contains only stored customer
 * actions belonging to the authenticated account.
 */
export async function getCustomerMarketplaceData(vehicle) {
    const recentActivity =
        await getMarketplaceActivity();

    // Location search is optional:
    // it must never make the Marketplace unusable.
    let nearbyStores = [];

    try {
        nearbyStores =
            await getLiveNearbyStores();
    } catch {
        nearbyStores = [];
    }

    return {
        ...developmentMarketplaceData,
        nearbyStores,
        recentActivity,
    };
}

/**
 * Retrieve Marketplace products.
 *
 * Until a real product catalogue is connected,
 * only clearly identified sample products
 * are returned.
 */
export async function getMarketplaceProducts(vehicleId) {
    // Future backend integration:
    //
    // - Authenticate the customer.
    // - Validate the selected vehicle.
    // - Retrieve real catalogue products.
    // - Retrieve validated seller information.
    // - Retrieve verified prices and availability.
    // - Retrieve authoritative compatibility data.
    //
    // Sample data must never claim verified fitment
    // or retailer availability.

    void vehicleId;

    return developmentMarketplaceData.recommendedProducts;
}

/**
 * Retrieve an individual Marketplace product.
 *
 * Product IDs currently resolve to development
 * samples only.
 */
export async function getMarketplaceProductById(
    productId,
    vehicleId
) {
    // Future backend integration will retrieve
    // actual product information using productId
    // and selected vehicle information.
    //
    // Verified compatibility must come from
    // authoritative fitment data.

    void vehicleId;

    return (
        developmentMarketplaceData.recommendedProducts.find(
            (product) => product.id === productId
        ) ?? null
    );
}

/**
 * Retrieve nearby Marketplace stores.
 */
export async function getMarketplaceStores() {
    // Production nearby-store results should use:
    //
    // - Validated store/provider data.
    // - Authoritative coordinates.
    // - The customer's permitted location.
    // - Verified opening information.
    // - Supported stock and pricing data.

    return getLiveNearbyStores();
}

/**
 * Retrieve a Marketplace store by ID using the same
 * live nearby-stores API as the Marketplace screens.
 *
 * Until the backend exposes a dedicated store-detail
 * endpoint, only stores present in a fresh nearby-store
 * response can be opened. No development store records
 * are used as a fallback.
 */
export async function getMarketplaceStoreById(storeId) {
    const requestedId = Array.isArray(storeId)
        ? storeId[0]
        : storeId;

    if (requestedId == null || String(requestedId).trim() === '') {
        return null;
    }

    const stores = await getLiveNearbyStores();

    if (!Array.isArray(stores)) {
        throw new Error(
            'The nearby-store service returned invalid store data.'
        );
    }

    return stores.find(
        (store) =>
            store?.id != null &&
            String(store.id) === String(requestedId)
    ) ?? null;
}

/**
 * Search for a vehicle part using a photograph.
 *
 * Recognition is not proof of compatibility.
 */
export async function recognizeMarketplacePart(
    picture,
    vehicle
) {
    const {
        getPictureSearchEndpoint,
    } = await import('../config/pictureSearchApi');

    const formData = new FormData();

    // Expo 57's fetch accepts Blob/File values,
    // not the legacy { uri, name, type }
    // React Native object.
    //
    // File reads the selected photo without
    // loading it into JS memory.

    const imageFile = new File(picture.uri);

    formData.append(
        'image',
        imageFile,
        picture.fileName ||
        imageFile.name ||
        'vehicle-part.jpg'
    );

    formData.append(
        'make',
        vehicle?.make || ''
    );

    formData.append(
        'model',
        vehicle?.model || ''
    );

    formData.append(
        'year',
        String(vehicle?.year || '')
    );

    formData.append(
        'engine',
        vehicle?.engineSize || ''
    );

    const {
        response,
        payload,
    } = await fetchMarketplaceJson(
        getPictureSearchEndpoint('/api/v1/part-searches'),
        {
            method: 'POST',
            body: formData,
        },
        MARKETPLACE_REQUEST_TIMEOUTS.PICTURE_RECOGNITION
    );

    if (!response.ok) {
        throw new Error(
            payload?.error ||
            'Picture search could not be completed.'
        );
    }

    return {
        recognitionId: payload.searchId,
        suggestedPartName:
            payload.recognition?.partName ||
            'Part not identified',
        suggestedCategory:
            payload.recognition?.categories?.[0] ||
            null,
        confidence:
            payload.recognition?.confidence || 0,
        categories:
            payload.recognition?.categories || [],
        catalogueMatches:
            payload.catalogueMatches || [],
        offers:
            payload.offers || [],
        notice:
            payload.notice || null,
    };
}

/**
 * Request retailer offers for a confirmed
 * part name and selected vehicle.
 *
 * A retailer offer does not establish
 * compatibility with the selected vehicle.
 */
export async function checkMarketplacePartCompatibility(input) {
    const {
        getPictureSearchEndpoint,
    } = await import('../config/pictureSearchApi');

    const vehicle = input.vehicle || {};

    const {
        response,
        payload,
    } = await fetchMarketplaceJson(
        getPictureSearchEndpoint('/api/v1/part-searches/offers'),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                partName: input.confirmedPartName,
                make: vehicle.make || '',
                model: vehicle.model || '',
                year: String(vehicle.year || ''),
                engine: vehicle.engineSize || '',
            }),
        },
        MARKETPLACE_REQUEST_TIMEOUTS.RETAILER_OFFERS
    );

    if (!response.ok) {
        throw new Error(
            payload?.error ||
            'Live retailer deals could not be loaded.'
        );
    }

    const matches =
        Array.isArray(input.catalogueMatches)
            ? input.catalogueMatches
            : [];

    const offers =
        Array.isArray(payload?.offers)
            ? payload.offers
            : [];

    // A catalogue match or retailer offer does
    // not prove that a part fits.
    //
    // Only an explicit, authoritative backend
    // fitment check (e.g. VIN/OEM) may set
    // isCompatible to true or false in a
    // future integration.

    return {
        isCompatible: null,

        message:
            matches.length > 0
                ? (
                    `${matches.length} catalogue option` +
                    `${matches.length === 1 ? '' : 's'} found. ` +
                    'Compatibility is not verified. ' +
                    'Confirm the OEM part number or VIN ' +
                    'with the seller before purchase.'
                )
                : offers.length > 0
                    ? (
                        `${offers.length} retailer deal` +
                        `${offers.length === 1 ? '' : 's'} found. ` +
                        'Compatibility is not verified. ' +
                        'Confirm the OEM part number or VIN ' +
                        'before purchase.'
                    )
                    : (
                        'No retailer deals were found. ' +
                        'Compatibility is not verified. ' +
                        'Try a more specific part name ' +
                        'or OEM number.'
                    ),

        catalogueMatches: matches,
        offers,
        notice: payload?.notice || null,
    };
}