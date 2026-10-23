import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { getCurrentUser, readUserProfile } from './userService';

const UserContext = createContext(undefined);

export function UserProvider({ children, }) {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                setIsLoadingUser(true);
                setUser(firebaseUser
                    ? await readUserProfile(firebaseUser)
                    : null);
            }
            finally {
                setIsLoadingUser(false);
            }
        });
        return unsubscribe;
    }, []);
    async function refreshUser() {
        try {
            setIsLoadingUser(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        }
        finally {
            setIsLoadingUser(false);
        }
    }
    function updateUser(updates) {
        setUser((currentUser) => {
            if (!currentUser) {
                return currentUser;
            }
            return {
                ...currentUser,
                ...updates,
            };
        });
    }
    return (_jsx(UserContext.Provider, { value: {
            user,
            isLoadingUser,
            setUser,
            updateUser,
            refreshUser,
            isOfflineProfile: false,
            userError: null,
        }, children: children }));
}
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used inside UserProvider');
    }
    return context;
}
