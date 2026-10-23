import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useCreateCustomerSavedAddress } from '../src/customer/useCreateCustomerSavedAddress';
import { useCustomerSavedAddresses } from '../src/customer/useCustomerSavedAddresses';
import { useTheme } from '../src/theme/ThemeContext';
import { useUser } from '../src/users/UserContext';
export default function SavedAddressesScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, isLoadingUser, } = useUser();
    const { savedAddresses, isLoadingSavedAddresses, savedAddressesError, refreshSavedAddresses, } = useCustomerSavedAddresses(user?.id ?? null);
    const { isCreatingSavedAddress, createSavedAddressError, createSavedAddress, clearCreateSavedAddressError, } = useCreateCustomerSavedAddress();
    const [isAddingAddress, setIsAddingAddress,] = useState(false);
    const [form, setForm,] = useState({
        label: '',
        address: '',
        isDefault: false,
    });
    const [formErrors, setFormErrors,] = useState({});
    const isLoading = isLoadingUser ||
        isLoadingSavedAddresses;
    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
        setFormErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
        clearCreateSavedAddressError();
    }
    function resetForm() {
        setForm({
            label: '',
            address: '',
            isDefault: false,
        });
        setFormErrors({});
        clearCreateSavedAddressError();
    }
    function handleCancelAdd() {
        resetForm();
        setIsAddingAddress(false);
    }
    function validateForm() {
        const errors = {};
        const label = form.label.trim();
        const address = form.address.trim();
        if (!label) {
            errors.label =
                'Address label is required.';
        }
        if (!address) {
            errors.address =
                'Address is required.';
        }
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return null;
        }
        return {
            label,
            address,
        };
    }
    async function handleSaveAddress() {
        if (!user) {
            return;
        }
        const values = validateForm();
        if (!values) {
            return;
        }
        const savedAddress = await createSavedAddress({
            customerId: user.id,
            label: values.label,
            address: values.address,
            isDefault: form.isDefault,
        });
        if (!savedAddress) {
            return;
        }
        resetForm();
        setIsAddingAddress(false);
        await refreshSavedAddresses();
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsx(KeyboardAvoidingView, { style: styles.keyboardView, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/profile'), style: [
                                    styles.backButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                    styles.headerTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Saved Addresses" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Your Locations" }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Manage addresses that can later be reused across supported MechanIQ services." }), !isAddingAddress ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setIsAddingAddress(true), style: [
                            styles.addButton,
                            {
                                backgroundColor: colors.accent,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "plus-circle-outline", size: 20, color: "#000000" }), _jsx(Text, { style: styles.addButtonText, children: "Add Address" })] })) : (_jsxs(View, { style: [
                            styles.formCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(Text, { style: [
                                    styles.formTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Add Saved Address" }), _jsx(AddressField, { label: "Label", value: form.label, placeholder: "e.g. Home", error: formErrors.label, onChangeText: (value) => updateField('label', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(AddressField, { label: "Address", value: form.address, placeholder: "Enter full address", error: formErrors.address, multiline: true, onChangeText: (value) => updateField('address', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsxs(View, { style: [
                                    styles.defaultRow,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsxs(View, { style: styles.defaultText, children: [_jsx(Text, { style: [
                                                    styles.defaultTitle,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: "Set as Default" }), _jsx(Text, { style: [
                                                    styles.defaultDescription,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Use this as the preferred saved address where supported." })] }), _jsx(Switch, { value: form.isDefault, disabled: isCreatingSavedAddress, onValueChange: (value) => {
                                            clearCreateSavedAddressError();
                                            setForm((current) => ({
                                                ...current,
                                                isDefault: value,
                                            }));
                                        } })] }), createSavedAddressError ? (_jsxs(View, { style: [
                                    styles.errorCard,
                                    {
                                        borderColor: colors.danger,
                                    },
                                ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 18, color: colors.danger }), _jsx(Text, { style: [
                                            styles.errorText,
                                            {
                                                color: colors.danger,
                                            },
                                        ], children: createSavedAddressError })] })) : null, _jsxs(View, { style: styles.formActions, children: [_jsx(TouchableOpacity, { activeOpacity: 0.75, disabled: isCreatingSavedAddress, onPress: handleCancelAdd, style: [
                                            styles.cancelButton,
                                            {
                                                borderColor: colors.border,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                styles.cancelButtonText,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Cancel" }) }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isCreatingSavedAddress, onPress: handleSaveAddress, style: [
                                            styles.saveButton,
                                            {
                                                backgroundColor: colors.accent,
                                                opacity: isCreatingSavedAddress
                                                    ? 0.6
                                                    : 1,
                                            },
                                        ], children: [isCreatingSavedAddress ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "content-save-outline", size: 18, color: "#000000" })), _jsx(Text, { style: styles.saveButtonText, children: isCreatingSavedAddress
                                                    ? 'Saving...'
                                                    : 'Save Address' })] })] })] })), isLoading ? (_jsxs(View, { style: [
                            styles.stateCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                    styles.stateTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Loading Addresses" }), _jsx(Text, { style: [
                                    styles.stateDescription,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Retrieving your saved locations." })] })) : !user ? (_jsxs(View, { style: [
                            styles.stateCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(Ionicons, { name: "person-outline", size: 40, color: colors.secondaryText }), _jsx(Text, { style: [
                                    styles.stateTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Customer Unavailable" }), _jsx(Text, { style: [
                                    styles.stateDescription,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Your account information could not be loaded." })] })) : savedAddressesError ? (_jsxs(View, { style: [
                            styles.stateCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 40, color: colors.warning }), _jsx(Text, { style: [
                                    styles.stateTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Addresses Unavailable" }), _jsx(Text, { style: [
                                    styles.stateDescription,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: savedAddressesError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshSavedAddresses, style: [
                                    styles.retryButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(MaterialCommunityIcons, { name: "refresh", size: 18, color: colors.text }), _jsx(Text, { style: [
                                            styles.retryButtonText,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: "Try Again" })] })] })) : savedAddresses.length ===
                        0 ? (_jsxs(View, { style: [
                            styles.stateCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "map-marker-outline", size: 42, color: colors.secondaryText }), _jsx(Text, { style: [
                                    styles.stateTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "No Saved Addresses" }), _jsx(Text, { style: [
                                    styles.stateDescription,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Add an address above. It will only appear here after the backend confirms that it has been saved." })] })) : (_jsx(View, { style: styles.addressList, children: savedAddresses.map((savedAddress) => (_jsxs(View, { style: [
                                styles.addressCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(View, { style: [
                                        styles.addressIcon,
                                        {
                                            borderColor: colors.accent,
                                        },
                                    ], children: _jsx(MaterialCommunityIcons, { name: "map-marker-outline", size: 22, color: colors.accent }) }), _jsxs(View, { style: styles.addressContent, children: [_jsxs(View, { style: styles.addressHeader, children: [_jsx(Text, { style: [
                                                        styles.addressLabel,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: savedAddress.label }), savedAddress.isDefault ? (_jsx(View, { style: [
                                                        styles.defaultBadge,
                                                        {
                                                            borderColor: colors.accent,
                                                        },
                                                    ], children: _jsx(Text, { style: [
                                                            styles.defaultBadgeText,
                                                            {
                                                                color: colors.accent,
                                                            },
                                                        ], children: "Default" }) })) : null] }), _jsx(Text, { style: [
                                                styles.addressValue,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: savedAddress.address })] })] }, savedAddress.id))) })), _jsxs(View, { style: [
                            styles.noticeCard,
                            {
                                borderColor: colors.warning,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 20, color: colors.warning }), _jsx(Text, { style: [
                                    styles.noticeText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Address validation, geocoding, persistent storage, and default address rules are owned by the backend. The app does not invent coordinates or treat local form data as a saved address." })] })] }) }) }));
}
function AddressField({ label, value, placeholder, error, multiline = false, onChangeText, textColor, secondaryTextColor, borderColor, dangerColor, }) {
    return (_jsxs(View, { style: styles.field, children: [_jsx(Text, { style: [
                    styles.fieldLabel,
                    {
                        color: textColor,
                    },
                ], children: label }), _jsx(TextInput, { value: value, onChangeText: onChangeText, placeholder: placeholder, placeholderTextColor: secondaryTextColor, multiline: multiline, textAlignVertical: multiline
                    ? 'top'
                    : 'center', autoCapitalize: "words", style: [
                    styles.input,
                    multiline &&
                        styles.multilineInput,
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
    addButton: {
        minHeight: 48,
        marginTop: 18,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
    formCard: {
        marginTop: 18,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
        gap: 14,
    },
    formTitle: {
        fontSize: 15,
        fontWeight: '700',
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
    multilineInput: {
        minHeight: 90,
        paddingTop: 12,
        paddingBottom: 12,
    },
    fieldError: {
        fontSize: 9,
        lineHeight: 13,
    },
    defaultRow: {
        minHeight: 72,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    defaultText: {
        flex: 1,
    },
    defaultTitle: {
        fontSize: 11,
        fontWeight: '700',
    },
    defaultDescription: {
        marginTop: 3,
        fontSize: 9,
        lineHeight: 14,
    },
    errorCard: {
        padding: 11,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    errorText: {
        flex: 1,
        fontSize: 9.5,
        lineHeight: 14,
    },
    formActions: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        minHeight: 46,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    saveButton: {
        flex: 1.4,
        minHeight: 46,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    saveButtonText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '800',
    },
    stateCard: {
        minHeight: 220,
        marginTop: 18,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateTitle: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    stateDescription: {
        marginTop: 7,
        maxWidth: 310,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    retryButton: {
        minHeight: 42,
        marginTop: 16,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    retryButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    addressList: {
        marginTop: 18,
        gap: 10,
    },
    addressCard: {
        minHeight: 84,
        padding: 13,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressIcon: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressContent: {
        flex: 1,
        marginLeft: 11,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    addressLabel: {
        flexShrink: 1,
        fontSize: 12,
        fontWeight: '700',
    },
    defaultBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 5,
    },
    defaultBadgeText: {
        fontSize: 8,
        fontWeight: '700',
    },
    addressValue: {
        marginTop: 5,
        fontSize: 9.5,
        lineHeight: 14,
    },
    noticeCard: {
        marginTop: 18,
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
});
