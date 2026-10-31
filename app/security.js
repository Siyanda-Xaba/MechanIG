import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useChangeCustomerPassword } from '../src/customer/useChangeCustomerPassword';
import { useCustomerSecuritySettings } from '../src/customer/useCustomerSecuritySettings';
import { useUpdateCustomerBiometricPreference } from '../src/customer/useUpdateCustomerBiometricPreference';
import { useTheme } from '../src/theme/ThemeContext';
import { useUser } from '../src/users/UserContext';
export default function SecurityScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, isLoadingUser, } = useUser();
    const { securitySettings, isLoadingSecuritySettings, securitySettingsError, refreshSecuritySettings, } = useCustomerSecuritySettings(user?.id ?? null);
    const { isChangingPassword, changePasswordError, changePassword, clearChangePasswordError, } = useChangeCustomerPassword();
    const { isUpdatingBiometricPreference, biometricPreferenceError, updateBiometricPreference, clearBiometricPreferenceError, } = useUpdateCustomerBiometricPreference();
    const [biometricEnabled, setBiometricEnabled,] = useState(false);
    const [passwordForm, setPasswordForm,] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordErrors, setPasswordErrors,] = useState({});
    const [showCurrentPassword, setShowCurrentPassword,] = useState(false);
    const [showNewPassword, setShowNewPassword,] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword,] = useState(false);
    useEffect(() => {
        if (securitySettings
            ?.biometricSignInEnabled ===
            null) {
            return;
        }
        if (typeof securitySettings
            ?.biometricSignInEnabled ===
            'boolean') {
            setBiometricEnabled(securitySettings.biometricSignInEnabled);
        }
    }, [securitySettings]);
    const isLoading = isLoadingUser ||
        isLoadingSecuritySettings;
    function updatePasswordField(field, value) {
        setPasswordForm((current) => ({
            ...current,
            [field]: value,
        }));
        setPasswordErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
        clearChangePasswordError();
    }
    function validatePasswordForm() {
        const errors = {};
        if (!passwordForm.currentPassword) {
            errors.currentPassword =
                'Current password is required.';
        }
        if (!passwordForm.newPassword) {
            errors.newPassword =
                'New password is required.';
        }
        else if (passwordForm.newPassword.length <
            8) {
            errors.newPassword =
                'New password must be at least 8 characters.';
        }
        if (!passwordForm.confirmPassword) {
            errors.confirmPassword =
                'Confirm your new password.';
        }
        else if (passwordForm.newPassword !==
            passwordForm.confirmPassword) {
            errors.confirmPassword =
                'Passwords do not match.';
        }
        setPasswordErrors(errors);
        return (Object.keys(errors).length === 0);
    }
    async function handleChangePassword() {
        if (!user) {
            return;
        }
        if (!validatePasswordForm()) {
            return;
        }
        const succeeded = await changePassword({
            customerId: user.id,
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
        });
        if (!succeeded) {
            return;
        }
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setPasswordErrors({});
        await refreshSecuritySettings();
    }
    async function handleBiometricChange(enabled) {
        if (!user) {
            return;
        }
        clearBiometricPreferenceError();
        const savedSettings = await updateBiometricPreference({
            customerId: user.id,
            enabled,
        });
        if (savedSettings
            ?.biometricSignInEnabled ===
            null ||
            typeof savedSettings
                ?.biometricSignInEnabled !==
                'boolean') {
            return;
        }
        setBiometricEnabled(savedSettings.biometricSignInEnabled);
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsx(KeyboardAvoidingView, { style: styles.keyboardView, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, disabled: isChangingPassword ||
                                    isUpdatingBiometricPreference, onPress: () => router.dismissTo('/profile'), style: [
                                    styles.backButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                    styles.headerTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Security" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Account Security" }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Manage password, authentication, and account security preferences." }), isLoading ? (_jsxs(View, { style: [
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
                                ], children: "Loading Security" }), _jsx(Text, { style: [
                                    styles.stateDescription,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Retrieving your account security information." })] })) : !user ? (_jsxs(View, { style: [
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
                                ], children: "Your account information could not be loaded." })] })) : (_jsxs(_Fragment, { children: [securitySettingsError ? (_jsxs(View, { style: [
                                    styles.errorCard,
                                    {
                                        borderColor: colors.danger,
                                    },
                                ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 19, color: colors.danger }), _jsxs(View, { style: styles.errorContent, children: [_jsx(Text, { style: [
                                                    styles.errorText,
                                                    {
                                                        color: colors.danger,
                                                    },
                                                ], children: securitySettingsError }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshSecuritySettings, style: [
                                                    styles.inlineRetryButton,
                                                    {
                                                        borderColor: colors.border,
                                                    },
                                                ], children: _jsx(Text, { style: [
                                                        styles.inlineRetryText,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: "Try Again" }) })] })] })) : null, _jsx(Text, { style: [
                                    styles.sectionTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Security Overview" }), _jsxs(View, { style: [
                                    styles.overviewCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(SecurityInfoRow, { icon: "devices", label: "Active Sessions", value: securitySettings
                                            ?.activeSessionCount !==
                                            null &&
                                            securitySettings
                                                ?.activeSessionCount !==
                                                undefined
                                            ? String(securitySettings.activeSessionCount)
                                            : 'Unavailable', textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent, borderColor: colors.border }), _jsx(SecurityInfoRow, { icon: "lock-clock", label: "Password Last Changed", value: securitySettings
                                            ?.lastPasswordChangedAt ??
                                            'Unavailable', isLast: true, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent, borderColor: colors.border })] }), _jsx(Text, { style: [
                                    styles.sectionTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Biometric Sign-In" }), _jsxs(View, { style: [
                                    styles.biometricCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(View, { style: [
                                            styles.biometricIcon,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: _jsx(MaterialCommunityIcons, { name: "fingerprint", size: 27, color: colors.accent }) }), _jsxs(View, { style: styles.biometricContent, children: [_jsx(Text, { style: [
                                                    styles.biometricTitle,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: "Use Biometrics" }), _jsx(Text, { style: [
                                                    styles.biometricDescription,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Biometric sign-in is not available yet; this setting will stay off until secure device authentication is connected." })] }), isUpdatingBiometricPreference ? (_jsx(ActivityIndicator, { size: "small", color: colors.accent })) : (_jsx(Switch, { value: false, disabled: true }))] }), biometricPreferenceError ? (_jsxs(View, { style: [
                                    styles.errorCard,
                                    {
                                        borderColor: colors.danger,
                                    },
                                ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 19, color: colors.danger }), _jsx(Text, { style: [
                                            styles.errorText,
                                            {
                                                color: colors.danger,
                                            },
                                        ], children: biometricPreferenceError })] })) : null, _jsx(Text, { style: [
                                    styles.sectionTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Change Password" }), _jsxs(View, { style: [
                                    styles.passwordCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(PasswordField, { label: "Current Password", value: passwordForm.currentPassword, error: passwordErrors.currentPassword, showPassword: showCurrentPassword, onToggleVisibility: () => setShowCurrentPassword((current) => !current), onChangeText: (value) => updatePasswordField('currentPassword', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(PasswordField, { label: "New Password", value: passwordForm.newPassword, error: passwordErrors.newPassword, showPassword: showNewPassword, onToggleVisibility: () => setShowNewPassword((current) => !current), onChangeText: (value) => updatePasswordField('newPassword', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), _jsx(PasswordField, { label: "Confirm New Password", value: passwordForm.confirmPassword, error: passwordErrors.confirmPassword, showPassword: showConfirmPassword, onToggleVisibility: () => setShowConfirmPassword((current) => !current), onChangeText: (value) => updatePasswordField('confirmPassword', value), textColor: colors.text, secondaryTextColor: colors.secondaryText, borderColor: colors.border, dangerColor: colors.danger }), changePasswordError ? (_jsxs(View, { style: [
                                            styles.passwordError,
                                            {
                                                borderColor: colors.danger,
                                            },
                                        ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 18, color: colors.danger }), _jsx(Text, { style: [
                                                    styles.errorText,
                                                    {
                                                        color: colors.danger,
                                                    },
                                                ], children: changePasswordError })] })) : null, _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isChangingPassword, onPress: handleChangePassword, style: [
                                            styles.changePasswordButton,
                                            {
                                                backgroundColor: colors.accent,
                                                opacity: isChangingPassword
                                                    ? 0.6
                                                    : 1,
                                            },
                                        ], children: [isChangingPassword ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "lock-reset", size: 20, color: "#000000" })), _jsx(Text, { style: styles.changePasswordText, children: isChangingPassword
                                                    ? 'Updating...'
                                                    : 'Update Password' })] })] }), _jsxs(View, { style: [
                                    styles.noticeCard,
                                    {
                                        borderColor: colors.warning,
                                    },
                                ], children: [_jsx(MaterialCommunityIcons, { name: "shield-alert-outline", size: 21, color: colors.warning }), _jsx(Text, { style: [
                                            styles.noticeText,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: "Password changes, active sessions, and biometric sign-in depend on the shared MechanIQ authentication backend. Biometrics also require secure device authentication and secure credential storage before they can be enabled." })] })] }))] }) }) }));
}
function SecurityInfoRow({ icon, label, value, isLast = false, textColor, secondaryTextColor, accentColor, borderColor, }) {
    return (_jsxs(View, { style: [
            styles.securityInfoRow,
            !isLast
                ? {
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                }
                : null,
        ], children: [_jsx(View, { style: [
                    styles.securityInfoIcon,
                    {
                        borderColor: accentColor,
                    },
                ], children: _jsx(MaterialCommunityIcons, { name: icon, size: 20, color: accentColor }) }), _jsxs(View, { style: styles.securityInfoContent, children: [_jsx(Text, { style: [
                            styles.securityInfoLabel,
                            {
                                color: secondaryTextColor,
                            },
                        ], children: label }), _jsx(Text, { style: [
                            styles.securityInfoValue,
                            {
                                color: textColor,
                            },
                        ], children: value })] })] }));
}
function PasswordField({ label, value, error, showPassword, onToggleVisibility, onChangeText, textColor, secondaryTextColor, borderColor, dangerColor, }) {
    return (_jsxs(View, { style: styles.field, children: [_jsx(Text, { style: [
                    styles.fieldLabel,
                    {
                        color: textColor,
                    },
                ], children: label }), _jsxs(View, { style: [
                    styles.passwordInputWrapper,
                    {
                        borderColor: error
                            ? dangerColor
                            : borderColor,
                    },
                ], children: [_jsx(TextInput, { value: value, onChangeText: onChangeText, placeholder: "Enter password", placeholderTextColor: secondaryTextColor, secureTextEntry: !showPassword, autoCapitalize: "none", autoCorrect: false, style: [
                            styles.passwordInput,
                            {
                                color: textColor,
                            },
                        ] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: onToggleVisibility, style: styles.visibilityButton, children: _jsx(Ionicons, { name: showPassword
                                ? 'eye-off-outline'
                                : 'eye-outline', size: 20, color: secondaryTextColor }) })] }), error ? (_jsx(Text, { style: [
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
    sectionTitle: {
        marginTop: 20,
        marginBottom: 9,
        fontSize: 15,
        fontWeight: '700',
    },
    stateCard: {
        minHeight: 230,
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
    errorCard: {
        marginTop: 18,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    errorContent: {
        flex: 1,
    },
    errorText: {
        flex: 1,
        fontSize: 9.5,
        lineHeight: 14,
    },
    inlineRetryButton: {
        alignSelf: 'flex-start',
        marginTop: 9,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderWidth: 1,
        borderRadius: 7,
    },
    inlineRetryText: {
        fontSize: 9,
        fontWeight: '700',
    },
    overviewCard: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
    },
    securityInfoRow: {
        minHeight: 70,
        flexDirection: 'row',
        alignItems: 'center',
    },
    securityInfoIcon: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    securityInfoContent: {
        flex: 1,
        marginLeft: 12,
    },
    securityInfoLabel: {
        fontSize: 9,
    },
    securityInfoValue: {
        marginTop: 3,
        fontSize: 11.5,
        fontWeight: '600',
    },
    biometricCard: {
        minHeight: 84,
        padding: 13,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    biometricIcon: {
        width: 44,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    biometricContent: {
        flex: 1,
        marginHorizontal: 11,
    },
    biometricTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    biometricDescription: {
        marginTop: 4,
        fontSize: 9,
        lineHeight: 14,
    },
    passwordCard: {
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
    passwordInputWrapper: {
        minHeight: 48,
        paddingLeft: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        minHeight: 46,
        fontSize: 12,
    },
    visibilityButton: {
        width: 44,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldError: {
        fontSize: 9,
        lineHeight: 13,
    },
    passwordError: {
        padding: 11,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    changePasswordButton: {
        minHeight: 48,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    changePasswordText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '800',
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
