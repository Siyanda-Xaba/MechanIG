import { useCallback, useEffect, useState, } from 'react';
import { getCustomerSavedAddresses, } from './customerAddressService';
export function useCustomerSavedAddresses(customerId) {
    const [savedAddresses, setSavedAddresses,] = useState([]);
    const [isLoadingSavedAddresses, setIsLoadingSavedAddresses,] = useState(false);
    const [savedAddressesError, setSavedAddressesError,] = useState(null);
    const refreshSavedAddresses = useCallback(async () => {
        if (!customerId) {
            setSavedAddresses([]);
            setSavedAddressesError(null);
            setIsLoadingSavedAddresses(false);
            return;
        }
        try {
            setIsLoadingSavedAddresses(true);
            setSavedAddressesError(null);
            const result = await getCustomerSavedAddresses(customerId);
            setSavedAddresses(result);
        }
        catch (error) {
            setSavedAddresses([]);
            setSavedAddressesError(error instanceof Error
                ? error.message
                : 'Unable to load saved addresses.');
        }
        finally {
            setIsLoadingSavedAddresses(false);
        }
    }, [customerId]);
    useEffect(() => {
        refreshSavedAddresses();
    }, [refreshSavedAddresses]);
    return {
        savedAddresses,
        isLoadingSavedAddresses,
        savedAddressesError,
        refreshSavedAddresses,
    };
}
