import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext'
import {
  getFirebaseAuthErrorMessage,
  registerWithEmail,
} from '../../../src/auth/authService'
import StableScrollView from '../../../src/components/StableScrollView'
import {
  CYAN,
  GREEN,
  MUTED,
  PasswordRow,
  SignUpFooter,
  SignUpHeader,
  styles,
} from '../../../src/auth/mechanic/MechanicSignUpShared'
import { useUser } from '../../../src/users/UserContext'

type PasswordRequirement = {
  label: string
  met: boolean
}

export default function MechanicSignUpStep3() {
  const router = useRouter()

  const {
    step1Data,
    step2Data,
    resetMechanicSignUp,
  } = useMechanicSignUp()
  const { setUser } = useUser()

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('')

  const [
    passwordVisible,
    setPasswordVisible,
  ] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [
    confirmPasswordVisible,
    setConfirmPasswordVisible,
  ] = useState(false)

  const [
    verificationCode,
    setVerificationCode,
  ] = useState('')

  const [
    twoFactorEnabled,
    setTwoFactorEnabled,
  ] = useState(false)

  const [
    agreedToTerms,
    setAgreedToTerms,
  ] = useState(false)

  const passwordRequirements: PasswordRequirement[] =
    [
      {
        label:
          'At least 8 characters long',
        met: password.length >= 8,
      },
      {
        label:
          'Include uppercase and lowercase letters',
        met:
          /[a-z]/.test(password) &&
          /[A-Z]/.test(password),
      },
      {
        label:
          'Include at least one number',
        met: /[0-9]/.test(password),
      },
      {
        label:
          'Include at least one special character (e.g. @ # ! %)',
        met: /[^A-Za-z0-9]/.test(
          password
        ),
      },
    ]

  const passwordIsValid =
    passwordRequirements.every(
      (requirement) =>
        requirement.met
    )

  function handleSendCode() {
    if (!step1Data.email.trim()) {
      Alert.alert(
        'Email required',
        'Enter your email address in Step 1 before requesting a verification code.'
      )
      return
    }

    Alert.alert(
      'Verification unavailable',
      'Email verification will be connected when the authentication backend is available.'
    )
  }

  function handleVerifyCode() {
    if (verificationCode.length !== 6) {
      Alert.alert(
        'Invalid code',
        'Enter the 6-digit verification code.'
      )
      return
    }

    Alert.alert(
      'Verification unavailable',
      'Verification codes cannot be validated until the authentication backend is connected.'
    )
  }

  async function handleCreateAccount() {
    if (!passwordIsValid) {
      Alert.alert(
        'Password requirements',
        'Please meet all password requirements before creating your account.'
      )
      return
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Passwords do not match',
        'Please make sure both password fields contain the same password.'
      )
      return
    }

    if (!agreedToTerms) {
      Alert.alert(
        'Terms required',
        'Please agree to the Terms of Service and Privacy Policy before creating your account.'
      )
      return
    }

    const nameParts = step1Data.fullName.trim().split(/\s+/)

    try {
      setIsSubmitting(true)
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
      })

      setUser(user)
      resetMechanicSignUp()
      Alert.alert(
        'Account created',
        'Your mechanic account has been created. We sent a verification link to your email address.',
        [
          {
            text: 'Continue',
            // The mechanic dashboard will replace this shared landing route
            // when it is available.
            onPress: () => router.replace('/(customer)'),
          },
        ]
      )
    } catch (error) {
      Alert.alert(
        'Unable to create account',
        getFirebaseAuthErrorMessage(error)
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <StableScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <SignUpHeader
            step={3}
            onBack={() => router.back()}
          />

          <View style={styles.section}>
            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={CYAN}
              />

              <Text
                style={styles.sectionTitle}
              >
                SECURITY DETAILS
              </Text>
            </View>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Set up a strong password to
              keep your account safe.
            </Text>

            <PasswordRow
              label="Create Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              visible={passwordVisible}
              onToggleVisible={() =>
                setPasswordVisible(
                  (current) => !current
                )
              }
            />

            <PasswordRow
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
              visible={
                confirmPasswordVisible
              }
              onToggleVisible={() =>
                setConfirmPasswordVisible(
                  (current) => !current
                )
              }
            />

            <View
              style={
                styles.requirementsBox
              }
            >
              <Text
                style={
                  styles.requirementsTitle
                }
              >
                Password requirements
              </Text>

              {passwordRequirements.map(
                (requirement) => (
                  <View
                    key={
                      requirement.label
                    }
                    style={
                      styles.requirementRow
                    }
                  >
                    <Ionicons
                      name={
                        requirement.met
                          ? 'checkmark-circle'
                          : 'ellipse-outline'
                      }
                      size={16}
                      color={
                        requirement.met
                          ? GREEN
                          : '#666666'
                      }
                    />

                    <Text
                      style={
                        styles.requirementText
                      }
                    >
                      {
                        requirement.label
                      }
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={CYAN}
              />

              <Text
                style={styles.sectionTitle}
              >
                EMAIL VERIFICATION
              </Text>
            </View>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              We'll send a verification
              code to your email address.
            </Text>

            <View
              style={
                styles.verificationInputRow
              }
            >
              <View
                style={
                  styles.verificationInputArea
                }
              >
                <Text
                  style={styles.fieldLabel}
                >
                  Email Address
                </Text>

                <Text
                  style={
                    step1Data.email
                      ? styles.fieldInput
                      : styles.fieldPlaceholder
                  }
                  numberOfLines={1}
                >
                  {step1Data.email ||
                    'Enter your email in Step 1'}
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.sendCodeButton
                }
                activeOpacity={0.8}
                onPress={handleSendCode}
              >
                <Text
                  style={
                    styles.sendCodeText
                  }
                >
                  Send Code
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={
                styles.verificationInputRow
              }
            >
              <View
                style={
                  styles.verificationInputArea
                }
              >
                <Text
                  style={styles.fieldLabel}
                >
                  Verification Code
                </Text>

                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#666666"
                  keyboardType="number-pad"
                  value={verificationCode}
                  onChangeText={(value) =>
                    setVerificationCode(
                      value.replace(
                        /[^0-9]/g,
                        ''
                      )
                    )
                  }
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                style={
                  styles.verifyCodeButton
                }
                activeOpacity={0.8}
                onPress={handleVerifyCode}
              >
                <Text
                  style={
                    styles.verifyCodeText
                  }
                >
                  Verify Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="shield-outline"
                size={18}
                color={CYAN}
              />

              <Text
                style={styles.sectionTitle}
              >
                TWO-FACTOR AUTHENTICATION
              </Text>
            </View>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Add an optional extra layer
              of security to protect your
              account.
            </Text>

            <View
              style={styles.twoFactorRow}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={CYAN}
              />

              <View
                style={
                  styles.twoFactorTextArea
                }
              >
                <Text
                  style={styles.fieldLabel}
                >
                  Enable 2FA
                </Text>

                <Text
                  style={
                    styles.verificationSubtext
                  }
                >
                  Receive a code when
                  signing in from a new
                  device
                </Text>
              </View>

              <Switch
                value={twoFactorEnabled}
                onValueChange={
                  setTwoFactorEnabled
                }
                trackColor={{
                  false: '#444444',
                  true: CYAN,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.agreeRow}
            onPress={() =>
              setAgreedToTerms(
                (current) => !current
              )
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name={
                agreedToTerms
                  ? 'checkbox'
                  : 'square-outline'
              }
              size={18}
              color={CYAN}
            />

            <Text
              style={styles.agreeText}
            >
              I agree to the{' '}
              <Text
                style={styles.agreeLink}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                style={styles.agreeLink}
              >
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity
              style={
                styles.backOutlineButton
              }
              activeOpacity={0.85}
              onPress={() => router.back()}
            >
              <Text
                style={
                  styles.backOutlineText
                }
              >
                Back
              </Text>
            </TouchableOpacity>

            <View style={{ width: 10 }} />

            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.85}
              onPress={
                handleCreateAccount
              }
              disabled={isSubmitting}
            >
              <Text
                style={styles.continueText}
              >
                {isSubmitting
                  ? 'Creating Account...'
                  : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <SignUpFooter
            onSignIn={() => {
              router.replace(
                '/auth/login'
              )
            }}
          />
        </StableScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
