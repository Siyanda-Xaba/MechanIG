import { useCallback, useState, } from 'react';
import { updateCustomerNotificationPreferences, } from './customerNotificationPreferenceService';
export function useUpdateCustomerNotificationPreferences() {
    const [isUpdatingNotificationPreferences, setIsUpdatingNotificationPreferences,] = useState(false);
    const [updateNotificationPreferencesError, setUpdateNotificationPreferencesError,] = useState(null);
    const updateNotificationPreferences = useCallback(async (input) => {
        try {
            setIsUpdatingNotificationPreferences(true);
            setUpdateNotificationPreferencesError(null);
            const savedPreferences = await updateCustomerNotificationPreferences(input);
            return savedPreferences;
        }
        catch (error) {
            setUpdateNotificationPreferencesError(error instanceof Error
                ? error.message
                : 'Unable to save notification preferences.');
            return null;
        }
        finally {
            setIsUpdatingNotificationPreferences(false);
        }
    }, []);
    const clearUpdateNotificationPreferencesError = useCallback(() => {
        setUpdateNotificationPreferencesError(null);
    }, []);
    return {
        isUpdatingNotificationPreferences,
        updateNotificationPreferencesError,
        updateNotificationPreferences,
        clearUpdateNotificationPreferencesError,
    };
}
