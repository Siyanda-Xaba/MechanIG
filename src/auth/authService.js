import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, } from 'firebase/auth';
import { ref, set, update } from 'firebase/database';
import { auth, database } from '../firebase/firebase';
import { getCurrentUser } from '../users/userService';
import { uploadAllMechanicDocuments } from '../mechanic/mechanicDocumentService';

function localProfileCache(profile, isMechanic) {
    if (!isMechanic) return profile;
    const cached = { ...profile };
    for (const key of ['idNumber', 'address', 'city', 'documents', 'licenseNumber', 'registrationNumber', 'communicationEmail']) delete cached[key];
    if (cached.professionalDetails && typeof cached.professionalDetails === 'object') {
        const publicKeys = ['specialisation', 'specialization', 'vehicleBrands', 'serviceRadius', 'yearsExperience'];
        cached.professionalDetails = Object.fromEntries(Object.entries(cached.professionalDetails).filter(([key]) => publicKeys.includes(key)));
    }
    return cached;
}
export async function registerWithEmail({ email, password, role, profile, documents, }) {
    if (role !== 'customer' && role !== 'mechanic') {
        throw new Error('This account type cannot be assigned during public sign-up.');
    }
    const isMechanic = role === 'mechanic';
    const cleanEmail = email.trim().toLowerCase();

    let credential;
    try {
        credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    } catch (authErr) {
        // If email is already registered in Firebase Auth and this is a mechanic sign-up:
        if (isMechanic && authErr?.code === 'auth/email-already-in-use') {
            try {
                // Try signing in with the provided credentials (e.g. from an earlier attempt)
                credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
            } catch {
                // If sign-in with that password failed, generate a numbered candidate and create
                const baseUser = cleanEmail.replace(/@mechanic\.com$/, '').replace(/\.com$/, '');
                const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                const retryEmail = `${baseUser}${randomSuffix}@mechanic.com`;
                credential = await createUserWithEmailAndPassword(auth, retryEmail, password);
                if (profile) {
                    profile.username = `${baseUser}${randomSuffix}@mechanic`;
                }
            }
        } else {
            throw authErr;
        }
    }

    try {
        const {
            role: _profileRole,
            isAdmin: _isAdmin,
            isVerified: _isVerified,
            isMechanicApproved: _isMechanicApproved,
            accountStatus: _accountStatus,
            twoFactorEnabled: _twoFactorEnabled,
            ...safeProfile
        } = profile || {};

        // Upload verification documents if provided
        let uploadedDocs = safeProfile.documents || {};
        if (isMechanic && documents) {
            const uploaded = await uploadAllMechanicDocuments(credential.user.uid, documents);
            uploadedDocs = { ...uploadedDocs, ...uploaded };
        }

        const now = new Date().toISOString();
        const userId = credential.user.uid;
        const fullProfileRecord = {
            ...safeProfile,
            id: userId,
            uid: userId,
            email: credential.user.email,
            username: safeProfile.username || (isMechanic ? credential.user.email.replace(/\.com$/, '') : null),
            role: isMechanic ? 'mechanic' : 'customer',
            documents: uploadedDocs,
            createdAt: safeProfile.createdAt || now,
            updatedAt: now,
            emailVerified: credential.user.emailVerified,
        };

        let firebaseUpdates;
        if (isMechanic) {
            const details = safeProfile.professionalDetails && typeof safeProfile.professionalDetails === 'object'
                ? safeProfile.professionalDetails
                : {};
            const { idNumber, address, city, licenseNumber, registrationNumber, professionalDetails: _details, documents: _documents, communicationEmail, ...publicProfile } = fullProfileRecord;
            const publicProfessionalDetails = Object.fromEntries(
                Object.entries(details).filter(([key]) => ['specialisation', 'specialization', 'vehicleBrands', 'serviceRadius', 'yearsExperience'].includes(key))
            );
            const mechanicPublicRecord = {
                ...publicProfile,
                uid: userId,
                ownerUid: userId,
                role: 'mechanic',
                publicName: `${fullProfileRecord.firstName || ''} ${fullProfileRecord.lastName || ''}`.trim() || fullProfileRecord.businessName || 'Mechanic',
                province: fullProfileRecord.province || '',
                professionalDetails: publicProfessionalDetails,
                updatedAt: now,
            };
            const mechanicPrivateRecord = {
                uid: userId,
                ownerUid: userId,
                legalName: `${fullProfileRecord.firstName || ''} ${fullProfileRecord.lastName || ''}`.trim(),
                communicationEmail: communicationEmail || safeProfile.email || '',
                idNumber: idNumber || '',
                address: address || '',
                city: city || '',
                licenseNumber: details.licenseNumber || licenseNumber || '',
                registrationNumber: details.registrationNumber || registrationNumber || '',
                workshopAddress: details.workshopLocation || '',
                qualifications: details.qualifications || '',
                professionalDetails: details,
                documents: uploadedDocs,
                createdAt: fullProfileRecord.createdAt,
                updatedAt: now,
            };
            firebaseUpdates = {
                [`mechanics/${userId}`]: mechanicPublicRecord,
                [`mechanicPrivate/${userId}`]: mechanicPrivateRecord,
            };
            if (fullProfileRecord.username) {
                firebaseUpdates[`mechanic_usernames/${fullProfileRecord.username.toLowerCase()}`] = {
                    uid: userId,
                    username: fullProfileRecord.username,
                    createdAt: now,
                };
            }
        } else {
            firebaseUpdates = {
                [`users/${userId}`]: fullProfileRecord,
            };
        }

        // Firebase is the authoritative record. Do not report registration success
        // until its owner-scoped profile records have been committed.
        await update(ref(database), firebaseUpdates);

        // Keep an account-scoped cache for offline profile access.
        try {
            await AsyncStorage.setItem(
                `@mechaniq_profile_${credential.user.uid}`,
                JSON.stringify(localProfileCache(fullProfileRecord, isMechanic))
            );
        } catch (storageErr) {
            console.warn('Could not cache profile locally:', storageErr);
        }

        if (!isMechanic) {
            try {
                await sendEmailVerification(credential.user);
            } catch (e) {
                console.warn('Could not send email verification', e);
            }
        }

        await signOut(auth);
        return {
            id: credential.user.uid,
            email: credential.user.email,
            role: isMechanic ? 'mechanic' : 'customer',
            username: fullProfileRecord.username,
        };
    }
    catch (error) {
        console.warn('Post-registration profile handling encountered an error:', error);
        await signOut(auth);
        throw new Error('Your account was created, but its profile could not be saved to Firebase. Sign in again and retry profile setup.');
    }
}
export async function signInWithEmail(emailOrUsername, password) {
    const raw = emailOrUsername.trim().toLowerCase();
    let normalizedEmail = raw;
    if (raw.endsWith('@mechanic')) {
        normalizedEmail = `${raw}.com`;
    } else if (!raw.includes('@')) {
        normalizedEmail = `${raw}@mechanic.com`;
    }

    let credential;
    try {
        credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (err) {
        if (normalizedEmail !== raw && (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-email')) {
            try {
                credential = await signInWithEmailAndPassword(auth, raw, password);
            } catch {
                throw err;
            }
        } else {
            throw err;
        }
    }

    let profile = await getCurrentUser();
    const accountStatus = String(profile?.accountStatus || '').trim().toLowerCase();
    if (['deleted', 'suspended', 'disabled'].includes(accountStatus)) {
        await signOut(auth);
        throw new Error('This account no longer has access to MechanIQ. Please contact support if you believe this is a mistake.');
    }
    const isMechanicLogin = raw.includes('@mechanic') || normalizedEmail.includes('@mechanic');

    if (!profile) {
        const fbUser = credential.user;
        profile = {
            id: fbUser.uid,
            uid: fbUser.uid,
            email: fbUser.email || normalizedEmail,
            username: isMechanicLogin ? (raw.endsWith('@mechanic') ? raw : `${raw}@mechanic`) : null,
            role: isMechanicLogin ? 'mechanic' : 'customer',
            ownerUid: fbUser.uid,
            firstName: isMechanicLogin ? 'Mechanic' : 'Customer',
            lastName: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        try {
            if (isMechanicLogin) {
                const { email, username, role, id, uid, ownerUid, firstName, lastName, createdAt, updatedAt } = profile;
                await update(ref(database), {
                    [`mechanics/${fbUser.uid}`]: { id, uid, ownerUid, username, role, publicName: `${firstName} ${lastName}`.trim(), firstName, lastName, createdAt, updatedAt },
                    [`mechanicPrivate/${fbUser.uid}`]: { uid, ownerUid, communicationEmail: email, createdAt, updatedAt },
                    [`mechanic_usernames/${username.toLowerCase()}`]: { uid, username, createdAt },
                });
            } else {
                await set(ref(database, `users/${fbUser.uid}`), profile);
            }
        } catch (e) {
            console.warn('Failed to create the Firebase profile after sign-in:', e);
            await signOut(auth);
            throw new Error('Your account profile could not be saved. Please retry sign-in after checking Firebase access.');
        }
    }

    return profile;
}
export function sendPasswordReset(email) {
    return sendPasswordResetEmail(auth, email.trim().toLowerCase());
}
export function signOutUser() {
    return signOut(auth);
}
export function getFirebaseAuthErrorMessage(error) {
    const code = error && error.code ? String(error.code) : '';
    const messages = {
        'auth/email-already-in-use': 'An account already exists with this email. Please sign in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/invalid-credential': 'The email or password is incorrect.',
        'auth/user-not-found': 'No account was found with this email.',
        'auth/wrong-password': 'The email or password is incorrect.',
        'auth/weak-password': 'Please choose a stronger password.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/network-request-failed': 'We could not connect. Check your internet connection and try again.',
        'auth/user-disabled': 'This account is unavailable. Please contact MechanIQ support for help.',
        'auth/operation-not-allowed': 'This sign-in method is not available right now. Please contact MechanIQ support.',
        'auth/invalid-verification-code': 'That verification code did not work. Check it and try again.',
        'auth/expired-action-code': 'This link has expired. Request a new one and try again.',
        'auth/missing-email': 'Enter the email address linked to your account.',
        'auth/requires-recent-login': 'For your security, sign in again and then retry this change.',
    };
    if (messages[code]) return messages[code];
    const message = error instanceof Error ? error.message.trim() : '';
    const appearsTechnical = /^(Firebase:|auth\/|Error:)|\b(HTTP \d{3}|stack trace|undefined|null|permission denied|network request failed)\b/i.test(message);
    return message && !appearsTechnical
        ? message
        : 'We could not complete that step. Check your details and connection, then try again.';
}

