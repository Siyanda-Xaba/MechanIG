import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    getCustomerSavedAddresses,
} from './customerAddressService';

export function useCustomerSavedAddresses(customerId) {
    const currentCustomerId = customerId ?? null;

    /*
     * Track the customer currently associated
     * with this hook.
     */
    const currentCustomerIdRef = useRef(currentCustomerId);

    currentCustomerIdRef.current = currentCustomerId;

    /*
     * Each request receives a version number.
     * Older requests cannot update the current state.
     */
    const requestVersionRef = useRef(0);

    const [addressState, setAddressState] = useState({
        customerId: null,
        savedAddresses: [],
        isLoading: false,
        error: null,
    });

    const refreshSavedAddresses = useCallback(async () => {
        const requestVersion = ++requestVersionRef.current;

        const isCurrentRequest = () => {
            return (
                requestVersion === requestVersionRef.current &&
                currentCustomerIdRef.current === currentCustomerId
            );
        };

        /*
         * Clear saved addresses when there is
         * no authenticated customer.
         */
        if (!currentCustomerId) {
            setAddressState({
                customerId: null,
                savedAddresses: [],
                isLoading: false,
                error: null,
            });

            return;
        }

        /*
         * Begin loading addresses for the
         * current authenticated customer.
         */
        setAddressState({
            customerId: currentCustomerId,
            savedAddresses: [],
            isLoading: true,
            error: null,
        });

        try {
            const result = await getCustomerSavedAddresses(
                currentCustomerId
            );

            /*
             * Ignore results belonging to an
             * outdated request or customer.
             */
            if (!isCurrentRequest()) {
                return;
            }

            /*
             * A successful backend response must
             * contain an array of saved addresses.
             *
             * Do not treat malformed responses
             * as an empty address list.
             */
            if (!Array.isArray(result)) {
                throw new Error(
                    'Saved addresses returned an invalid response.'
                );
            }

            setAddressState({
                customerId: currentCustomerId,
                savedAddresses: result,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            if (!isCurrentRequest()) {
                return;
            }

            setAddressState({
                customerId: currentCustomerId,
                savedAddresses: [],
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unable to load saved addresses.',
            });
        }
    }, [currentCustomerId]);

    useEffect(() => {
        void refreshSavedAddresses();

        /*
         * Invalidate pending requests when
         * the customer changes or the component
         * is unmounted.
         */
        return () => {
            requestVersionRef.current += 1;
        };
    }, [refreshSavedAddresses]);

    /*
     * Never expose saved addresses from a
     * previously authenticated customer.
     */
    const isCurrentCustomer =
        addressState.customerId === currentCustomerId;

    return {
        savedAddresses: isCurrentCustomer
            ? addressState.savedAddresses
            : [],

        isLoadingSavedAddresses: isCurrentCustomer
            ? addressState.isLoading
            : Boolean(currentCustomerId),

        savedAddressesError: isCurrentCustomer
            ? addressState.error
            : null,

        refreshSavedAddresses,
    };
}