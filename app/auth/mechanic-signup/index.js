import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext';
import StableScrollView from '../../../src/components/StableScrollView';
import { CYAN, DropdownRow, FieldRow, MUTED, SignUpFooter, SignUpHeader, styles, } from '../../../src/auth/mechanic/MechanicSignUpShared';
const BUSINESS_TYPES = [
    'Independent Workshop',
    'Dealership',
    'Mobile Mechanic',
    'Auto Repair Centre',
    'Fleet Workshop',
    'Specialised Auto Workshop',
];
const PROVINCES = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Limpopo',
    'Mpumalanga',
    'Free State',
    'North West',
    'Northern Cape',
];
export default function MechanicSignUpStep1() {
    const router = useRouter();
    const { step1Data, updateStep1Field, } = useMechanicSignUp();
    const [businessTypeOpen, setBusinessTypeOpen,] = useState(false);
    const [provinceOpen, setProvinceOpen,] = useState(false);
    function handleContinue() {
        const requiredFields = [
            step1Data.fullName,
            step1Data.email,
            step1Data.phone,
            step1Data.idNumber,
            step1Data.businessName,
            step1Data.businessType,
            step1Data.yearsInBusiness,
            step1Data.employees,
            step1Data.address,
            step1Data.city,
            step1Data.province,
        ];
        const hasMissingFields = requiredFields.some((value) => !value.trim());
        if (hasMissingFields) {
            Alert.alert('Details required', 'Please complete all personal and business details before continuing.');
            return;
        }
        const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1Data.email.trim());
        if (!emailIsValid) {
            Alert.alert('Invalid email', 'Please enter a valid email address before continuing.');
            return;
        }
        router.push('/auth/mechanic-signup/step-2');
    }
    return (_jsx(SafeAreaView, { style: styles.container, children: _jsx(KeyboardAvoidingView, { style: styles.flex, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { contentContainerStyle: styles.scrollContent, keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false, children: [_jsx(SignUpHeader, { step: 1, onBack: () => router.dismissTo('/welcome') }), _jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "person-outline", size: 18, color: CYAN }), _jsx(Text, { style: styles.sectionTitle, children: "PERSONAL DETAILS" })] }), _jsx(Text, { style: styles.sectionSubtitle, children: "Enter your personal information." }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "person-outline", size: 18, color: MUTED }), label: "Full Name", placeholder: "Enter your full name", value: step1Data.fullName, onChangeText: (value) => updateStep1Field('fullName', value) }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "mail-outline", size: 18, color: MUTED }), label: "Email Address", placeholder: "Enter your email", keyboardType: "email-address", value: step1Data.email, onChangeText: (value) => updateStep1Field('email', value) }) })] }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "call-outline", size: 18, color: MUTED }), label: "Phone Number", placeholder: "+27  Enter your number", keyboardType: "phone-pad", value: step1Data.phone, onChangeText: (value) => updateStep1Field('phone', value) }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(MaterialCommunityIcons, { name: "card-account-details-outline", size: 18, color: MUTED }), label: "ID Number / Passport", placeholder: "Enter ID or passport", value: step1Data.idNumber, onChangeText: (value) => updateStep1Field('idNumber', value) }) })] })] }), _jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "storefront-outline", size: 18, color: CYAN }), _jsx(Text, { style: styles.sectionTitle, children: "BUSINESS DETAILS" })] }), _jsx(Text, { style: styles.sectionSubtitle, children: "Tell us about your workshop or mechanic business." }), _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "storefront-outline", size: 18, color: MUTED }), label: "Workshop / Business Name", placeholder: "Enter your workshop or business name", value: step1Data.businessName, onChangeText: (value) => updateStep1Field('businessName', value) }), _jsx(DropdownRow, { icon: _jsx(Ionicons, { name: "briefcase-outline", size: 18, color: MUTED }), label: "Business Type", placeholder: "Select your business type", value: step1Data.businessType, onPress: () => setBusinessTypeOpen(true) }), _jsx(Modal, { visible: businessTypeOpen, transparent: true, animationType: "fade", onRequestClose: () => setBusinessTypeOpen(false), children: _jsx(Pressable, { style: styles.modalOverlay, onPress: () => setBusinessTypeOpen(false), children: _jsxs(Pressable, { style: styles.dropdownModal, onPress: () => { }, children: [_jsx(Text, { style: styles.modalTitle, children: "Select Business Type" }), BUSINESS_TYPES.map((businessType) => (_jsxs(TouchableOpacity, { style: styles.dropdownOption, onPress: () => {
                                                    updateStep1Field('businessType', businessType);
                                                    setBusinessTypeOpen(false);
                                                }, activeOpacity: 0.8, children: [_jsx(Text, { style: styles.dropdownOptionText, children: businessType }), step1Data.businessType ===
                                                        businessType && (_jsx(Ionicons, { name: "checkmark-circle", size: 21, color: CYAN }))] }, businessType)))] }) }) }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "calendar-outline", size: 18, color: MUTED }), label: "Years in Business", placeholder: "Enter years", keyboardType: "number-pad", value: step1Data.yearsInBusiness, onChangeText: (value) => updateStep1Field('yearsInBusiness', value) }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "people-outline", size: 18, color: MUTED }), label: "Employees", placeholder: "Enter number", keyboardType: "number-pad", value: step1Data.employees, onChangeText: (value) => updateStep1Field('employees', value) }) })] }), _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "location-outline", size: 18, color: MUTED }), label: "Street Address", placeholder: "Enter your street address", value: step1Data.address, onChangeText: (value) => updateStep1Field('address', value) }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "business-outline", size: 18, color: MUTED }), label: "City", placeholder: "Enter your city", value: step1Data.city, onChangeText: (value) => updateStep1Field('city', value) }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(DropdownRow, { icon: _jsx(Ionicons, { name: "map-outline", size: 18, color: MUTED }), label: "Province", placeholder: "Select province", value: step1Data.province, onPress: () => setProvinceOpen(true) }) })] }), _jsx(Modal, { visible: provinceOpen, transparent: true, animationType: "fade", onRequestClose: () => setProvinceOpen(false), children: _jsx(Pressable, { style: styles.modalOverlay, onPress: () => setProvinceOpen(false), children: _jsxs(Pressable, { style: styles.dropdownModal, onPress: () => { }, children: [_jsx(Text, { style: styles.modalTitle, children: "Select Province" }), PROVINCES.map((province) => (_jsxs(TouchableOpacity, { style: styles.dropdownOption, onPress: () => {
                                                    updateStep1Field('province', province);
                                                    setProvinceOpen(false);
                                                }, activeOpacity: 0.8, children: [_jsx(Text, { style: styles.dropdownOptionText, children: province }), step1Data.province ===
                                                        province && (_jsx(Ionicons, { name: "checkmark-circle", size: 21, color: CYAN }))] }, province)))] }) }) })] }), _jsx(TouchableOpacity, { style: styles.continueButton, activeOpacity: 0.85, onPress: handleContinue, children: _jsx(Text, { style: styles.continueText, children: "Continue" }) }), _jsx(SignUpFooter, { onSignIn: () => {
                            router.replace('/auth/login');
                        } })] }) }) }));
}
