import { useCallback, useEffect, useState, } from 'react';
import { getCustomerBookServiceData, } from './bookServiceService';
export function useBookService(vehicleId) {
    const [bookServiceData, setBookServiceData,] = useState(null);
    const [selectedServiceId, setSelectedServiceId,] = useState(null);
    const [isLoadingBookService, setIsLoadingBookService,] = useState(false);
    const [bookServiceError, setBookServiceError,] = useState(null);
    const refreshBookService = useCallback(async () => {
        if (!vehicleId) {
            setBookServiceData(null);
            setSelectedServiceId(null);
            setBookServiceError('No vehicle was selected.');
            return;
        }
        try {
            setIsLoadingBookService(true);
            setBookServiceError(null);
            const data = await getCustomerBookServiceData(vehicleId);
            setBookServiceData(data);
            setSelectedServiceId((currentServiceId) => {
                if (!currentServiceId) {
                    return null;
                }
                const stillAvailable = data.services.some((service) => service.id ===
                    currentServiceId);
                return stillAvailable
                    ? currentServiceId
                    : null;
            });
        }
        catch {
            setBookServiceData(null);
            setSelectedServiceId(null);
            setBookServiceError('Unable to load service options.');
        }
        finally {
            setIsLoadingBookService(false);
        }
    }, [vehicleId]);
    useEffect(() => {
        refreshBookService();
    }, [refreshBookService]);
    const selectedService = bookServiceData?.services.find((service) => service.id === selectedServiceId) ?? null;
    function selectService(serviceId) {
        const serviceExists = bookServiceData?.services.some((service) => service.id === serviceId) ?? false;
        if (!serviceExists) {
            return;
        }
        setSelectedServiceId(serviceId);
    }
    function clearSelectedService() {
        setSelectedServiceId(null);
    }
    return {
        bookServiceData,
        selectedService,
        selectedServiceId,
        isLoadingBookService,
        bookServiceError,
        selectService,
        clearSelectedService,
        refreshBookService,
    };
}
