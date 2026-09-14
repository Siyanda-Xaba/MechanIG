import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext'
import {
  CYAN,
  GREEN,
  MUTED,
  PasswordRow,
  SignUpFooter,
  SignUpHeader,
  styles,
} from '../../../src/auth/mechanic/MechanicSignUpShared'

type PasswordRequirement = {
  label: string
  met: boolean
}

export default function MechanicSignUpStep3() {
  const router = useRouter()

  const {
    step1Data,
  } = useMechanicSignUp()

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

  function handleCreateAccount() {
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

    Alert.alert(
      'Account creation unavailable',
      'Mechanic registration will be connected when the authentication and verification backend is available.'
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        style={styles.container}
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

        <PasswordRow
          label="Create Password"
          placeholder="Enter a strong password"
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
                key={requirement.label}
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
                      : MUTED
                  }
                />

                <Text
                  style={
                    styles.requirementText
                  }
                >
                  {requirement.label}
                </Text>
              </View>
            )
          )}
        </View>

        <View
          style={styles.verificationBox}
        >
          <View
            style={
              styles.verificationHeaderRow
            }
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={CYAN}
            />

            <View
              style={
                styles.verificationHeaderText
              }
            >
              <Text
                style={styles.fieldLabel}
              >
                Email Verification
              </Text>

              <Text
                style={
                  styles.verificationSubtext
                }
              >
                We'll send a verification
                code to your email
                address.
              </Text>
            </View>
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
                  'Enter email in Step 1'}
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
                style={styles.sendCodeText}
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
                placeholderTextColor={
                  MUTED
                }
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

        <View
          style={styles.twoFactorRow}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
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
              Two-Factor Authentication
              (Optional)
            </Text>

            <Text
              style={
                styles.verificationSubtext
              }
            >
              Add an extra layer of
              security to protect your
              account.
            </Text>
          </View>

          <Switch
            value={twoFactorEnabled}
            onValueChange={
              setTwoFactorEnabled
            }
            trackColor={{
              false: '#3A4750',
              true: CYAN,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity
          style={styles.agreeRow}
          onPress={() =>
            setAgreedToTerms(
              (current) => !current
            )
          }
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              agreedToTerms &&
                styles.checkboxChecked,
            ]}
          >
            {agreedToTerms && (
              <Ionicons
                name="checkmark"
                size={14}
                color="#00131A"
              />
            )}
          </View>

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

        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={handleCreateAccount}
        >
          <Text
            style={styles.continueText}
          >
            Create Account
          </Text>
        </TouchableOpacity>

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

        <SignUpFooter
          onSignIn={() => {
            router.replace({
              pathname: '/auth/login',
              params: {
                role: 'mechanic',
              },
            })
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}