import { useCallback, useEffect, useState, } from 'react';
import { getCustomerSecuritySettings, } from './customerSecurityService';
export function useCustomerSecuritySettings(customerId) {
    const [securitySettings, setSecuritySettings,] = useState(null);
    const [isLoadingSecuritySettings, setIsLoadingSecuritySettings,] = useState(false);
    const [securitySettingsError, setSecuritySettingsError,] = useState(null);
    const refreshSecuritySettings = useCallback(async () => {
        if (!customerId) {
            setSecuritySettings(null);
            setSecuritySettingsError(null);
            setIsLoadingSecuritySettings(false);
            return;
        }
        try {
            setIsLoadingSecuritySettings(true);
            setSecuritySettingsError(null);
            const result = await getCustomerSecuritySettings(customerId);
            setSecuritySettings(result);
        }
        catch (error) {
            setSecuritySettings(null);
            setSecuritySettingsError(error instanceof Error
                ? error.message
                : 'Unable to load security settings.');
        }
        finally {
            setIsLoadingSecuritySettings(false);
        }
    }, [customerId]);
    useEffect(() => {
        refreshSecuritySettings();
    }, [refreshSecuritySettings]);
    return {
        securitySettings,
        isLoadingSecuritySettings,
        securitySettingsError,
        refreshSecuritySettings,
    };
}
