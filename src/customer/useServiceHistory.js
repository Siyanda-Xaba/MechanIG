import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    getCustomerServiceHistory,
} from './serviceHistoryService';

export function useServiceHistory(customerId, vehicleId) {
    const currentVehicleId = vehicleId ?? null;
    const currentCustomerId = customerId ?? null;

    /*
     * Keep track of the customer and vehicle
     * currently associated with this hook.
     */
    const currentScopeRef = useRef({
        customerId: currentCustomerId,
        vehicleId: currentVehicleId,
    });

    currentScopeRef.current = {
        customerId: currentCustomerId,
        vehicleId: currentVehicleId,
    };

    /*
     * Prevent outdated requests from updating
     * Service History after the customer or
     * selected vehicle changes.
     */
    const requestVersionRef = useRef(0);

    const [historyState, setHistoryState] = useState({
        customerId: null,
        vehicleId: null,
        records: [],
        isLoading: false,
        error: null,
    });

    const refreshServiceHistory = useCallback(async () => {
        const requestVersion = ++requestVersionRef.current;

        const isCurrentRequest = () => {
            return (
                requestVersion === requestVersionRef.current &&
                currentScopeRef.current.customerId ===
                    currentCustomerId &&
                currentScopeRef.current.vehicleId ===
                    currentVehicleId
            );
        };

        /*
         * Clear service history when there is
         * no authenticated customer.
         */
        if (!currentCustomerId) {
            setHistoryState({
                customerId: null,
                vehicleId: null,
                records: [],
                isLoading: false,
                error: null,
            });

            return;
        }

        /*
         * Start loading records for the current
         * customer and optional vehicle.
         */
        setHistoryState({
            customerId: currentCustomerId,
            vehicleId: currentVehicleId,
            records: [],
            isLoading: true,
            error: null,
        });

        try {
            const result = await getCustomerServiceHistory(
                currentCustomerId,
                currentVehicleId
            );

            if (!isCurrentRequest()) {
                return;
            }

            /*
             * A successful backend response must
             * contain a valid records array.
             *
             * Do not interpret malformed backend
             * responses as an empty service history.
             */
            if (!Array.isArray(result?.records)) {
                throw new Error(
                    'Service history returned an invalid response.'
                );
            }

            setHistoryState({
                customerId: currentCustomerId,
                vehicleId: currentVehicleId,
                records: result.records,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            if (!isCurrentRequest()) {
                return;
            }

            setHistoryState({
                customerId: currentCustomerId,
                vehicleId: currentVehicleId,
                records: [],
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unable to load service history.',
            });
        }
    }, [currentCustomerId, currentVehicleId]);

    useEffect(() => {
        void refreshServiceHistory();

        /*
         * Invalidate pending requests when the
         * customer, vehicle, or component changes.
         */
        return () => {
            requestVersionRef.current += 1;
        };
    }, [refreshServiceHistory]);

    /*
     * Never expose records from a different
     * customer or selected vehicle, even during
     * the render before a new request begins.
     */
    const isCurrentScope =
        historyState.customerId === currentCustomerId &&
        historyState.vehicleId === currentVehicleId;

    return {
        records: isCurrentScope
            ? historyState.records
            : [],

        isLoadingServiceHistory: isCurrentScope
            ? historyState.isLoading
            : Boolean(currentCustomerId),

        serviceHistoryError: isCurrentScope
            ? historyState.error
            : null,

        refreshServiceHistory,
    };
}