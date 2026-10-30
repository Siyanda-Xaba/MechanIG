import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: 'AIzaSyCIow8TP9gJTEbOyIAInaMh-3usjrCOw9s',
    authDomain: 'mechaniq-3a0f2.firebaseapp.com',
    databaseURL: 'https://mechaniq-3a0f2-default-rtdb.firebaseio.com',
    projectId: 'mechaniq-3a0f2',
    storageBucket: 'mechaniq-3a0f2.firebasestorage.app',
    messagingSenderId: '174807907179',
    appId: '1:174807907179:web:decd35675c9a5f14e8aa2e',
};
export const firebaseApp = getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);
// Keeps the signed-in session after an app restart.
export const auth = (() => {
    try {
        return initializeAuth(firebaseApp, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }
    catch {
        return getAuth(firebaseApp);
    }
})();
export const database = getDatabase(firebaseApp);
// Firestore stores platform administration data; profile records remain in RTDB.
export const db = getFirestore(firebaseApp);
