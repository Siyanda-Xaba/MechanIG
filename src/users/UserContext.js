import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { getCurrentUser, readUserProfile } from './userService';

const UserContext = createContext(undefined);
const BACKGROUND_TIMESTAMP_KEY = 'auth.backgroundedAt';
const BACKGROUND_USER_ID_KEY = 'auth.backgroundedUserId';
const BACKGROUND_SIGN_OUT_MS = 5 * 60 * 1000;

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const timeoutRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        let previousState = AppState.currentState;

        const clearBackgroundTimeout = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
        const clearStoredBackground = async () => {
            await AsyncStorage.multiRemove([BACKGROUND_TIMESTAMP_KEY, BACKGROUND_USER_ID_KEY]);
        };

        // Timers may pause while the OS suspends the app. Check the saved
        // background time before restoring the Firebase profile on launch.
        const startupCheck = AsyncStorage.multiGet([BACKGROUND_TIMESTAMP_KEY, BACKGROUND_USER_ID_KEY])
            .then(async ([timestampEntry, userIdEntry]) => {
                const backgroundedAt = Number(timestampEntry?.[1]);
                const backgroundedUserId = userIdEntry?.[1];
                if (backgroundedAt && auth.currentUser?.uid === backgroundedUserId && Date.now() - backgroundedAt >= BACKGROUND_SIGN_OUT_MS) {
                    await clearStoredBackground();
                    await signOut(auth);
                } else {
                    await clearStoredBackground();
                }
            })
            .catch(() => {});

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                await startupCheck;
                if (!isMounted) return;
                setIsLoadingUser(true);
                setUser(firebaseUser ? await readUserProfile(firebaseUser) : null);
            } finally {
                if (isMounted) setIsLoadingUser(false);
            }
        });

        const appStateSubscription = AppState.addEventListener('change', async (nextState) => {
            const wasBackgrounded = previousState === 'background' || previousState === 'inactive';
            const isBackgrounded = nextState === 'background' || nextState === 'inactive';

            if (!wasBackgrounded && isBackgrounded && auth.currentUser) {
                clearBackgroundTimeout();
                const backgroundedAt = Date.now();
                const userId = auth.currentUser.uid;
                await AsyncStorage.multiSet([
                    [BACKGROUND_TIMESTAMP_KEY, String(backgroundedAt)],
                    [BACKGROUND_USER_ID_KEY, userId],
                ]);
                timeoutRef.current = setTimeout(async () => {
                    if (auth.currentUser?.uid === userId) {
                        await signOut(auth);
                    }
                    await clearStoredBackground();
                    timeoutRef.current = null;
                }, BACKGROUND_SIGN_OUT_MS);
            } else if (wasBackgrounded && nextState === 'active') {
                clearBackgroundTimeout();
                const [timestampEntry, userIdEntry] = await AsyncStorage.multiGet([BACKGROUND_TIMESTAMP_KEY, BACKGROUND_USER_ID_KEY]);
                const backgroundedAt = Number(timestampEntry?.[1]);
                if (backgroundedAt && auth.currentUser?.uid === userIdEntry?.[1] && Date.now() - backgroundedAt >= BACKGROUND_SIGN_OUT_MS) {
                    await signOut(auth);
                }
                await clearStoredBackground();
            }

            previousState = nextState;
        });

        return () => {
            isMounted = false;
            clearBackgroundTimeout();
            appStateSubscription.remove();
            unsubscribe();
        };
    }, []);

    async function refreshUser() {
        try {
            setIsLoadingUser(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } finally {
            setIsLoadingUser(false);
        }
    }

    function updateUser(updates) {
        setUser((currentUser) => {
            if (!currentUser) return currentUser;
            return { ...currentUser, ...updates };
        });
    }

    return (
        <UserContext.Provider value={{ user, isLoadingUser, setUser, updateUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used inside UserProvider');
    return context;
}

