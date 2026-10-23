import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AntDesign, Ionicons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { getFirebaseAuthErrorMessage, sendPasswordReset, signInWithEmail, } from '../../src/auth/authService';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';

export default function LoginScreen() {
    const router = useRouter();
    const { username: paramUsername } = useLocalSearchParams();
    const { colors } = useTheme();
    const { setUser } = useUser();
    const [emailOrPhone, setEmailOrPhone] = useState(paramUsername ? String(paramUsername) : '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (paramUsername) {
            setEmailOrPhone(String(paramUsername));
        }
    }, [paramUsername]);

    async function handleSignIn() {
        const input = emailOrPhone.trim();
        if (!input) {
            Alert.alert('Required', 'Enter your mechanic username (e.g. mike@mechanic) or email.');
            return;
        }
        if (!password) {
            Alert.alert('Password required', 'Enter your password to sign in.');
            return;
        }
        try {
            setIsSubmitting(true);
            const user = await signInWithEmail(emailOrPhone, password);
            setUser(user);
            const email = (user?.email || '').toLowerCase();
            const username = (user?.username || emailOrPhone || '').toLowerCase();
            const isMechanic =
                user?.role === 'mechanic' ||
                username.includes('@mechanic') ||
                email.includes('@mechanic') ||
                username.endsWith('mechanic') ||
                email.endsWith('mechanic');
            if (isMechanic) {
                router.replace('/(mechanic)');
            } else {
                router.replace('/(customer)');
            }
        }
        catch (error) {
            Alert.alert('Unable to sign in', getFirebaseAuthErrorMessage(error));
        }
        finally {
            setIsSubmitting(false);
        }
    }
    async function handleForgotPassword() {
        if (!emailOrPhone.includes('@')) {
            Alert.alert('Enter your email', 'Enter the email address for your account, then tap Forgot Password again.');
            return;
        }
        try {
            await sendPasswordReset(emailOrPhone);
            Alert.alert('Reset email sent', 'Check your inbox for a link to reset your password.');
        }
        catch (error) {
            Alert.alert('Unable to reset password', getFirebaseAuthErrorMessage(error));
        }
    }
    function handleCreateAccount() {
        router.push('/welcome');
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsx(KeyboardAvoidingView, { style: styles.keyboardView, behavior: Platform.OS === 'ios'
                ? 'padding'
                : undefined, children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", contentContainerStyle: styles.content, children: [_jsx(View, { style: styles.backButtonSpacer }), _jsx(View, { style: styles.logoContainer, children: _jsx(Image, { source: require('../../assets/images/mechaniq-logo.png'), style: styles.logo, resizeMode: "contain" }) }), _jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Welcome Back" }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Login your account to continue" }), _jsxs(View, { style: [
                            styles.inputWrapper,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(Ionicons, { name: "person-outline", size: 20, color: colors.accent, style: styles.inputIcon }), _jsx(TextInput, { style: [
                                    styles.input,
                                    {
                                        color: colors.text,
                                    },
                                ], placeholder: "Username (e.g. mike@mechanic) or Email", placeholderTextColor: colors.secondaryText, value: emailOrPhone, onChangeText: setEmailOrPhone, autoCapitalize: "none", autoCorrect: false })] }), _jsxs(View, { style: [
                            styles.inputWrapper,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(Ionicons, { name: "lock-closed-outline", size: 20, color: colors.accent, style: styles.inputIcon }), _jsx(TextInput, { style: [
                                    styles.input,
                                    {
                                        color: colors.text,
                                    },
                                ], placeholder: "Password", placeholderTextColor: colors.secondaryText, value: password, onChangeText: setPassword, secureTextEntry: !showPassword }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => {
                                    setShowPassword((current) => !current);
                                }, accessibilityRole: "button", accessibilityLabel: showPassword
                                    ? 'Hide password'
                                    : 'Show password', children: _jsx(Ionicons, { name: showPassword
                                        ? 'eye-off-outline'
                                        : 'eye-outline', size: 20, color: colors.secondaryText }) })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: handleForgotPassword, style: styles.forgotWrapper, children: _jsx(Text, { style: [
                                styles.forgotText,
                                {
                                    color: colors.accent,
                                },
                            ], children: "Forgot Password?" }) }), _jsx(TouchableOpacity, { activeOpacity: 0.85, onPress: handleSignIn, disabled: isSubmitting, style: [
                            styles.signInButton,
                            {
                                backgroundColor: colors.accent,
                                opacity: isSubmitting ? 0.7 : 1,
                            },
                        ], children: _jsx(Text, { style: styles.signInText, children: isSubmitting ? 'SIGNING IN...' : 'SIGN IN' }) }), _jsxs(View, { style: styles.dividerRow, children: [_jsx(View, { style: [
                                    styles.dividerLine,
                                    {
                                        backgroundColor: colors.border,
                                    },
                                ] }), _jsx(Text, { style: [
                                    styles.dividerText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "OR" }), _jsx(View, { style: [
                                    styles.dividerLine,
                                    {
                                        backgroundColor: colors.border,
                                    },
                                ] })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.85, onPress: () => {
                            // Google authentication
                            // will be connected later.
                        }, style: [
                            styles.socialButton,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(AntDesign, { name: "google", size: 19, color: "#EA4335", style: styles.socialIcon }), _jsx(Text, { style: [
                                    styles.socialText,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Continue with Google" })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.85, onPress: () => {
                            // Apple authentication
                            // will be connected later.
                        }, style: [
                            styles.socialButton,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(AntDesign, { name: "apple", size: 21, color: colors.text, style: styles.socialIcon }), _jsx(Text, { style: [
                                    styles.socialText,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Continue with Apple" })] }), _jsxs(View, { style: styles.footerRow, children: [_jsxs(Text, { style: [
                                    styles.footerText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: ["Don't have an account?", ' '] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: handleCreateAccount, children: _jsx(Text, { style: [
                                        styles.footerLink,
                                        {
                                            color: colors.accent,
                                        },
                                    ], children: "Create Account" }) })] })] }) }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 40,
    },
    backButtonSpacer: {
        width: 38,
        height: 38,
        marginTop: 4,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 4,
    },
    logo: {
        width: 240,
        height: 145,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 6,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 28,
        textTransform: 'lowercase',
    },
    inputWrapper: {
        height: 56,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
    },
    forgotWrapper: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotText: {
        fontSize: 13,
        fontWeight: '600',
    },
    signInButton: {
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    signInText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontSize: 13,
        marginHorizontal: 14,
    },
    socialButton: {
        height: 56,
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIcon: {
        marginRight: 10,
    },
    socialText: {
        fontSize: 14,
    },
    footerRow: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
    },
    footerLink: {
        fontSize: 12,
        fontWeight: '700',
    },
});
