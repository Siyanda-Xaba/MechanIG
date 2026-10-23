import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebase';
import { getCurrentUser, readUserProfile } from '../users/userService';
export async function registerWithEmail({ email, password, role, profile, }) {
    if (role !== 'customer' && role !== 'mechanic') {
        throw new Error('This account type cannot be assigned during public sign-up.');
    }
    const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
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
        const isMechanic = role === 'mechanic';
        await set(ref(database, `users/${credential.user.uid}`), {
            ...safeProfile,
            id: credential.user.uid,
            email: credential.user.email,
            username: safeProfile.username || (isMechanic ? email.replace(/\.com$/, '') : null),
            role: isMechanic ? 'mechanic' : 'customer',
            createdAt: new Date().toISOString(),
            emailVerified: isMechanic ? true : credential.user.emailVerified,
        });

        if (safeProfile.username) {
            try {
                await set(ref(database, `mechanic_usernames/${safeProfile.username.toLowerCase()}`), {
                    uid: credential.user.uid,
                    username: safeProfile.username,
                });
            } catch (e) {
                console.warn('Could not save mechanic_usernames index', e);
            }
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
            username: safeProfile.username,
        };
    }
    catch (error) {
        await signOut(auth);
        throw error;
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
    const isMechanicLogin = raw.includes('@mechanic') || normalizedEmail.includes('@mechanic');

    if (!profile) {
        const fbUser = credential.user;
        profile = {
            id: fbUser.uid,
            email: fbUser.email || normalizedEmail,
            username: isMechanicLogin ? (raw.endsWith('@mechanic') ? raw : `${raw}@mechanic`) : null,
            role: isMechanicLogin ? 'mechanic' : 'customer',
            firstName: isMechanicLogin ? 'Mechanic' : 'Customer',
            lastName: '',
            createdAt: new Date().toISOString(),
        };
        try {
            await set(ref(database, `users/${fbUser.uid}`), profile);
        } catch (e) {
            console.warn('Failed to save profile in Realtime Database', e);
        }
    } else if (isMechanicLogin && profile.role !== 'mechanic') {
        profile.role = 'mechanic';
        try {
            await set(ref(database, `users/${credential.user.uid}/role`), 'mechanic');
        } catch (e) {
            console.warn('Failed to update role in Realtime Database', e);
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
    };
    return messages[code] ??
        (error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.');
}

