import { useCallback, useEffect, useState, } from 'react';
import { getCustomerMaintenanceData, } from './maintenanceService';
import { useVehicle } from '../vehicles/VehicleContext';
export function useCustomerMaintenance() {
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const [maintenanceData, setMaintenanceData,] = useState(null);
    const [isLoadingMaintenance, setIsLoadingMaintenance,] = useState(false);
    const [maintenanceError, setMaintenanceError,] = useState(null);
    const vehicleId = selectedVehicle?.id ?? null;
    const refreshMaintenance = useCallback(async () => {
        if (!vehicleId) {
            setMaintenanceData(null);
            setMaintenanceError(null);
            setIsLoadingMaintenance(false);
            return;
        }
        try {
            setIsLoadingMaintenance(true);
            setMaintenanceError(null);
            const data = await getCustomerMaintenanceData(vehicleId);
            setMaintenanceData(data);
        }
        catch {
            setMaintenanceData(null);
            setMaintenanceError('Unable to load maintenance information.');
        }
        finally {
            setIsLoadingMaintenance(false);
        }
    }, [vehicleId]);
    useEffect(() => {
        if (isLoadingVehicles) {
            return;
        }
        refreshMaintenance();
    }, [
        isLoadingVehicles,
        refreshMaintenance,
    ]);
    return {
        maintenanceData,
        isLoadingMaintenance: isLoadingVehicles ||
            isLoadingMaintenance,
        maintenanceError,
        refreshMaintenance,
    };
}
