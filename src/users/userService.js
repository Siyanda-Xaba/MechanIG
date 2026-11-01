import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, ref, update } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { auth, database, storage } from '../firebase/firebase';

const PUBLIC_MECHANIC_DETAIL_KEYS = ['specialisation', 'specialization', 'vehicleBrands', 'serviceRadius', 'yearsExperience'];
const PRIVATE_MECHANIC_KEYS = ['idNumber', 'address', 'city', 'documents', 'licenseNumber', 'registrationNumber', 'workshopAddress', 'communicationEmail', 'qualifications'];

function sanitizeProfileForLocalCache(profile) {
    if (profile?.role !== 'mechanic') return profile;
    const cached = { ...profile };
    for (const key of PRIVATE_MECHANIC_KEYS) delete cached[key];
    if (cached.professionalDetails && typeof cached.professionalDetails === 'object') {
        cached.professionalDetails = Object.fromEntries(Object.entries(cached.professionalDetails).filter(([key]) => PUBLIC_MECHANIC_DETAIL_KEYS.includes(key)));
    }
    return cached;
}

async function migrateLegacyMechanicPrivateData(uid, profile) {
    const details = profile?.professionalDetails && typeof profile.professionalDetails === 'object' ? profile.professionalDetails : {};
    const documents = Object.fromEntries(Object.entries(profile?.documents || {}).filter(([, document]) => typeof document?.storagePath === 'string').map(([key, document]) => [key, {
        name: document.name || '',
        size: Number(document.size) || 0,
        mimeType: document.mimeType || 'application/octet-stream',
        storagePath: document.storagePath,
        uploadedAt: document.uploadedAt || profile?.createdAt || new Date().toISOString(),
    }]));
    const privateRecord = {
        uid,
        ownerUid: uid,
        legalName: `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim(),
        communicationEmail: profile?.communicationEmail || '',
        idNumber: profile?.idNumber || '',
        address: profile?.address || '',
        city: profile?.city || '',
        licenseNumber: profile?.licenseNumber || details.licenseNumber || '',
        registrationNumber: profile?.registrationNumber || details.registrationNumber || '',
        workshopAddress: details.workshopLocation || profile?.workshopAddress || '',
        qualifications: details.qualifications || profile?.qualifications || '',
        documents,
        professionalDetails: details,
        createdAt: profile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const publicDetails = Object.fromEntries(Object.entries(details).filter(([key]) => PUBLIC_MECHANIC_DETAIL_KEYS.includes(key)));
    const removal = {};
    for (const key of PRIVATE_MECHANIC_KEYS) removal[`mechanics/${uid}/${key}`] = null;
    removal[`mechanics/${uid}/communicationEmail`] = null;
    removal[`mechanics/${uid}/professionalDetails`] = publicDetails;
    removal[`mechanics/${uid}/publicName`] = profile?.publicName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || profile?.businessName || 'Mechanic';
    removal[`mechanics/${uid}/uid`] = uid;
    removal[`mechanics/${uid}/ownerUid`] = uid;
    removal[`mechanicPrivate/${uid}`] = privateRecord;
    await update(ref(database), removal);
}

export async function getCurrentUser() {
    if (!auth.currentUser) {
        return null;
    }
    return readUserProfile(auth.currentUser);
}

export async function readUserProfile(firebaseUser) {
    if (!firebaseUser) return null;
    // Superadmin access comes only from the trusted Firebase Auth custom claim.
    // Do this before reading or creating a customer/mechanic profile so admin
    // accounts are not misclassified or written into customer records.
    try {
        const token = await firebaseUser.getIdTokenResult();
        if (token.claims?.role === 'superadmin') {
            return {
                id: firebaseUser.uid,
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                firstName: firebaseUser.displayName || 'Super Admin',
                lastName: '',
                role: 'superadmin',
            };
        }
    } catch {
        // Continue with normal profile loading if token metadata is unavailable.
    }
    const email = (firebaseUser.email || '').toLowerCase();
    const isMechanicCandidate = email.includes('@mechanic') || email.endsWith('mechanic') || email.includes('mechanic@');

    // Load locally cached profile if available
    let localProfile = null;
    try {
        const raw = await AsyncStorage.getItem(`@mechaniq_profile_${firebaseUser.uid}`);
        if (raw) {
            localProfile = JSON.parse(raw);
        }
    } catch (e) {
        console.warn('Error reading local profile cache:', e);
    }

    const isMechanic = isMechanicCandidate || localProfile?.role === 'mechanic';

    // 1. If candidate is a mechanic, check mechanics table first
    if (isMechanic) {
        try {
            const mechanicSnapshot = await get(ref(database, `mechanics/${firebaseUser.uid}`));
            if (mechanicSnapshot.exists()) {
                let val = mechanicSnapshot.val();
                const privateSnapshot = await get(ref(database, `mechanicPrivate/${firebaseUser.uid}`)).catch(() => null);
                let privateProfile = privateSnapshot?.val?.() || {};
                const hasLegacyPrivateFields = PRIVATE_MECHANIC_KEYS.some((key) => val[key] !== undefined)
                    || Object.keys(val.professionalDetails || {}).some((key) => !PUBLIC_MECHANIC_DETAIL_KEYS.includes(key));
                if (!privateSnapshot?.exists?.() && hasLegacyPrivateFields && auth.currentUser?.uid === firebaseUser.uid) {
                    try {
                        await migrateLegacyMechanicPrivateData(firebaseUser.uid, val);
                        const refreshed = await get(ref(database, `mechanics/${firebaseUser.uid}`));
                        const refreshedPrivate = await get(ref(database, `mechanicPrivate/${firebaseUser.uid}`));
                        val = refreshed.val() || val;
                        privateProfile = refreshedPrivate.val() || {};
                    } catch (migrationError) {
                        console.warn('Private mechanic profile migration is pending:', migrationError?.message || migrationError);
                    }
                }
                const merged = {
                    ...localProfile,
                    ...val,
                    ...privateProfile,
                    id: firebaseUser.uid,
                    role: 'mechanic',
                };
                try {
                    await AsyncStorage.setItem(`@mechaniq_profile_${firebaseUser.uid}`, JSON.stringify(sanitizeProfileForLocalCache(merged)));
                } catch {}
                return merged;
            }
        } catch (e) {
            console.warn('Error reading from mechanics table:', e);
        }
    }

    // 2. Try checking users table (for customers or existing users)
    try {
        const userSnapshot = await get(ref(database, `users/${firebaseUser.uid}`));
        if (userSnapshot.exists()) {
            const val = userSnapshot.val();
            const role = val.role || (isMechanic ? 'mechanic' : 'customer');
            const merged = {
                ...localProfile,
                ...val,
                id: firebaseUser.uid,
                role,
            };
            try {
                await AsyncStorage.setItem(`@mechaniq_profile_${firebaseUser.uid}`, JSON.stringify(sanitizeProfileForLocalCache(merged)));
            } catch {}
            return merged;
        }
    } catch (e) {
        console.warn('Error reading from users table:', e);
    }

    // 3. Fallback: If not found in users and wasn't checked in mechanics yet, check mechanics table
    if (!isMechanic) {
        try {
            const mechanicSnapshot = await get(ref(database, `mechanics/${firebaseUser.uid}`));
            if (mechanicSnapshot.exists()) {
                const val = mechanicSnapshot.val();
                const merged = {
                    ...localProfile,
                    ...val,
                    id: firebaseUser.uid,
                    role: 'mechanic',
                };
                try {
                    await AsyncStorage.setItem(`@mechaniq_profile_${firebaseUser.uid}`, JSON.stringify(sanitizeProfileForLocalCache(merged)));
                } catch {}
                return merged;
            }
        } catch (e) {
            console.warn('Error reading from mechanics fallback:', e);
        }
    }

    // 4. Fallback to cached local profile if server records could not be fetched
    if (localProfile) {
        return {
            ...localProfile,
            id: firebaseUser.uid,
            role: localProfile.role || (isMechanic ? 'mechanic' : 'customer'),
        };
    }

    // Default basic profile
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        role: isMechanicCandidate ? 'mechanic' : 'customer',
        firstName: isMechanicCandidate ? 'Mechanic' : 'Customer',
        lastName: '',
    };
}

export async function updateCurrentUserProfile(input) {
    if (auth.currentUser?.uid !== input.userId) {
        throw new Error('You must be signed in to update your profile.');
    }
    const current = await getCurrentUser();
    const isMechanic = current?.role === 'mechanic';
    const table = isMechanic ? 'mechanics' : 'users';

    const now = new Date().toISOString();
    const updates = {
        updatedAt: new Date().toISOString(),
    };
    if (input.firstName !== undefined) updates.firstName = input.firstName.trim();
    if (input.lastName !== undefined) updates.lastName = input.lastName.trim();
    if (input.email !== undefined) updates.email = input.email.trim().toLowerCase();
    if (input.phone !== undefined) updates.phone = input.phone.trim();
    if (input.businessName !== undefined) updates.businessName = input.businessName.trim();
    if (input.professionalDetails !== undefined) updates.professionalDetails = input.professionalDetails;
    if (input.documents !== undefined) updates.documents = input.documents;

    if (isMechanic) {
        const { idNumber, address, city, licenseNumber, registrationNumber, documents, professionalDetails, email, ...publicUpdates } = updates;
        const privateUpdates = { updatedAt: now };
        if (input.email !== undefined) privateUpdates.communicationEmail = input.email.trim().toLowerCase();
        if (input.idNumber !== undefined) privateUpdates.idNumber = input.idNumber;
        if (input.address !== undefined) privateUpdates.address = input.address;
        if (input.city !== undefined) privateUpdates.city = input.city;
        if (input.licenseNumber !== undefined) privateUpdates.licenseNumber = input.licenseNumber;
        if (input.registrationNumber !== undefined) privateUpdates.registrationNumber = input.registrationNumber;
        if (input.documents !== undefined) privateUpdates.documents = input.documents;
        if (input.professionalDetails !== undefined) {
            privateUpdates.professionalDetails = input.professionalDetails;
            privateUpdates.workshopAddress = input.professionalDetails?.workshopLocation || '';
            privateUpdates.licenseNumber = input.professionalDetails?.licenseNumber || privateUpdates.licenseNumber || '';
            privateUpdates.registrationNumber = input.professionalDetails?.registrationNumber || privateUpdates.registrationNumber || '';
            privateUpdates.qualifications = input.professionalDetails?.qualifications || '';
            const publicKeys = ['specialisation', 'specialization', 'vehicleBrands', 'serviceRadius', 'yearsExperience'];
            publicUpdates.professionalDetails = Object.fromEntries(Object.entries(input.professionalDetails || {}).filter(([key]) => publicKeys.includes(key)));
        }
        const writeMap = { [`mechanics/${input.userId}`]: publicUpdates, [`mechanicPrivate/${input.userId}`]: privateUpdates };
        await update(ref(database), writeMap);
    } else {
        await update(ref(database, `${table}/${input.userId}`), updates);
    }

    const updatedProfile = {
        ...(current || {}),
        ...updates,
        id: input.userId,
    };

    try {
        await AsyncStorage.setItem(
            `@mechaniq_profile_${input.userId}`,
            JSON.stringify(sanitizeProfileForLocalCache(updatedProfile))
        );
    } catch {}

    return updatedProfile;
}

export async function uploadProfileImage(input) {
    if (!input || !input.uri) {
        throw new Error('No image was selected for profile upload.');
    }
    const current = await getCurrentUser();
    const isMechanic = current?.role === 'mechanic';
    const table = isMechanic ? 'mechanics' : 'users';
    const userId = input.userId || auth.currentUser?.uid;

    if (!userId) {
        throw new Error('You must be signed in to upload a profile photo.');
    }

    try {
        const path = `${table}/${userId}/profile_${Date.now()}.jpg`;
        const sRef = storageRef(storage, path);
        const response = await fetch(input.uri);
        const blob = await response.blob();
        const uploadSnapshot = await uploadBytes(sRef, blob, {
            contentType: input.mimeType || 'image/jpeg',
        });
        const downloadUrl = await getDownloadURL(uploadSnapshot.ref);

        await update(ref(database, `${table}/${userId}`), {
            profileImageUrl: downloadUrl,
            updatedAt: new Date().toISOString(),
        });

        return { profileImageUrl: downloadUrl };
    } catch (storageError) {
        console.warn('Firebase Storage profile upload failed:', storageError);
        throw new Error('Your profile photo could not be uploaded. Check your connection and try again.');
    }
}
