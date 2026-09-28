import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    getMechanicNotifications,
} from './mechanicNotificationService';

import {
    useUser,
} from '../users/UserContext';

export function useMechanicNotifications() {
    const {
        user,
        isLoadingUser,
    } = useUser();

    const [
        notificationsData,
        setNotificationsData,
    ] = useState(null);

    const [
        isLoadingNotifications,
        setIsLoadingNotifications,
    ] = useState(false);

    const [
        notificationsError,
        setNotificationsError,
    ] = useState(null);

    const mechanicId =
        user?.role === 'mechanic'
            ? user?.id ?? null
            : null;

    const refreshNotifications =
        useCallback(async () => {
            if (!mechanicId) {
                setNotificationsData(null);
                setNotificationsError(null);
                setIsLoadingNotifications(false);
                return;
            }

            try {
                setIsLoadingNotifications(true);
                setNotificationsError(null);

                const data =
                    await getMechanicNotifications(
                        mechanicId
                    );

                setNotificationsData(data);
            }
            catch {
                setNotificationsData(null);

                setNotificationsError(
                    'Unable to load mechanic notifications.'
                );
            }
            finally {
                setIsLoadingNotifications(false);
            }
        }, [mechanicId]);

    useEffect(() => {
        if (isLoadingUser) {
            return;
        }

        refreshNotifications();
    }, [
        isLoadingUser,
        refreshNotifications,
    ]);

    return {
        notificationsData,

        isLoadingNotifications:
            isLoadingUser ||
            isLoadingNotifications,

        notificationsError,

        refreshNotifications,
    };
}