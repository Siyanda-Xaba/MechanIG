import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useEffect, useMemo, useState, } from 'react';
import { useFuelDeliveryRequest } from '../src/customer/useFuelDeliveryRequest';
import { prepareAndSaveEmergencyRequest } from '../src/emergency/emergencyPreparationService';
import { useUser } from '../src/users/UserContext';
import { useForegroundLocation } from '../src/location/useForegroundLocation';
import { useTheme } from '../src/theme/ThemeContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function FuelDeliveryRequestScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user } = useUser();
    const params = useLocalSearchParams();
    const routeFuelType = Array.isArray(params.fuelType)
        ? params.fuelType[0]
        : params.fuelType;
    const compatibleFuelTypesParam = Array.isArray(params.compatibleFuelTypes)
        ? params.compatibleFuelTypes[0]
        : params.compatibleFuelTypes;
    const requestTypeParam = Array.isArray(params.requestType)
        ? params.requestType[0]
        : params.requestType;
    const requestType = requestTypeParam === 'emergency'
        ? 'emergency'
        : 'standard';
    const isEmergency = requestType === 'emergency';
    const compatibleFuelTypes = useMemo(() => {
        if (!compatibleFuelTypesParam) {
            return routeFuelType
                ? [routeFuelType]
                : [];
        }
        try {
            const parsed = JSON.parse(compatibleFuelTypesParam);
            if (!Array.isArray(parsed)) {
                return routeFuelType
                    ? [routeFuelType]
                    : [];
            }
            const validFuelTypes = parsed.filter((item) => typeof item ===
                'string' &&
                item.trim().length > 0);
            return Array.from(new Set(validFuelTypes));
        }
        catch {
            return routeFuelType
                ? [routeFuelType]
                : [];
        }
    }, [
        compatibleFuelTypesParam,
        routeFuelType,
    ]);
    const [selectedFuelType, setSelectedFuelType,] = useState(routeFuelType ?? null);
    useEffect(() => {
        if (selectedFuelType &&
            compatibleFuelTypes.includes(selectedFuelType)) {
            return;
        }
        if (routeFuelType &&
            compatibleFuelTypes.includes(routeFuelType)) {
            setSelectedFuelType(routeFuelType);
            return;
        }
        setSelectedFuelType(compatibleFuelTypes[0] ??
            null);
    }, [
        compatibleFuelTypes,
        routeFuelType,
        selectedFuelType,
    ]);
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { location, isLoadingLocation, locationError, refreshLocation, } = useForegroundLocation();
    const { isSubmittingRequest, requestError, submitFuelRequest, clearRequestError, } = useFuelDeliveryRequest();
    const [quantityText, setQuantityText,] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const [reviewInput, setReviewInput] = useState(null);
    const [isSavingEmergency, setIsSavingEmergency] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [savedEmergency, setSavedEmergency] = useState(null);
    const quantityLitres = Number(quantityText);
    const hasValidQuantity = Number.isFinite(quantityLitres) && quantityLitres > 0;
    // Standard fuel delivery keeps its original validation and backend submission.
    const canSubmit = !isLoadingVehicles &&
        !isLoadingLocation &&
        !isSubmittingRequest &&
        selectedVehicle !== null &&
        selectedFuelType !== null &&
        location !== null &&
        hasValidQuantity;
    // Emergency fuel may be saved as an incomplete local draft, even without GPS.
    const canReviewEmergency = !isLoadingVehicles &&
        !isSavingEmergency &&
        user?.role === 'customer' &&
        !savedEmergency;
    const canProceed = isEmergency ? canReviewEmergency : canSubmit;

    function prepareEmergencyInput() {
        const vehicleYear = selectedVehicle?.year == null
            ? null
            : Number(selectedVehicle.year);

        return {
            serviceType: 'fuel',
            owner: {
                type: 'customer',
                accountId: user?.id ?? '',
            },
            contact: {
                name: contactName,
                phoneNumber: contactPhone,
            },
            location: {
                coordinates: location
                    ? { latitude: location.latitude, longitude: location.longitude }
                    : null,
                description: locationDescription,
            },
            vehicle: selectedVehicle
                ? {
                    vehicleId: selectedVehicle.id ?? null,
                    make: selectedVehicle.make ?? null,
                    model: selectedVehicle.model ?? null,
                    year: Number.isInteger(vehicleYear) && vehicleYear > 0
                        ? vehicleYear
                        : null,
                }
                : null,
            details: {
                fuelType: selectedFuelType,
                quantityLitres: hasValidQuantity ? quantityLitres : null,
            },
        };
    }

    function handleReviewEmergency() {
        if (!canReviewEmergency) {
            return;
        }
        // Do not silently discard an invalid quantity entered by the Customer.
        if (quantityText.trim() && !hasValidQuantity) {
            setSaveError('Enter a valid fuel quantity or clear the field to save an incomplete draft.');
            return;
        }
        setSaveError(null);
        setReviewInput(prepareEmergencyInput());
    }

    async function handleSaveEmergency() {
        if (!reviewInput || isSavingEmergency || savedEmergency) {
            return;
        }
        setIsSavingEmergency(true);
        setSaveError(null);
        try {
            // Secure local draft only: no backend request and no tracking ID.
            const request = await prepareAndSaveEmergencyRequest(reviewInput, user);
            setSavedEmergency(request);
            setReviewInput(null);
        } catch (error) {
            setSaveError(error instanceof Error
                ? error.message
                : 'Unable to save the emergency fuel draft.');
        } finally {
            setIsSavingEmergency(false);
        }
    }
    async function handleSubmit() {
        if (!selectedVehicle ||
            !selectedFuelType ||
            !location ||
            !hasValidQuantity) {
            return;
        }
        const result = await submitFuelRequest({
            vehicleId: selectedVehicle.id,
            requestType,
            fuelType: selectedFuelType,
            quantityLitres,
            deliveryLocation: {
                label: 'Current location',
                address: null,
                coordinate: location,
            },
            scheduledFor: null,
        });
        if (!result) {
            return;
        }
        router.replace({
            pathname: '/fuel-delivery-tracking',
            params: {
                deliveryId: result.deliveryId,
            },
        });
    }
    function handleFuelTypeSelect(fuelType) {
        clearRequestError();
        setReviewInput(null);
        setSaveError(null);
        setSelectedFuelType(fuelType);
    }
    function handleQuantityChange(value) {
        clearRequestError();
        setReviewInput(null);
        setSaveError(null);
        const sanitizedValue = value.replace(/[^0-9.]/g, '');
        const decimalParts = sanitizedValue.split('.');
        if (decimalParts.length > 2) {
            return;
        }
        setQuantityText(sanitizedValue);
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsx(KeyboardAvoidingView, { style: styles.flex, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.back(), style: [
                                    styles.headerButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                    styles.headerTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: isEmergency
                                    ? 'Emergency Fuel'
                                    : 'Request Fuel' }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: isEmergency
                            ? 'Emergency Fuel Assistance'
                            : 'Fuel Delivery' }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: isEmergency
                            ? 'Prepare an urgent fuel request. Save it on this device even when GPS or internet is unavailable.'
                            : 'Request fuel for your selected vehicle at your current location.' }), isEmergency ? (_jsxs(View, { style: [
                            styles.emergencyNotice,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 22, color: colors.danger }), _jsx(Text, { style: [
                                    styles.emergencyNoticeText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Saving an emergency fuel draft does not send a request or dispatch fuel. Review and submit it explicitly once a real delivery backend is available." })] })) : null, _jsxs(View, { style: [
                            styles.vehicleCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                            styles.sectionTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: "Selected Vehicle" })] }), isLoadingVehicles ? (_jsx(Text, { style: [
                                    styles.secondaryText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Loading vehicle..." })) : selectedVehicle ? (_jsxs(_Fragment, { children: [_jsxs(Text, { style: [
                                            styles.vehicleName,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                            styles.secondaryText,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: selectedVehicle.registration })] })) : (_jsx(Text, { style: [
                                    styles.secondaryText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: "No vehicle selected." }))] }), _jsxs(View, { style: [
                            styles.formCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(Text, { style: [
                                    styles.fieldLabel,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Fuel Type" }), compatibleFuelTypes.length >
                                0 ? (_jsx(View, { style: styles.fuelOptions, children: compatibleFuelTypes.map((fuelType) => {
                                    const isSelected = selectedFuelType ===
                                        fuelType;
                                    return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => handleFuelTypeSelect(fuelType), style: [
                                            styles.fuelOption,
                                            {
                                                borderColor: isSelected
                                                    ? colors.accent
                                                    : colors.border,
                                                backgroundColor: isSelected
                                                    ? colors.accent
                                                    : colors.background,
                                            },
                                        ], children: [_jsx(MaterialCommunityIcons, { name: "gas-station-outline", size: 19, color: isSelected
                                                    ? '#000000'
                                                    : colors.accent }), _jsx(Text, { style: [
                                                    styles.fuelOptionText,
                                                    {
                                                        color: isSelected
                                                            ? '#000000'
                                                            : colors.text,
                                                    },
                                                ], children: fuelType }), isSelected ? (_jsx(Ionicons, { name: "checkmark-circle", size: 18, color: "#000000" })) : null] }, fuelType));
                                }) })) : (_jsxs(View, { style: [
                                    styles.unavailableField,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 19, color: colors.danger }), _jsx(Text, { style: [
                                            styles.unavailableText,
                                            {
                                                color: colors.danger,
                                            },
                                        ], children: "Compatible fuel information is unavailable." })] })), _jsx(Text, { style: [
                                    styles.compatibilityNote,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Only compatible fuel options for the selected vehicle should be offered. The backend will validate compatibility again before creating the delivery." }), _jsx(Text, { style: [
                                    styles.fieldLabel,
                                    styles.quantityLabel,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Quantity" }), _jsxs(View, { style: [
                                    styles.quantityField,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(TextInput, { value: quantityText, onChangeText: handleQuantityChange, placeholder: "Enter amount", placeholderTextColor: colors.secondaryText, keyboardType: "decimal-pad", style: [
                                            styles.quantityInput,
                                            {
                                                color: colors.text,
                                            },
                                        ] }), _jsx(Text, { style: [
                                            styles.quantityUnit,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: "litres" })] }), quantityText.length >
                                0 &&
                                !hasValidQuantity ? (_jsx(Text, { style: [
                                    styles.validationText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: "Enter a quantity greater than 0 litres." })) : null] }), isEmergency ? (_jsxs(View, { style: [
                            styles.formCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsxs(View, { style: styles.sectionHeader, children: [
                            _jsx(Ionicons, { name: 'person-outline', size: 22, color: colors.accent }),
                            _jsx(Text, { style: [styles.sectionTitle, { color: colors.text }], children: 'Emergency Contact' }),
                        ] }), _jsx(Text, { style: [styles.secondaryText, { color: colors.secondaryText }], children: 'Add contact details for when you are ready to submit. Missing details can remain in a saved draft.' }),
                            _jsx(EmergencyTextField, {
                                label: 'Contact Name',
                                value: contactName,
                                onChangeText: (text) => { setContactName(text); setReviewInput(null); setSaveError(null); },
                                placeholder: 'Name of person requesting help',
                                maxLength: 120,
                                colors,
                            }),
                            _jsx(EmergencyTextField, {
                                label: 'Phone Number',
                                value: contactPhone,
                                onChangeText: (text) => { setContactPhone(text); setReviewInput(null); setSaveError(null); },
                                placeholder: 'Phone number responders can call',
                                maxLength: 40,
                                keyboardType: 'phone-pad',
                                colors,
                            }),
                        ] })) : null, _jsxs(View, { style: [
                            styles.locationCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "location-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                            styles.sectionTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: "Delivery Location" })] }), isLoadingLocation ? (_jsx(Text, { style: [
                                    styles.secondaryText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Getting your current location..." })) : locationError ? (_jsxs(_Fragment, { children: [_jsx(Text, { style: [
                                            styles.secondaryText,
                                            {
                                                color: colors.danger,
                                            },
                                        ], children: locationError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshLocation, style: [
                                            styles.retryButton,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: [_jsx(MaterialCommunityIcons, { name: "crosshairs-gps", size: 17, color: colors.accent }), _jsx(Text, { style: [
                                                    styles.retryText,
                                                    {
                                                        color: colors.accent,
                                                    },
                                                ], children: "Try Location Again" })] })] })) : location ? (_jsxs(_Fragment, { children: [_jsx(Text, { style: [
                                            styles.locationTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: "Current Location" }), _jsx(Text, { style: [
                                            styles.secondaryText,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: isEmergency
                                                ? 'GPS coordinates will be included only in your encrypted local draft until you explicitly submit it.'
                                                : 'Your device location will be sent securely with the delivery request.' })] })) : (_jsx(Text, { style: [
                                    styles.secondaryText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Location unavailable." })), isEmergency ? (_jsxs(View, { children: [
                                    _jsx(EmergencyTextField, {
                                        label: 'Location Description (optional for saved drafts)',
                                        value: locationDescription,
                                        onChangeText: (text) => { setLocationDescription(text); setReviewInput(null); setSaveError(null); },
                                        placeholder: 'Road name, nearest landmark, or other location details',
                                        maxLength: 500,
                                        multiline: true,
                                        colors,
                                    }),
                                    _jsx(Text, { style: [styles.secondaryText, { color: colors.secondaryText }], children: 'GPS may be unavailable without a clear signal. Add a description if possible. A usable location will be required before actual submission.' }),
                                ] })) : null] }), _jsxs(View, { style: [
                            styles.infoCard,
                            {
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 19, color: colors.accent }), _jsx(Text, { style: [
                                    styles.infoText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: isEmergency
                                    ? 'This form currently saves drafts locally only. Pricing, coverage, compatibility and driver availability must be verified by a connected backend before any delivery request is created.'
                                    : 'Final pricing, service coverage, fuel compatibility, and driver availability will be confirmed by the MechanIQ delivery backend before a request is created.' })] }), requestError ? (_jsxs(View, { style: [
                            styles.errorCard,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 20, color: colors.danger }), _jsx(Text, { style: [
                                    styles.errorText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: requestError })] })) : null, isEmergency && saveError ? (_jsxs(View, { style: [styles.errorCard, { borderColor: colors.danger }], children: [
                            _jsx(MaterialCommunityIcons, { name: 'alert-circle-outline', size: 20, color: colors.danger }),
                            _jsx(Text, { style: [styles.errorText, { color: colors.danger }], children: saveError }),
                        ] })) : null, isEmergency && reviewInput ? (_jsxs(View, { style: [styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.accent }], children: [
                            _jsx(Text, { style: [styles.reviewTitle, { color: colors.text }], children: 'Review Emergency Fuel Draft' }),
                            _jsx(Text, { style: [styles.reviewWarning, { color: colors.secondaryText }], children: 'Check these details before saving them securely on this device. Saving does NOT contact a provider.' }),
                            _jsx(ReviewRow, { label: 'Vehicle', value: reviewInput.vehicle ? [reviewInput.vehicle.make, reviewInput.vehicle.model].filter(Boolean).join(' ') || 'Vehicle selected' : 'Not selected', colors }),
                            _jsx(ReviewRow, { label: 'Fuel', value: reviewInput.details.fuelType || 'Not specified', colors }),
                            _jsx(ReviewRow, { label: 'Quantity', value: reviewInput.details.quantityLitres == null ? 'Not specified' : `${reviewInput.details.quantityLitres} litres`, colors }),
                            _jsx(ReviewRow, { label: 'Contact', value: reviewInput.contact.name || 'Not specified', colors }),
                            _jsx(ReviewRow, { label: 'Phone', value: reviewInput.contact.phoneNumber || 'Not specified', colors }),
                            _jsx(ReviewRow, { label: 'GPS', value: reviewInput.location.coordinates ? `${reviewInput.location.coordinates.latitude.toFixed(6)}, ${reviewInput.location.coordinates.longitude.toFixed(6)}` : 'Not available', colors }),
                            _jsx(ReviewRow, { label: 'Location details', value: reviewInput.location.description || 'Not specified', colors }),
                            _jsx(Text, { style: [styles.reviewWarning, { color: colors.secondaryText }], children: 'Missing details must be completed before actual backend submission. This draft is not a service request.' }),
                            _jsxs(View, { style: styles.reviewActions, children: [
                                _jsx(TouchableOpacity, { accessibilityRole: 'button', disabled: isSavingEmergency, onPress: () => { setReviewInput(null); setSaveError(null); }, style: [styles.reviewAction, { borderColor: colors.border }], children: _jsx(Text, { style: [styles.reviewActionText, { color: colors.text }], children: 'Edit Details' }) }),
                                _jsx(TouchableOpacity, { accessibilityRole: 'button', disabled: isSavingEmergency, onPress: () => { void handleSaveEmergency(); }, style: [styles.reviewAction, { backgroundColor: colors.accent, opacity: isSavingEmergency ? 0.6 : 1 }], children: _jsx(Text, { style: [styles.reviewActionText, { color: '#000000' }], children: isSavingEmergency ? 'Saving...' : 'Confirm Save' }) }),
                            ] }),
                        ] })) : null, isEmergency && savedEmergency ? (_jsxs(View, { style: [styles.savedCard, { backgroundColor: colors.card, borderColor: colors.accent }], children: [
                            _jsx(Ionicons, { name: 'checkmark-circle-outline', size: 27, color: colors.accent }),
                            _jsx(Text, { style: [styles.reviewTitle, { color: colors.text }], children: 'Saved Locally — Not Submitted' }),
                            _jsx(Text, { style: [styles.savedDescription, { color: colors.secondaryText }], children: 'Your emergency fuel draft is saved on this device. No fuel provider has been contacted, and there is no active delivery to track. Saved-request retrieval and explicit backend submission will be added next.' }),
                            _jsx(TouchableOpacity, { accessibilityRole: 'button', onPress: () => router.back(), style: [styles.savedBackButton, { borderColor: colors.border }], children: _jsx(Text, { style: [styles.reviewActionText, { color: colors.text }], children: 'Return to Fuel' }) }),
                        ] })) : null, (!isEmergency || (!reviewInput && !savedEmergency)) ? (_jsxs(TouchableOpacity, { activeOpacity: canProceed
                            ? 0.75
                            : 1, disabled: !canProceed, onPress: isEmergency ? handleReviewEmergency : handleSubmit, style: [
                            styles.submitButton,
                            {
                                backgroundColor: canProceed
                                    ? isEmergency
                                        ? colors.danger
                                        : colors.accent
                                    : colors.border,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: isEmergency
                                    ? 'content-save-outline'
                                    : 'truck-delivery-outline', size: 20, color: canProceed
                                    ? '#000000'
                                    : colors.secondaryText }), _jsx(Text, { style: [
                                    styles.submitButtonText,
                                    {
                                        color: canProceed
                                            ? '#000000'
                                            : colors.secondaryText,
                                    },
                                ], children: isSubmittingRequest
                                    ? 'Submitting...'
                                    : isEmergency
                                        ? 'Review & Save Locally'
                                        : 'Request Fuel' })] })) : null] }) }) }));
}

