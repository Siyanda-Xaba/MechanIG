import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';

import { Ionicons } from '@expo/vector-icons';

import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';

import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
    applyActionCode,
    signOut,
} from 'firebase/auth';

import { auth } from '../../src/firebase/firebase';

import { useTheme } from '../../src/theme/ThemeContext';

function getSingleParam(value) {
    return Array.isArray(value)
        ? value[0]
        : value;
}

function getVerificationError(error) {
    switch (error?.code) {
        case 'auth/expired-action-code':
            return 'This verification link has expired. Please request a new verification email.';

        case 'auth/invalid-action-code':
            return 'This verification link is invalid or has already been used. If you have already verified your email, try logging in.';

        case 'auth/network-request-failed':
            return 'An internet connection is required to verify your email. Please reconnect and try again.';

        default:
            return 'We could not verify your email address. Please try again or contact support.';
    }
}

export default function VerifyEmailScreen() {
    const router = useRouter();

    const { colors } = useTheme();

    const params = useLocalSearchParams();

    const mode = getSingleParam(params.mode);

    const actionCode = getSingleParam(params.oobCode);

    const [status, setStatus] = useState('loading');

    const [message, setMessage] = useState(
        'Confirming your email address with Firebase...'
    );

    const [attempt, setAttempt] = useState(0);

    const successAlertShownRef = useRef(false);

    const styles = createStyles(colors);

    useEffect(() => {
        let active = true;

        async function verifyEmail() {
            if (!actionCode) {
                setStatus('error');

                setMessage(
                    'No verification code was received. If you already verified your email through your browser, return to Login and sign in to confirm your verification.'
                );

                return;
            }

            if (mode && mode !== 'verifyEmail') {
                setStatus('error');

                setMessage(
                    'This link is not an email verification link.'
                );

                return;
            }

            setStatus('loading');

            setMessage(
                'Confirming your email address with Firebase...'
            );

            try {
                /*
                 * Firebase is the source of truth.
                 *
                 * Do not treat URL parameters such
                 * as verified=true as proof of
                 * email verification.
                 */
                await applyActionCode(
                    auth,
                    actionCode
                );

                /*
                 * Verification does not grant
                 * dashboard access.
                 *
                 * Users must log in separately.
                 */
                try {
                    await signOut(auth);
                } catch {
                    // Email verification has already
                    // succeeded. Login still performs
                    // its own authentication checks.
                }

                if (!active) {
                    return;
                }

                setStatus('success');

                setMessage(
                    'Your email address has been verified successfully. You can now log in to MechanIQ.'
                );
            } catch (error) {
                if (!active) {
                    return;
                }

                setStatus('error');

                setMessage(
                    getVerificationError(error)
                );
            }
        }

        void verifyEmail();

        return () => {
            active = false;
        };
    }, [actionCode, mode, attempt]);

    useEffect(() => {
        if (
            status !== 'success' ||
            successAlertShownRef.current
        ) {
            return;
        }

        successAlertShownRef.current = true;

        if (Platform.OS !== 'web') {
            Alert.alert(
                'Email Address Verified',
                'Your email address has been verified successfully. You can now log in to MechanIQ.',
                [
                    {
                        text: 'Go to Login',
                        onPress: () => {
                            router.replace('/auth/login');
                        },
                    },
                ],
                {
                    cancelable: false,
                }
            );
        }
    }, [status, router]);

    function goToLogin() {
        router.replace('/auth/login');
    }

    function retryVerification() {
        setAttempt((current) => current + 1);
    }

    const isLoading = status === 'loading';

    const isSuccess = status === 'success';

    const iconName = isSuccess
        ? 'checkmark-circle'
        : status === 'error'
            ? 'alert-circle-outline'
            : 'mail-outline';

    const iconColor = isSuccess
        ? colors.success
        : status === 'error'
            ? colors.danger
            : colors.accent;

    return _jsx(SafeAreaView, {
        style: styles.container,
        children: _jsxs(View, {
            style: styles.content,
            children: [
                _jsx(Ionicons, {
                    name: iconName,
                    size: 76,
                    color: iconColor,
                }),

                _jsx(Text, {
                    style: styles.title,
                    children: isSuccess
                        ? 'Email Verified'
                        : status === 'error'
                            ? 'Verification Unavailable'
                            : 'Verifying Your Email',
                }),

                _jsx(Text, {
                    style: styles.message,
                    children: message,
                }),

                isLoading &&
                    _jsx(ActivityIndicator, {
                        size: 'large',
                        color: colors.accent,
                        style: styles.loader,
                    }),

                status === 'error' &&
                    !!actionCode &&
                    _jsx(TouchableOpacity, {
                        style: styles.retryButton,
                        onPress: retryVerification,
                        activeOpacity: 0.8,
                        children: _jsx(Text, {
                            style: styles.retryButtonText,
                            children: 'Try Again',
                        }),
                    }),

                !isLoading &&
                    _jsx(TouchableOpacity, {
                        style: styles.loginButton,
                        onPress: goToLogin,
                        activeOpacity: 0.85,
                        children: _jsx(Text, {
                            style: styles.loginButtonText,
                            children: 'Go to Login',
                        }),
                    }),
            ],
        }),
    });
}

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        content: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 28,
            paddingBottom: 40,
        },

        title: {
            color: colors.text,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 22,
        },

        message: {
            color: colors.secondaryText,
            fontSize: 15,
            lineHeight: 23,
            textAlign: 'center',
            marginTop: 14,
            marginBottom: 28,
        },

        loader: {
            marginTop: 12,
        },

        loginButton: {
            width: '100%',
            backgroundColor: colors.accent,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 18,
        },

        loginButtonText: {
            color: '#000000',
            fontSize: 15,
            fontWeight: 'bold',
        },

        retryButton: {
            width: '100%',
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
        },

        retryButtonText: {
            color: colors.accent,
            fontSize: 15,
            fontWeight: '600',
        },
    });
}