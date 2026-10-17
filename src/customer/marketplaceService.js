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

const developmentMarketplaceData = {
    categories: [
        'Brakes',
        'Engine',
        'Battery',
        'Tyres',
        'Fluids',
    ],

    // Development display products: compatibility is unknown until verified.
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
            compatibleWithSelectedVehicle: null,
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
            compatibleWithSelectedVehicle: null,
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
            compatibleWithSelectedVehicle: null,
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
            compatibleWithSelectedVehicle: null,
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
};

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

export async function getMarketplaceProducts(vehicleId) {
    // Later this will call the MechanIQ backend
    // using the selected vehicle ID.
    //
    // Production results should contain validated:
    // - product details
    // - current pricing
    // - seller data
    // - availability
    // - selected-vehicle compatibility

    void vehicleId;

    return developmentMarketplaceData.recommendedProducts;
}

export async function getMarketplaceProductById(
    productId,
    vehicleId
) {
    // Later this will call the MechanIQ backend
    // using both the product ID and selected vehicle ID.
    //
    // Production data must provide authoritative:
    // - product details
    // - current price
    // - seller information
    // - availability / stock
    // - selected-vehicle compatibility

    void vehicleId;

    return (
        developmentMarketplaceData.recommendedProducts.find(
            (product) => product.id === productId
        ) ?? null
    );
}

export async function getMarketplaceStores() {
    // Later this will call the MechanIQ backend or
    // marketplace provider.
    //
    // Production nearby-store results should use:
    // - validated store/provider data
    // - authoritative coordinates
    // - the customer's permitted location where needed
    // - current opening status
    // - supported stock / pricing information

    return getLiveNearbyStores();
}

export async function getMarketplaceStoreById(storeId) {
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
    );
}

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