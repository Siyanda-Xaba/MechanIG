import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useTheme } from '../src/theme/ThemeContext';
import { useUpdateUserProfile } from '../src/users/useUpdateUserProfile';
import { useUser } from '../src/users/UserContext';
export default function PersonalInformationScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, isLoadingUser, } = useUser();
    const { isUpdatingProfile, updateProfileError, updateProfile, clearUpdateProfileError, } = useUpdateUserProfile();
    const [form, setForm,] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [formErrors, setFormErrors,] = useState({});
    useEffect(() => {
        if (!user) {
            return;
        }
        setForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
        });
    }, [user]);
    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
        setFormErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
        clearUpdateProfileError();
    }
    function validateForm() {
        const errors = {};
        const firstName = form.firstName.trim();
        const lastName = form.lastName.trim();
        const email = form.email.trim().toLowerCase();
        const phone = form.phone.trim();
        if (!firstName) {
            errors.firstName =
                'First name is required.';
        }
        if (!lastName) {
            errors.lastName =
                'Last name is required.';
        }
        if (!email) {
            errors.email =
                'Email address is required.';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email =
                'Enter a valid email address.';
        }
        if (!phone) {
            errors.phone =
                'Phone number is required.';
        }
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return null;
        }
        return {
            firstName,
            lastName,
            email,
            phone,
        };
    }
    async function handleSave() {
        if (!user) {
            return;
        }
        const values = validateForm();
        if (!values) {
            return;
        }
        const savedUser = await updateProfile({
            userId: user.id,
            ...values,
        });
        if (savedUser) {
            router.dismissTo('/profile');
        }
    }
    if (isLoadingUser) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                        styles.loadingText,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Loading profile..." })] }));
    }
    if (!user) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(Ionicons, { name: "person-outline", size: 44, color: colors.secondaryText }), _jsx(Text, { style: [
                        styles.stateTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Profile Unavailable" }), _jsx(Text, { style: [
                        styles.loadingText,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Your profile information could not be loaded." }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/profile'), style: [
                        styles.secondaryButton,
                        {
                            borderColor: colors.border,
                        },
                    ], children: _jsx(Text, { style: [
                            styles.secondaryButtonText,
                            {
                                color: colors.text,
                            },
                        ], children: "Go Back" }) })] }));
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsx(KeyboardAvoidingView, { style: styles.keyboardView, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, disabled: isUpdatingProfile, onPress: () => router.dismissTo('/profile'), style: [
                                    styles.backButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                    styles.headerTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Personal Information" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Your Details" }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Review and update the personal information linked to your MechanIQ account." }), _jsxs(View, { style: [
                            styles.formCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(ProfileField, { label: "First Name", value: form.firstName, error: formErrors.firstName, placeholder: "First name", onChangeText: (value) => updateField('firstName', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(ProfileField, { label: "Last Name", value: form.lastName, error: formErrors.lastName, placeholder: "Last name", onChangeText: (value) => updateField('lastName', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(ProfileField, { label: "Email Address", value: form.email, error: formErrors.email, placeholder: "Email address", keyboardType: "email-address", autoCapitalize: "none", onChangeText: (value) => updateField('email', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(ProfileField, { label: "Phone Number", value: form.phone, error: formErrors.phone, placeholder: "Phone number", keyboardType: "phone-pad", autoCapitalize: "none", onChangeText: (value) => updateField('phone', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger })] }), updateProfileError ? (_jsxs(View, { style: [
                            styles.errorCard,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 19, color: colors.danger }), _jsx(Text, { style: [
                                    styles.errorText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: updateProfileError })] })) : null, _jsxs(View, { style: [
                            styles.noticeCard,
                            {
                                borderColor: colors.warning,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 20, color: colors.warning }), _jsx(Text, { style: [
                                    styles.noticeText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Changes are only applied to the shared user profile after the MechanIQ backend confirms the updated account information." })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isUpdatingProfile, onPress: handleSave, style: [
                            styles.saveButton,
                            {
                                backgroundColor: colors.accent,
                                opacity: isUpdatingProfile
                                    ? 0.6
                                    : 1,
                            },
                        ], children: [isUpdatingProfile ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "content-save-outline", size: 20, color: "#000000" })), _jsx(Text, { style: styles.saveButtonText, children: isUpdatingProfile
                                    ? 'Saving...'
                                    : 'Save Changes' })] })] }) }) }));
}
function ProfileField({ label, value, placeholder, error, keyboardType = 'default', autoCapitalize = 'words', onChangeText, textColor, secondaryTextColor, borderColor, dangerColor, }) {
    return (_jsxs(View, { style: styles.field, children: [_jsx(Text, { style: [
                    styles.fieldLabel,
                    {
                        color: textColor,
                    },
                ], children: label }), _jsx(TextInput, { value: value, onChangeText: onChangeText, placeholder: placeholder, placeholderTextColor: secondaryTextColor, keyboardType: keyboardType, autoCapitalize: autoCapitalize, style: [
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
    centeredPage: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
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
    saveButton: {
        minHeight: 50,
        marginTop: 18,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    saveButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    stateTitle: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: '700',
    },
    secondaryButton: {
        minHeight: 44,
        marginTop: 18,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
});
