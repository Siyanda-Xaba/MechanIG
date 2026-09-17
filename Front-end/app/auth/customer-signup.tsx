import {
  Ionicons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  type ComponentProps,
  type ReactNode,
  useState,
} from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'

type Step = 1 | 2 | 3

type IoniconName =
  ComponentProps<typeof Ionicons>['name']

type InputFieldProps = {
  icon: IoniconName
  label: string
  value: string
  onChangeText: (value: string) => void
  placeholder: string
  keyboardType?: TextInputProps['keyboardType']
  rightElement?: ReactNode
}

type DropdownFieldProps = {
  icon: IoniconName
  label: string
  value: string
  placeholder: string
  onPress: () => void
}

type PasswordStrength = {
  label: string
  color: string
  bars: number
}

function InputField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  rightElement,
}: InputFieldProps) {
  return (
    <View style={styles.inputWrapper}>
      <Ionicons
        name={icon}
        size={18}
        color="#888888"
        style={styles.inputIcon}
      />

      <View style={styles.inputContent}>
        <Text style={styles.inputLabel}>
          {label}
        </Text>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666666"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>

      {rightElement}
    </View>
  )
}

function DropdownField({
  icon,
  label,
  value,
  placeholder,
  onPress,
}: DropdownFieldProps) {
  return (
    <TouchableOpacity
      style={styles.inputWrapper}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={18}
        color="#888888"
        style={styles.inputIcon}
      />

      <View style={styles.inputContent}>
        <Text style={styles.inputLabel}>
          {label}
        </Text>

        <Text
          style={
            value
              ? styles.input
              : styles.placeholderText
          }
        >
          {value || placeholder}
        </Text>
      </View>

      <Ionicons
        name="chevron-down"
        size={18}
        color="#888888"
      />
    </TouchableOpacity>
  )
}

