import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { auth } from '../firebase/firebase';
import { useUser } from '../users/UserContext';

export function usePushNotificationRegistration() {
    const { user } = useUser();

    const [
        isRegisteringPushNotifications,
        setIsRegisteringPushNotifications,
    ] = useState(false);

    const [
        isPushDeviceRegistered,
        setIsPushDeviceRegistered,
    ] = useState(false);

    const [
        pushRegistrationError,
        setPushRegistrationError,
    ] = useState(null);

    const registrationInProgress = useRef(false);

    const accountId = user?.id ?? null;
    const accountRole = user?.role ?? null;

    useEffect(() => {
        setIsPushDeviceRegistered(false);
        setPushRegistrationError(null);
    }, [accountId, accountRole]);

    const clearPushRegistrationError = useCallback(() => {
        setPushRegistrationError(null);
    }, []);

    const enablePushNotifications = useCallback(async () => {
        if (registrationInProgress.current) {
            return false;
        }

        registrationInProgress.current = true;

        try {
            setIsRegisteringPushNotifications(true);
            setPushRegistrationError(null);

            if (
                accountRole !== 'customer' &&
                accountRole !== 'mechanic'
            ) {
                throw new Error(
                    'A Customer or Mechanic account is required.'
                );
            }

            const apiBaseUrl = String(
                process.env.EXPO_PUBLIC_NOTIFICATIONS_API_URL ??
                ''
            ).trim();

            if (!apiBaseUrl) {
                throw new Error(
                    'Push registration is unavailable until the notification backend is connected.'
                );
            }

            const firebaseUser = auth.currentUser;

            if (!firebaseUser) {
                throw new Error(
                    'You must be signed in to enable push notifications.'
                );
            }

            const authenticatedUid = firebaseUser.uid;

            await firebaseUser.getIdToken();

            // Load native notification functionality only
            // after backend and authentication checks.
            // This protects older development builds.
            const {
                registerPushDevice,
                requestExpoPushToken,
            } = await import('./pushNotificationService');

            const expoPushToken =
                await requestExpoPushToken();

            const confirmed = await registerPushDevice({
                expoPushToken,
                apiBaseUrl,

                getIdToken: async () => {
                    const currentUser = auth.currentUser;

                    if (
                        !currentUser ||
                        currentUser.uid !== authenticatedUid
                    ) {
                        throw new Error(
                            'Your signed-in account changed during registration.'
                        );
                    }

                    return currentUser.getIdToken();
                },
            });

            if (
                !confirmed ||
                auth.currentUser?.uid !== authenticatedUid
            ) {
                throw new Error(
                    'Push registration was not confirmed for the current account.'
                );
            }

            setIsPushDeviceRegistered(true);

            return true;
        } catch (error) {
            setIsPushDeviceRegistered(false);

            setPushRegistrationError(
                error instanceof Error
                    ? error.message
                    : 'Unable to enable push notifications.'
            );

            return false;
        } finally {
            registrationInProgress.current = false;
            setIsRegisteringPushNotifications(false);
        }
    }, [accountRole]);

    return {
        enablePushNotifications,
        isRegisteringPushNotifications,
        isPushDeviceRegistered,
        pushRegistrationError,
        clearPushRegistrationError,
    };
}