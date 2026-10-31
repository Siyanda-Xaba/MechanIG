import { useCallback, useState, } from 'react';
import { createWorkshopBooking, } from './workshopBookingService';
export function useWorkshopBooking() {
    const [workshopBooking, setWorkshopBooking,] = useState(null);
    const [isSubmittingBooking, setIsSubmittingBooking,] = useState(false);
    const [workshopBookingError, setWorkshopBookingError,] = useState(null);
    const submitWorkshopBooking = useCallback(async (input) => {
        try {
            setIsSubmittingBooking(true);
            setWorkshopBookingError(null);
            const booking = await createWorkshopBooking(input);
            setWorkshopBooking(booking);
            return booking;
        }
        catch {
            setWorkshopBooking(null);
            setWorkshopBookingError('Unable to submit the workshop booking.');
            return null;
        }
        finally {
            setIsSubmittingBooking(false);
        }
    }, []);
    const resetWorkshopBooking = useCallback(() => {
        setWorkshopBooking(null);
        setWorkshopBookingError(null);
    }, []);
    return {
        workshopBooking,
        isSubmittingBooking,
        workshopBookingError,
        submitWorkshopBooking,
        resetWorkshopBooking,
    };
}
