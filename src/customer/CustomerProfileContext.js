import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { useUser } from '../users/UserContext';
import { getCustomerProfileData } from './customerProfileService';

const CustomerProfileContext = createContext(undefined);
const emptyProfileState = {
    customerId: null,
    data: null,
    isLoading: false,
    error: null,
};

async function loadCustomerProfileData(customerId) {
    const data = await getCustomerProfileData(customerId);
    if (
        !data
        || typeof data !== 'object'
        || Array.isArray(data)
        || !Array.isArray(data.quickActions)
        || !Array.isArray(data.settings)
        || !Array.isArray(data.recentActivity)
    ) {
        throw new Error('The customer profile service returned an invalid response.');
    }
    return data;
}

export function CustomerProfileProvider({ children }) {
    const { user, isLoadingUser } = useUser();
    const customerId = user?.role === 'customer'
        && typeof user.id === 'string'
        && user.id.trim()
        ? user.id
        : null;
    const currentScopeRef = useRef({ customerId, isLoadingUser });
    useLayoutEffect(() => {
        currentScopeRef.current = { customerId, isLoadingUser };
    }, [customerId, isLoadingUser]);
    const requestVersionRef = useRef(0);
    const [profileState, setProfileState] = useState(emptyProfileState);

    const refreshProfileData = useCallback(async () => {
        const requestVersion = ++requestVersionRef.current;
        const isCurrentRequest = () => requestVersion === requestVersionRef.current
            && currentScopeRef.current.customerId === customerId
            && currentScopeRef.current.isLoadingUser === false;

        if (isLoadingUser || !customerId) {
            setProfileState({ ...emptyProfileState });
            return false;
        }

        setProfileState({ customerId, data: null, isLoading: true, error: null });
        try {
            const data = await loadCustomerProfileData(customerId);
            if (!isCurrentRequest()) return false;
            setProfileState({ customerId, data, isLoading: false, error: null });
            return true;
        } catch (error) {
            if (!isCurrentRequest()) return false;
            setProfileState({
                customerId,
                data: null,
                isLoading: false,
                error: error instanceof Error
                    ? error.message
                    : 'Unable to load profile information.',
            });
            return false;
        }
    }, [customerId, isLoadingUser]);

    useEffect(() => {
        const requestVersion = ++requestVersionRef.current;
        const isCurrentRequest = () => requestVersion === requestVersionRef.current
            && currentScopeRef.current.customerId === customerId
            && currentScopeRef.current.isLoadingUser === false;

        if (!isLoadingUser && customerId) {
            loadCustomerProfileData(customerId).then((data) => {
                if (isCurrentRequest()) {
                    setProfileState({ customerId, data, isLoading: false, error: null });
                }
            }).catch((error) => {
                if (!isCurrentRequest()) return;
                setProfileState({
                    customerId,
                    data: null,
                    isLoading: false,
                    error: error instanceof Error
                        ? error.message
                        : 'Unable to load profile information.',
                });
            });
        }

        return () => {
            requestVersionRef.current += 1;
        };
    }, [customerId, isLoadingUser]);

    const isCurrentAccount = !isLoadingUser
        && customerId !== null
        && profileState.customerId === customerId;
    const value = {
        profileData: isCurrentAccount ? profileState.data : null,
        isLoadingProfile: isCurrentAccount
            ? profileState.isLoading
            : !isLoadingUser && customerId !== null,
        profileError: isCurrentAccount ? profileState.error : null,
        refreshProfileData,
    };

    return (
        <CustomerProfileContext.Provider value={value}>
            {children}
        </CustomerProfileContext.Provider>
    );
}

export function useCustomerProfile() {
    const context = useContext(CustomerProfileContext);
    if (!context) {
        throw new Error('useCustomerProfile must be used inside CustomerProfileProvider');
    }
    return context;
}
