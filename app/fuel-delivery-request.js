import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useMemo, useState, } from 'react';
import { useFuelDeliveryRequest } from '../src/customer/useFuelDeliveryRequest';
import { useForegroundLocation } from '../src/location/useForegroundLocation';
import { useTheme } from '../src/theme/ThemeContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function FuelDeliveryRequestScreen() {
    const router = useRouter();
    const { colors } = useTheme();
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
            if (validFuelTypes.length > 0) {
                return Array.from(new Set(validFuelTypes));
            }
            return routeFuelType
                ? [routeFuelType]
                : [];
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
    const [selectedFuelType, setSelectedFuelType,] = useState(() => routeFuelType && compatibleFuelTypes.includes(routeFuelType)
        ? routeFuelType
        : compatibleFuelTypes[0] ?? null);
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { location, isLoadingLocation, locationError, refreshLocation, } = useForegroundLocation();
    const { isSubmittingRequest, requestError, submitFuelRequest, clearRequestError, } = useFuelDeliveryRequest();
    const [quantityText, setQuantityText,] = useState('');
    const [validationError, setValidationError,] = useState(null);
    const quantityLitres = Number(quantityText);
    const hasValidQuantity = Number.isFinite(quantityLitres) && quantityLitres > 0;
    function handleBack() {
        router.replace('/fuel');
    }
    async function handleSubmit() {
        setValidationError(null);
        if (isLoadingVehicles) {
            setValidationError('Please wait while your vehicle information loads.');
            return;
        }
        if (!selectedVehicle) {
            setValidationError('Select or add a vehicle before requesting fuel.');
            return;
        }
        if (!selectedFuelType) {
            setValidationError('Select a compatible fuel type before requesting fuel.');
            return;
        }
        if (!hasValidQuantity) {
            setValidationError('Enter a quantity greater than 0 litres.');
            return;
        }
        if (isLoadingLocation) {
            setValidationError('Please wait while your current location is determined.');
            return;
        }
        if (!location) {
            setValidationError(locationError ?? 'Allow location access before requesting fuel.');
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
        setValidationError(null);
        setSelectedFuelType(fuelType);
    }
    function handleQuantityChange(value) {
        clearRequestError();
        setValidationError(null);
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
                : undefined, children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: handleBack, style: [
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
                            ? 'Request urgent fuel assistance for your selected vehicle at your current location.'
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
                                ], children: "Emergency fuel is for urgent fuel assistance. Service coverage and driver availability must still be confirmed by the backend." })] })) : null, _jsxs(View, { style: [
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
                                ], children: "Enter a quantity greater than 0 litres." })) : null] }), _jsxs(View, { style: [
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
                                        ], children: "Your device location will be sent securely with the delivery request." })] })) : (_jsx(Text, { style: [
                                    styles.secondaryText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Location unavailable." }))] }), _jsxs(View, { style: [
                            styles.infoCard,
                            {
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 19, color: colors.accent }), _jsx(Text, { style: [
                                    styles.infoText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Final pricing, service coverage, fuel compatibility, and driver availability will be confirmed by the MechanIQ delivery backend before a request is created." })] }), requestError ? (_jsxs(View, { style: [
                            styles.errorCard,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 20, color: colors.danger }), _jsx(Text, { style: [
                                    styles.errorText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: requestError })] })) : null, validationError ? (_jsxs(View, { style: [
                            styles.errorCard,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 20, color: colors.danger }), _jsx(Text, { style: [
                                    styles.errorText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: validationError })] })) : null, _jsxs(TouchableOpacity, { activeOpacity: isSubmittingRequest
                            ? 1
                            : 0.75, disabled: isSubmittingRequest, onPress: handleSubmit, style: [
                            styles.submitButton,
                            {
                                backgroundColor: isSubmittingRequest
                                    ? colors.border
                                    : isEmergency
                                        ? colors.danger
                                        : colors.accent,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: isEmergency
                                    ? 'alert-circle-outline'
                                    : 'truck-delivery-outline', size: 20, color: isSubmittingRequest
                                    ? colors.secondaryText
                                    : '#000000' }), _jsx(Text, { style: [
                                    styles.submitButtonText,
                                    {
                                        color: isSubmittingRequest
                                            ? colors.secondaryText
                                            : '#000000',
                                    },
                                ], children: isSubmittingRequest
                                    ? 'Submitting...'
                                    : isEmergency
                                        ? 'Request Emergency Fuel'
                                        : 'Request Fuel' })] })] }) }) }));
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
});
