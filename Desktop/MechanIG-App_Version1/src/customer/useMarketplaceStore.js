import { useCallback, useEffect, useState, } from 'react';
import { getMarketplaceStoreById } from './marketplaceService';
export function useMarketplaceStore(storeId) {
    const [store, setStore,] = useState(null);
    const [isLoadingStore, setIsLoadingStore,] = useState(false);
    const [storeError, setStoreError,] = useState(null);
    const refreshStore = useCallback(async () => {
        if (!storeId) {
            setStore(null);
            setStoreError('No marketplace store was selected.');
            return;
        }
        try {
            setIsLoadingStore(true);
            setStoreError(null);
            const result = await getMarketplaceStoreById(storeId);
            if (!result) {
                setStore(null);
                setStoreError('Marketplace store not found.');
                return;
            }
            setStore(result);
        }
        catch (error) {
            setStore(null);
            setStoreError(error instanceof Error
                ? error.message
                : 'Unable to load marketplace store.');
        }
        finally {
            setIsLoadingStore(false);
        }
    }, [storeId]);
    useEffect(() => {
        refreshStore();
    }, [refreshStore]);
    return {
        store,
        isLoadingStore,
        storeError,
        refreshStore,
    };
}
