import { useCallback, useEffect, useState, } from 'react';
import { getCustomerServiceHistory, } from './serviceHistoryService';
export function useServiceHistory(customerId, vehicleId) {
    const [records, setRecords,] = useState([]);
    const [isLoadingServiceHistory, setIsLoadingServiceHistory,] = useState(false);
    const [serviceHistoryError, setServiceHistoryError,] = useState(null);
    const refreshServiceHistory = useCallback(async () => {
        if (!customerId) {
            setRecords([]);
            setServiceHistoryError(null);
            setIsLoadingServiceHistory(false);
            return;
        }
        try {
            setIsLoadingServiceHistory(true);
            setServiceHistoryError(null);
            const result = await getCustomerServiceHistory(customerId, vehicleId);
            setRecords(result.records);
        }
        catch (error) {
            setRecords([]);
            setServiceHistoryError(error instanceof Error
                ? error.message
                : 'Unable to load service history.');
        }
        finally {
            setIsLoadingServiceHistory(false);
        }
    }, [
        customerId,
        vehicleId,
    ]);
    useEffect(() => {
        refreshServiceHistory();
    }, [refreshServiceHistory]);
    return {
        records,
        isLoadingServiceHistory,
        serviceHistoryError,
        refreshServiceHistory,
    };
}
