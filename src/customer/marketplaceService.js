import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { auth, database } from '../firebase/firebase';
import { get, push, ref, remove, set } from 'firebase/database';

const MARKETPLACE_ACTIVITY_KEY = 'mechaniq-marketplace-activity';
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
};
async function getLiveNearbyStores({ requestPermission = false } = {}) {
    const permission = requestPermission
        ? await Location.requestForegroundPermissionsAsync()
        : await Location.getForegroundPermissionsAsync();
    if (!permission.granted) return [];
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { getPictureSearchEndpoint, getPictureSearchAuthHeaders } = await import('../config/pictureSearchApi');
    const response = await fetch(getPictureSearchEndpoint('/api/v1/nearby-stores'), {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...await getPictureSearchAuthHeaders() },
        body: JSON.stringify({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error || 'Nearby stores could not be loaded.');
    return Array.isArray(payload?.stores)
        ? payload.stores.filter(isRecord).map(normalizeStore)
        : [];
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeStore(store, index = 0) {
    const distance = store.distanceKm == null || store.distanceKm === '' ? NaN : Number(store.distanceKm);
    const latitude = store.latitude == null || store.latitude === '' ? NaN : Number(store.latitude);
    const longitude = store.longitude == null || store.longitude === '' ? NaN : Number(store.longitude);
    return {
        ...store,
        id: String(store.id || store.storeId || ('store-' + index)),
        name: String(store.name || store.storeName || 'Marketplace store'),
        address: typeof store.address === 'string' ? store.address : '',
        distanceKm: Number.isFinite(distance) ? distance : null,
        latitude: Number.isFinite(latitude) ? latitude : null,
        longitude: Number.isFinite(longitude) ? longitude : null,
        isOpen: typeof store.isOpen === 'boolean' ? store.isOpen : null,
        closingTime: typeof store.closingTime === 'string' ? store.closingTime : null,
    };
}

function normalizeActivity(id, item) {
    if (!isRecord(item)) return null;
    const parsedPrice = Number(item.price);
    const price = item.price == null || item.price === '' || !Number.isFinite(parsedPrice)
        ? null
        : parsedPrice;
    const type = ['viewed', 'saved', 'cart', 'purchased'].includes(item.type)
        ? item.type
        : 'viewed';
    return {
        id: String(item.id || id || ('activity-' + Date.now())),
        title: String(item.title || 'Marketplace activity'),
        occurredAt: String(item.occurredAt || item.createdAt || ''),
        createdAt: String(item.createdAt || ''),
        price,
        type,
    };
}
export async function getMarketplaceActivity() {
    const userId = auth.currentUser?.uid;
    if (userId) {
        try {
            const snapshot = await get(ref(database, `marketplaceActivity/${userId}`));
            const cloudActivity = Object.entries(snapshot.val() || {})
                .map(([id, item]) => normalizeActivity(id, item))
                .filter(Boolean)
                .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
                .slice(0, 20);
            const rawLocal = await AsyncStorage.getItem(MARKETPLACE_ACTIVITY_KEY);
            let localActivity = [];
            try { localActivity = rawLocal ? JSON.parse(rawLocal) : []; } catch {}
            localActivity = Array.isArray(localActivity)
                ? localActivity.map((item, index) => normalizeActivity(item?.id || ('local-' + index), item)).filter(Boolean)
                : [];
            const cloudIds = new Set(cloudActivity.map((item) => item.id));
            const unsyncedLocal = localActivity.filter((item) => !cloudIds.has(item.id));
            const mergedActivity = [...cloudActivity, ...unsyncedLocal].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).slice(0, 20);
            await AsyncStorage.setItem(MARKETPLACE_ACTIVITY_KEY, JSON.stringify(mergedActivity));
            if (unsyncedLocal.length) {
                const activityRef = ref(database, `marketplaceActivity/${userId}`);
                await Promise.all(unsyncedLocal.map(async (item) => {
                    const pendingRef = push(activityRef);
                    await set(pendingRef, { ...item, ownerUid: userId, id: pendingRef.key });
                }));
            }
            return mergedActivity;
        } catch {
            // Preserve offline access from the local cache when Firebase is unavailable.
        }
    }
    const rawActivity = await AsyncStorage.getItem(MARKETPLACE_ACTIVITY_KEY);
    try {

        const parsed = rawActivity ? JSON.parse(rawActivity) : [];

        return Array.isArray(parsed)

            ? parsed.map((item, index) => normalizeActivity(item?.id || ('local-' + index), item)).filter(Boolean)

            : [];

    } catch { return []; }
}
export async function recordMarketplaceActivity(activity) {
    const current = await getMarketplaceActivity();
    const userId = auth.currentUser?.uid;
    const createdAt = new Date().toISOString();
    const localId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const nextItem = { id: localId, title: String(activity.title || 'Marketplace activity').slice(0, 200), type: ['viewed', 'saved', 'cart', 'purchased'].includes(activity.type) ? activity.type : 'viewed', price: Number.isFinite(Number(activity.price)) ? Number(activity.price) : null, occurredAt: new Date(createdAt).toLocaleString(), createdAt };
    const next = [nextItem, ...current].slice(0, 20);
    await AsyncStorage.setItem(MARKETPLACE_ACTIVITY_KEY, JSON.stringify(next));
    if (!userId) return;
    try {
        const activitiesRef = ref(database, `marketplaceActivity/${userId}`);
        const activityRef = push(activitiesRef);
        const id = activityRef.key;
        if (!id) return;
        const record = { ownerUid: userId, ...nextItem, id };
        await set(activityRef, record);
        const snapshot = await get(activitiesRef);
        const entries = Object.entries(snapshot.val() || {}).sort((a, b) => String(a[1]?.createdAt || '').localeCompare(String(b[1]?.createdAt || '')));
        await Promise.all(entries.slice(0, Math.max(0, entries.length - 20)).map(([oldId]) => remove(ref(database, `marketplaceActivity/${userId}/${oldId}`))));
    } catch {
        // The local activity remains available and syncs on a later read.
    }
}
export async function getCustomerMarketplaceData(vehicle) {
    const recentActivity = await getMarketplaceActivity().catch(async () => {
        const rawActivity = await AsyncStorage.getItem(MARKETPLACE_ACTIVITY_KEY);
        try {

        const parsed = rawActivity ? JSON.parse(rawActivity) : [];

        return Array.isArray(parsed)

            ? parsed.map((item, index) => normalizeActivity(item?.id || ('local-' + index), item)).filter(Boolean)

            : [];

    } catch { return []; }
    });
    // Location search is optional: it must never make the Marketplace unusable.
    let nearbyStores = [];
    try {
        nearbyStores = await getLiveNearbyStores();
    }
    catch {
        nearbyStores = [];
    }
    return {

        ...developmentMarketplaceData,

        nearbyStores: Array.isArray(nearbyStores) ? nearbyStores.filter(isRecord).map(normalizeStore) : [],

        recentActivity: Array.isArray(recentActivity)

            ? recentActivity.map((item, index) => normalizeActivity(item?.id || ('activity-' + index), item)).filter(Boolean)

            : [],

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
export async function getMarketplaceProductById(productId, vehicleId) {
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
    return (developmentMarketplaceData.recommendedProducts.find((product) => product.id === productId) ?? null);
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
    return getLiveNearbyStores({ requestPermission: true });
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
    return (developmentMarketplaceData.nearbyStores.find((store) => store.id === storeId) ?? null);
}

export async function recognizeMarketplacePart(picture, vehicle) {
    const { getPictureSearchEndpoint, getPictureSearchAuthHeaders } = await import('../config/pictureSearchApi');
    const formData = new FormData();
    // Expo 57's fetch accepts Blob/File values, not the legacy { uri, name, type }
    // React Native object. File reads the selected photo without loading it into JS memory.
    const { File } = await import('expo-file-system');
    const imageFile = new File(picture.uri);
    formData.append('image', imageFile, picture.fileName || imageFile.name || 'vehicle-part.jpg');
    formData.append('make', vehicle?.make || '');
    formData.append('model', vehicle?.model || '');
    formData.append('year', String(vehicle?.year || ''));
    formData.append('engine', vehicle?.engineSize || '');
    const response = await fetch(getPictureSearchEndpoint('/api/v1/part-searches'), {
        method: 'POST',
      headers: await getPictureSearchAuthHeaders(),
        body: formData,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(payload?.error || 'Picture search could not be completed.');
    }
    return {
        recognitionId: payload.searchId,
        suggestedPartName: payload.recognition?.partName || 'Part not identified',
        suggestedCategory: payload.recognition?.categories?.[0] || null,
        confidence: payload.recognition?.confidence || 0,
        categories: payload.recognition?.categories || [],
        catalogueMatches: payload.catalogueMatches || [],
        offers: payload.offers || [],
        notice: payload?.notice || null,
    };
}
export async function checkMarketplacePartCompatibility(input) {
    const { getPictureSearchEndpoint, getPictureSearchAuthHeaders } = await import('../config/pictureSearchApi');
    const vehicle = input.vehicle || {};
    let location = null;
    try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.granted) {
            const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        }
    } catch {
        // Location is optional; continue with online listings if permission or GPS fails.
    }
    const response = await fetch(getPictureSearchEndpoint('/api/v1/part-searches/offers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...await getPictureSearchAuthHeaders() },
        body: JSON.stringify({
            partName: input.confirmedPartName,
            make: vehicle.make || '',
            model: vehicle.model || '',
            year: String(vehicle.year || ''),
            engine: vehicle.engineSize || '',
            location,
        }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(payload?.error || 'Live retailer deals could not be loaded.');
    }
    const matches = Array.isArray(input.catalogueMatches) ? input.catalogueMatches : [];
    const offers = Array.isArray(payload?.offers)
        ? payload.offers.filter(isRecord).map((offer, index) => ({
            ...offer,
            id: String(offer.id || ('offer-' + index)),
            productName: String(offer.productName || 'Part listing'),
            retailer: String(offer.retailer || 'Seller'),
            priceText: typeof offer.priceText === 'string' ? offer.priceText : '',
            sourceType: offer.sourceType === 'nearby' ? 'nearby' : 'online',
            productUrl: typeof offer.productUrl === 'string' ? offer.productUrl : '',
        }))
        : [];
    const nearbyCount = Number.isFinite(Number(payload?.nearbyCount)) ? Number(payload.nearbyCount) : offers.filter((offer) => offer.sourceType === 'nearby').length;
    const onlineCount = Number.isFinite(Number(payload?.onlineCount)) ? Number(payload.onlineCount) : offers.filter((offer) => offer.sourceType === 'online').length;
    return {
        isCompatible: matches.length > 0 ? true : null,
        message: matches.length > 0
            ? `${matches.length} verified catalogue option${matches.length === 1 ? '' : 's'} found for this vehicle. Confirm the OEM number or VIN before purchase.`
            : offers.length > 0
            ? `${nearbyCount} nearby shop${nearbyCount === 1 ? '' : 's'} first, followed by ${onlineCount} online offer${onlineCount === 1 ? '' : 's'}. Confirm local stock and fitment before travelling.`
                : payload?.notice || 'No nearby shops or online offers were found. Try a more specific part name or OEM number.',
        catalogueMatches: matches,
        offers,
        nearbyCount,
        onlineCount,
        notice: payload?.notice || null,
    };
}

export async function searchMarketplacePartByText(partName, vehicle) {
    const normalizedPartName = String(partName || '').trim();
    if (!normalizedPartName) {
        throw new Error('Enter a part name to search Marketplace listings.');
    }
    const result = await checkMarketplacePartCompatibility({
        vehicle,
        confirmedPartName: normalizedPartName,
        catalogueMatches: [],
    });
    // Keep a private, account-scoped record of what the user searched and the
    // offers returned. A Firebase write failure must not hide successful results.
    const userId = auth.currentUser?.uid;
    if (userId) {
        try {
            const searchRef = push(ref(database, `marketplacePartSearches/${userId}`));
            await set(searchRef, {
                ownerUid: userId,
                searchTerm: normalizedPartName.slice(0, 120),
                vehicleId: String(vehicle?.id || '').slice(0, 128),
                searchedAt: Date.now(),
                resultCount: Array.isArray(result.offers) ? result.offers.length : 0,
                offers: (result.offers || []).slice(0, 20).map((offer) => ({
                    productName: String(offer.productName || '').slice(0, 180),
                    retailer: String(offer.retailer || '').slice(0, 120),
                    priceText: String(offer.priceText || '').slice(0, 80),
                    sourceType: offer.sourceType === 'nearby' ? 'nearby' : 'online',
                    productUrl: String(offer.productUrl || '').slice(0, 1000),
                    recommendation: String(offer.recommendation || '').slice(0, 240),
                })),
            });
            result.historySaved = true;
        } catch {
            result.historySaved = false;
        }
    } else {
        result.historySaved = false;
    }
    return result;
}
