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
    const [obdSnapshotsByVehicle, setObdSnapshotsByVehicle] = useState({});
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
    const recordObdSnapshot = useCallback((vehicleId, snapshot) => {
        if (!vehicleId || !snapshot?.capturedAt || !Array.isArray(snapshot.readings)) return;
        const hasValidReading = snapshot.readings.some((reading) => (
            reading.supported !== false && reading.value != null && Number.isFinite(Number(reading.value))
        ));
        if (!hasValidReading) return;
        setObdSnapshotsByVehicle((current) => ({
            ...current,
            [String(vehicleId)]: {
                capturedAt: snapshot.capturedAt,
                readings: snapshot.readings,
                source: snapshot.source ?? 'OBD adapter',
            },
        }));
    }, []);
    const liveObdSnapshot = selectedVehicle?.id
        ? obdSnapshotsByVehicle[String(selectedVehicle.id)] ?? null
        : null;
    return (_jsx(CustomerHomeContext.Provider, { value: {
            homeData,
            liveObdSnapshot,
            recordObdSnapshot,
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
