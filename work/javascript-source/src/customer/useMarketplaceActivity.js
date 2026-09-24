import { useCallback, useEffect, useState, } from 'react';
import { getMarketplaceActivity } from './marketplaceService';
export function useMarketplaceActivity(vehicleId) {
    const [activity, setActivity,] = useState([]);
    const [isLoadingActivity, setIsLoadingActivity,] = useState(false);
    const [activityError, setActivityError,] = useState(null);
    const refreshActivity = useCallback(async () => {
        if (!vehicleId) {
            setActivity([]);
            setActivityError('Select a vehicle to view Marketplace activity.');
            return;
        }
        try {
            setIsLoadingActivity(true);
            setActivityError(null);
            const result = await getMarketplaceActivity(vehicleId);
            setActivity(result);
        }
        catch (error) {
            setActivity([]);
            setActivityError(error instanceof Error
                ? error.message
                : 'Unable to load Marketplace activity.');
        }
        finally {
            setIsLoadingActivity(false);
        }
    }, [vehicleId]);
    useEffect(() => {
        refreshActivity();
    }, [refreshActivity]);
    return {
        activity,
        isLoadingActivity,
        activityError,
        refreshActivity,
    };
}
