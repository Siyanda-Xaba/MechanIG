import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useState, } from 'react';
import { useUser } from '../users/UserContext';
import { getCustomerProfileData } from './customerProfileService';
const CustomerProfileContext = createContext(undefined);
export function CustomerProfileProvider({ children, }) {
    const { user } = useUser();
    const [profileData, setProfileData] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const refreshProfileData = useCallback(async () => {
        if (!user) {
            setProfileData(null);
            setProfileError(null);
            return;
        }
        try {
            setIsLoadingProfile(true);
            setProfileError(null);
            const data = await getCustomerProfileData(user.id);
            setProfileData(data);
        }
        catch {
            setProfileData(null);
            setProfileError('Unable to load profile information.');
        }
        finally {
            setIsLoadingProfile(false);
        }
    }, [user]);
    useEffect(() => {
        refreshProfileData();
    }, [refreshProfileData]);
    return (_jsx(CustomerProfileContext.Provider, { value: {
            profileData,
            isLoadingProfile,
            profileError,
            refreshProfileData,
        }, children: children }));
}
export function useCustomerProfile() {
    const context = useContext(CustomerProfileContext);
    if (!context) {
        throw new Error('useCustomerProfile must be used inside CustomerProfileProvider');
    }
    return context;
}
