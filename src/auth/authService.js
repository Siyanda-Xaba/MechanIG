import {
    createUserWithEmailAndPassword,
    reload,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';

import {
    ref,
    set,
} from 'firebase/database';

import {
    auth,
    database,
} from '../firebase/firebase';

import {
    readUserProfile,
} from '../users/userService';

/**
 * Create a Customer or Mechanic account.
 *
 * Registration must not automatically grant
 * access to either dashboard.
 *
 * The user must verify their email and then
 * sign in separately.
 */
export async function registerWithEmail({
    email,
    password,
    role,
    profile,
}) {
    const credential =
        await createUserWithEmailAndPassword(
            auth,
            email.trim().toLowerCase(),
            password
        );

    try {
        await set(
            ref(
                database,
                `users/${credential.user.uid}`
            ),
            {
                ...profile,
                id: credential.user.uid,
                email: credential.user.email,
                role,
                createdAt: new Date().toISOString(),
                emailVerified:
                    credential.user.emailVerified,
            }
        );

        await sendEmailVerification(
            credential.user
        );

        const savedProfile =
            await readUserProfile(
                credential.user
            );

        if (!savedProfile) {
            throw new Error(
                'Your account was created, but the profile could not be loaded.'
            );
        }

        return savedProfile;
    } finally {
        // Firebase signs users in automatically
        // when creating an account.
        //
        // Sign out so registration cannot be
        // treated as a completed login.
        await signOut(auth);
    }
}

/**
 * Authenticate an existing account.
 *
 * Only Firebase's authoritative emailVerified
 * value determines verification status.
 */
export async function signInWithEmail(
    email,
    password
) {
    const credential =
        await signInWithEmailAndPassword(
            auth,
            email.trim().toLowerCase(),
            password
        );

    try {
        // Refresh the Firebase account so that
        // verification completed through an
        // email link is recognized.
        await reload(credential.user);

        if (!credential.user.emailVerified) {
            throw Object.assign(
                new Error(
                    'Please verify your email address before signing in. Check your inbox or spam folder for the verification email.'
                ),
                {
                    code: 'auth/email-not-verified',
                }
            );
        }

        const profile =
            await readUserProfile(
                credential.user
            );

        if (!profile) {
            throw new Error(
                'This account does not have a MechanIQ profile. Please contact support.'
            );
        }

        if (
            profile.role !== 'customer' &&
            profile.role !== 'mechanic'
        ) {
            throw new Error(
                'This account does not have a supported MechanIQ role. Please contact support.'
            );
        }

        return {
            ...profile,

            // Reflect the freshly verified
            // Firebase Auth value in the UI.
            emailVerified: true,
        };
    } catch (error) {
        // A failed verification or profile check
        // must not leave a signed-in session.
        await signOut(auth);

        throw error;
    }
}

export function sendPasswordReset(email) {
    return sendPasswordResetEmail(
        auth,
        email.trim().toLowerCase()
    );
}

export function signOutUser() {
    return signOut(auth);
}

export function getFirebaseAuthErrorMessage(error) {
    const code =
        error && error.code
            ? String(error.code)
            : '';

    const messages = {
        'auth/email-already-in-use':
            'An account already exists with this email. Please sign in instead.',

        'auth/invalid-email':
            'Please enter a valid email address.',

        'auth/invalid-credential':
            'The email or password is incorrect.',

        'auth/user-not-found':
            'No account was found with this email.',

        'auth/wrong-password':
            'The email or password is incorrect.',

        'auth/weak-password':
            'Please choose a stronger password.',

        'auth/too-many-requests':
            'Too many attempts. Please wait a moment and try again.',

        'auth/email-not-verified':
            'Please verify your email address before signing in. Check your inbox or spam folder for the verification email.',
    };

    return (
        messages[code] ??
        (
            error instanceof Error
                ? error.message
                : 'Something went wrong. Please try again.'
        )
    );
}