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
        const mechanicApplication = role === 'mechanic';
        await set(ref(database, `users/${credential.user.uid}`), {
            ...safeProfile,
            id: credential.user.uid,
            email: credential.user.email,
            role: 'customer',
            ...(mechanicApplication ? {
                requestedAccountType: 'mechanic',
                mechanicApplicationStatus: 'pending',
            } : {}),
            createdAt: new Date().toISOString(),
            emailVerified: credential.user.emailVerified,
        });
        await sendEmailVerification(credential.user);
        return await readUserProfile(credential.user);
    }
    catch (error) {
        // Do not leave an account signed in if its profile was not saved.
        await signOut(auth);
        throw error;
    }
}
export async function signInWithEmail(email, password) {
    await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    const profile = await getCurrentUser();
    if (!profile) {
        await signOut(auth);
        throw new Error('This account does not have a MechanIQ profile. Please contact support.');
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
// yes sir
