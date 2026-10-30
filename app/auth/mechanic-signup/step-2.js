import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
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
import {
    pickDocumentFromFile,
    pickDocumentFromCamera,
    pickDocumentFromGallery,
} from '../../../src/mechanic/mechanicDocumentService';
import StableScrollView from '../../../src/components/StableScrollView';
import {
    CYAN,
    DropdownRow,
    FieldRow,
    MUTED,
    SignUpFooter,
    SignUpHeader,
    styles,
    UploadRow,
} from '../../../src/auth/mechanic/MechanicSignUpShared';

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
    const { step2Data, updateStep2Field } = useMechanicSignUp();
    const [specialisationOpen, setSpecialisationOpen] = useState(false);
    const [vehicleBrandsOpen, setVehicleBrandsOpen] = useState(false);

    // Document Picker State
    const [pickerOpen, setPickerOpen] = useState(false);
    const [activeDocKey, setActiveDocKey] = useState(null);
    const [activeDocLabel, setActiveDocLabel] = useState('');
    const [isPicking, setIsPicking] = useState(false);

    function openDocumentPicker(docKey, label) {
        setActiveDocKey(docKey);
        setActiveDocLabel(label);
        setPickerOpen(true);
    }

    async function handlePickMethod(method) {
        try {
            setIsPicking(true);
            let result = null;
            if (method === 'file') {
                result = await pickDocumentFromFile();
            } else if (method === 'camera') {
                result = await pickDocumentFromCamera();
            } else if (method === 'gallery') {
                result = await pickDocumentFromGallery();
            }
            if (result && activeDocKey) {
                updateStep2Field(activeDocKey, result);
                setPickerOpen(false);
            }
        } catch (error) {
            Alert.alert('Selection Error', error?.message || 'Unable to select the document.');
        } finally {
            setIsPicking(false);
        }
    }

    function toggleVehicleBrand(brand) {
        const currentBrands = step2Data.vehicleBrands;
        if (currentBrands.includes(brand)) {
            updateStep2Field('vehicleBrands', currentBrands.filter((item) => item !== brand));
            return;
        }
        updateStep2Field('vehicleBrands', [...currentBrands, brand]);
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
        if (step2Data.vehicleBrands.length === 0) {
            Alert.alert('Vehicle brands required', 'Please select at least one vehicle brand that you support.');
            return;
        }
        router.push('/auth/mechanic-signup/step-3');
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
                    <SignUpHeader step={2} onBack={() => router.dismissTo('/auth/mechanic-signup')} />

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="construct-outline" size={18} color={CYAN} />
                            <Text style={styles.sectionTitle}>PROFESSIONAL DETAILS</Text>
                        </View>
                        <Text style={styles.sectionSubtitle}>
                            Tell us about your workshop, experience and services.
                        </Text>

                        <FieldRow
                            icon={<Ionicons name="location-outline" size={18} color={MUTED} />}
                            label="Workshop Location"
                            placeholder="Enter your workshop location"
                            value={step2Data.workshopLocation}
                            onChangeText={(value) => updateStep2Field('workshopLocation', value)}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<Ionicons name="locate-outline" size={18} color={MUTED} />}
                                    label="Service Area / Radius"
                                    placeholder="e.g. 25 km"
                                    value={step2Data.serviceRadius}
                                    onChangeText={(value) => updateStep2Field('serviceRadius', value)}
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<Ionicons name="calendar-outline" size={18} color={MUTED} />}
                                    label="Years of Experience"
                                    placeholder="Enter years"
                                    keyboardType="number-pad"
                                    value={step2Data.yearsExperience}
                                    onChangeText={(value) => updateStep2Field('yearsExperience', value)}
                                />
                            </View>
                        </View>

                        <FieldRow
                            icon={<Ionicons name="school-outline" size={18} color={MUTED} />}
                            label="Qualifications / Certifications"
                            placeholder="Enter your qualifications and certifications"
                            value={step2Data.qualifications}
                            onChangeText={(value) => updateStep2Field('qualifications', value)}
                        />

                        <DropdownRow
                            icon={<Ionicons name="construct-outline" size={18} color={MUTED} />}
                            label="Specialisation"
                            placeholder="Select your specialisation"
                            value={step2Data.specialisation}
                            onPress={() => setSpecialisationOpen(true)}
                        />

                        <Modal
                            visible={specialisationOpen}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setSpecialisationOpen(false)}
                        >
                            <Pressable style={styles.modalOverlay} onPress={() => setSpecialisationOpen(false)}>
                                <Pressable style={styles.dropdownModal} onPress={() => {}}>
                                    <Text style={styles.modalTitle}>Select Specialisation</Text>
                                    {SPECIALISATIONS.map((specialisation) => (
                                        <TouchableOpacity
                                            key={specialisation}
                                            style={styles.dropdownOption}
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                updateStep2Field('specialisation', specialisation);
                                                setSpecialisationOpen(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownOptionText}>{specialisation}</Text>
                                            {step2Data.specialisation === specialisation && (
                                                <Ionicons name="checkmark-circle" size={21} color={CYAN} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </Pressable>
                            </Pressable>
                        </Modal>

                        <DropdownRow
                            icon={<Ionicons name="car-outline" size={18} color={MUTED} />}
                            label="Vehicle Brands Supported"
                            placeholder="Select vehicle brands"
                            value={step2Data.vehicleBrands.length > 0 ? step2Data.vehicleBrands.join(', ') : ''}
                            onPress={() => setVehicleBrandsOpen(true)}
                        />

                        <Modal
                            visible={vehicleBrandsOpen}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setVehicleBrandsOpen(false)}
                        >
                            <Pressable style={styles.modalOverlay} onPress={() => setVehicleBrandsOpen(false)}>
                                <Pressable style={styles.dropdownModal} onPress={() => {}}>
                                    <Text style={styles.modalTitle}>Select Vehicle Brands</Text>
                                    <Text style={styles.modalSubtext}>Select all brands your workshop supports</Text>
                                    {VEHICLE_BRANDS.map((brand) => {
                                        const selected = step2Data.vehicleBrands.includes(brand);
                                        return (
                                            <TouchableOpacity
                                                key={brand}
                                                style={styles.dropdownOption}
                                                onPress={() => toggleVehicleBrand(brand)}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.dropdownOptionText}>{brand}</Text>
                                                {selected && (
                                                    <Ionicons name="checkmark-circle" size={22} color={CYAN} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                    <TouchableOpacity
                                        style={styles.modalDoneButton}
                                        onPress={() => setVehicleBrandsOpen(false)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={styles.modalDoneText}>Done</Text>
                                    </TouchableOpacity>
                                </Pressable>
                            </Pressable>
                        </Modal>

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<MaterialCommunityIcons name="card-account-details-outline" size={18} color={MUTED} />}
                                    label="Trade Test / License Number"
                                    placeholder="Enter license number"
                                    value={step2Data.licenseNumber}
                                    onChangeText={(value) => updateStep2Field('licenseNumber', value)}
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <FieldRow
                                    icon={<MaterialCommunityIcons name="card-account-details-outline" size={18} color={MUTED} />}
                                    label="Business Registration Number"
                                    placeholder="Enter registration number"
                                    value={step2Data.registrationNumber}
                                    onChangeText={(value) => updateStep2Field('registrationNumber', value)}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Verification Documents Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="shield-checkmark-outline" size={18} color={CYAN} />
                            <Text style={styles.sectionTitle}>VERIFICATION DOCUMENTS</Text>
                        </View>
                        <Text style={styles.sectionSubtitle}>
                            Upload verification documents for your mechanic profile (PDF, Word, or Photo).
                        </Text>

                        <UploadRow
                            label="ID Document"
                            document={step2Data.idDocument}
                            onPress={() => openDocumentPicker('idDocument', 'ID Document')}
                            onRemove={() => updateStep2Field('idDocument', null)}
                        />

                        <UploadRow
                            label="Trade Certificate"
                            document={step2Data.tradeCertificate}
                            onPress={() => openDocumentPicker('tradeCertificate', 'Trade Certificate')}
                            onRemove={() => updateStep2Field('tradeCertificate', null)}
                        />

                        <UploadRow
                            label="Workshop Registration / Proof of Business"
                            document={step2Data.workshopRegistration}
                            onPress={() => openDocumentPicker('workshopRegistration', 'Workshop Registration')}
                            onRemove={() => updateStep2Field('workshopRegistration', null)}
                        />
                    </View>

                    {/* Document Picker Modal */}
                    <Modal
                        visible={pickerOpen}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => !isPicking && setPickerOpen(false)}
                    >
                        <Pressable style={styles.modalOverlay} onPress={() => !isPicking && setPickerOpen(false)}>
                            <Pressable style={styles.dropdownModal} onPress={() => {}}>
                                <Text style={styles.modalTitle}>{`Upload ${activeDocLabel}`}</Text>
                                <Text style={styles.modalSubtext}>Choose how you want to upload this document</Text>

                                {isPicking ? (
                                    <View style={docPickerStyles.loadingBox}>
                                        <ActivityIndicator size="small" color={CYAN} />
                                        <Text style={docPickerStyles.loadingText}>Opening picker...</Text>
                                    </View>
                                ) : (
                                    <_Fragment>
                                        <TouchableOpacity
                                            style={docPickerStyles.optionRow}
                                            activeOpacity={0.8}
                                            onPress={() => handlePickMethod('file')}
                                        >
                                            <View style={docPickerStyles.iconCircle}>
                                                <Ionicons name="document-attach-outline" size={22} color={CYAN} />
                                            </View>
                                            <View style={docPickerStyles.optionTextContainer}>
                                                <Text style={docPickerStyles.optionTitle}>Choose PDF or File</Text>
                                                <Text style={docPickerStyles.optionSub}>Browse documents on your device</Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={18} color={MUTED} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={docPickerStyles.optionRow}
                                            activeOpacity={0.8}
                                            onPress={() => handlePickMethod('camera')}
                                        >
                                            <View style={docPickerStyles.iconCircle}>
                                                <Ionicons name="camera-outline" size={22} color={CYAN} />
                                            </View>
                                            <View style={docPickerStyles.optionTextContainer}>
                                                <Text style={docPickerStyles.optionTitle}>Take Photo</Text>
                                                <Text style={docPickerStyles.optionSub}>Scan or take photo of document</Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={18} color={MUTED} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={docPickerStyles.optionRow}
                                            activeOpacity={0.8}
                                            onPress={() => handlePickMethod('gallery')}
                                        >
                                            <View style={docPickerStyles.iconCircle}>
                                                <Ionicons name="images-outline" size={22} color={CYAN} />
                                            </View>
                                            <View style={docPickerStyles.optionTextContainer}>
                                                <Text style={docPickerStyles.optionTitle}>Photo Gallery</Text>
                                                <Text style={docPickerStyles.optionSub}>Choose image from device photos</Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={18} color={MUTED} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.modalDoneButton}
                                            activeOpacity={0.85}
                                            onPress={() => setPickerOpen(false)}
                                        >
                                            <Text style={styles.modalDoneText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </_Fragment>
                                )}
                            </Pressable>
                        </Pressable>
                    </Modal>

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.backOutlineButton}
                            activeOpacity={0.85}
                            onPress={() => router.dismissTo('/auth/mechanic-signup')}
                        >
                            <Text style={styles.backOutlineText}>Back</Text>
                        </TouchableOpacity>
                        <View style={{ width: 10 }} />
                        <TouchableOpacity
                            style={styles.continueButton}
                            activeOpacity={0.85}
                            onPress={handleContinue}
                        >
                            <Text style={styles.continueText}>Continue</Text>
                        </TouchableOpacity>
                    </View>

                    <SignUpFooter
                        onSignIn={() => {
                            router.replace('/auth/login');
                        }}
                    />
                </StableScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const docPickerStyles = StyleSheet.create({
    loadingBox: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    loadingText: {
        color: MUTED,
        marginTop: 10,
        fontSize: 13,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#2C3342',
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(61, 217, 245, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    optionSub: {
        color: MUTED,
        fontSize: 12,
        marginTop: 2,
    },
});
