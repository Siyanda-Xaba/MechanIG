import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext';
import { generateUniqueMechanicUsername } from '../../../src/auth/mechanic/mechanicUsernameService';
import { getFirebaseAuthErrorMessage, registerWithEmail } from '../../../src/auth/authService';
import StableScrollView from '../../../src/components/StableScrollView';
import {
    CYAN,
    GREEN,
    PasswordRow,
    SignUpFooter,
    SignUpHeader,
    styles,
} from '../../../src/auth/mechanic/MechanicSignUpShared';

export default function MechanicSignUpStep3() {
    const router = useRouter();
    const { step1Data, step2Data, previewUsername, resetMechanicSignUp } = useMechanicSignUp();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdUsername, setCreatedUsername] = useState('');

    const passwordRequirements = [
        {
            label: 'At least 8 characters long',
            met: password.length >= 8,
        },
        {
            label: 'Include uppercase and lowercase letters',
            met: /[a-z]/.test(password) && /[A-Z]/.test(password),
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

    async function handleCreateAccount() {
        if (!passwordIsValid) {
            Alert.alert('Password requirements', 'Please meet all password requirements before creating your account.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Passwords do not match', 'Please make sure both password fields contain the same password.');
            return;
        }
        if (!agreedToTerms) {
            Alert.alert('Terms required', 'Please agree to the Terms of Service and Privacy Policy before creating your account.');
            return;
        }

        try {
            setIsSubmitting(true);

            // Generate unique username with @mechanic
            const finalUsername = await generateUniqueMechanicUsername(step1Data.fullName);
            const authEmail = `${finalUsername.toLowerCase()}.com`;

            const nameParts = step1Data.fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || 'Mechanic';
            const lastName = nameParts.slice(1).join(' ') || '';

            await registerWithEmail({
                email: authEmail,
                password,
                role: 'mechanic',
                profile: {
                    username: finalUsername,
                    communicationEmail: step1Data.email.trim().toLowerCase(),
                    email: step1Data.email.trim().toLowerCase(),
                    firstName,
                    lastName,
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
                    role: 'mechanic',
                    createdAt: new Date().toISOString(),
                },
            });

            setCreatedUsername(finalUsername);
            setShowSuccessModal(true);
        } catch (error) {
            Alert.alert('Unable to create account', getFirebaseAuthErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleProceedToLogin() {
        const usernameToPass = createdUsername;
        setShowSuccessModal(false);
        resetMechanicSignUp();
        router.replace({
            pathname: '/auth/login',
            params: { username: usernameToPass },
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <StableScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <SignUpHeader step={3} onBack={() => router.dismissTo('/auth/mechanic-signup/step-2')} />

                    {/* Account Credentials Confirmation */}
                    <View style={localStyles.summaryCard}>
                        <View style={localStyles.summaryHeader}>
                            <Ionicons name="shield-checkmark" size={20} color={CYAN} />
                            <Text style={localStyles.summaryTitle}>ACCOUNT CREDENTIALS</Text>
                        </View>

                        <View style={localStyles.summaryRow}>
                            <Text style={localStyles.summaryLabel}>Generated Login Username:</Text>
                            <Text style={localStyles.summaryUsername}>{previewUsername}</Text>
                        </View>

                        <View style={localStyles.summaryRow}>
                            <Text style={localStyles.summaryLabel}>Communication Email:</Text>
                            <Text style={localStyles.summaryEmail}>{step1Data.email || 'N/A'}</Text>
                        </View>

                        <Text style={localStyles.summaryNote}>
                            You will use your username above to sign in. The email address will be used for communications.
                        </Text>
                    </View>

                    {/* Password Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="lock-closed-outline" size={18} color={CYAN} />
                            <Text style={styles.sectionTitle}>CREATE PASSWORD</Text>
                        </View>
                        <Text style={styles.sectionSubtitle}>
                            Set up a secure password to protect your mechanic account.
                        </Text>

                        <PasswordRow
                            label="Create Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            visible={passwordVisible}
                            onToggleVisible={() => setPasswordVisible((current) => !current)}
                        />

                        <PasswordRow
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            visible={confirmPasswordVisible}
                            onToggleVisible={() => setConfirmPasswordVisible((current) => !current)}
                        />

                        <View style={styles.requirementsBox}>
                            <Text style={styles.requirementsTitle}>Password requirements</Text>
                            {passwordRequirements.map((requirement) => (
                                <View style={styles.requirementRow} key={requirement.label}>
                                    <Ionicons
                                        name={requirement.met ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={16}
                                        color={requirement.met ? GREEN : '#666666'}
                                    />
                                    <Text style={styles.requirementText}>{requirement.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Terms */}
                    <TouchableOpacity
                        style={styles.agreeRow}
                        onPress={() => setAgreedToTerms((current) => !current)}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={agreedToTerms ? 'checkbox' : 'square-outline'}
                            size={18}
                            color={CYAN}
                        />
                        <Text style={styles.agreeText}>
                            I agree to the <Text style={styles.agreeLink}>Terms of Service</Text> and{' '}
                            <Text style={styles.agreeLink}>Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Submit Buttons */}
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.backOutlineButton}
                            activeOpacity={0.85}
                            onPress={() => router.dismissTo('/auth/mechanic-signup/step-2')}
                        >
                            <Text style={styles.backOutlineText}>Back</Text>
                        </TouchableOpacity>

                        <View style={{ width: 10 }} />

                        <TouchableOpacity
                            style={styles.continueButton}
                            activeOpacity={0.85}
                            onPress={handleCreateAccount}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#050B14" />
                            ) : (
                                <Text style={styles.continueText}>Create Mechanic Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <SignUpFooter onSignIn={() => router.replace('/auth/login')} />
                </StableScrollView>
            </KeyboardAvoidingView>

            {/* Registration Success Modal with Username Display */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleProceedToLogin}
            >
                <View style={localStyles.modalOverlay}>
                    <View style={localStyles.modalCard}>
                        <View style={localStyles.modalIconContainer}>
                            <Ionicons name="checkmark-circle" size={54} color={GREEN} />
                        </View>

                        <Text style={localStyles.modalTitle}>Registration Successful!</Text>
                        <Text style={localStyles.modalSubtitle}>
                            Your Mechanic Account has been created.
                        </Text>

                        <View style={localStyles.usernameDisplayBox}>
                            <Text style={localStyles.usernameDisplayLabel}>YOUR LOGIN USERNAME</Text>
                            <Text style={localStyles.usernameDisplayText}>{createdUsername}</Text>
                        </View>

                        <View style={localStyles.emailDisplayRow}>
                            <Ionicons name="mail-outline" size={16} color="#8CA0B2" />
                            <Text style={localStyles.emailDisplayText}>
                                Communication Email: {step1Data.email}
                            </Text>
                        </View>

                        <Text style={localStyles.modalInstructions}>
                            Please save your username. When signing in, enter{' '}
                            <Text style={{ fontWeight: 'bold', color: CYAN }}>{createdUsername}</Text> and your password.
                        </Text>

                        <TouchableOpacity
                            style={localStyles.modalSignInButton}
                            activeOpacity={0.85}
                            onPress={handleProceedToLogin}
                        >
                            <Text style={localStyles.modalSignInButtonText}>Sign In Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    summaryCard: {
        backgroundColor: '#0F2236',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1D3B54',
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    summaryTitle: {
        color: CYAN,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.8,
    },
    summaryRow: {
        marginBottom: 6,
    },
    summaryLabel: {
        color: '#8CA0B2',
        fontSize: 11,
    },
    summaryUsername: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    summaryEmail: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    summaryNote: {
        color: '#8CA0B2',
        fontSize: 11,
        marginTop: 6,
        lineHeight: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.82)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        backgroundColor: '#0A1726',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 380,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1D3B54',
    },
    modalIconContainer: {
        marginBottom: 12,
    },
    modalTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center',
    },
    modalSubtitle: {
        color: '#8CA0B2',
        fontSize: 13,
        marginBottom: 16,
        textAlign: 'center',
    },
    usernameDisplayBox: {
        backgroundColor: '#112940',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: CYAN,
    },
    usernameDisplayLabel: {
        color: CYAN,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    usernameDisplayText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    emailDisplayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 14,
    },
    emailDisplayText: {
        color: '#8CA0B2',
        fontSize: 12,
    },
    modalInstructions: {
        color: '#D0E2EE',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalSignInButton: {
        backgroundColor: CYAN,
        borderRadius: 12,
        paddingVertical: 14,
        width: '100%',
        alignItems: 'center',
    },
    modalSignInButtonText: {
        color: '#050B14',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
