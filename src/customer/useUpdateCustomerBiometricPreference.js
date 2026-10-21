import { useCallback, useState, } from 'react';
import { updateCustomerBiometricPreference, } from './customerSecurityService';
export function useUpdateCustomerBiometricPreference() {
    const [isUpdatingBiometricPreference, setIsUpdatingBiometricPreference,] = useState(false);
    const [biometricPreferenceError, setBiometricPreferenceError,] = useState(null);
    const updateBiometricPreference = useCallback(async (input) => {
        try {
            setIsUpdatingBiometricPreference(true);
            setBiometricPreferenceError(null);
            const savedSettings = await updateCustomerBiometricPreference(input);
            return savedSettings;
        }
        catch (error) {
            setBiometricPreferenceError(error instanceof Error
                ? error.message
                : 'Unable to update biometric sign-in.');
            return null;
        }
        finally {
            setIsUpdatingBiometricPreference(false);
        }
    }, []);
    const clearBiometricPreferenceError = useCallback(() => {
        setBiometricPreferenceError(null);
    }, []);
    return {
        isUpdatingBiometricPreference,
        biometricPreferenceError,
        updateBiometricPreference,
        clearBiometricPreferenceError,
    };
}
