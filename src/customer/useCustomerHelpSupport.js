import { useCallback, useEffect, useState, } from 'react';
import { getCustomerHelpSupportData, } from './customerHelpSupportService';
export function useCustomerHelpSupport() {
    const [helpSupportData, setHelpSupportData,] = useState(null);
    const [isLoadingHelpSupport, setIsLoadingHelpSupport,] = useState(false);
    const [helpSupportError, setHelpSupportError,] = useState(null);
    const refreshHelpSupport = useCallback(async () => {
        try {
            setIsLoadingHelpSupport(true);
            setHelpSupportError(null);
            const result = await getCustomerHelpSupportData();
            setHelpSupportData(result);
        }
        catch (error) {
            setHelpSupportData(null);
            setHelpSupportError(error instanceof Error
                ? error.message
                : 'Unable to load help and support.');
        }
        finally {
            setIsLoadingHelpSupport(false);
        }
    }, []);
    useEffect(() => {
        refreshHelpSupport();
    }, [refreshHelpSupport]);
    return {
        helpSupportData,
        isLoadingHelpSupport,
        helpSupportError,
        refreshHelpSupport,
    };
}
