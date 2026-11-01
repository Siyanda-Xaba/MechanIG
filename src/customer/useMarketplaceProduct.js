import { useCallback, useEffect, useState, } from 'react';
import { getMarketplaceProductById } from './marketplaceService';
export function useMarketplaceProduct(productId, vehicleId) {
    const [product, setProduct,] = useState(null);
    const [isLoadingProduct, setIsLoadingProduct,] = useState(false);
    const [productError, setProductError,] = useState(null);
    const refreshProduct = useCallback(async () => {
        if (!productId) {
            setProduct(null);
            setProductError('No marketplace product was selected.');
            return;
        }
        if (!vehicleId) {
            setProduct(null);
            setProductError('Select a vehicle to view product compatibility.');
            return;
        }
        try {
            setIsLoadingProduct(true);
            setProductError(null);
            const result = await getMarketplaceProductById(productId, vehicleId);
            if (!result) {
                setProduct(null);
                setProductError('Marketplace product not found.');
                return;
            }
            setProduct(result);
        }
        catch (error) {
            setProduct(null);
            setProductError(error instanceof Error
                ? error.message
                : 'Unable to load marketplace product.');
        }
        finally {
            setIsLoadingProduct(false);
        }
    }, [productId, vehicleId]);
    useEffect(() => {
        refreshProduct();
    }, [refreshProduct]);
    return {
        product,
        isLoadingProduct,
        productError,
        refreshProduct,
    };
}
