import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import DateTimePicker from '../src/components/AppDateTimePicker';
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
function createInitialScheduleDate() {
    const date = new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    return date;
}
export default function FuelTopUpScheduleScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const params = useLocalSearchParams();
    const routeFuelType = Array.isArray(params.fuelType)
        ? params.fuelType[0]
        : params.fuelType;
    const compatibleFuelTypesParam = Array.isArray(params.compatibleFuelTypes)
        ? params.compatibleFuelTypes[0]
        : params.compatibleFuelTypes;
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
    const [quantityText, setQuantityText,] = useState('');
    const [scheduledFor, setScheduledFor,] = useState(createInitialScheduleDate);
    const [pickerMode, setPickerMode,] = useState(null);
    const [openedAt] = useState(Date.now);
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { location, isLoadingLocation, locationError, refreshLocation, } = useForegroundLocation();
    const { isSubmittingRequest, requestError, submitFuelRequest, clearRequestError, } = useFuelDeliveryRequest();
    const quantityLitres = Number(quantityText);
    const hasValidQuantity = Number.isFinite(quantityLitres) && quantityLitres > 0;
    const isFutureSchedule = scheduledFor.getTime() > openedAt;
    const canSubmit = !isLoadingVehicles &&
        !isLoadingLocation &&
        !isSubmittingRequest &&
        selectedVehicle !== null &&
        selectedFuelType !== null &&
        location !== null &&
        hasValidQuantity &&
        isFutureSchedule;
    function handleFuelTypeSelect(fuelType) {
        clearRequestError();
        setSelectedFuelType(fuelType);
    }
    function handleQuantityChange(value) {
        clearRequestError();
        const sanitizedValue = value.replace(/[^0-9.]/g, '');
        const decimalParts = sanitizedValue.split('.');
        if (decimalParts.length > 2) {
            return;
        }
        setQuantityText(sanitizedValue);
    }
    function handlePickerChange(event, selectedDate) {
        if (Platform.OS === 'android') {
            setPickerMode(null);
        }
        if (event.type === 'dismissed' ||
            !selectedDate) {
            return;
        }
        setScheduledFor((current) => {
            const updated = new Date(current);
            if (pickerMode === 'date') {
                updated.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            }
            if (pickerMode === 'time') {
                updated.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
            }
            return updated;
        });
        clearRequestError();
    }
    async function handleSubmit() {
        if (!selectedVehicle ||
            !selectedFuelType ||
            !location ||
            !hasValidQuantity ||
            !isFutureSchedule) {
            return;
        }
        const result = await submitFuelRequest({
            vehicleId: selectedVehicle.id,
            requestType: 'standard',
            fuelType: selectedFuelType,
            quantityLitres,
            deliveryLocation: {
                label: 'Current location',
                address: null,
                coordinate: location,
            },
            scheduledFor: scheduledFor.toISOString(),
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
    const formattedDate = scheduledFor.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const formattedTime = scheduledFor.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsx(KeyboardAvoidingView, { style: styles.flex, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/fuel'), style: [
                                    styles.headerButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                    styles.headerTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Schedule Top-up" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Schedule Fuel" }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Choose a future date and time for fuel delivery to your current location." }), _jsxs(View, { style: [
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
                                }) })) : (_jsx(Text, { style: [
                                    styles.unavailableText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: "Compatible fuel information is unavailable." })), _jsx(Text, { style: [
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
                                        ], children: "litres" })] })] }), _jsxs(View, { style: [
                            styles.scheduleCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(MaterialCommunityIcons, { name: "calendar-clock-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                            styles.sectionTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: "Delivery Schedule" })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setPickerMode('date'), style: [
                                    styles.scheduleField,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(Ionicons, { name: "calendar-outline", size: 20, color: colors.accent }), _jsxs(View, { style: styles.scheduleFieldText, children: [_jsx(Text, { style: [
                                                    styles.scheduleLabel,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Date" }), _jsx(Text, { style: [
                                                    styles.scheduleValue,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: formattedDate })] }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setPickerMode('time'), style: [
                                    styles.scheduleField,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(Ionicons, { name: "time-outline", size: 20, color: colors.accent }), _jsxs(View, { style: styles.scheduleFieldText, children: [_jsx(Text, { style: [
                                                    styles.scheduleLabel,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Time" }), _jsx(Text, { style: [
                                                    styles.scheduleValue,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: formattedTime })] }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] }), !isFutureSchedule ? (_jsx(Text, { style: [
                                    styles.validationText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: "Select a future delivery date and time." })) : null, pickerMode ? (_jsxs(View, { style: styles.pickerContainer, children: [_jsx(DateTimePicker, { value: scheduledFor, mode: pickerMode, minimumDate: pickerMode ===
                                            'date'
                                            ? new Date()
                                            : undefined, display: Platform.OS === 'ios'
                                            ? 'spinner'
                                            : 'default', onChange: handlePickerChange }), Platform.OS ===
                                        'ios' ? (_jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setPickerMode(null), style: [
                                            styles.doneButton,
                                            {
                                                backgroundColor: colors.accent,
                                            },
                                        ], children: _jsx(Text, { style: styles.doneButtonText, children: "Done" }) })) : null] })) : null] }), _jsxs(View, { style: [
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
                                        ], children: "The selected delivery time and your current location will be sent with the scheduled request." })] })) : (_jsx(Text, { style: [
                                    styles.secondaryText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Location unavailable." }))] }), requestError ? (_jsxs(View, { style: [
                            styles.errorCard,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 20, color: colors.danger }), _jsx(Text, { style: [
                                    styles.errorText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: requestError })] })) : null, _jsxs(TouchableOpacity, { activeOpacity: canSubmit
                            ? 0.75
                            : 1, disabled: !canSubmit, onPress: handleSubmit, style: [
                            styles.submitButton,
                            {
                                backgroundColor: canSubmit
                                    ? colors.accent
                                    : colors.border,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "calendar-check-outline", size: 20, color: canSubmit
                                    ? '#000000'
                                    : colors.secondaryText }), _jsx(Text, { style: [
                                    styles.submitButtonText,
                                    {
                                        color: canSubmit
                                            ? '#000000'
                                            : colors.secondaryText,
                                    },
                                ], children: isSubmittingRequest
                                    ? 'Scheduling...'
                                    : 'Schedule Top-up' })] })] }) }) }));
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
    scheduleCard: {
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
    unavailableText: {
        marginTop: 8,
        fontSize: 10,
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
    scheduleField: {
        minHeight: 56,
        marginTop: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
    },
    scheduleFieldText: {
        flex: 1,
        marginLeft: 10,
    },
    scheduleLabel: {
        fontSize: 9,
    },
    scheduleValue: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: '700',
    },
    pickerContainer: {
        marginTop: 12,
    },
    doneButton: {
        minHeight: 38,
        marginTop: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButtonText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '700',
    },
    validationText: {
        marginTop: 8,
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
