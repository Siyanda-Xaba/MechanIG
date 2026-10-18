import {
    useCallback,
    useState,
} from 'react';

import { auth } from '../firebase/firebase';

import { useUser } from './UserContext';

import {
    updateCurrentUserProfile,
} from './userService';

export function useUpdateUserProfile() {
    const { setUser } = useUser();

    const [
        isUpdatingProfile,
        setIsUpdatingProfile,
    ] = useState(false);

    const [
        updateProfileError,
        setUpdateProfileError,
    ] = useState(null);

    const updateProfile = useCallback(
        async (input) => {
            try {
                setIsUpdatingProfile(true);
                setUpdateProfileError(null);

                // Save profile changes to Firebase Realtime Database.
                const savedUser =
                    await updateCurrentUserProfile(input);

                // Confirm that the same Firebase account
                // is still authenticated after saving.
                const firebaseUser = auth.currentUser;

                if (
                    !firebaseUser ||
                    firebaseUser.uid !== input.userId ||
                    savedUser?.id !== input.userId
                ) {
                    throw new Error(
                        'Your account session changed while saving. Please try again.'
                    );
                }

                // Preserve the existing authenticated identity,
                // role, and other account information.
                //
                // Only update the personal information fields
                // confirmed by the database.
                //
                // Email verification must come from Firebase
                // Authentication, not the profile database.
                setUser((currentUser) => {
                    if (
                        !currentUser ||
                        currentUser.id !== input.userId ||
                        auth.currentUser?.uid !== input.userId
                    ) {
                        return currentUser;
                    }

                    return {
                        ...currentUser,

                        firstName: savedUser.firstName,
                        lastName: savedUser.lastName,
                        email: savedUser.email,
                        phone: savedUser.phone,

                        updatedAt: savedUser.updatedAt,

                        emailVerified:
                            auth.currentUser.emailVerified === true,
                    };
                });

                return savedUser;
            } catch (error) {
                setUpdateProfileError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to update your profile.'
                );

                return null;
            } finally {
                setIsUpdatingProfile(false);
            }
        },
        [setUser]
    );

    const clearUpdateProfileError = useCallback(() => {
        setUpdateProfileError(null);
    }, []);

    return {
        isUpdatingProfile,
        updateProfileError,
        updateProfile,
        clearUpdateProfileError,
    };
}