import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import { auth, database } from '../firebase/firebase';
import { getCurrentUser, readUserProfile } from './userService';

const UserContext = createContext(undefined);

export function UserProvider({ children, }) {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    useEffect(() => {
        let profileStatusUnsubscribe = () => {};
        let revision = 0;
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            const currentRevision = ++revision;
            profileStatusUnsubscribe();
            profileStatusUnsubscribe = () => {};
            try {
                setIsLoadingUser(true);
                if (!firebaseUser) {
                    setUser(null);
                    return;
                }
                const profile = await readUserProfile(firebaseUser);
                if (currentRevision !== revision || auth.currentUser?.uid !== firebaseUser.uid) return;
                const accountStatus = String(profile?.accountStatus || '').trim().toLowerCase();
                if (['deleted', 'suspended', 'disabled'].includes(accountStatus)) {
                    setUser(null);
                    await signOut(auth);
                    return;
                }
                setUser(profile);
                if (profile?.role !== 'superadmin') {
                    const table = profile?.role === 'mechanic' ? 'mechanics' : 'users';
                    profileStatusUnsubscribe = onValue(
                        ref(database, `${table}/${firebaseUser.uid}/accountStatus`),
                        (snapshot) => {
                            const status = String(snapshot.val() || '').trim().toLowerCase();
                            if (['deleted', 'suspended', 'disabled'].includes(status)
                                && auth.currentUser?.uid === firebaseUser.uid) {
                                setUser(null);
                                void signOut(auth);
                            }
                        },
                        () => {},
                    );
                }
            }
            finally {
                if (currentRevision === revision) setIsLoadingUser(false);
            }
        });
        return () => {
            revision += 1;
            profileStatusUnsubscribe();
            unsubscribe();
        };
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
