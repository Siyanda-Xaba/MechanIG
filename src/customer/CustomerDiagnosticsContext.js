import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useState, } from 'react';
import { useVehicle } from '../vehicles/VehicleContext';
import { getCustomerDiagnosticsData } from './diagnosticsService';
const CustomerDiagnosticsContext = createContext(undefined);
export function CustomerDiagnosticsProvider({ children, }) {
    const { selectedVehicle } = useVehicle();
    const [diagnosticsData, setDiagnosticsData] = useState(null);
    const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);
    const [diagnosticsError, setDiagnosticsError] = useState(null);
    const refreshDiagnostics = useCallback(async () => {
        if (!selectedVehicle) {
            setDiagnosticsData(null);
            setDiagnosticsError(null);
            return;
        }
        try {
            setIsLoadingDiagnostics(true);
            setDiagnosticsError(null);
            const data = await getCustomerDiagnosticsData(selectedVehicle);
            setDiagnosticsData(data);
        }
        catch {
            setDiagnosticsData(null);
            setDiagnosticsError('Unable to load diagnostic information.');
        }
        finally {
            setIsLoadingDiagnostics(false);
        }
    }, [selectedVehicle]);
    useEffect(() => {
        refreshDiagnostics();
    }, [refreshDiagnostics]);
    return (_jsx(CustomerDiagnosticsContext.Provider, { value: {
            diagnosticsData,
            isLoadingDiagnostics,
            diagnosticsError,
            refreshDiagnostics,
        }, children: children }));
}
export function useCustomerDiagnostics() {
    const context = useContext(CustomerDiagnosticsContext);
    if (!context) {
        throw new Error('useCustomerDiagnostics must be used inside CustomerDiagnosticsProvider');
    }
    return context;
}
