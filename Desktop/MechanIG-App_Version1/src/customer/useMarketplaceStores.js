import { useCallback, useEffect, useState, } from 'react';
import { getMarketplaceStores } from './marketplaceService';
export function useMarketplaceStores() {
    const [stores, setStores,] = useState([]);
    const [isLoadingStores, setIsLoadingStores,] = useState(false);
    const [storesError, setStoresError,] = useState(null);
    const refreshStores = useCallback(async () => {
        try {
            setIsLoadingStores(true);
            setStoresError(null);
            const result = await getMarketplaceStores();
            setStores(result);
        }
        catch (error) {
            setStores([]);
            setStoresError(error instanceof Error
                ? error.message
                : 'Unable to load nearby marketplace stores.');
        }
        finally {
            setIsLoadingStores(false);
        }
    }, []);
    useEffect(() => {
        refreshStores();
    }, [refreshStores]);
    return {
        stores,
        isLoadingStores,
        storesError,
        refreshStores,
    };
}
