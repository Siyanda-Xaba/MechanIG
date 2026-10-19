import { jsx as _jsx } from 'react/jsx-runtime';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useUser } from '../users/UserContext';

import {
    getCustomerProfileData,
} from './customerProfileService';

const CustomerProfileContext = createContext(undefined);

export function CustomerProfileProvider({ children }) {
    const { user } = useUser();

    const userId = user?.id ?? null;

    /*
     * Track the current account independently
     * of asynchronous profile requests.
     */
    const currentUserIdRef = useRef(userId);

    currentUserIdRef.current = userId;

    /*
     * Each request receives a unique version.
     * Outdated requests must not update the context.
     */
    const requestVersionRef = useRef(0);

    /*
     * Store the account ID alongside its profile
     * information to prevent cross-account display.
     */
    const [profileState, setProfileState] = useState({
        userId: null,
        data: null,
        error: null,
        isLoading: false,
    });

    const refreshProfileData = useCallback(async () => {
        const requestVersion = ++requestVersionRef.current;

        /*
         * Clear profile information when there
         * is no authenticated customer.
         */
        if (!userId) {
            setProfileState({
                userId: null,
                data: null,
                error: null,
                isLoading: false,
            });

            return;
        }

        /*
         * Clear previous account information while
         * loading the current customer's profile.
         */
        setProfileState({
            userId,
            data: null,
            error: null,
            isLoading: true,
        });

        try {
            const data = await getCustomerProfileData(userId);

            /*
             * Ignore outdated responses or results
             * belonging to a different account.
             */
            if (
                requestVersion !== requestVersionRef.current ||
                currentUserIdRef.current !== userId
            ) {
                return;
            }

            setProfileState({
                userId,
                data,
                error: null,
                isLoading: false,
            });
        } catch {
            if (
                requestVersion !== requestVersionRef.current ||
                currentUserIdRef.current !== userId
            ) {
                return;
            }

            setProfileState({
                userId,
                data: null,
                error: 'Unable to load profile information.',
                isLoading: false,
            });
        }
    }, [userId]);

    useEffect(() => {
        refreshProfileData();

        /*
         * Invalidate requests when the account
         * changes or the provider unmounts.
         */
        return () => {
            requestVersionRef.current += 1;
        };
    }, [refreshProfileData]);

    /*
     * Never expose profile information belonging
     * to a previously authenticated account.
     */
    const visibleProfileState =
        profileState.userId === userId
            ? profileState
            : {
                userId,
                data: null,
                error: null,
                isLoading: Boolean(userId),
            };

    return _jsx(CustomerProfileContext.Provider, {
        value: {
            profileData: visibleProfileState.data,
            isLoadingProfile: visibleProfileState.isLoading,
            profileError: visibleProfileState.error,
            refreshProfileData,
        },
        children,
    });
}

export function useCustomerProfile() {
    const context = useContext(CustomerProfileContext);

    if (!context) {
        throw new Error(
            'useCustomerProfile must be used inside CustomerProfileProvider'
        );
    }

    return context;
}