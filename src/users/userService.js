import { get, ref, update } from 'firebase/database';
import { auth, database } from '../firebase/firebase';
export async function getCurrentUser() {
    if (!auth.currentUser) {
        return null;
    }
    return readUserProfile(auth.currentUser);
}
export async function readUserProfile(firebaseUser) {
    const isMechanic = (firebaseUser.email || '').toLowerCase().includes('@mechanic') ||
                       (firebaseUser.email || '').toLowerCase().endsWith('mechanic');
    const snapshot = await get(ref(database, `users/${firebaseUser.uid}`));
    if (!snapshot.exists()) {
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            role: isMechanic ? 'mechanic' : 'customer',
            firstName: isMechanic ? 'Mechanic' : 'Customer',
            lastName: '',
        };
    }
    const val = snapshot.val();
    if (isMechanic && val.role !== 'mechanic') {
        val.role = 'mechanic';
    }
    return val;
}
export async function updateCurrentUserProfile(input) {
    if (auth.currentUser?.uid !== input.userId) {
        throw new Error('You must be signed in to update your profile.');
    }
    await update(ref(database, `users/${input.userId}`), {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        updatedAt: new Date().toISOString(),
    });
    const profile = await getCurrentUser();
    if (!profile) {
        throw new Error('Your profile could not be loaded after saving.');
    }
    return profile;
}
export async function uploadProfileImage(input) {
    // Production implementation will upload the selected
    // image to the MechanIQ backend or configured media
    // storage service.
    //
    // The backend must return a persistent image URL.
    // A local device URI must not be treated as a
    // successfully uploaded profile image.
    void input;
    throw new Error('Profile image upload is not available until the user backend is connected.');
}
