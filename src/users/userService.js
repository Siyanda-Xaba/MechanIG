import {
    get,
    ref,
    update,
} from 'firebase/database';

import {
    auth,
    database,
} from '../firebase/firebase';

/**
 * Retrieve the current authenticated user's profile.
 */
export async function getCurrentUser() {
    if (!auth.currentUser) {
        return null;
    }

    return readUserProfile(auth.currentUser);
}

/**
 * Read the profile associated with a Firebase account.
 */
export async function readUserProfile(firebaseUser) {
    const snapshot = await get(
        ref(
            database,
            `users/${firebaseUser.uid}`
        )
    );

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val();
}

/**
 * Update personal information.
 *
 * The Firebase Authentication email remains
 * authoritative.
 *
 * Email changes require a separate secure
 * verification workflow and must not be
 * performed by updating Realtime Database alone.
 */
export async function updateCurrentUserProfile(input) {
    const firebaseUser = auth.currentUser;

    if (
        !firebaseUser ||
        firebaseUser.uid !== input.userId
    ) {
        throw new Error(
            'You must be signed in to update your profile.'
        );
    }

    const requestedEmail = input.email
        .trim()
        .toLowerCase();

    const authenticatedEmail = firebaseUser.email
        ?.trim()
        .toLowerCase();

    /*
     * Never allow a Realtime Database update
     * to change the account email independently
     * of Firebase Authentication.
     */
    if (
        !authenticatedEmail ||
        requestedEmail !== authenticatedEmail
    ) {
        throw new Error(
            'Email address changes require verification and are not available yet. You can still update your name and phone number.'
        );
    }

    /*
     * Save ordinary personal information.
     *
     * Keep the database email synchronized
     * with the existing Firebase Auth email.
     */
    await update(
        ref(
            database,
            `users/${input.userId}`
        ),
        {
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            email: authenticatedEmail,
            phone: input.phone.trim(),
            updatedAt: new Date().toISOString(),
        }
    );

    /*
     * Retrieve the confirmed saved profile.
     */
    const profile = await getCurrentUser();

    if (!profile) {
        throw new Error(
            'Your profile could not be loaded after saving.'
        );
    }

    return profile;
}

/**
 * Profile image upload requires a configured
 * persistent backend or media storage service.
 */
export async function uploadProfileImage(input) {
    // Production implementation will upload the selected
    // image to the MechanIQ backend or configured media
    // storage service.
    //
    // The backend must return a persistent image URL.
    // A local device URI must not be treated as a
    // successfully uploaded profile image.

    void input;

    throw new Error(
        'Profile image upload is not available until the user backend is connected.'
    );
}