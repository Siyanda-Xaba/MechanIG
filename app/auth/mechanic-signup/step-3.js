import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Switch, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext';
import { getFirebaseAuthErrorMessage, registerWithEmail, } from '../../../src/auth/authService';
import StableScrollView from '../../../src/components/StableScrollView';
import { CYAN, GREEN, PasswordRow, SignUpFooter, SignUpHeader, styles, } from '../../../src/auth/mechanic/MechanicSignUpShared';
import { useUser } from '../../../src/users/UserContext';

export default function MechanicSignUpStep3() {
    const router = useRouter();
    const { step1Data, step2Data, resetMechanicSignUp, } = useMechanicSignUp();
    const { setUser } = useUser();
    const [password, setPassword,] = useState('');
    const [confirmPassword, setConfirmPassword,] = useState('');
    const [passwordVisible, setPasswordVisible,] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible,] = useState(false);
    const [verificationCode, setVerificationCode,] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled,] = useState(false);
    const [agreedToTerms, setAgreedToTerms,] = useState(false);

    const passwordRequirements = [
        {
            label: 'At least 8 characters long',
            met: password.length >= 8,
        },
        {
            label: 'Include uppercase and lowercase letters',
            met: /[a-z]/.test(password) &&
                /[A-Z]/.test(password),
        },
        {
            label: 'Include at least one number',
            met: /[0-9]/.test(password),
        },
        {
            label: 'Include at least one special character (e.g. @ # ! %)',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];

    const passwordIsValid = passwordRequirements.every((requirement) => requirement.met);

    function handleSendCode() {
        if (!step1Data.email.trim()) {
            Alert.alert(
                'Email required',
                'Enter your email address in Step 1 before requesting a verification code.'
            );
            return;
        }

        Alert.alert(
            'Verification unavailable',
            'Email verification will be connected when the authentication backend is available.'
        );
    }

    function handleVerifyCode() {
        if (verificationCode.length !== 6) {
            Alert.alert(
                'Invalid code',
                'Enter the 6-digit verification code.'
            );
            return;
        }

        Alert.alert(
            'Verification unavailable',
            'Verification codes cannot be validated until the authentication backend is connected.'
        );
    }

    async function handleCreateAccount() {
        if (!passwordIsValid) {
            Alert.alert(
                'Password requirements',
                'Please meet all password requirements before creating your account.'
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(
                'Passwords do not match',
                'Please make sure both password fields contain the same password.'
            );
            return;
        }

        if (!agreedToTerms) {
            Alert.alert(
                'Terms required',
                'Please agree to the Terms of Service and Privacy Policy before creating your account.'
            );
            return;
        }

        const nameParts = step1Data.fullName.trim().split(/\s+/);

        try {
            setIsSubmitting(true);

            const user = await registerWithEmail({
                email: step1Data.email,
                password,
                role: 'mechanic',
                profile: {
                    firstName: nameParts[0],
                    lastName: nameParts.slice(1).join(' '),
                    phone: step1Data.phone.trim(),
                    idNumber: step1Data.idNumber.trim(),
                    businessName: step1Data.businessName.trim(),
                    businessType: step1Data.businessType,
                    yearsInBusiness: step1Data.yearsInBusiness,
                    employees: step1Data.employees,
                    address: step1Data.address.trim(),
                    city: step1Data.city.trim(),
                    province: step1Data.province,
                    professionalDetails: step2Data,
                    twoFactorEnabled,
                    profileImageUrl: null,
                },
            });

            setUser(user);
            resetMechanicSignUp();

            Alert.alert(
                'Account created',
                'Your mechanic account has been created. We sent a verification link to your email address.',
                [
                    {
                        text: 'Continue',
                        onPress: () => router.replace('/(mechanic)'),
                    },
                ]
            );
        }
        catch (error) {
            Alert.alert(
                'Unable to create account',
                getFirebaseAuthErrorMessage(error)
            );
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        _jsx(SafeAreaView, {
            style: styles.container,
            children: _jsx(KeyboardAvoidingView, {
                style: styles.flex,
                behavior: Platform.OS === 'ios'
                    ? 'padding'
                    : undefined,
                children: _jsxs(StableScrollView, {
                    contentContainerStyle: styles.scrollContent,
                    keyboardShouldPersistTaps: "handled",
                    showsVerticalScrollIndicator: false,
                    children: [
                        _jsx(SignUpHeader, {
                            step: 3,
                            onBack: () => router.back()
                        }),
                        _jsxs(View, {
                            style: styles.section,
                            children: [
                                _jsxs(View, {
                                    style: styles.sectionHeader,
                                    children: [
                                        _jsx(Ionicons, {
                                            name: "lock-closed-outline",
                                            size: 18,
                                            color: CYAN
                                        }),
                                        _jsx(Text, {
                                            style: styles.sectionTitle,
                                            children: "SECURITY DETAILS"
                                        })
                                    ]
                                }),
                                _jsx(Text, {
                                    style: styles.sectionSubtitle,
                                    children: "Set up a strong password to keep your account safe."
                                }),
                                _jsx(PasswordRow, {
                                    label: "Create Password",
                                    placeholder: "Enter your password",
                                    value: password,
                                    onChangeText: setPassword,
                                    visible: passwordVisible,
                                    onToggleVisible: () =>
                                        setPasswordVisible((current) => !current)
                                }),
                                _jsx(PasswordRow, {
                                    label: "Confirm Password",
                                    placeholder: "Re-enter your password",
                                    value: confirmPassword,
                                    onChangeText: setConfirmPassword,
                                    visible: confirmPasswordVisible,
                                    onToggleVisible: () =>
                                        setConfirmPasswordVisible((current) => !current)
                                }),
                                _jsxs(View, {
                                    style: styles.requirementsBox,
                                    children: [
                                        _jsx(Text, {
                                            style: styles.requirementsTitle,
                                            children: "Password requirements"
                                        }),
                                        passwordRequirements.map((requirement) =>
                                            _jsxs(View, {
                                                style: styles.requirementRow,
                                                children: [
                                                    _jsx(Ionicons, {
                                                        name: requirement.met
                                                            ? 'checkmark-circle'
                                                            : 'ellipse-outline',
                                                        size: 16,
                                                        color: requirement.met
                                                            ? GREEN
                                                            : '#666666'
                                                    }),
                                                    _jsx(Text, {
                                                        style: styles.requirementText,
                                                        children: requirement.label
                                                    })
                                                ]
                                            }, requirement.label)
                                        )
                                    ]
                                })
                            ]
                        }),
                        _jsxs(View, {
                            style: styles.section,
                            children: [
                                _jsxs(View, {
                                    style: styles.sectionHeader,
                                    children: [
                                        _jsx(Ionicons, {
                                            name: "mail-outline",
                                            size: 18,
                                            color: CYAN
                                        }),
                                        _jsx(Text, {
                                            style: styles.sectionTitle,
                                            children: "EMAIL VERIFICATION"
                                        })
                                    ]
                                }),
                                _jsx(Text, {
                                    style: styles.sectionSubtitle,
                                    children: "We'll send a verification code to your email address."
                                }),
                                _jsxs(View, {
                                    style: styles.verificationInputRow,
                                    children: [
                                        _jsxs(View, {
                                            style: styles.verificationInputArea,
                                            children: [
                                                _jsx(Text, {
                                                    style: styles.fieldLabel,
                                                    children: "Email Address"
                                                }),
                                                _jsx(Text, {
                                                    style: step1Data.email
                                                        ? styles.fieldInput
                                                        : styles.fieldPlaceholder,
                                                    numberOfLines: 1,
                                                    children: step1Data.email ||
                                                        'Enter your email in Step 1'
                                                })
                                            ]
                                        }),
                                        _jsx(TouchableOpacity, {
                                            style: styles.sendCodeButton,
                                            activeOpacity: 0.8,
                                            onPress: handleSendCode,
                                            children: _jsx(Text, {
                                                style: styles.sendCodeText,
                                                children: "Send Code"
                                            })
                                        })
                                    ]
                                }),
                                _jsxs(View, {
                                    style: styles.verificationInputRow,
                                    children: [
                                        _jsxs(View, {
                                            style: styles.verificationInputArea,
                                            children: [
                                                _jsx(Text, {
                                                    style: styles.fieldLabel,
                                                    children: "Verification Code"
                                                }),
                                                _jsx(TextInput, {
                                                    style: styles.fieldInput,
                                                    placeholder: "Enter 6-digit code",
                                                    placeholderTextColor: "#666666",
                                                    keyboardType: "number-pad",
                                                    value: verificationCode,
                                                    onChangeText: (value) =>
                                                        setVerificationCode(
                                                            value.replace(/[^0-9]/g, '')
                                                        ),
                                                    maxLength: 6
                                                })
                                            ]
                                        }),
                                        _jsx(TouchableOpacity, {
                                            style: styles.verifyCodeButton,
                                            activeOpacity: 0.8,
                                            onPress: handleVerifyCode,
                                            children: _jsx(Text, {
                                                style: styles.verifyCodeText,
                                                children: "Verify Code"
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        _jsxs(View, {
                            style: styles.section,
                            children: [
                                _jsxs(View, {
                                    style: styles.sectionHeader,
                                    children: [
                                        _jsx(Ionicons, {
                                            name: "shield-outline",
                                            size: 18,
                                            color: CYAN
                                        }),
                                        _jsx(Text, {
                                            style: styles.sectionTitle,
                                            children: "TWO-FACTOR AUTHENTICATION"
                                        })
                                    ]
                                }),
                                _jsx(Text, {
                                    style: styles.sectionSubtitle,
                                    children: "Add an optional extra layer of security to protect your account."
                                }),
                                _jsxs(View, {
                                    style: styles.twoFactorRow,
                                    children: [
                                        _jsx(Ionicons, {
                                            name: "shield-checkmark-outline",
                                            size: 18,
                                            color: CYAN
                                        }),
                                        _jsxs(View, {
                                            style: styles.twoFactorTextArea,
                                            children: [
                                                _jsx(Text, {
                                                    style: styles.fieldLabel,
                                                    children: "Enable 2FA"
                                                }),
                                                _jsx(Text, {
                                                    style: styles.verificationSubtext,
                                                    children: "Receive a code when signing in from a new device"
                                                })
                                            ]
                                        }),
                                        _jsx(Switch, {
                                            value: twoFactorEnabled,
                                            onValueChange: setTwoFactorEnabled,
                                            trackColor: {
                                                false: '#444444',
                                                true: CYAN,
                                            },
                                            thumbColor: "#FFFFFF"
                                        })
                                    ]
                                })
                            ]
                        }),
                        _jsxs(TouchableOpacity, {
                            style: styles.agreeRow,
                            onPress: () =>
                                setAgreedToTerms((current) => !current),
                            activeOpacity: 0.8,
                            children: [
                                _jsx(Ionicons, {
                                    name: agreedToTerms
                                        ? 'checkbox'
                                        : 'square-outline',
                                    size: 18,
                                    color: CYAN
                                }),
                                _jsxs(Text, {
                                    style: styles.agreeText,
                                    children: [
                                        "I agree to the",
                                        ' ',
                                        _jsx(Text, {
                                            style: styles.agreeLink,
                                            children: "Terms of Service"
                                        }),
                                        ' ',
                                        "and",
                                        ' ',
                                        _jsx(Text, {
                                            style: styles.agreeLink,
                                            children: "Privacy Policy"
                                        })
                                    ]
                                })
                            ]
                        }),
                        _jsxs(View, {
                            style: styles.row,
                            children: [
                                _jsx(TouchableOpacity, {
                                    style: styles.backOutlineButton,
                                    activeOpacity: 0.85,
                                    onPress: () => router.back(),
                                    children: _jsx(Text, {
                                        style: styles.backOutlineText,
                                        children: "Back"
                                    })
                                }),
                                _jsx(View, {
                                    style: { width: 10 }
                                }),
                                _jsx(TouchableOpacity, {
                                    style: styles.continueButton,
                                    activeOpacity: 0.85,
                                    onPress: handleCreateAccount,
                                    disabled: isSubmitting,
                                    children: _jsx(Text, {
                                        style: styles.continueText,
                                        children: isSubmitting
                                            ? 'Creating Account...'
                                            : 'Create Account'
                                    })
                                })
                            ]
                        }),
                        _jsx(SignUpFooter, {
                            onSignIn: () => {
                                router.replace('/auth/login');
                            }
                        })
                    ]
                })
            })
        })
    );
}