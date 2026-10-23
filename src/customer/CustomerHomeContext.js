import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useState, } from 'react';
import { useVehicle } from '../vehicles/VehicleContext';
import { getCustomerHomeData } from './homeService';
const CustomerHomeContext = createContext(undefined);
export function CustomerHomeProvider({ children, }) {
    const { selectedVehicle } = useVehicle();
    const [homeData, setHomeData] = useState(null);
    const [isLoadingHome, setIsLoadingHome] = useState(false);
    const [homeError, setHomeError] = useState(null);
    const refreshHomeData = useCallback(async () => {
        if (!selectedVehicle) {
            setHomeData(null);
            setHomeError(null);
            return;
        }
        try {
            setIsLoadingHome(true);
            setHomeError(null);
            const data = await getCustomerHomeData(selectedVehicle.id);
            setHomeData(data);
        }
        catch {
            setHomeData(null);
            setHomeError('Unable to load vehicle information.');
        }
        finally {
            setIsLoadingHome(false);
        }
    }, [selectedVehicle]);
    useEffect(() => {
        refreshHomeData();
    }, [refreshHomeData]);
    return (_jsx(CustomerHomeContext.Provider, { value: {
            homeData,
            isLoadingHome,
            homeError,
            refreshHomeData,
        }, children: children }));
}
export function useCustomerHome() {
    const context = useContext(CustomerHomeContext);
    if (!context) {
        throw new Error('useCustomerHome must be used inside CustomerHomeProvider');
    }
    return context;
}
