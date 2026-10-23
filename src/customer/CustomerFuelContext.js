import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useState, } from 'react';
import { useVehicle } from '../vehicles/VehicleContext';
import { getCustomerFuelData } from './fuelService';
const CustomerFuelContext = createContext(undefined);
export function CustomerFuelProvider({ children, }) {
    const { selectedVehicle } = useVehicle();
    const [fuelData, setFuelData] = useState(null);
    const [isLoadingFuel, setIsLoadingFuel] = useState(false);
    const [fuelError, setFuelError] = useState(null);
    const refreshFuelData = useCallback(async () => {
        if (!selectedVehicle) {
            setFuelData(null);
            setFuelError(null);
            return;
        }
        try {
            setIsLoadingFuel(true);
            setFuelError(null);
            const data = await getCustomerFuelData(selectedVehicle.id);
            setFuelData(data);
        }
        catch {
            setFuelData(null);
            setFuelError('Unable to load fuel information.');
        }
        finally {
            setIsLoadingFuel(false);
        }
    }, [selectedVehicle]);
    useEffect(() => {
        refreshFuelData();
    }, [refreshFuelData]);
    return (_jsx(CustomerFuelContext.Provider, { value: {
            fuelData,
            isLoadingFuel,
            fuelError,
            refreshFuelData,
        }, children: children }));
}
export function useCustomerFuel() {
    const context = useContext(CustomerFuelContext);
    if (!context) {
        throw new Error('useCustomerFuel must be used inside CustomerFuelProvider');
    }
    return context;
}
