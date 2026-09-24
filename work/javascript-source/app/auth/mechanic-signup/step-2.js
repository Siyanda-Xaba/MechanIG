import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext';
import StableScrollView from '../../../src/components/StableScrollView';
import { CYAN, DropdownRow, FieldRow, MUTED, SignUpFooter, SignUpHeader, styles, UploadRow, } from '../../../src/auth/mechanic/MechanicSignUpShared';
const SPECIALISATIONS = [
    'General Mechanic',
    'Auto Electrical',
    'Engine Repair',
    'Brakes & Suspension',
    'Vehicle Diagnostics',
    'Transmission Repair',
    'Air Conditioning',
];
const VEHICLE_BRANDS = [
    'Toyota',
    'Volkswagen',
    'Ford',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Nissan',
    'Hyundai',
    'Kia',
    'Honda',
];
export default function MechanicSignUpStep2() {
    const router = useRouter();
    const { step2Data, updateStep2Field, } = useMechanicSignUp();
    const [specialisationOpen, setSpecialisationOpen,] = useState(false);
    const [vehicleBrandsOpen, setVehicleBrandsOpen,] = useState(false);
    function toggleVehicleBrand(brand) {
        const currentBrands = step2Data.vehicleBrands;
        if (currentBrands.includes(brand)) {
            updateStep2Field('vehicleBrands', currentBrands.filter((item) => item !== brand));
            return;
        }
        updateStep2Field('vehicleBrands', [...currentBrands, brand]);
    }
    function handleDocumentUpload(documentName) {
        Alert.alert('Document upload unavailable', `${documentName} upload will be connected to the mechanic verification backend later.`);
    }
    function handleContinue() {
        const requiredFields = [
            step2Data.workshopLocation,
            step2Data.serviceRadius,
            step2Data.yearsExperience,
            step2Data.qualifications,
            step2Data.specialisation,
            step2Data.licenseNumber,
            step2Data.registrationNumber,
        ];
        const hasMissingFields = requiredFields.some((value) => !value.trim());
        if (hasMissingFields) {
            Alert.alert('Professional details required', 'Please complete all professional and workshop details before continuing.');
            return;
        }
        if (step2Data.vehicleBrands.length ===
            0) {
            Alert.alert('Vehicle brands required', 'Please select at least one vehicle brand that you support.');
            return;
        }
        router.push('/auth/mechanic-signup/step-3');
    }
    return (_jsx(SafeAreaView, { style: styles.container, children: _jsx(KeyboardAvoidingView, { style: styles.flex, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { contentContainerStyle: styles.scrollContent, keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false, children: [_jsx(SignUpHeader, { step: 2, onBack: () => router.back() }), _jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "construct-outline", size: 18, color: CYAN }), _jsx(Text, { style: styles.sectionTitle, children: "PROFESSIONAL DETAILS" })] }), _jsx(Text, { style: styles.sectionSubtitle, children: "Tell us about your workshop, experience and services." }), _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "location-outline", size: 18, color: MUTED }), label: "Workshop Location", placeholder: "Enter your workshop location", value: step2Data.workshopLocation, onChangeText: (value) => updateStep2Field('workshopLocation', value) }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "locate-outline", size: 18, color: MUTED }), label: "Service Area / Radius", placeholder: "e.g. 25 km", value: step2Data.serviceRadius, onChangeText: (value) => updateStep2Field('serviceRadius', value) }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "calendar-outline", size: 18, color: MUTED }), label: "Years of Experience", placeholder: "Enter years", keyboardType: "number-pad", value: step2Data.yearsExperience, onChangeText: (value) => updateStep2Field('yearsExperience', value) }) })] }), _jsx(FieldRow, { icon: _jsx(Ionicons, { name: "school-outline", size: 18, color: MUTED }), label: "Qualifications / Certifications", placeholder: "Enter your qualifications and certifications", value: step2Data.qualifications, onChangeText: (value) => updateStep2Field('qualifications', value) }), _jsx(DropdownRow, { icon: _jsx(Ionicons, { name: "construct-outline", size: 18, color: MUTED }), label: "Specialisation", placeholder: "Select your specialisation", value: step2Data.specialisation, onPress: () => setSpecialisationOpen(true) }), _jsx(Modal, { visible: specialisationOpen, transparent: true, animationType: "fade", onRequestClose: () => setSpecialisationOpen(false), children: _jsx(Pressable, { style: styles.modalOverlay, onPress: () => setSpecialisationOpen(false), children: _jsxs(Pressable, { style: styles.dropdownModal, onPress: () => { }, children: [_jsx(Text, { style: styles.modalTitle, children: "Select Specialisation" }), SPECIALISATIONS.map((specialisation) => (_jsxs(TouchableOpacity, { style: styles.dropdownOption, activeOpacity: 0.8, onPress: () => {
                                                    updateStep2Field('specialisation', specialisation);
                                                    setSpecialisationOpen(false);
                                                }, children: [_jsx(Text, { style: styles.dropdownOptionText, children: specialisation }), step2Data.specialisation ===
                                                        specialisation && (_jsx(Ionicons, { name: "checkmark-circle", size: 21, color: CYAN }))] }, specialisation)))] }) }) }), _jsx(DropdownRow, { icon: _jsx(Ionicons, { name: "car-outline", size: 18, color: MUTED }), label: "Vehicle Brands Supported", placeholder: "Select vehicle brands", value: step2Data.vehicleBrands
                                    .length > 0
                                    ? step2Data.vehicleBrands.join(', ')
                                    : '', onPress: () => setVehicleBrandsOpen(true) }), _jsx(Modal, { visible: vehicleBrandsOpen, transparent: true, animationType: "fade", onRequestClose: () => setVehicleBrandsOpen(false), children: _jsx(Pressable, { style: styles.modalOverlay, onPress: () => setVehicleBrandsOpen(false), children: _jsxs(Pressable, { style: styles.dropdownModal, onPress: () => { }, children: [_jsx(Text, { style: styles.modalTitle, children: "Select Vehicle Brands" }), _jsx(Text, { style: styles.modalSubtext, children: "Select all brands your workshop supports" }), VEHICLE_BRANDS.map((brand) => {
                                                const selected = step2Data.vehicleBrands.includes(brand);
                                                return (_jsxs(TouchableOpacity, { style: styles.dropdownOption, onPress: () => toggleVehicleBrand(brand), activeOpacity: 0.8, children: [_jsx(Text, { style: styles.dropdownOptionText, children: brand }), selected && (_jsx(Ionicons, { name: "checkmark-circle", size: 22, color: CYAN }))] }, brand));
                                            }), _jsx(TouchableOpacity, { style: styles.modalDoneButton, onPress: () => setVehicleBrandsOpen(false), activeOpacity: 0.85, children: _jsx(Text, { style: styles.modalDoneText, children: "Done" }) })] }) }) }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(MaterialCommunityIcons, { name: "card-account-details-outline", size: 18, color: MUTED }), label: "Trade Test / License Number", placeholder: "Enter license number", value: step2Data.licenseNumber, onChangeText: (value) => updateStep2Field('licenseNumber', value) }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(FieldRow, { icon: _jsx(MaterialCommunityIcons, { name: "card-account-details-outline", size: 18, color: MUTED }), label: "Business Registration Number", placeholder: "Enter registration number", value: step2Data.registrationNumber, onChangeText: (value) => updateStep2Field('registrationNumber', value) }) })] })] }), _jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "shield-checkmark-outline", size: 18, color: CYAN }), _jsx(Text, { style: styles.sectionTitle, children: "VERIFICATION DOCUMENTS" })] }), _jsx(Text, { style: styles.sectionSubtitle, children: "Upload verification documents for your mechanic profile." }), _jsx(UploadRow, { label: "Upload ID Document", onPress: () => handleDocumentUpload('ID document') }), _jsx(UploadRow, { label: "Upload Trade Certificate", onPress: () => handleDocumentUpload('Trade certificate') }), _jsx(UploadRow, { label: "Upload Workshop Registration / Proof of Business", onPress: () => handleDocumentUpload('Workshop registration / proof of business') })] }), _jsxs(View, { style: styles.row, children: [_jsx(TouchableOpacity, { style: styles.backOutlineButton, activeOpacity: 0.85, onPress: () => router.back(), children: _jsx(Text, { style: styles.backOutlineText, children: "Back" }) }), _jsx(View, { style: { width: 10 } }), _jsx(TouchableOpacity, { style: styles.continueButton, activeOpacity: 0.85, onPress: handleContinue, children: _jsx(Text, { style: styles.continueText, children: "Continue" }) })] }), _jsx(SignUpFooter, { onSignIn: () => {
                            router.replace('/auth/login');
                        } })] }) }) }));
}
