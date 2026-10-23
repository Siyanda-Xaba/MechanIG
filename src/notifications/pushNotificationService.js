import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REQUEST_TIMEOUT_MS = 15000;

const PUSH_CHANNEL_ID = 'default';

function hasNotificationPermission(settings) {
    return (
        settings.granted === true ||
        settings.ios?.status ===
            Notifications.IosAuthorizationStatus.PROVISIONAL
    );
}

function getNotificationsApiUrl(override) {
    return String(
        override ??
        process.env.EXPO_PUBLIC_NOTIFICATIONS_API_URL ??
        ''
    )
        .trim()
        .replace(/\/+$/, '');
}

export async function getPushPermissionStatus() {
    if (Platform.OS === 'web') {
        return {
            granted: false,
            canAskAgain: false,
            status: 'unsupported',
        };
    }

    const settings =
        await Notifications.getPermissionsAsync();

    return {
        granted: hasNotificationPermission(settings),
        canAskAgain: settings.canAskAgain,
        status: settings.status,
    };
}

/**
 * Request a push token after an explicit user action.
 *
 * This function does not register the token with
 * the MechanIQ backend.
 */
export async function requestExpoPushToken() {
    if (
        Platform.OS !== 'android' &&
        Platform.OS !== 'ios'
    ) {
        throw new Error(
            'Push notifications are not supported on this platform.'
        );
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(
            PUSH_CHANNEL_ID,
            {
                name: 'MechanIQ Updates',
                importance:
                    Notifications.AndroidImportance.DEFAULT,
                lightColor: '#00E5FF',
            }
        );
    }

    let permissions =
        await Notifications.getPermissionsAsync();

    if (!hasNotificationPermission(permissions)) {
        if (!permissions.canAskAgain) {
            throw new Error(
                'Notification permission is disabled. Enable notifications in your device settings.'
            );
        }

        permissions =
            await Notifications.requestPermissionsAsync();
    }

    if (!hasNotificationPermission(permissions)) {
        throw new Error(
            'Notification permission was not granted.'
        );
    }

    const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

    if (!projectId) {
        throw new Error(
            'MechanIQ Expo project ID is unavailable.'
        );
    }

    const result =
        await Notifications.getExpoPushTokenAsync({
            projectId,
        });

    const expoPushToken = result?.data;

    if (
        typeof expoPushToken !== 'string' ||
        !expoPushToken.trim()
    ) {
        throw new Error(
            'The device did not return a valid push token.'
        );
    }

    return expoPushToken;
}

/**
 * Register a device with the authenticated
 * MechanIQ account.
 *
 * Proposed backend endpoint:
 * POST /notifications/devices
 *
 * Expected confirmation:
 * HTTP 204 or JSON { registered: true }
 *
 * The backend must associate the device with
 * the authenticated user, not a supplied role ID.
 */
export async function registerPushDevice(
    {
        expoPushToken,
        getIdToken,
        apiBaseUrl,
    } = {}
) {
    const baseUrl =
        getNotificationsApiUrl(apiBaseUrl);

    if (!baseUrl) {
        throw new Error(
            'Push device registration is unavailable until the MechanIQ backend is connected.'
        );
    }

    if (typeof getIdToken !== 'function') {
        throw new Error(
            'Authentication is required for push registration.'
        );
    }

    if (
        typeof expoPushToken !== 'string' ||
        !expoPushToken.trim()
    ) {
        throw new Error(
            'A valid Expo push token is required.'
        );
    }

    const idToken = await getIdToken();

    if (!idToken) {
        throw new Error(
            'Your authenticated session could not be verified.'
        );
    }

    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS
    );

    try {
        const response = await fetch(
            `${baseUrl}/notifications/devices`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    expoPushToken,
                    provider: 'expo',
                    platform: Platform.OS,
                }),
                signal: controller.signal,
            }
        );

        if (!response.ok) {
            if (
                response.status === 401 ||
                response.status === 403
            ) {
                throw new Error(
                    'You are not authorized to register this device.'
                );
            }

            throw new Error(
                'Unable to register this device for notifications.'
            );
        }

        if (response.status === 204) {
            return true;
        }

        const result = await response
            .json()
            .catch(() => null);

        if (result?.registered !== true) {
            throw new Error(
                'The backend did not confirm device registration.'
            );
        }

        return true;
    } catch (error) {
        if (error?.name === 'AbortError') {
            throw new Error(
                'Push registration timed out. Please try again.'
            );
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}