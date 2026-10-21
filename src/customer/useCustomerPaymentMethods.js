import { useCallback, useEffect, useState, } from 'react';
import { getCustomerPaymentMethods, } from './customerPaymentService';
export function useCustomerPaymentMethods(customerId) {
    const [paymentMethods, setPaymentMethods,] = useState([]);
    const [isLoadingPaymentMethods, setIsLoadingPaymentMethods,] = useState(false);
    const [paymentMethodsError, setPaymentMethodsError,] = useState(null);
    const refreshPaymentMethods = useCallback(async () => {
        if (!customerId) {
            setPaymentMethods([]);
            setPaymentMethodsError(null);
            setIsLoadingPaymentMethods(false);
            return;
        }
        try {
            setIsLoadingPaymentMethods(true);
            setPaymentMethodsError(null);
            const result = await getCustomerPaymentMethods(customerId);
            setPaymentMethods(result);
        }
        catch (error) {
            setPaymentMethods([]);
            setPaymentMethodsError(error instanceof Error
                ? error.message
                : 'Unable to load payment methods.');
        }
        finally {
            setIsLoadingPaymentMethods(false);
        }
    }, [customerId]);
    useEffect(() => {
        refreshPaymentMethods();
    }, [refreshPaymentMethods]);
    return {
        paymentMethods,
        isLoadingPaymentMethods,
        paymentMethodsError,
        refreshPaymentMethods,
    };
}
