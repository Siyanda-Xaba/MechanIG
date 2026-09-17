import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  useEffect,
  useState,
} from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'

import { useChangeCustomerPassword } from '../src/customer/useChangeCustomerPassword'
import { useCustomerSecuritySettings } from '../src/customer/useCustomerSecuritySettings'
import { useUpdateCustomerBiometricPreference } from '../src/customer/useUpdateCustomerBiometricPreference'
import { useTheme } from '../src/theme/ThemeContext'
import { useUser } from '../src/users/UserContext'

type PasswordFormState = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type PasswordFormErrors = Partial<
  Record<
    keyof PasswordFormState,
    string
  >
>

export default function SecurityScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    user,
    isLoadingUser,
  } = useUser()

  const {
    securitySettings,
    isLoadingSecuritySettings,
    securitySettingsError,
    refreshSecuritySettings,
  } = useCustomerSecuritySettings(
    user?.id ?? null
  )

  const {
    isChangingPassword,
    changePasswordError,
    changePassword,
    clearChangePasswordError,
  } = useChangeCustomerPassword()

  const {
    isUpdatingBiometricPreference,
    biometricPreferenceError,
    updateBiometricPreference,
    clearBiometricPreferenceError,
  } =
    useUpdateCustomerBiometricPreference()

  const [
    biometricEnabled,
    setBiometricEnabled,
  ] = useState(false)

  const [
    passwordForm,
    setPasswordForm,
  ] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [
    passwordErrors,
    setPasswordErrors,
  ] = useState<PasswordFormErrors>({})

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false)

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  useEffect(() => {
    if (
      securitySettings
        ?.biometricSignInEnabled ===
      null
    ) {
      return
    }

    if (
      typeof securitySettings
        ?.biometricSignInEnabled ===
      'boolean'
    ) {
      setBiometricEnabled(
        securitySettings.biometricSignInEnabled
      )
    }
  }, [securitySettings])

  const isLoading =
    isLoadingUser ||
    isLoadingSecuritySettings

  function updatePasswordField(
    field: keyof PasswordFormState,
    value: string
  ) {
    setPasswordForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )

    setPasswordErrors(
      (current) => ({
        ...current,
        [field]: undefined,
      })
    )

    clearChangePasswordError()
  }

  function validatePasswordForm() {
    const errors:
      PasswordFormErrors = {}

    if (
      !passwordForm.currentPassword
    ) {
      errors.currentPassword =
        'Current password is required.'
    }

    if (!passwordForm.newPassword) {
      errors.newPassword =
        'New password is required.'
    } else if (
      passwordForm.newPassword.length <
      8
    ) {
      errors.newPassword =
        'New password must be at least 8 characters.'
    }

    if (
      !passwordForm.confirmPassword
    ) {
      errors.confirmPassword =
        'Confirm your new password.'
    } else if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      errors.confirmPassword =
        'Passwords do not match.'
    }

    setPasswordErrors(errors)

    return (
      Object.keys(errors).length === 0
    )
  }

  async function handleChangePassword() {
    if (!user) {
      return
    }

    if (!validatePasswordForm()) {
      return
    }

    const succeeded =
      await changePassword({
        customerId: user.id,
        currentPassword:
          passwordForm.currentPassword,
        newPassword:
          passwordForm.newPassword,
      })

    if (!succeeded) {
      return
    }

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })

    setPasswordErrors({})

    await refreshSecuritySettings()
  }

  async function handleBiometricChange(
    enabled: boolean
  ) {
    if (!user) {
      return
    }

    clearBiometricPreferenceError()

    const savedSettings =
      await updateBiometricPreference({
        customerId: user.id,
        enabled,
      })

    if (
      savedSettings
        ?.biometricSignInEnabled ===
      null ||
      typeof savedSettings
        ?.biometricSignInEnabled !==
        'boolean'
    ) {
      return
    }

    setBiometricEnabled(
      savedSettings.biometricSignInEnabled
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <StableScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
        >
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={
                isChangingPassword ||
                isUpdatingBiometricPreference
              }
              onPress={() =>
                router.back()
              }
              style={[
                styles.backButton,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Security
            </Text>

            <View
              style={
                styles.headerPlaceholder
              }
            />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Account Security
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Manage password,
            authentication, and account
            security preferences.
          </Text>

          {isLoading ? (
            <View
              style={[
                styles.stateCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <ActivityIndicator
                size="large"
                color={colors.accent}
              />

              <Text
                style={[
                  styles.stateTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Loading Security
              </Text>

              <Text
                style={[
                  styles.stateDescription,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Retrieving your
                account security
                information.
              </Text>
            </View>
          ) : !user ? (
            <View
              style={[
                styles.stateCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={40}
                color={
                  colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.stateTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Customer Unavailable
              </Text>

              <Text
                style={[
                  styles.stateDescription,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Your account
                information could not
                be loaded.
              </Text>
            </View>
          ) : (
            <>
              {securitySettingsError ? (
                <View
                  style={[
                    styles.errorCard,
                    {
                      borderColor:
                        colors.danger,
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={19}
                    color={
                      colors.danger
                    }
                  />

                  <View
                    style={
                      styles.errorContent
                    }
                  >
                    <Text
                      style={[
                        styles.errorText,
                        {
                          color:
                            colors.danger,
                        },
                      ]}
                    >
                      {
                        securitySettingsError
                      }
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={
                        refreshSecuritySettings
                      }
                      style={[
                        styles.inlineRetryButton,
                        {
                          borderColor:
                            colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.inlineRetryText,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        Try Again
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Security Overview
              </Text>

              <View
                style={[
                  styles.overviewCard,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <SecurityInfoRow
                  icon="devices"
                  label="Active Sessions"
                  value={
                    securitySettings
                      ?.activeSessionCount !==
                    null &&
                    securitySettings
                      ?.activeSessionCount !==
                    undefined
                      ? String(
                          securitySettings.activeSessionCount
                        )
                      : 'Unavailable'
                  }
                  textColor={
                    colors.text
                  }
                  secondaryTextColor={
                    colors.secondaryText
                  }
                  accentColor={
                    colors.accent
                  }
                  borderColor={
                    colors.border
                  }
                />

                <SecurityInfoRow
                  icon="lock-clock"
                  label="Password Last Changed"
                  value={
                    securitySettings
                      ?.lastPasswordChangedAt ??
                    'Unavailable'
                  }
                  isLast
                  textColor={
                    colors.text
                  }
                  secondaryTextColor={
                    colors.secondaryText
                  }
                  accentColor={
                    colors.accent
                  }
                  borderColor={
                    colors.border
                  }
                />
              </View>

              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Biometric Sign-In
              </Text>

              <View
                style={[
                  styles.biometricCard,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.biometricIcon,
                    {
                      borderColor:
                        colors.accent,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="fingerprint"
                    size={27}
                    color={
                      colors.accent
                    }
                  />
                </View>

                <View
                  style={
                    styles.biometricContent
                  }
                >
                  <Text
                    style={[
                      styles.biometricTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    Use Biometrics
                  </Text>

                  <Text
                    style={[
                      styles.biometricDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Use supported
                    device authentication
                    for secure sign-in
                    once biometric
                    integration is
                    connected.
                  </Text>
                </View>

                {isUpdatingBiometricPreference ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.accent}
                  />
                ) : (
                  <Switch
                    value={
                      biometricEnabled
                    }
                    onValueChange={
                      handleBiometricChange
                    }
                  />
                )}
              </View>

              {biometricPreferenceError ? (
                <View
                  style={[
                    styles.errorCard,
                    {
                      borderColor:
                        colors.danger,
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={19}
                    color={
                      colors.danger
                    }
                  />

                  <Text
                    style={[
                      styles.errorText,
                      {
                        color:
                          colors.danger,
                      },
                    ]}
                  >
                    {
                      biometricPreferenceError
                    }
                  </Text>
                </View>
              ) : null}

              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Change Password
              </Text>

              <View
                style={[
                  styles.passwordCard,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <PasswordField
                  label="Current Password"
                  value={
                    passwordForm.currentPassword
                  }
                  error={
                    passwordErrors.currentPassword
                  }
                  showPassword={
                    showCurrentPassword
                  }
                  onToggleVisibility={() =>
                    setShowCurrentPassword(
                      (current) =>
                        !current
                    )
                  }
                  onChangeText={(value) =>
                    updatePasswordField(
                      'currentPassword',
                      value
                    )
                  }
                  textColor={
                    colors.text
                  }
                  secondaryTextColor={
                    colors.secondaryText
                  }
                  borderColor={
                    colors.border
                  }
                  dangerColor={
                    colors.danger
                  }
                />

                <PasswordField
                  label="New Password"
                  value={
                    passwordForm.newPassword
                  }
                  error={
                    passwordErrors.newPassword
                  }
                  showPassword={
                    showNewPassword
                  }
                  onToggleVisibility={() =>
                    setShowNewPassword(
                      (current) =>
                        !current
                    )
                  }
                  onChangeText={(value) =>
                    updatePasswordField(
                      'newPassword',
                      value
                    )
                  }
                  textColor={
                    colors.text
                  }
                  secondaryTextColor={
                    colors.secondaryText
                  }
                  borderColor={
                    colors.border
                  }
                  dangerColor={
                    colors.danger
                  }
                />

                <PasswordField
                  label="Confirm New Password"
                  value={
                    passwordForm.confirmPassword
                  }
                  error={
                    passwordErrors.confirmPassword
                  }
                  showPassword={
                    showConfirmPassword
                  }
                  onToggleVisibility={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current
                    )
                  }
                  onChangeText={(value) =>
                    updatePasswordField(
                      'confirmPassword',
                      value
                    )
                  }
                  textColor={
                    colors.text
                  }
                  secondaryTextColor={
                    colors.secondaryText
                  }
                  borderColor={
                    colors.border
                  }
                  dangerColor={
                    colors.danger
                  }
                />

                {changePasswordError ? (
                  <View
                    style={[
                      styles.passwordError,
                      {
                        borderColor:
                          colors.danger,
                      },
                    ]}
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color={
                        colors.danger
                      }
                    />

                    <Text
                      style={[
                        styles.errorText,
                        {
                          color:
                            colors.danger,
                        },
                      ]}
                    >
                      {
                        changePasswordError
                      }
                    </Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.75}
                  disabled={
                    isChangingPassword
                  }
                  onPress={
                    handleChangePassword
                  }
                  style={[
                    styles.changePasswordButton,
                    {
                      backgroundColor:
                        colors.accent,
                      opacity:
                        isChangingPassword
                          ? 0.6
                          : 1,
                    },
                  ]}
                >
                  {isChangingPassword ? (
                    <ActivityIndicator
                      size="small"
                      color="#000000"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="lock-reset"
                      size={20}
                      color="#000000"
                    />
                  )}

                  <Text
                    style={
                      styles.changePasswordText
                    }
                  >
                    {isChangingPassword
                      ? 'Updating...'
                      : 'Update Password'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.noticeCard,
                  {
                    borderColor:
                      colors.warning,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="shield-alert-outline"
                  size={21}
                  color={colors.warning}
                />

                <Text
                  style={[
                    styles.noticeText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Password changes,
                  active sessions, and
                  biometric sign-in
                  depend on the shared
                  MechanIQ authentication
                  backend. Biometrics
                  also require secure
                  device authentication
                  and secure credential
                  storage before they can
                  be enabled.
                </Text>
              </View>
            </>
          )}
        </StableScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

type SecurityInfoRowProps = {
  icon:
    keyof typeof MaterialCommunityIcons.glyphMap

  label: string
  value: string

  isLast?: boolean

  textColor: string
  secondaryTextColor: string
  accentColor: string
  borderColor: string
}

function SecurityInfoRow({
  icon,
  label,
  value,
  isLast = false,
  textColor,
  secondaryTextColor,
  accentColor,
  borderColor,
}: SecurityInfoRowProps) {
  return (
    <View
      style={[
        styles.securityInfoRow,
        !isLast
          ? {
              borderBottomWidth: 1,
              borderBottomColor:
                borderColor,
            }
          : null,
      ]}
    >
      <View
        style={[
          styles.securityInfoIcon,
          {
            borderColor:
              accentColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={accentColor}
        />
      </View>

      <View
        style={
          styles.securityInfoContent
        }
      >
        <Text
          style={[
            styles.securityInfoLabel,
            {
              color:
                secondaryTextColor,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.securityInfoValue,
            {
              color: textColor,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  )
}

type PasswordFieldProps = {
  label: string
  value: string
  error?: string

  showPassword: boolean

  onToggleVisibility: () => void

  onChangeText: (
    value: string
  ) => void

  textColor: string
  secondaryTextColor: string
  borderColor: string
  dangerColor: string
}

function PasswordField({
  label,
  value,
  error,
  showPassword,
  onToggleVisibility,
  onChangeText,
  textColor,
  secondaryTextColor,
  borderColor,
  dangerColor,
}: PasswordFieldProps) {
  return (
    <View style={styles.field}>
      <Text
        style={[
          styles.fieldLabel,
          {
            color: textColor,
          },
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.passwordInputWrapper,
          {
            borderColor: error
              ? dangerColor
              : borderColor,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter password"
          placeholderTextColor={
            secondaryTextColor
          }
          secureTextEntry={
            !showPassword
          }
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.passwordInput,
            {
              color: textColor,
            },
          ]}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={
            onToggleVisibility
          }
          style={
            styles.visibilityButton
          }
        >
          <Ionicons
            name={
              showPassword
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={20}
            color={
              secondaryTextColor
            }
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text
          style={[
            styles.fieldError,
            {
              color: dangerColor,
            },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
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
    justifyContent:
      'space-between',
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
})