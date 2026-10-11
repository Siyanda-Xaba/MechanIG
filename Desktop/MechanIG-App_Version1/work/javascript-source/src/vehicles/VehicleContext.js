import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from 'react';
import { getUserVehicles } from './vehicleService';
const VehicleContext = createContext(undefined);
export function VehicleProvider({ children, }) {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
    useEffect(() => {
        refreshVehicles();
    }, []);
    async function refreshVehicles() {
        try {
            setIsLoadingVehicles(true);
            const userVehicles = await getUserVehicles();
            setVehicles(userVehicles);
            const primaryVehicle = userVehicles.find((vehicle) => vehicle.isPrimary) ??
                userVehicles[0] ??
                null;
            setSelectedVehicle(primaryVehicle);
        }
        finally {
            setIsLoadingVehicles(false);
        }
    }
    function addVehicle(vehicle, shouldSelect = false) {
        setVehicles((currentVehicles) => {
            const existingVehicles = vehicle.isPrimary
                ? currentVehicles.map((currentVehicle) => ({
                    ...currentVehicle,
                    isPrimary: false,
                }))
                : currentVehicles;
            return [
                ...existingVehicles,
                vehicle,
            ];
        });
        setSelectedVehicle((currentVehicle) => {
            if (shouldSelect ||
                vehicle.isPrimary ||
                currentVehicle === null) {
                return vehicle;
            }
            return currentVehicle;
        });
    }
    function selectVehicle(vehicleId) {
        const vehicle = vehicles.find((item) => item.id === vehicleId);
        if (vehicle) {
            setSelectedVehicle(vehicle);
        }
    }
    return (_jsx(VehicleContext.Provider, { value: {
            vehicles,
            selectedVehicle,
            isLoadingVehicles,
            addVehicle,
            selectVehicle,
            refreshVehicles,
        }, children: children }));
}
export function useVehicle() {
    const context = useContext(VehicleContext);
    if (!context) {
        throw new Error('useVehicle must be used inside VehicleProvider');
    }
    return context;
}
