import { useCallback, useState, } from 'react';
import { createCustomerSavedAddress, } from './customerAddressService';
export function useCreateCustomerSavedAddress() {
    const [isCreatingSavedAddress, setIsCreatingSavedAddress,] = useState(false);
    const [createSavedAddressError, setCreateSavedAddressError,] = useState(null);
    const createSavedAddress = useCallback(async (input) => {
        try {
            setIsCreatingSavedAddress(true);
            setCreateSavedAddressError(null);
            const savedAddress = await createCustomerSavedAddress(input);
            return savedAddress;
        }
        catch (error) {
            setCreateSavedAddressError(error instanceof Error
                ? error.message
                : 'Unable to save the address.');
            return null;
        }
        finally {
            setIsCreatingSavedAddress(false);
        }
    }, []);
    const clearCreateSavedAddressError = useCallback(() => {
        setCreateSavedAddressError(null);
    }, []);
    return {
        isCreatingSavedAddress,
        createSavedAddressError,
        createSavedAddress,
        clearCreateSavedAddressError,
    };
}
