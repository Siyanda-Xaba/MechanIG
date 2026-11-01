import AsyncStorage from '@react-native-async-storage/async-storage';

export const ALWAYS_THIS_DEVICE_ONLY = 1;
export const WHEN_UNLOCKED = 2;

export async function getItemAsync(key, options) {
    try {
        return await AsyncStorage.getItem(`secure_${key}`);
    } catch {
        return null;
    }
}

export async function setItemAsync(key, value, options) {
    try {
        await AsyncStorage.setItem(`secure_${key}`, String(value));
    } catch (e) {
        console.warn('SecureStore setItem failed', e);
    }
}

export async function deleteItemAsync(key, options) {
    try {
        await AsyncStorage.removeItem(`secure_${key}`);
    } catch {
        // ignore
    }
}

export default {
    getItemAsync,
    setItemAsync,
    deleteItemAsync,
    ALWAYS_THIS_DEVICE_ONLY,
    WHEN_UNLOCKED,
};
