import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();

  // which step we're currently on: 1 = Personal, 2 = Vehicle, 3 = Security
  const [step, setStep] = useState(1);

  // ---- Step 1: Personal Details ----
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('South Africa');

  // ---- Step 2: Vehicle Details ----
  const [numberOfVehicles, setNumberOfVehicles] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [mileage, setMileage] = useState('');
  const [vehicleNickname, setVehicleNickname] = useState('');

  // ---- Step 3: Security ----
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // very simple password strength check just for the progress bar colour/label
  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '#444444', bars: 0 };
    if (password.length < 6) return { label: 'Weak', color: '#E53935', bars: 1 };
    if (password.length < 10) return { label: 'Medium', color: '#FBC02D', bars: 2 };
    return { label: 'Strong', color: '#4CAF50', bars: 3 };
  };
  const strength = getPasswordStrength();

  const handleBack = () => {
    if (step === 1) {
      router.back(); 
    } else {
      setStep(step - 1);
    }
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // TODO: connect this to your backend / auth logic later
      console.log('Creating account with:', {
        fullName,
        email,
        phoneNumber,
        dob,
        address,
        city,
        province,
        postalCode,
        country,
        numberOfVehicles,
        make,
        model,
        year,
        bodyType,
        fuelType,
        transmission,
        engineSize,
        licensePlate,
        vinNumber,
        mileage,
        vehicleNickname,
        password,
        verificationCode,
        twoFAEnabled,
      });
    }
  };

  const InputField = ({ icon, label, value, onChangeText, placeholder, keyboardType, rightElement }) => (
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={18} color="#888888" style={styles.inputIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666666"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
        />
      </View>
      {rightElement}
    </View>
  );

  // @react-native-picker/picker or a custom modal when you're ready.
  const DropdownField = ({ icon, label, value, placeholder, onPress }) => (
    <TouchableOpacity style={styles.inputWrapper} onPress={onPress}>
      <Ionicons name={icon} size={18} color="#888888" style={styles.inputIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={value ? styles.input : styles.placeholderText}>
          {value || placeholder}
        </Text>
      </View>
      <Ionicons name="chevron-down" size={18} color="#888888" />
    </TouchableOpacity>
  );

  // the 3-circle progress indicator at the top
  const StepIndicator = () => {
    const steps = [
      { number: 1, label: 'Personal Details' },
      { number: 2, label: 'Vehicle Details' },
      { number: 3, label: 'Security' },
    ];
    return (
      <View style={styles.stepIndicatorRow}>
        {steps.map((s, index) => (
          <React.Fragment key={s.number}>
            <View style={styles.stepCircleWrapper}>
              <View
                style={[
                  styles.stepCircle,
                  step >= s.number && styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    step >= s.number && styles.stepNumberActive,
                  ]}
                >
                  {s.number}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step === s.number && styles.stepLabelActive,
                ]}
              >
                {s.label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepConnector,
                  step > s.number && styles.stepConnectorActive,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const subtitleForStep = {
    1: "Let's get to know you.",
    2: 'Tell us about your vehicle.',
    3: 'Secure your account.',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back arrow */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/MechanicIQLogo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Heading */}
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>{subtitleForStep[step]}</Text>

        {/* Progress steps */}
        <StepIndicator />

        {/*STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={18} color="#2FD5D5" />
              <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Enter your personal information.
            </Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  icon="person-outline"
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                />
              </View>
              <View style={styles.halfWidth}>
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
              <View style={styles.halfWidth}>
                <InputField
                  icon="call-outline"
                  label="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+27  Enter your number"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.halfWidth}>
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
              <View style={styles.halfWidth}>
                <InputField
                  icon="business-outline"
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                />
              </View>
              <View style={styles.halfWidth}>
                <DropdownField
                  icon="options-outline"
                  label="Province"
                  value={province}
                  placeholder="Select province"
                  onPress={() => console.log('open province picker')}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  icon="mail-open-outline"
                  label="Postal Code"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="Enter postal code"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <DropdownField
                  icon="globe-outline"
                  label="Country"
                  value={country}
                  placeholder="Select country"
                  onPress={() => console.log('open country picker')}
                />
              </View>
            </View>

            {/* Privacy note */}
            <View style={styles.privacyBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#2FD5D5" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.privacyTitle}>Your privacy matters</Text>
                <Text style={styles.privacySubtitle}>
                  We keep your information safe and secure.
                </Text>
              </View>
              <Ionicons name="lock-closed-outline" size={18} color="#2FD5D5" />
            </View>
          </View>
        )}

        {/* STEP 2: VEHICLE DETAILS*/}
        {step === 2 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="car-outline" size={18} color="#2FD5D5" />
              <Text style={styles.sectionTitle}>VEHICLE DETAILS</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Add your vehicle so we can provide you with better services and
              recommendations.
            </Text>

            <DropdownField
              icon="car-sport-outline"
              label="Number of Vehicles"
              value={numberOfVehicles}
              placeholder="Select number of vehicles"
              onPress={() => console.log('open vehicle count picker')}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <DropdownField
                  icon="car-outline"
                  label="Make"
                  value={make}
                  placeholder="Select make"
                  onPress={() => console.log('open make picker')}
                />
              </View>
              <View style={styles.halfWidth}>
                <DropdownField
                  icon="car-outline"
                  label="Model"
                  value={model}
                  placeholder="Select model"
                  onPress={() => console.log('open model picker')}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <DropdownField
                  icon="calendar-outline"
                  label="Year"
                  value={year}
                  placeholder="Select year"
                  onPress={() => console.log('open year picker')}
                />
              </View>
              <View style={styles.halfWidth}>
                <DropdownField
                  icon="car-outline"
                  label="Body Type"
                  value={bodyType}
                  placeholder="Select body type"
                  onPress={() => console.log('open body type picker')}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <DropdownField
                  icon="water-outline"
                  label="Fuel Type"
                  value={fuelType}
                  placeholder="Select fuel type"
                  onPress={() => console.log('open fuel type picker')}
                />
              </View>
              <View style={styles.halfWidth}>
                <DropdownField
                  icon="settings-outline"
                  label="Transmission"
                  value={transmission}
                  placeholder="Select transmission"
                  onPress={() => console.log('open transmission picker')}
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
              onChangeText={setLicensePlate}
              placeholder="e.g. ABC123GP"
            />

            <View style={styles.inputWrapper}>
              <Ionicons name="barcode-outline" size={18} color="#888888" style={styles.inputIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>VIN Number (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter VIN number"
                  placeholderTextColor="#666666"
                  value={vinNumber}
                  onChangeText={setVinNumber}
                />
              </View>
              <TouchableOpacity style={styles.scanButton}>
                <Ionicons name="scan-outline" size={14} color="#2FD5D5" />
                <Text style={styles.scanButtonText}>Scan VIN</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="speedometer-outline" size={18} color="#888888" style={styles.inputIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Mileage / Odometer (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 45,000 km"
                  placeholderTextColor="#666666"
                  value={mileage}
                  onChangeText={setMileage}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.unitText}>km</Text>
            </View>

            <View>
              <InputField
                icon="pricetag-outline"
                label="Vehicle Nickname (Optional)"
                value={vehicleNickname}
                onChangeText={setVehicleNickname}
                placeholder="e.g. My Car, Family SUV"
              />
              <Text style={styles.helperText}>
                Give your vehicle a name for easy identification.
              </Text>
            </View>
          </View>
        )}

        {/* STEP 3: SECURITY*/}
        {step === 3 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="lock-closed-outline" size={18} color="#2FD5D5" />
              <Text style={styles.sectionTitle}>SECURITY DETAILS</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Set up a strong password to keep your account safe.
            </Text>

            {/* Create password */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#888888" style={styles.inputIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Create Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#666666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>

            {/* Password strength bar */}
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                  Password strength: {strength.label}
                </Text>
                <View style={styles.strengthBarsRow}>
                  {[1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        { backgroundColor: i <= strength.bars ? strength.color : '#333333' },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Confirm password */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#888888" style={styles.inputIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#666666"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
              </View>
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>

            {/* Password requirements checklist */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>Password requirements</Text>
              {[
                { label: 'At least 8 characters long', met: password.length >= 8 },
                {
                  label: 'Include uppercase and lowercase letters',
                  met: /[a-z]/.test(password) && /[A-Z]/.test(password),
                },
                { label: 'Include at least one number', met: /[0-9]/.test(password) },
                {
                  label: 'Include at least one special character (e.g. @ # ! %)',
                  met: /[^A-Za-z0-9]/.test(password),
                },
              ].map((req, index) => (
                <View key={index} style={styles.requirementRow}>
                  <Ionicons
                    name={req.met ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={req.met ? '#4CAF50' : '#666666'}
                  />
                  <Text style={styles.requirementText}>{req.label}</Text>
                </View>
              ))}
            </View>

            {/* Email verification */}
            <View style={styles.sectionHeader}>
              <Ionicons name="mail-outline" size={18} color="#2FD5D5" />
              <Text style={styles.sectionTitle}>EMAIL VERIFICATION</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              We'll send a verification code to your email address.
            </Text>

            <View style={styles.inputWrapper}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <Text style={styles.input}>{email || 'john.doe@email.com'}</Text>
              </View>
              <TouchableOpacity style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Send Code</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Verification Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#666666"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
              <TouchableOpacity style={styles.smallButtonDisabled} disabled>
                <Text style={styles.smallButtonDisabledText}>Verify Code</Text>
              </TouchableOpacity>
            </View>

            {/* Two-factor authentication toggle */}
            <View style={styles.twoFARow}>
              <Ionicons name="shield-outline" size={18} color="#2FD5D5" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.twoFATitle}>
                  TWO-FACTOR AUTHENTICATION (OPTIONAL)
                </Text>
                <Text style={styles.twoFASubtitle}>
                  Add an extra layer of security to protect your account.
                </Text>
              </View>
            </View>
            <View style={styles.twoFAToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.twoFAToggleLabel}>Enable 2FA</Text>
                <Text style={styles.twoFAToggleSubtitle}>
                  Receive a code when signing in from a new device
                </Text>
              </View>
              <Switch
                value={twoFAEnabled}
                onValueChange={setTwoFAEnabled}
                trackColor={{ false: '#444444', true: '#2FD5D5' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Terms agreement */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <Ionicons
                name={agreedToTerms ? 'checkbox' : 'square-outline'}
                size={18}
                color="#2FD5D5"
              />
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Back / Continue buttons */}
        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity style={styles.backOutlineButton} onPress={handleBack}>
              <Text style={styles.backOutlineButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.continueButton, step === 1 && { flex: 1 }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>
              {step === 3 ? 'Create Account' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          {[1, 2, 3].map((dot) => (
            <View
              key={dot}
              style={[styles.dot, step === dot && styles.dotActive]}
            />
          ))}
        </View>

        {/* Already have an account */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('./LoginScreen')}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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

  // step indicator
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepCircleWrapper: {
    alignItems: 'center',
    width: 90,
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
  },
  stepCircleActive: {
    backgroundColor: '#2FD5D5',
    borderColor: '#2FD5D5',
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
  },
  stepLabelActive: {
    color: '#2FD5D5',
    fontWeight: 'bold',
  },
  stepConnector: {
    height: 2,
    flex: 1,
    backgroundColor: '#444444',
    marginTop: 15,
  },
  stepConnectorActive: {
    backgroundColor: '#2FD5D5',
  },

  // sections
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

  // form layout
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
    color: '#2FD5D5',
    fontSize: 12,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2FD5D5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scanButtonText: {
    color: '#2FD5D5',
    fontSize: 11,
    marginLeft: 4,
  },

  // privacy note
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2FD5D5',
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
    marginBottom: 10,
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

  // password strength
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

  // password requirements
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
  },

  // buttons
  smallButton: {
    borderWidth: 1,
    borderColor: '#2FD5D5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallButtonText: {
    color: '#2FD5D5',
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

  // 2FA
  twoFARow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 10,
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

  // terms
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
    color: '#2FD5D5',
  },

  // continue / back
  buttonRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  backOutlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2FD5D5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  backOutlineButtonText: {
    color: '#2FD5D5',
    fontWeight: 'bold',
    fontSize: 13,
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#2FD5D5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 13,
  },

  // dots + login link
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
    backgroundColor: '#2FD5D5',
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
    color: '#2FD5D5',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
