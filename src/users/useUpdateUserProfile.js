import { useCallback, useState, } from 'react';
import { useUser } from './UserContext';
import { updateCurrentUserProfile } from './userService';
export function useUpdateUserProfile() {
    const { setUser } = useUser();
    const [isUpdatingProfile, setIsUpdatingProfile,] = useState(false);
    const [updateProfileError, setUpdateProfileError,] = useState(null);
    const updateProfile = useCallback(async (input) => {
        try {
            setIsUpdatingProfile(true);
            setUpdateProfileError(null);
            const savedUser = await updateCurrentUserProfile(input);
            setUser(savedUser);
            return savedUser;
        }
        catch (error) {
            setUpdateProfileError(error instanceof Error
                ? error.message
                : 'Unable to update your profile.');
            return null;
        }
        finally {
            setIsUpdatingProfile(false);
        }
    }, [setUser]);
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
