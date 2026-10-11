import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    getMechanicNotifications,
} from './mechanicNotificationService';

import {
    markNotificationAsRead,
} from '../notifications/notificationReadService';

import {
    useUser,
} from '../users/UserContext';

import {
    auth,
} from '../firebase/firebase';

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

    const [
        isMarkingNotificationRead,
        setIsMarkingNotificationRead,
    ] = useState(false);

    const [
        notificationReadError,
        setNotificationReadError,
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

    const markNotificationRead =
        useCallback(async (notificationId) => {
            if (!mechanicId) {
                setNotificationReadError(
                    'A mechanic account is required to update notifications.'
                );

                return false;
            }

            if (
                typeof notificationId !== 'string' ||
                !notificationId.trim()
            ) {
                setNotificationReadError(
                    'A valid notification ID is required.'
                );

                return false;
            }

            try {
                setIsMarkingNotificationRead(true);
                setNotificationReadError(null);

                const firebaseUser =
                    auth.currentUser;

                if (!firebaseUser) {
                    throw new Error(
                        'You must be signed in to update notifications.'
                    );
                }

                const confirmed =
                    await markNotificationAsRead(
                        notificationId,
                        {
                            getIdToken: () =>
                                firebaseUser.getIdToken(),
                        }
                    );

                if (!confirmed) {
                    throw new Error(
                        'The notification read update was not confirmed.'
                    );
                }

                setNotificationsData(
                    (currentData) => {
                        if (
                            !currentData ||
                            !Array.isArray(
                                currentData.notifications
                            )
                        ) {
                            return currentData;
                        }

                        const updatedNotifications =
                            currentData.notifications.map(
                                (notification) =>
                                    notification.id ===
                                    notificationId
                                        ? {
                                              ...notification,
                                              isRead: true,
                                          }
                                        : notification
                            );

                        return {
                            ...currentData,
                            notifications:
                                updatedNotifications,
                            unreadCount:
                                updatedNotifications.filter(
                                    (notification) =>
                                        !notification.isRead
                                ).length,
                        };
                    }
                );

                return true;
            }
            catch (error) {
                setNotificationReadError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to mark the notification as read.'
                );

                return false;
            }
            finally {
                setIsMarkingNotificationRead(false);
            }
        }, [mechanicId]);

    const clearNotificationReadError =
        useCallback(() => {
            setNotificationReadError(null);
        }, []);

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

        markNotificationRead,

        isMarkingNotificationRead,

        notificationReadError,

        clearNotificationReadError,
    };
}