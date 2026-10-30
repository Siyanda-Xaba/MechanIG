import { createUserWithEmailAndPassword, getIdTokenResult, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, database, db } from '../firebase/firebase';
import { getCurrentUser, readUserProfile } from '../users/userService';
export async function registerWithEmail({ email, password, role, profile, }) {
    const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    try {
        await set(ref(database, `users/${credential.user.uid}`), {
            ...profile,
            id: credential.user.uid,
            email: credential.user.email,
            role,
            createdAt: new Date().toISOString(),
            emailVerified: credential.user.emailVerified,
        });
        await setDoc(doc(db, 'users', credential.user.uid), {
            ...profile,
            id: credential.user.uid,
            email: credential.user.email,
            role,
            status: 'Active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
    const profileRole = String(profile.role || '').trim().toLowerCase();
    if (profileRole === 'superadmin' || profileRole === 'super admin') {
        const token = await getIdTokenResult(auth.currentUser, true);
        if (token.claims.role !== 'superadmin') {
            await signOut(auth);
            throw new Error('This profile is marked Super Admin, but Firebase Authentication has not granted the superadmin custom claim. Ask the Firebase project owner to grant the claim, then sign in again.');
        }
    }
    // Backfill profiles created before the Firestore admin directory was added.
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const existing = await getDoc(userRef);
    if (existing.data()?.status === 'Suspended') {
        await signOut(auth);
        throw new Error('This account has been suspended. Please contact support.');
    }
    await setDoc(userRef, {
        ...profile,
        id: auth.currentUser.uid,
        email: auth.currentUser.email,
        updatedAt: new Date().toISOString(),
        ...(existing.exists() ? {} : { status: 'Active' }),
    }, { merge: true });
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
