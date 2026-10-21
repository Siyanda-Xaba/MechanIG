import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useTheme } from '../src/theme/ThemeContext';
import { useCreateVehicle } from '../src/vehicles/useCreateVehicle';
const initialForm = {
    make: '',
    model: '',
    year: '',
    color: '',
    fuelType: '',
    registration: '',
    isPrimary: false,
};
export default function AddVehicleScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { isCreatingVehicle, createVehicleError, createVehicle, clearCreateVehicleError, } = useCreateVehicle();
    const [form, setForm] = useState(initialForm);
    const [formErrors, setFormErrors] = useState({});
    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
        if (field !== 'isPrimary') {
            setFormErrors((current) => ({
                ...current,
                [field]: undefined,
            }));
        }
        clearCreateVehicleError();
    }
    function validateForm() {
        const errors = {};
        const make = form.make.trim();
        const model = form.model.trim();
        const color = form.color.trim();
        const fuelType = form.fuelType.trim();
        const registration = form.registration.trim().toUpperCase();
        const year = Number(form.year.trim());
        const currentYear = new Date().getFullYear() + 1;
        if (!make) {
            errors.make = 'Vehicle make is required.';
        }
        if (!model) {
            errors.model = 'Vehicle model is required.';
        }
        if (!form.year.trim()) {
            errors.year = 'Vehicle year is required.';
        }
        else if (!Number.isInteger(year) ||
            year < 1900 ||
            year > currentYear) {
            errors.year =
                'Enter a valid vehicle year.';
        }
        if (!color) {
            errors.color = 'Vehicle colour is required.';
        }
        if (!fuelType) {
            errors.fuelType =
                'Fuel type is required.';
        }
        if (!registration) {
            errors.registration =
                'Registration is required.';
        }
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return null;
        }
        return {
            make,
            model,
            year,
            color,
            fuelType,
            registration,
            isPrimary: form.isPrimary,
        };
    }
    async function handleSubmit() {
        const input = validateForm();
        if (!input) {
            return;
        }
        const savedVehicle = await createVehicle(input);
        if (savedVehicle) {
            router.dismissTo('/profile');
        }
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsx(KeyboardAvoidingView, { style: styles.keyboardView, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, disabled: isCreatingVehicle, onPress: () => router.dismissTo('/profile'), style: [
                                    styles.backButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                    styles.headerTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Add Vehicle" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Vehicle Information" }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Add another vehicle to your MechanIQ account." }), _jsxs(View, { style: [
                            styles.formCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(VehicleField, { label: "Make", placeholder: "e.g. BMW", value: form.make, error: formErrors.make, onChangeText: (value) => updateField('make', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(VehicleField, { label: "Model", placeholder: "e.g. 320i", value: form.model, error: formErrors.model, onChangeText: (value) => updateField('model', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(VehicleField, { label: "Year", placeholder: "e.g. 2019", value: form.year, error: formErrors.year, keyboardType: "number-pad", maxLength: 4, onChangeText: (value) => updateField('year', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(VehicleField, { label: "Colour", placeholder: "e.g. Black", value: form.color, error: formErrors.color, onChangeText: (value) => updateField('color', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(VehicleField, { label: "Fuel Type", placeholder: "e.g. Petrol 95", value: form.fuelType, error: formErrors.fuelType, onChangeText: (value) => updateField('fuelType', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(VehicleField, { label: "Registration", placeholder: "e.g. CAA 123 456", value: form.registration, error: formErrors.registration, autoCapitalize: "characters", onChangeText: (value) => updateField('registration', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsxs(View, { style: [
                                    styles.primaryRow,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(View, { style: [
                                            styles.primaryIcon,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 21, color: colors.accent }) }), _jsxs(View, { style: styles.primaryContent, children: [_jsx(Text, { style: [
                                                    styles.primaryTitle,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: "Set as Primary Vehicle" }), _jsx(Text, { style: [
                                                    styles.primaryDescription,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Use this vehicle as the default vehicle across MechanIQ." })] }), _jsx(Switch, { value: form.isPrimary, disabled: isCreatingVehicle, onValueChange: (value) => updateField('isPrimary', value), trackColor: {
                                            false: colors.border,
                                            true: colors.accent,
                                        }, thumbColor: "#FFFFFF" })] })] }), createVehicleError ? (_jsxs(View, { style: [
                            styles.errorCard,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 19, color: colors.danger }), _jsx(Text, { style: [
                                    styles.errorText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: createVehicleError })] })) : null, _jsxs(View, { style: [
                            styles.noticeCard,
                            {
                                borderColor: colors.warning,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 20, color: colors.warning }), _jsx(Text, { style: [
                                    styles.noticeText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Your vehicle will only be added after the MechanIQ backend confirms the saved vehicle record. Internal vehicle model mapping is handled by the backend." })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isCreatingVehicle, onPress: handleSubmit, style: [
                            styles.submitButton,
                            {
                                backgroundColor: colors.accent,
                                opacity: isCreatingVehicle
                                    ? 0.6
                                    : 1,
                            },
                        ], children: [isCreatingVehicle ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "plus-circle-outline", size: 21, color: "#000000" })), _jsx(Text, { style: styles.submitButtonText, children: isCreatingVehicle
                                    ? 'Adding Vehicle...'
                                    : 'Add Vehicle' })] })] }) }) }));
}
function VehicleField({ label, placeholder, value, error, keyboardType = 'default', maxLength, autoCapitalize = 'words', onChangeText, textColor, secondaryTextColor, borderColor, dangerColor, }) {
    return (_jsxs(View, { style: styles.field, children: [_jsx(Text, { style: [
                    styles.fieldLabel,
                    {
                        color: textColor,
                    },
                ], children: label }), _jsx(TextInput, { value: value, onChangeText: onChangeText, placeholder: placeholder, placeholderTextColor: secondaryTextColor, keyboardType: keyboardType, maxLength: maxLength, autoCapitalize: autoCapitalize, style: [
                    styles.input,
                    {
                        color: textColor,
                        borderColor: error
                            ? dangerColor
                            : borderColor,
                    },
                ] }), error ? (_jsx(Text, { style: [
                    styles.fieldError,
                    {
                        color: dangerColor,
                    },
                ], children: error })) : null] }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 36,
    },
    header: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
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
        marginTop: 5,
        fontSize: 12,
        lineHeight: 18,
    },
    formCard: {
        marginTop: 18,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
        gap: 14,
    },
    field: {
        gap: 6,
    },
    fieldLabel: {
        fontSize: 11,
        fontWeight: '700',
    },
    input: {
        minHeight: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 12,
    },
    fieldError: {
        fontSize: 9,
        lineHeight: 13,
    },
    primaryRow: {
        minHeight: 76,
        paddingTop: 14,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    primaryIcon: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryContent: {
        flex: 1,
    },
    primaryTitle: {
        fontSize: 11,
        fontWeight: '700',
    },
    primaryDescription: {
        marginTop: 4,
        fontSize: 9,
        lineHeight: 14,
    },
    errorCard: {
        marginTop: 14,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    errorText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 15,
    },
    noticeCard: {
        marginTop: 14,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    noticeText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 15,
    },
    submitButton: {
        minHeight: 50,
        marginTop: 18,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
});
