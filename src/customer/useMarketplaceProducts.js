import { useCallback, useEffect, useState, } from 'react';
import { getMarketplaceProducts } from './marketplaceService';
export function useMarketplaceProducts(vehicleId) {
    const [products, setProducts,] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts,] = useState(false);
    const [productsError, setProductsError,] = useState(null);
    const refreshProducts = useCallback(async () => {
        if (!vehicleId) {
            setProducts([]);
            setProductsError('Select a vehicle to view compatible Marketplace products.');
            return;
        }
        try {
            setIsLoadingProducts(true);
            setProductsError(null);
            const result = await getMarketplaceProducts(vehicleId);
            setProducts(result);
        }
        catch (error) {
            setProducts([]);
            setProductsError(error instanceof Error
                ? error.message
                : 'Unable to load Marketplace products.');
        }
        finally {
            setIsLoadingProducts(false);
        }
    }, [vehicleId]);
    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);
    return {
        products,
        isLoadingProducts,
        productsError,
        refreshProducts,
    };
}