export default function CustomerSignUpScreen() {
  const router = useRouter()

  const [
    step,
    setStep,
  ] = useState<Step>(1)

  const [
    fullName,
    setFullName,
  ] = useState('')

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState('')

  const [
    dob,
    setDob,
  ] = useState('')

  const [
    address,
    setAddress,
  ] = useState('')

  const [
    city,
    setCity,
  ] = useState('')

  const [
    province,
  ] = useState('')

  const [
    postalCode,
    setPostalCode,
  ] = useState('')

  const [
    country,
  ] = useState('South Africa')

  const [
    numberOfVehicles,
  ] = useState('')

  const [
    make,
  ] = useState('')

  const [
    model,
  ] = useState('')

  const [
    year,
  ] = useState('')

  const [
    bodyType,
  ] = useState('')

  const [
    fuelType,
  ] = useState('')

  const [
    transmission,
  ] = useState('')

  const [
    engineSize,
    setEngineSize,
  ] = useState('')

  const [
    licensePlate,
    setLicensePlate,
  ] = useState('')

  const [
    vinNumber,
    setVinNumber,
  ] = useState('')

  const [
    mileage,
    setMileage,
  ] = useState('')

  const [
    vehicleNickname,
    setVehicleNickname,
  ] = useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  const [
    verificationCode,
    setVerificationCode,
  ] = useState('')

  const [
    twoFAEnabled,
    setTwoFAEnabled,
  ] = useState(false)

  const [
    agreedToTerms,
    setAgreedToTerms,
  ] = useState(false)

  function getPasswordStrength(): PasswordStrength {
    if (password.length === 0) {
      return {
        label: '',
        color: '#444444',
        bars: 0,
      }
    }

    if (password.length < 6) {
      return {
        label: 'Weak',
        color: '#FF3B30',
        bars: 1,
      }
    }

    if (password.length < 10) {
      return {
        label: 'Medium',
        color: '#FFB020',
        bars: 2,
      }
    }

    return {
      label: 'Strong',
      color: '#7CFF4F',
      bars: 3,
    }
  }

  const strength = getPasswordStrength()

  const passwordRequirements = [
    {
      label:
        'At least 8 characters long',
      met:
        password.length >= 8,
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
      met:
        /[0-9]/.test(password),
    },
    {
      label:
        'Include at least one special character (e.g. @ # ! %)',
      met:
        /[^A-Za-z0-9]/.test(
          password
        ),
    },
  ]

  const passwordMeetsRequirements =
    passwordRequirements.every(
      (requirement) =>
        requirement.met
    )

  const subtitleForStep: Record<
    Step,
    string
  > = {
    1: "Let's get to know you.",
    2: 'Tell us about your vehicle.',
    3: 'Secure your account.',
  }

  function handleBack() {
    if (step === 1) {
      router.back()
      return
    }

    setStep(
      (current) =>
        (current - 1) as Step
    )
  }

  function handleContinue() {
    if (step < 3) {
      setStep(
        (current) =>
          (current + 1) as Step
      )
      return
    }

    if (!passwordMeetsRequirements) {
      Alert.alert(
        'Password requirements not met',
        'Please make sure your password meets all of the listed security requirements.'
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
      'Customer registration will be connected when the authentication backend is available.'
    )
  }

  function StepIndicator() {
    const steps: Array<{
      number: Step
      label: string
    }> = [
      {
        number: 1,
        label: 'Personal Details',
      },
      {
        number: 2,
        label: 'Vehicle Details',
      },
      {
        number: 3,
        label: 'Security',
      },
    ]

    return (
      <View
        style={styles.stepIndicatorRow}
      >
        {steps.map(
          (item, index) => (
            <View
              key={item.number}
              style={styles.stepItem}
            >
              {index <
                steps.length - 1 && (
                <View
                  style={[
                    styles.stepConnector,
                    step >
                      item.number &&
                      styles.stepConnectorActive,
                  ]}
                />
              )}

              <View
                style={[
                  styles.stepCircle,
                  step >= item.number &&
                    styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    step >= item.number &&
                      styles.stepNumberActive,
                  ]}
                >
                  {item.number}
                </Text>
              </View>

              <Text
                style={[
                  styles.stepLabel,
                  step === item.number &&
                    styles.stepLabelActive,
                ]}
                numberOfLines={2}
              >
                {item.label}
              </Text>
            </View>
          )
        )}
      </View>
    )
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StableScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View
          style={styles.logoContainer}
        >
          <Image
            source={require('../../assets/images/mechaniq-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Create Your Account
        </Text>

        <Text style={styles.subtitle}>
          {subtitleForStep[step]}
        </Text>

        <StepIndicator />

        {step === 1 && (
          <View style={styles.section}>
            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color="#00E5FF"
              />

              <Text
                style={styles.sectionTitle}
              >
                PERSONAL DETAILS
              </Text>
            </View>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Enter your personal
              information.
            </Text>

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <InputField
                  icon="person-outline"
                  label="Full Name"
                  value={fullName}
                  onChangeText={
                    setFullName
                  }
                  placeholder="Enter your full name"
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <InputField
                  icon="mail-outline"
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <InputField
                  icon="call-outline"
                  label="Phone Number"
                  value={phoneNumber}
                  onChangeText={
                    setPhoneNumber
                  }
                  placeholder="+27  Enter your number"
                  keyboardType="phone-pad"
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <InputField
                  icon="calendar-outline"
                  label="Date of Birth"
                  value={dob}
                  onChangeText={setDob}
                  placeholder="DD / MM / YYYY"
                />
              </View>
            </View>

            <InputField
              icon="location-outline"
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
            />

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <InputField
                  icon="business-outline"
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <DropdownField
                  icon="options-outline"
                  label="Province"
                  value={province}
                  placeholder="Select province"
                  onPress={() => {
                    // Picker will be
                    // connected separately.
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <InputField
                  icon="mail-open-outline"
                  label="Postal Code"
                  value={postalCode}
                  onChangeText={
                    setPostalCode
                  }
                  placeholder="Enter postal code"
                  keyboardType="numeric"
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <DropdownField
                  icon="globe-outline"
                  label="Country"
                  value={country}
                  placeholder="Select country"
                  onPress={() => {
                    // Picker will be
                    // connected separately.
                  }}
                />
              </View>
            </View>

            <View
              style={styles.privacyBox}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#00E5FF"
              />

              <View
                style={
                  styles.privacyContent
                }
              >
                <Text
                  style={
                    styles.privacyTitle
                  }
                >
                  Your privacy matters
                </Text>

                <Text
                  style={
                    styles.privacySubtitle
                  }
                >
                  We keep your
                  information safe and
                  secure.
                </Text>
              </View>

              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#00E5FF"
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="car-outline"
                size={18}
                color="#00E5FF"
              />

              <Text
                style={styles.sectionTitle}
              >
                VEHICLE DETAILS
              </Text>
            </View>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Add your vehicle so we can
              provide you with better
              services and
              recommendations.
            </Text>

            <DropdownField
              icon="car-sport-outline"
              label="Number of Vehicles"
              value={numberOfVehicles}
              placeholder="Select number of vehicles"
              onPress={() => {
                // Picker will be
                // connected separately.
              }}
            />

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <DropdownField
                  icon="car-outline"
                  label="Make"
                  value={make}
                  placeholder="Select make"
                  onPress={() => {
                    // Picker will be
                    // connected separately.
                  }}
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <DropdownField
                  icon="car-outline"
                  label="Model"
                  value={model}
                  placeholder="Select model"
                  onPress={() => {
                    // Picker will be
                    // connected separately.
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <DropdownField
                  icon="calendar-outline"
                  label="Year"
                  value={year}
                  placeholder="Select year"
                  onPress={() => {
                    // Picker will be
                    // connected separately.
                  }}
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <DropdownField
                  icon="car-outline"
                  label="Body Type"
                  value={bodyType}
                  placeholder="Select body type"
                  onPress={() => {
                    // Picker will be
                    // connected separately.
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <DropdownField
                  icon="water-outline"
                  label="Fuel Type"
                  value={fuelType}
                  placeholder="Select fuel type"
                  onPress={() => {
                    // Picker will be
                    // connected separately.
                  }}
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <DropdownField
                  icon="settings-outline"
                  label="Transmission"
                  value={transmission}
                  placeholder="Select transmission"
                  onPress={() => {
                    // Picker will be
                    // connected separately.
                  }}
                />
              </View>
            </View>

            <InputField
              icon="speedometer-outline"
              label="Engine Size (Optional)"
              value={engineSize}
              onChangeText={setEngineSize}
              placeholder="e.g. 1.6L, 2.0L, V6, etc."
            />

            <InputField
              icon="pricetag-outline"
              label="License Plate"
              value={licensePlate}
              onChangeText={
                setLicensePlate
              }
              placeholder="e.g. ABC123GP"
            />

            <View
              style={styles.inputWrapper}
            >
              <Ionicons
                name="barcode-outline"
                size={18}
                color="#888888"
                style={styles.inputIcon}
              />

              <View
                style={styles.inputContent}
              >
                <Text
                  style={styles.inputLabel}
                >
                  VIN Number (Optional)
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter VIN number"
                  placeholderTextColor="#666666"
                  value={vinNumber}
                  onChangeText={setVinNumber}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                style={styles.scanButton}
                activeOpacity={0.8}
                onPress={() => {
                  // VIN scanning will be
                  // integrated separately.
                }}
              >
                <Ionicons
                  name="scan-outline"
                  size={14}
                  color="#00E5FF"
                />

                <Text
                  style={
                    styles.scanButtonText
                  }
                >
                  Scan VIN
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={styles.inputWrapper}
            >
              <Ionicons
                name="speedometer-outline"
                size={18}
                color="#888888"
                style={styles.inputIcon}
              />

              <View
                style={styles.inputContent}
              >
                <Text
                  style={styles.inputLabel}
                >
                  Mileage / Odometer
                  (Optional)
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="e.g. 45,000"
                  placeholderTextColor="#666666"
                  value={mileage}
                  onChangeText={setMileage}
                  keyboardType="numeric"
                />
              </View>

              <Text style={styles.unitText}>
                km
              </Text>
            </View>

            <View>
              <InputField
                icon="pricetag-outline"
                label="Vehicle Nickname (Optional)"
                value={vehicleNickname}
                onChangeText={
                  setVehicleNickname
                }
                placeholder="e.g. My Car, Family SUV"
              />

              <Text
                style={styles.helperText}
              >
                Give your vehicle a name
                for easy identification.
              </Text>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.section}>
            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#00E5FF"
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

            <View
              style={styles.inputWrapper}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#888888"
                style={styles.inputIcon}
              />

              <View
                style={styles.inputContent}
              >
                <Text
                  style={styles.inputLabel}
                >
                  Create Password
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#666666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={
                    !showPassword
                  }
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setShowPassword(
                    (current) => !current
                  )
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>

            {password.length > 0 && (
              <View
                style={styles.strengthRow}
              >
                <Text
                  style={[
                    styles.strengthLabel,
                    {
                      color:
                        strength.color,
                    },
                  ]}
                >
                  Password strength:{' '}
                  {strength.label}
                </Text>

                <View
                  style={
                    styles.strengthBarsRow
                  }
                >
                  {[1, 2, 3].map(
                    (bar) => (
                      <View
                        key={bar}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              bar <=
                              strength.bars
                                ? strength.color
                                : '#333333',
                          },
                        ]}
                      />
                    )
                  )}
                </View>
              </View>
            )}

            <View
              style={styles.inputWrapper}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#888888"
                style={styles.inputIcon}
              />

              <View
                style={styles.inputContent}
              >
                <Text
                  style={styles.inputLabel}
                >
                  Confirm Password
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#666666"
                  value={confirmPassword}
                  onChangeText={
                    setConfirmPassword
                  }
                  secureTextEntry={
                    !showConfirmPassword
                  }
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>

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
                          ? '#7CFF4F'
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

            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color="#00E5FF"
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
              style={styles.inputWrapper}
            >
              <View
                style={styles.inputContent}
              >
                <Text
                  style={styles.inputLabel}
                >
                  Email Address
                </Text>

                <Text style={styles.input}>
                  {email ||
                    'Enter your email in Step 1'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.smallButton}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert(
                    'Verification unavailable',
                    'Email verification will be connected when the authentication backend is available.'
                  )
                }}
              >
                <Text
                  style={
                    styles.smallButtonText
                  }
                >
                  Send Code
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={styles.inputWrapper}
            >
              <View
                style={styles.inputContent}
              >
                <Text
                  style={styles.inputLabel}
                >
                  Verification Code
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#666666"
                  value={verificationCode}
                  onChangeText={
                    setVerificationCode
                  }
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                style={
                  styles.smallButtonDisabled
                }
                disabled
              >
                <Text
                  style={
                    styles.smallButtonDisabledText
                  }
                >
                  Verify Code
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={styles.twoFARow}
            >
              <Ionicons
                name="shield-outline"
                size={18}
                color="#00E5FF"
              />

              <View
                style={
                  styles.twoFAContent
                }
              >
                <Text
                  style={
                    styles.twoFATitle
                  }
                >
                  TWO-FACTOR
                  AUTHENTICATION
                  (OPTIONAL)
                </Text>

                <Text
                  style={
                    styles.twoFASubtitle
                  }
                >
                  Add an extra layer of
                  security to protect your
                  account.
                </Text>
              </View>
            </View>

            <View
              style={
                styles.twoFAToggleRow
              }
            >
              <View
                style={styles.inputContent}
              >
                <Text
                  style={
                    styles.twoFAToggleLabel
                  }
                >
                  Enable 2FA
                </Text>

                <Text
                  style={
                    styles.twoFAToggleSubtitle
                  }
                >
                  Receive a code when
                  signing in from a new
                  device
                </Text>
              </View>

              <Switch
                value={twoFAEnabled}
                onValueChange={
                  setTwoFAEnabled
                }
                trackColor={{
                  false: '#444444',
                  true: '#00E5FF',
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => {
                setAgreedToTerms(
                  (current) => !current
                )
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={
                  agreedToTerms
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={18}
                color="#00E5FF"
              />

              <Text
                style={styles.termsText}
              >
                I agree to the{' '}
                <Text
                  style={styles.termsLink}
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  style={styles.termsLink}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity
              style={
                styles.backOutlineButton
              }
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Text
                style={
                  styles.backOutlineButtonText
                }
              >
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.continueButton,
              step === 1 &&
                styles.continueButtonFull,
            ]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.continueButtonText
              }
            >
              {step === 3
                ? 'Create Account'
                : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dotsRow}>
          {[1, 2, 3].map((dot) => (
            <View
              key={dot}
              style={[
                styles.dot,
                step === dot &&
                  styles.dotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.loginRow}>
          <Text
            style={styles.loginText}
          >
            Already have an account?{' '}
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.replace({
                pathname: '/auth/login',
                params: {
                  role: 'customer',
                },
              })
            }}
            activeOpacity={0.7}
          >
            <Text
              style={styles.loginLink}
            >
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },

  logo: {
    width: 150,
    height: 80,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
  },

  subtitle: {
    color: '#AAAAAA',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },

  stepIndicatorRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
  },

  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    zIndex: 2,
  },

  stepCircleActive: {
    backgroundColor: '#00E5FF',
    borderColor: '#00E5FF',
  },

  stepNumber: {
    color: '#888888',
    fontWeight: 'bold',
    fontSize: 13,
  },

  stepNumberActive: {
    color: '#000000',
  },

  stepLabel: {
    color: '#777777',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    width: '100%',
  },

  stepLabelActive: {
    color: '#00E5FF',
    fontWeight: 'bold',
  },

  stepConnector: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#444444',
    zIndex: 1,
  },

  stepConnectorActive: {
    backgroundColor: '#00E5FF',
  },

  section: {
    marginBottom: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 8,
  },

  sectionSubtitle: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfWidth: {
    width: '48%',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },

  inputContent: {
    flex: 1,
  },

  inputIcon: {
    marginRight: 10,
  },

  inputLabel: {
    color: '#999999',
    fontSize: 11,
  },

  input: {
    color: '#FFFFFF',
    fontSize: 13,
    paddingVertical: 2,
  },

  placeholderText: {
    color: '#666666',
    fontSize: 13,
    paddingVertical: 2,
  },

  helperText: {
    color: '#777777',
    fontSize: 11,
    marginTop: -10,
    marginBottom: 14,
  },

  unitText: {
    color: '#00E5FF',
    fontSize: 12,
  },

  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00E5FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  scanButtonText: {
    color: '#00E5FF',
    fontSize: 11,
    marginLeft: 4,
  },

  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00E5FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
    marginBottom: 10,
  },

  privacyContent: {
    flex: 1,
    marginLeft: 10,
  },

  privacyTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  privacySubtitle: {
    color: '#999999',
    fontSize: 11,
  },

  strengthRow: {
    marginTop: -8,
    marginBottom: 14,
  },

  strengthLabel: {
    fontSize: 11,
    marginBottom: 6,
  },

  strengthBarsRow: {
    flexDirection: 'row',
  },

  strengthBar: {
    height: 4,
    flex: 1,
    borderRadius: 2,
    marginRight: 6,
  },

  requirementsBox: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },

  requirementsTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  requirementText: {
    color: '#AAAAAA',
    fontSize: 11,
    marginLeft: 8,
    flex: 1,
  },

  smallButton: {
    borderWidth: 1,
    borderColor: '#00E5FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  smallButtonText: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  smallButtonDisabled: {
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  smallButtonDisabledText: {
    color: '#666666',
    fontSize: 11,
    fontWeight: 'bold',
  },

  twoFARow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 10,
  },

  twoFAContent: {
    flex: 1,
    marginLeft: 10,
  },

  twoFATitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  twoFASubtitle: {
    color: '#888888',
    fontSize: 11,
    marginTop: 2,
  },

  twoFAToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  twoFAToggleLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  twoFAToggleSubtitle: {
    color: '#888888',
    fontSize: 10,
    marginTop: 2,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  termsText: {
    color: '#AAAAAA',
    fontSize: 11,
    marginLeft: 8,
    flex: 1,
  },

  termsLink: {
    color: '#00E5FF',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 4,
  },

  backOutlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00E5FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },

  backOutlineButtonText: {
    color: '#00E5FF',
    fontWeight: 'bold',
    fontSize: 13,
  },

  continueButton: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },

  continueButtonFull: {
    flex: 1,
  },

  continueButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 13,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 14,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444444',
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: '#00E5FF',
    width: 16,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  loginText: {
    color: '#AAAAAA',
    fontSize: 12,
  },

  loginLink: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
})