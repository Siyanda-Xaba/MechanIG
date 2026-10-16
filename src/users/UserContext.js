import { jsx as _jsx } from 'react/jsx-runtime';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import NetInfo from '@react-native-community/netinfo';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase/firebase';
import { readUserProfile } from './userService';

import {
    loadOfflineAccountRole,
    saveOfflineAccountRole,
} from '../offline/offlineAccountCache';

const UserContext = createContext(undefined);

const PROFILE_TIMEOUT_MS = 6000;

const SUPPORTED_ROLES = [
    'customer',
    'mechanic',
];

function isSupportedRole(role) {
    return SUPPORTED_ROLES.includes(role);
}

function readProfileWithTimeout(firebaseUser) {
    let timeoutId;

    const timeout = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            const error = new Error(
                'Profile retrieval timed out.'
            );

            error.code = 'PROFILE_TIMEOUT';

            reject(error);
        }, PROFILE_TIMEOUT_MS);
    });

    return Promise.race([
        readUserProfile(firebaseUser),
        timeout,
    ]).finally(() => {
        clearTimeout(timeoutId);
    });
}

async function canUseOfflineFallback(error) {
    if (error?.code === 'PROFILE_TIMEOUT') {
        return true;
    }

    try {
        const network = await NetInfo.fetch();

        return (
            network.isConnected === false ||
            network.isInternetReachable === false
        );
    } catch {
        return false;
    }
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const [
        isLoadingUser,
        setIsLoadingUser,
    ] = useState(true);

    const [
        isOfflineProfile,
        setIsOfflineProfile,
    ] = useState(false);

    const [
        userError,
        setUserError,
    ] = useState(null);

    const requestVersionRef = useRef(0);

    const restoreUser = useCallback(
        async (firebaseUser, requestVersion) => {
            const isCurrentRequest = () =>
                requestVersion ===
                    requestVersionRef.current &&
                (
                    firebaseUser
                        ? auth.currentUser?.uid ===
                          firebaseUser.uid
                        : !auth.currentUser
                );

            if (!firebaseUser) {
                if (isCurrentRequest()) {
                    setUser(null);
                    setIsOfflineProfile(false);
                    setUserError(null);
                    setIsLoadingUser(false);
                }

                return;
            }

            /*
             * Email verification is mandatory.
             *
             * A Firebase session alone does not
             * grant access to MechanIQ dashboards.
             *
             * This also prevents a newly created
             * account from gaining access during
             * Firebase's temporary sign-in state.
             */
            if (!firebaseUser.emailVerified) {
                if (isCurrentRequest()) {
                    setUser(null);

                    setIsOfflineProfile(false);

                    setUserError(
                        'Please verify your email address before signing in.'
                    );

                    setIsLoadingUser(false);
                }

                return;
            }

            try {
                const profile =
                    await readProfileWithTimeout(
                        firebaseUser
                    );

                if (!isCurrentRequest()) {
                    return;
                }

                /*
                 * Accept only a profile belonging
                 * to the authenticated Firebase UID
                 * with a supported MechanIQ role.
                 */
                if (
                    !profile ||
                    profile.id !== firebaseUser.uid ||
                    !isSupportedRole(profile.role)
                ) {
                    setUser(null);

                    setIsOfflineProfile(false);

                    setUserError(
                        'Your MechanIQ account profile is unavailable or invalid.'
                    );

                    return;
                }

                setUser({
                    ...profile,
                    emailVerified: true,
                });

                setIsOfflineProfile(false);

                setUserError(null);

                /*
                 * Only verified accounts can
                 * update the offline role cache.
                 *
                 * Cache failure must never
                 * interrupt a successful login.
                 */
                void saveOfflineAccountRole(
                    profile
                ).catch(() => {});
            } catch (error) {
                if (!isCurrentRequest()) {
                    return;
                }

                const allowOfflineFallback =
                    await canUseOfflineFallback(
                        error
                    );

                if (!isCurrentRequest()) {
                    return;
                }

                /*
                 * An offline account can only
                 * be restored if Firebase's
                 * persisted session indicates
                 * that its email was verified.
                 */
                if (
                    allowOfflineFallback &&
                    auth.currentUser?.emailVerified
                ) {
                    try {
                        const cachedAccount =
                            await loadOfflineAccountRole();

                        if (!isCurrentRequest()) {
                            return;
                        }

                        if (
                            cachedAccount?.uid ===
                                firebaseUser.uid &&
                            isSupportedRole(
                                cachedAccount.role
                            ) &&
                            auth.currentUser?.emailVerified
                        ) {
                            setUser({
                                id: cachedAccount.uid,
                                role: cachedAccount.role,
                                emailVerified: true,
                            });

                            setIsOfflineProfile(true);

                            setUserError(
                                'Offline mode: using your previously verified account role.'
                            );

                            return;
                        }
                    } catch {
                        // Continue to the unavailable state.
                    }
                }

                if (isCurrentRequest()) {
                    setUser(null);

                    setIsOfflineProfile(false);

                    setUserError(
                        'Your account profile could not be loaded.'
                    );
                }
            } finally {
                if (isCurrentRequest()) {
                    setIsLoadingUser(false);
                }
            }
        },
        []
    );

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (firebaseUser) => {
                const requestVersion =
                    ++requestVersionRef.current;

                /*
                 * Immediately clear the previous
                 * profile when Firebase reports
                 * an authentication change.
                 *
                 * This avoids displaying a previous
                 * user's dashboard while the next
                 * account is being checked.
                 */
                setUser(null);

                setIsOfflineProfile(false);

                setUserError(null);

                setIsLoadingUser(true);

                void restoreUser(
                    firebaseUser,
                    requestVersion
                );
            }
        );

        return () => {
            ++requestVersionRef.current;

            unsubscribe();
        };
    }, [restoreUser]);

    const refreshUser = useCallback(async () => {
        const requestVersion =
            ++requestVersionRef.current;

        setIsLoadingUser(true);

        await restoreUser(
            auth.currentUser,
            requestVersion
        );
    }, [restoreUser]);

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

    return _jsx(UserContext.Provider, {
        value: {
            user,
            isLoadingUser,
            isOfflineProfile,
            userError,
            setUser,
            updateUser,
            refreshUser,
        },
        children,
    });
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            'useUser must be used inside UserProvider'
        );
    }

    return context;
}