function EmergencyTextField({ label, value, onChangeText, placeholder, maxLength, keyboardType, multiline = false, colors }) {
    return _jsxs(View, { style: styles.emergencyField, children: [
        _jsx(Text, { style: [styles.emergencyFieldLabel, { color: colors.secondaryText }], children: label }),
        _jsx(TextInput, {
            value,
            onChangeText,
            placeholder,
            maxLength,
            keyboardType,
            multiline,
            textAlignVertical: multiline ? 'top' : 'center',
            placeholderTextColor: colors.secondaryText,
            style: [styles.emergencyInput, multiline ? styles.multilineInput : null, { borderColor: colors.border, color: colors.text }],
        }),
    ] });
}

function ReviewRow({ label, value, colors }) {
    return _jsxs(View, { style: styles.reviewRow, children: [
        _jsx(Text, { style: [styles.reviewLabel, { color: colors.secondaryText }], children: label }),
        _jsx(Text, { selectable: true, style: [styles.reviewValue, { color: colors.text }], children: value }),
    ] });
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    header: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerButton: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    headerPlaceholder: {
        width: 38,
    },
    title: {
        marginTop: 14,
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 6,
        fontSize: 12,
        lineHeight: 18,
    },
    emergencyNotice: {
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    emergencyNoticeText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 15,
    },
    vehicleCard: {
        marginTop: 20,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    formCard: {
        marginTop: 14,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    locationCard: {
        marginTop: 14,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    vehicleName: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: '700',
    },
    secondaryText: {
        marginTop: 5,
        fontSize: 10,
        lineHeight: 15,
    },
    fieldLabel: {
        fontSize: 9,
        fontWeight: '600',
    },
    fuelOptions: {
        marginTop: 8,
        gap: 8,
    },
    fuelOption: {
        minHeight: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    fuelOptionText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
    },
    unavailableField: {
        minHeight: 48,
        marginTop: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    unavailableText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 15,
    },
    compatibilityNote: {
        marginTop: 8,
        fontSize: 9,
        lineHeight: 14,
    },
    quantityLabel: {
        marginTop: 16,
    },
    quantityField: {
        minHeight: 48,
        marginTop: 7,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityInput: {
        flex: 1,
        minHeight: 46,
        fontSize: 13,
    },
    quantityUnit: {
        marginLeft: 8,
        fontSize: 11,
    },
    validationText: {
        marginTop: 6,
        fontSize: 9,
    },
    locationTitle: {
        marginTop: 12,
        fontSize: 12,
        fontWeight: '700',
    },
    retryButton: {
        alignSelf: 'flex-start',
        minHeight: 36,
        marginTop: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    retryText: {
        fontSize: 10,
        fontWeight: '700',
    },
    infoCard: {
        marginTop: 14,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    infoText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 14,
    },
    errorCard: {
        marginTop: 14,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    errorText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 15,
    },
    submitButton: {
        minHeight: 48,
        marginTop: 18,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonText: {
        fontSize: 12,
        fontWeight: '700',
    },
    emergencyField: {
        marginTop: 14,
    },
    emergencyFieldLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 7,
    },
    emergencyInput: {
        minHeight: 46,
        borderWidth: 1,
        borderRadius: 9,
        paddingHorizontal: 12,
        fontSize: 13,
    },
    multilineInput: {
        minHeight: 88,
        paddingTop: 12,
        paddingBottom: 12,
    },
    reviewCard: {
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    reviewTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    reviewWarning: {
        fontSize: 11,
        lineHeight: 17,
        marginTop: 10,
        marginBottom: 8,
    },
    reviewRow: {
        marginTop: 10,
    },
    reviewLabel: {
        fontSize: 10,
        fontWeight: '600',
    },
    reviewValue: {
        marginTop: 3,
        fontSize: 12,
        lineHeight: 18,
    },
    reviewActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    reviewAction: {
        flex: 1,
        minHeight: 44,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewActionText: {
        fontSize: 12,
        fontWeight: '700',
    },
    savedCard: {
        marginTop: 18,
        padding: 16,
        borderWidth: 1,
        borderRadius: 14,
        gap: 10,
    },
    savedDescription: {
        fontSize: 11,
        lineHeight: 17,
    },
    savedBackButton: {
        minHeight: 42,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
