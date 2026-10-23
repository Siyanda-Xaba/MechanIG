import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext';
import StableScrollView from '../../../src/components/StableScrollView';
import {
    CYAN,
    DropdownRow,
    FieldRow,
    MUTED,
    SignUpFooter,
    SignUpHeader,
    styles,
} from '../../../src/auth/mechanic/MechanicSignUpShared';

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
    const { step1Data, previewUsername, updateStep1Field } = useMechanicSignUp();
    const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
    const [provinceOpen, setProvinceOpen] = useState(false);

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
            Alert.alert('Invalid communication email', 'Please enter a valid email address for customer and system communications.');
            return;
        }
        router.push('/auth/mechanic-signup/step-2');
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <StableScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <SignUpHeader step={1} onBack={() => router.dismissTo('/welcome')} />
                    
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="person-outline" size={18} color={CYAN} />
                            <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
                        </View>
                        <Text style={styles.sectionSubtitle}>
                            Enter your personal information and contact details.
                        </Text>
                        
                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<Ionicons name="person-outline" size={18} color={MUTED} />}
                                    label="Full Name"
                                    placeholder="Enter your name"
                                    value={step1Data.fullName}
                                    onChangeText={(value) => updateStep1Field('fullName', value)}
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<Ionicons name="mail-outline" size={18} color={MUTED} />}
                                    label="Email (Communication)"
                                    placeholder="e.g. name@example.com"
                                    keyboardType="email-address"
                                    value={step1Data.email}
                                    onChangeText={(value) => updateStep1Field('email', value)}
                                />
                            </View>
                        </View>

                        {/* Generated Username Live Preview Box */}
                        <View style={localStyles.usernamePreviewCard}>
                            <View style={localStyles.usernameHeader}>
                                <Ionicons name="at-circle-outline" size={20} color={CYAN} />
                                <Text style={localStyles.usernameLabel}>GENERATED LOGIN USERNAME</Text>
                            </View>
                            <Text style={localStyles.usernameValue}>{previewUsername}</Text>
                            <Text style={localStyles.usernameNote}>
                                When logging in, you will use this username. Your email above is kept for communications and customer requests.
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<Ionicons name="call-outline" size={18} color={MUTED} />}
                                    label="Phone Number"
                                    placeholder="+27  Enter your number"
                                    keyboardType="phone-pad"
                                    value={step1Data.phone}
                                    onChangeText={(value) => updateStep1Field('phone', value)}
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<MaterialCommunityIcons name="card-account-details-outline" size={18} color={MUTED} />}
                                    label="ID Number / Passport"
                                    placeholder="Enter ID or passport"
                                    value={step1Data.idNumber}
                                    onChangeText={(value) => updateStep1Field('idNumber', value)}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="storefront-outline" size={18} color={CYAN} />
                            <Text style={styles.sectionTitle}>BUSINESS DETAILS</Text>
                        </View>
                        <Text style={styles.sectionSubtitle}>
                            Tell us about your workshop or mechanic business.
                        </Text>
                        
                        <FieldRow
                            icon={<Ionicons name="storefront-outline" size={18} color={MUTED} />}
                            label="Workshop / Business Name"
                            placeholder="Enter your workshop or business name"
                            value={step1Data.businessName}
                            onChangeText={(value) => updateStep1Field('businessName', value)}
                        />
                        
                        <DropdownRow
                            icon={<Ionicons name="briefcase-outline" size={18} color={MUTED} />}
                            label="Business Type"
                            placeholder="Select your business type"
                            value={step1Data.businessType}
                            onPress={() => setBusinessTypeOpen(true)}
                        />
                        
                        <Modal
                            visible={businessTypeOpen}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setBusinessTypeOpen(false)}
                        >
                            <Pressable style={styles.modalOverlay} onPress={() => setBusinessTypeOpen(false)}>
                                <Pressable style={styles.dropdownModal} onPress={() => {}}>
                                    <Text style={styles.modalTitle}>Select Business Type</Text>
                                    {BUSINESS_TYPES.map((businessType) => (
                                        <TouchableOpacity
                                            key={businessType}
                                            style={styles.dropdownOption}
                                            onPress={() => {
                                                updateStep1Field('businessType', businessType);
                                                setBusinessTypeOpen(false);
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.dropdownOptionText}>{businessType}</Text>
                                            {step1Data.businessType === businessType && (
                                                <Ionicons name="checkmark-circle" size={21} color={CYAN} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </Pressable>
                            </Pressable>
                        </Modal>

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<Ionicons name="calendar-outline" size={18} color={MUTED} />}
                                    label="Years in Business"
                                    placeholder="Enter years"
                                    keyboardType="number-pad"
                                    value={step1Data.yearsInBusiness}
                                    onChangeText={(value) => updateStep1Field('yearsInBusiness', value)}
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<Ionicons name="people-outline" size={18} color={MUTED} />}
                                    label="Employees"
                                    placeholder="Enter number"
                                    keyboardType="number-pad"
                                    value={step1Data.employees}
                                    onChangeText={(value) => updateStep1Field('employees', value)}
                                />
                            </View>
                        </View>

                        <FieldRow
                            icon={<Ionicons name="location-outline" size={18} color={MUTED} />}
                            label="Street Address"
                            placeholder="Enter your street address"
                            value={step1Data.address}
                            onChangeText={(value) => updateStep1Field('address', value)}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<Ionicons name="business-outline" size={18} color={MUTED} />}
                                    label="City"
                                    placeholder="Enter your city"
                                    value={step1Data.city}
                                    onChangeText={(value) => updateStep1Field('city', value)}
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <DropdownRow
                                    icon={<Ionicons name="map-outline" size={18} color={MUTED} />}
                                    label="Province"
                                    placeholder="Select province"
                                    value={step1Data.province}
                                    onPress={() => setProvinceOpen(true)}
                                />
                            </View>
                        </View>

                        <Modal
                            visible={provinceOpen}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setProvinceOpen(false)}
                        >
                            <Pressable style={styles.modalOverlay} onPress={() => setProvinceOpen(false)}>
                                <Pressable style={styles.dropdownModal} onPress={() => {}}>
                                    <Text style={styles.modalTitle}>Select Province</Text>
                                    {PROVINCES.map((province) => (
                                        <TouchableOpacity
                                            key={province}
                                            style={styles.dropdownOption}
                                            onPress={() => {
                                                updateStep1Field('province', province);
                                                setProvinceOpen(false);
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.dropdownOptionText}>{province}</Text>
                                            {step1Data.province === province && (
                                                <Ionicons name="checkmark-circle" size={21} color={CYAN} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </Pressable>
                            </Pressable>
                        </Modal>
                    </View>

                    <TouchableOpacity
                        style={styles.continueButton}
                        activeOpacity={0.85}
                        onPress={handleContinue}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>

                    <SignUpFooter onSignIn={() => router.replace('/auth/login')} />
                </StableScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    usernamePreviewCard: {
        backgroundColor: '#0F2236',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#1D3B54',
    },
    usernameHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    usernameLabel: {
        color: CYAN,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    usernameValue: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginVertical: 4,
    },
    usernameNote: {
        color: '#8CA0B2',
        fontSize: 12,
        lineHeight: 16,
    },
});
