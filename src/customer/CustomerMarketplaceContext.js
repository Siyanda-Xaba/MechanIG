import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useState, } from 'react';
import { useVehicle } from '../vehicles/VehicleContext';
import { getCustomerMarketplaceData } from './marketplaceService';
const CustomerMarketplaceContext = createContext(undefined);
export function CustomerMarketplaceProvider({ children, }) {
    const { selectedVehicle } = useVehicle();
    const [marketplaceData, setMarketplaceData] = useState(null);
    const [isLoadingMarketplace, setIsLoadingMarketplace] = useState(false);
    const [marketplaceError, setMarketplaceError] = useState(null);
    const refreshMarketplaceData = useCallback(async () => {
        if (!selectedVehicle) {
            setMarketplaceData(null);
            setMarketplaceError(null);
            return;
        }
        try {
            setIsLoadingMarketplace(true);
            setMarketplaceError(null);
            const data = await getCustomerMarketplaceData(selectedVehicle);
            setMarketplaceData(data);
        }
        catch {
            setMarketplaceData(null);
            setMarketplaceError('Unable to load marketplace information.');
        }
        finally {
            setIsLoadingMarketplace(false);
        }
    }, [selectedVehicle]);
    useEffect(() => {
        refreshMarketplaceData();
    }, [refreshMarketplaceData]);
    return (_jsx(CustomerMarketplaceContext.Provider, { value: {
            marketplaceData,
            isLoadingMarketplace,
            marketplaceError,
            refreshMarketplaceData,
        }, children: children }));
}
export function useCustomerMarketplace() {
    const context = useContext(CustomerMarketplaceContext);
    if (!context) {
        throw new Error('useCustomerMarketplace must be used inside CustomerMarketplaceProvider');
    }
    return context;
}
