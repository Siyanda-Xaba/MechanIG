import { jsx as _jsx } from 'react/jsx-runtime';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useVehicle } from '../vehicles/VehicleContext';

import { getCustomerFuelData } from './fuelService';

const CustomerFuelContext = createContext(undefined);

export function CustomerFuelProvider({ children }) {
    const { selectedVehicle } = useVehicle();

    const selectedVehicleId = selectedVehicle?.id ?? null;

    const [fuelData, setFuelData] = useState(null);

    const [isLoadingFuel, setIsLoadingFuel] = useState(false);

    const [fuelError, setFuelError] = useState(null);

    /*
     * Each fuel request receives a unique version.
     *
     * If the customer changes vehicles or refreshes
     * fuel information, older requests must not
     * overwrite the latest vehicle data.
     */
    const requestVersionRef = useRef(0);

    const refreshFuelData = useCallback(async () => {
        const requestVersion = ++requestVersionRef.current;

        /*
         * Fuel information must always belong
         * to a selected vehicle.
         */
        if (!selectedVehicleId) {
            setFuelData(null);
            setFuelError(null);
            setIsLoadingFuel(false);
            return;
        }

        /*
         * Clear previous vehicle information while
         * loading the selected vehicle's data.
         */
        setFuelData(null);
        setIsLoadingFuel(true);
        setFuelError(null);

        try {
            const data = await getCustomerFuelData(
                selectedVehicleId
            );

            /*
             * Ignore responses from outdated requests.
             */
            if (
                requestVersion !== requestVersionRef.current
            ) {
                return;
            }

            setFuelData(data);
        } catch {
            if (
                requestVersion !== requestVersionRef.current
            ) {
                return;
            }

            setFuelData(null);

            setFuelError(
                'Unable to load fuel information.'
            );
        } finally {
            /*
             * Only the latest request may change
             * the loading state.
             */
            if (
                requestVersion === requestVersionRef.current
            ) {
                setIsLoadingFuel(false);
            }
        }
    }, [selectedVehicleId]);

    useEffect(() => {
        refreshFuelData();

        /*
         * Invalidate pending requests when the
         * selected vehicle changes or the provider
         * unmounts.
         */
        return () => {
            requestVersionRef.current += 1;
        };
    }, [refreshFuelData]);

    return _jsx(CustomerFuelContext.Provider, {
        value: {
            fuelData,
            isLoadingFuel,
            fuelError,
            refreshFuelData,
        },
        children,
    });
}

export function useCustomerFuel() {
    const context = useContext(CustomerFuelContext);

    if (!context) {
        throw new Error(
            'useCustomerFuel must be used inside CustomerFuelProvider'
        );
    }

    return context;
}