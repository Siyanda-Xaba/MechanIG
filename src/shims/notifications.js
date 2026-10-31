export const IosAuthorizationStatus = {
    NOT_DETERMINED: 0,
    DENIED: 1,
    AUTHORIZED: 2,
    PROVISIONAL: 3,
    EPHEMERAL: 4,
};

export const AndroidImportance = {
    UNKNOWN: 0,
    UNSPECIFIED: 1,
    NONE: 2,
    MIN: 3,
    LOW: 4,
    DEFAULT: 5,
    HIGH: 6,
    MAX: 7,
};

export async function getPermissionsAsync() {
    return {
        granted: true,
        status: 'granted',
        canAskAgain: true,
        expires: 'never',
    };
}

export async function requestPermissionsAsync() {
    return {
        granted: true,
        status: 'granted',
        canAskAgain: true,
        expires: 'never',
    };
}

export async function setNotificationChannelAsync() {
    return null;
}

export function setNotificationHandler() {}

export async function getExpoPushTokenAsync() {
    return { data: 'mock-expo-push-token' };
}

export function addNotificationReceivedListener() {
    return {
        remove: () => {},
    };
}

export function addNotificationResponseReceivedListener() {
    return {
        remove: () => {},
    };
}

export default {
    IosAuthorizationStatus,
    AndroidImportance,
    getPermissionsAsync,
    requestPermissionsAsync,
    setNotificationChannelAsync,
    setNotificationHandler,
    getExpoPushTokenAsync,
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
};
