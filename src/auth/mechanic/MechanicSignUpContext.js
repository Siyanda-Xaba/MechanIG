import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { previewMechanicUsername } from './mechanicUsernameService';

const initialStep1Data = {
    fullName: '',
    email: '', // Communication email
    phone: '',
    idNumber: '',
    businessName: '',
    businessType: '',
    yearsInBusiness: '',
    employees: '',
    address: '',
    city: '',
    province: '',
};

const initialStep2Data = {
    workshopLocation: '',
    serviceRadius: '',
    yearsExperience: '',
    qualifications: '',
    specialisation: '',
    vehicleBrands: [],
    licenseNumber: '',
    registrationNumber: '',
    idDocument: null,
    tradeCertificate: null,
    workshopRegistration: null,
};

const MechanicSignUpContext = createContext(null);

export function MechanicSignUpProvider({ children }) {
    const [step1Data, setStep1Data] = useState(initialStep1Data);
    const [step2Data, setStep2Data] = useState(initialStep2Data);

    const previewUsername = useMemo(() => {
        return step1Data.fullName.trim()
            ? previewMechanicUsername(step1Data.fullName)
            : 'e.g. mike@mechanic';
    }, [step1Data.fullName]);

    const updateStep1Field = useCallback((key, value) => {
        setStep1Data((current) => ({
            ...current,
            [key]: value,
        }));
    }, []);

    const updateStep2Field = useCallback((key, value) => {
        setStep2Data((current) => ({
            ...current,
            [key]: value,
        }));
    }, []);

    const resetMechanicSignUp = useCallback(() => {
        setStep1Data(initialStep1Data);
        setStep2Data(initialStep2Data);
    }, []);

    const value = useMemo(() => ({
        step1Data,
        step2Data,
        previewUsername,
        updateStep1Field,
        updateStep2Field,
        resetMechanicSignUp,
    }), [
        resetMechanicSignUp,
        step1Data,
        step2Data,
        previewUsername,
        updateStep1Field,
        updateStep2Field,
    ]);

    return (_jsx(MechanicSignUpContext.Provider, { value: value, children: children }));
}

export function useMechanicSignUp() {
    const context = useContext(MechanicSignUpContext);
    if (!context) {
        throw new Error('useMechanicSignUp must be used within a MechanicSignUpProvider');
    }
    return context;
}
