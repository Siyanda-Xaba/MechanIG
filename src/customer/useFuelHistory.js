import { useCallback, useEffect, useState, } from 'react';
import { getFuelHistory, } from './fuelService';
export function useFuelHistory(vehicleId) {
    const [history, setHistory,] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory,] = useState(false);
    const [historyError, setHistoryError,] = useState(null);
    const refreshHistory = useCallback(async () => {
        if (!vehicleId) {
            setHistory([]);
            setHistoryError(null);
            setIsLoadingHistory(false);
            return;
        }
        try {
            setIsLoadingHistory(true);
            setHistoryError(null);
            const result = await getFuelHistory(vehicleId);
            setHistory(result);
        }
        catch (error) {
            setHistory([]);
            setHistoryError(error instanceof Error
                ? error.message
                : 'Unable to load fuel history.');
        }
        finally {
            setIsLoadingHistory(false);
        }
    }, [vehicleId]);
    useEffect(() => {
        refreshHistory();
    }, [refreshHistory]);
    return {
        history,
        isLoadingHistory,
        historyError,
        refreshHistory,
    };
}
