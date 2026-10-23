import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, } from 'react';
import { Alert, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import OptionPickerModal from '../../src/components/OptionPickerModal';
import { getFirebaseAuthErrorMessage, registerWithEmail, } from '../../src/auth/authService';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';
function InputField({ icon, label, value, onChangeText, placeholder, keyboardType = 'default', rightElement, }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    return (_jsxs(View, { style: styles.inputWrapper, children: [_jsx(Ionicons, { name: icon, size: 18, color: colors.secondaryText, style: styles.inputIcon }), _jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.inputLabel, children: label }), _jsx(TextInput, { style: styles.input, placeholder: placeholder, placeholderTextColor: colors.secondaryText, value: value, onChangeText: onChangeText, keyboardType: keyboardType })] }), rightElement] }));
}
function DropdownField({ icon, label, value, placeholder, onPress, }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    return (_jsxs(TouchableOpacity, { style: styles.inputWrapper, onPress: onPress, activeOpacity: 0.8, accessibilityRole: "button", accessibilityLabel: `${label}: ${value || placeholder}`, children: [_jsx(Ionicons, { name: icon, size: 18, color: colors.secondaryText, style: styles.inputIcon }), _jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.inputLabel, children: label }), _jsx(Text, { style: value
                            ? styles.input
                            : styles.placeholderText, children: value || placeholder })] }), _jsx(Ionicons, { name: "chevron-down", size: 18, color: colors.secondaryText })] }));
}
export default function CustomerSignUpScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const { setUser } = useUser();
    const [step, setStep,] = useState(1);
    const [fullName, setFullName,] = useState('');
    const [email, setEmail,] = useState('');
    const [phoneNumber, setPhoneNumber,] = useState('');
    const [dob, setDob,] = useState('');
    const [address, setAddress,] = useState('');
    const [city, setCity,] = useState('');
    const [province, setProvince,] = useState('');
    const [postalCode, setPostalCode,] = useState('');
    const [country, setCountry,] = useState('South Africa');
    const [numberOfVehicles, setNumberOfVehicles,] = useState('');
    const [make, setMake,] = useState('');
    const [model, setModel,] = useState('');
    const [year, setYear,] = useState('');
    const [color, setColor,] = useState('');
    const [bodyType, setBodyType,] = useState('');
    const [fuelType, setFuelType,] = useState('');
    const [transmission, setTransmission,] = useState('');
    const [engineSize, setEngineSize,] = useState('');
    const [licensePlate, setLicensePlate,] = useState('');
    const [vinNumber, setVinNumber,] = useState('');
    const [mileage, setMileage,] = useState('');
    const [vehicleNickname, setVehicleNickname,] = useState('');
    const [password, setPassword,] = useState('');
    const [confirmPassword, setConfirmPassword,] = useState('');
    const [showPassword, setShowPassword,] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword,] = useState(false);
    const [verificationCode, setVerificationCode,] = useState('');
    
    const [agreedToTerms, setAgreedToTerms,] = useState(false);
    const [optionPicker, setOptionPicker] = useState(null);
    function chooseOption(title, options, onSelect) {
        setOptionPicker({ title, options, onSelect });
    }
    function getPasswordStrength() {
        if (password.length === 0) {
            return {
                label: '',
                color: colors.border,
                bars: 0,
            };
        }
        if (password.length < 6) {
            return {
                label: 'Weak',
                color: colors.danger,
                bars: 1,
            };
        }
        if (password.length < 10) {
            return {
                label: 'Medium',
                color: colors.warning,
                bars: 2,
            };
        }
        return {
            label: 'Strong',
            color: colors.success,
            bars: 3,
        };
    }
    const strength = getPasswordStrength();
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
    const passwordMeetsRequirements = passwordRequirements.every((requirement) => requirement.met);
    const subtitleForStep = {
        1: "Let's get to know you.",
        2: 'Tell us about your vehicle.',
        3: 'Secure your account.',
    };
    function handleBack() {
        if (step === 1) {
            router.dismissTo('/welcome');
            return;
        }
        setStep((current) => (current - 1));
    }
    async function handleContinue() {
        if (step < 3) {
            if (step === 1 &&
                (!fullName.trim() ||
                    !email.trim() ||
                    !phoneNumber.trim())) {
                Alert.alert('Details required', 'Please enter your full name, email address, and phone number.');
                return;
            }
            if (step === 2 && (!numberOfVehicles?.trim() || !make.trim() || !model.trim() || !/^\d{4}$/.test(year.trim()) || Number(year) < 1900 || !color.trim() || !fuelType.trim() || !licensePlate.trim())) {
                Alert.alert('Vehicle details required', 'Please provide the number of vehicles, make, model, year, colour, fuel type, and registration number before continuing.');
                return;
            }
            if (step === 1 &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                Alert.alert('Invalid email', 'Please enter a valid email address.');
                return;
            }
            setStep((current) => (current + 1));
            return;
        }
        if (!passwordMeetsRequirements) {
            Alert.alert('Password requirements not met', 'Please make sure your password meets all of the listed security requirements.');
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
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        try {
            setIsSubmitting(true);
            const user = await registerWithEmail({
                email,
                password,
                role: 'customer',
                profile: {
                    firstName,
                    lastName,
                    phone: phoneNumber.trim(),
                    dateOfBirth: dob.trim() || null,
                    address: address.trim() || null,
                    city: city.trim() || null,
                    province: province.trim() || null,
                    postalCode: postalCode.trim() || null,
                    country,
                    
                    vehicle: {
                        numberOfVehicles: numberOfVehicles.trim() || null,
                        make: make.trim() || null,
                        model: model.trim() || null,
                        year: year.trim(),
                        color: color.trim(),
                        bodyType: bodyType.trim() || null,
                        fuelType: fuelType.trim(),
                        transmission: transmission.trim() || null,
                        engineSize: engineSize.trim() || null,
                        licensePlate: licensePlate.trim().toUpperCase(),
                        vinNumber: vinNumber.trim() || null,
                        mileage: mileage.trim() || null,
                        nickname: vehicleNickname.trim() || null,
                    },
                    profileImageUrl: null,
                },
            });
            setUser(user);
            Alert.alert('Account created', 'Your account has been created. We sent a verification link to your email address.', [
                {
                    text: 'Continue',
                    onPress: () => router.replace('/(customer)'),
                },
            ]);
        }
        catch (error) {
            Alert.alert('Unable to create account', getFirebaseAuthErrorMessage(error));
        }
        finally {
            setIsSubmitting(false);
        }
    }
    function StepIndicator() {
        const steps = [
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
        ];
        return (_jsx(View, { style: styles.stepIndicatorRow, children: steps.map((item, index) => (_jsxs(View, { style: styles.stepItem, children: [index <
                        steps.length - 1 && (_jsx(View, { style: [
                            styles.stepConnector,
                            step >
                                item.number &&
                                styles.stepConnectorActive,
                        ] })), _jsx(View, { style: [
                            styles.stepCircle,
                            step >= item.number &&
                                styles.stepCircleActive,
                        ], children: _jsx(Text, { style: [
                                styles.stepNumber,
                                step >= item.number &&
                                    styles.stepNumberActive,
                            ], children: item.number }) }), _jsx(Text, { style: [
                            styles.stepLabel,
                            step === item.number &&
                                styles.stepLabelActive,
                        ], numberOfLines: 2, children: item.label })] }, item.number))) }));
    }
    return (_jsx(SafeAreaView, { style: styles.container, children: _jsxs(StableScrollView, { contentContainerStyle: styles.scrollContent, showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", children: [_jsx(TouchableOpacity, { style: styles.backButton, onPress: handleBack, activeOpacity: 0.7, accessibilityRole: "button", accessibilityLabel: "Go back", children: _jsx(Ionicons, { name: "arrow-back", size: 24, color: colors.text }) }), _jsx(View, { style: styles.logoContainer, children: _jsx(Image, { source: require('../../assets/images/mechaniq-logo.png'), style: styles.logo, resizeMode: "contain" }) }), _jsx(Text, { style: styles.title, children: "Create Your Account" }), _jsx(Text, { style: styles.subtitle, children: subtitleForStep[step] }), _jsx(StepIndicator, {}), step === 1 && (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "person-outline", size: 18, color: colors.accent }), _jsx(Text, { style: styles.sectionTitle, children: "PERSONAL DETAILS" })] }), _jsx(Text, { style: styles.sectionSubtitle, children: "Enter your personal information." }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(InputField, { icon: "person-outline", label: "Full Name", value: fullName, onChangeText: setFullName, placeholder: "Enter your full name" }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(InputField, { icon: "mail-outline", label: "Email Address", value: email, onChangeText: setEmail, placeholder: "Enter your email", keyboardType: "email-address" }) })] }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(InputField, { icon: "call-outline", label: "Phone Number", value: phoneNumber, onChangeText: setPhoneNumber, placeholder: "+27  Enter your number", keyboardType: "phone-pad" }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(InputField, { icon: "calendar-outline", label: "Date of Birth", value: dob, onChangeText: setDob, placeholder: "DD / MM / YYYY" }) })] }), _jsx(InputField, { icon: "location-outline", label: "Address", value: address, onChangeText: setAddress, placeholder: "Enter your address" }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(InputField, { icon: "business-outline", label: "City", value: city, onChangeText: setCity, placeholder: "Enter your city" }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(DropdownField, { icon: "options-outline", label: "Province", value: province, placeholder: "Select province", onPress: () => {
                                    chooseOption('Select province', ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'], setProvince);
                                        } }) })] }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(InputField, { icon: "mail-open-outline", label: "Postal Code", value: postalCode, onChangeText: setPostalCode, placeholder: "Enter postal code", keyboardType: "numeric" }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(DropdownField, { icon: "globe-outline", label: "Country", value: country, placeholder: "Select country", onPress: () => {
                                    chooseOption('Select country', ['South Africa', 'Botswana', 'Eswatini', 'Lesotho', 'Mozambique', 'Namibia', 'Zimbabwe'], setCountry);
                                        } }) })] }), _jsxs(View, { style: styles.privacyBox, children: [_jsx(Ionicons, { name: "shield-checkmark-outline", size: 20, color: colors.accent }), _jsxs(View, { style: styles.privacyContent, children: [_jsx(Text, { style: styles.privacyTitle, children: "Your privacy matters" }), _jsx(Text, { style: styles.privacySubtitle, children: "We keep your information safe and secure." })] }), _jsx(Ionicons, { name: "lock-closed-outline", size: 18, color: colors.accent })] })] })), step === 2 && (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "car-outline", size: 18, color: colors.accent }), _jsx(Text, { style: styles.sectionTitle, children: "VEHICLE DETAILS" })] }), _jsx(Text, { style: styles.sectionSubtitle, children: "Add your vehicle so we can provide you with better services and recommendations." }), _jsx(DropdownField, { icon: "car-sport-outline", label: "Number of Vehicles", value: numberOfVehicles, placeholder: "Select number of vehicles", onPress: () => {
                                chooseOption('Number of vehicles', ['1', '2', '3', '4', '5+'], setNumberOfVehicles);
                            } }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(DropdownField, { icon: "car-outline", label: "Make", value: make, placeholder: "Select make", onPress: () => {
                                            chooseOption('Select make', ['Toyota', 'Volkswagen', 'Ford', 'BMW', 'Mercedes-Benz', 'Hyundai', 'Kia', 'Nissan', 'Honda', 'Mazda', 'Other'], (value) => {
                                                setMake(value);
                                                setModel('');
                                            });
                                        } }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(DropdownField, { icon: "car-outline", label: "Model", value: model, placeholder: "Select model", onPress: () => {
                                            if (!make) {
                                                Alert.alert('Select a make first', 'Choose your vehicle make before selecting a model.');
                                                return;
                                            }
                                            chooseOption('Select model', ['Corolla', 'Hilux', 'Polo', 'Golf', 'Ranger', 'Fiesta', '3 Series', 'C-Class', 'i20', 'Sportage', 'Other'], setModel);
                                        } }) })] }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(DropdownField, { icon: "calendar-outline", label: "Year", value: year, placeholder: "Select year", onPress: () => {
                                            chooseOption('Select year', Array.from({ length: 27 }, (_, index) => String(new Date().getFullYear() - index)), setYear);
                                        } }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(DropdownField, { icon: "car-outline", label: "Body Type", value: bodyType, placeholder: "Select body type", onPress: () => {
                                            chooseOption('Select body type', ['Sedan', 'Hatchback', 'SUV', 'Bakkie / Pickup', 'Coupe', 'Van', 'Wagon', 'Other'], setBodyType);
                                        } }) })] }), _jsxs(View, { style: styles.row, children: [_jsx(View, { style: styles.halfWidth, children: _jsx(DropdownField, { icon: "water-outline", label: "Fuel Type *", value: fuelType, placeholder: "Select fuel type", onPress: () => {
                                            chooseOption('Select fuel type', ['Petrol 93', 'Petrol 95', 'Diesel 50ppm', 'Diesel 500ppm', 'Hybrid', 'Electric'], setFuelType);
                                        } }) }), _jsx(View, { style: styles.halfWidth, children: _jsx(DropdownField, { icon: "settings-outline", label: "Transmission", value: transmission, placeholder: "Select transmission", onPress: () => {
                                            chooseOption('Select transmission', ['Manual', 'Automatic', 'CVT', 'Other'], setTransmission);
                                        } }) })] }), _jsx(InputField, { icon: "color-palette-outline", label: "Colour *", value: color, onChangeText: setColor, placeholder: "Enter vehicle colour" }), _jsx(InputField, { icon: "speedometer-outline", label: "Engine Size (Optional)", value: engineSize, onChangeText: setEngineSize, placeholder: "e.g. 1.6L, 2.0L, V6, etc." }), _jsx(InputField, { icon: "pricetag-outline", label: "Registration Number *", value: licensePlate, onChangeText: setLicensePlate, placeholder: "e.g. ABC123GP" }), _jsxs(View, { style: styles.inputWrapper, children: [_jsx(Ionicons, { name: "barcode-outline", size: 18, color: colors.secondaryText, style: styles.inputIcon }), _jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.inputLabel, children: "VIN Number (Optional)" }), _jsx(TextInput, { style: styles.input, placeholder: "Enter VIN number", placeholderTextColor: colors.secondaryText, value: vinNumber, onChangeText: setVinNumber, autoCapitalize: "characters" })] }), _jsxs(TouchableOpacity, { style: styles.scanButton, activeOpacity: 0.8, onPress: () => {
                                        // VIN scanning will be
                                        // integrated separately.
                                    }, children: [_jsx(Ionicons, { name: "scan-outline", size: 14, color: colors.accent }), _jsx(Text, { style: styles.scanButtonText, children: "Scan VIN" })] })] }), _jsxs(View, { style: styles.inputWrapper, children: [_jsx(Ionicons, { name: "speedometer-outline", size: 18, color: colors.secondaryText, style: styles.inputIcon }), _jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.inputLabel, children: "Mileage / Odometer (Optional)" }), _jsx(TextInput, { style: styles.input, placeholder: "e.g. 45,000", placeholderTextColor: colors.secondaryText, value: mileage, onChangeText: setMileage, keyboardType: "numeric" })] }), _jsx(Text, { style: styles.unitText, children: "km" })] }), _jsxs(View, { children: [_jsx(InputField, { icon: "pricetag-outline", label: "Vehicle Nickname (Optional)", value: vehicleNickname, onChangeText: setVehicleNickname, placeholder: "e.g. My Car, Family SUV" }), _jsx(Text, { style: styles.helperText, children: "Give your vehicle a name for easy identification." })] })] })), step === 3 && (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "lock-closed-outline", size: 18, color: colors.accent }), _jsx(Text, { style: styles.sectionTitle, children: "SECURITY DETAILS" })] }), _jsx(Text, { style: styles.sectionSubtitle, children: "Set up a strong password to keep your account safe." }), _jsxs(View, { style: styles.inputWrapper, children: [_jsx(Ionicons, { name: "lock-closed-outline", size: 18, color: colors.secondaryText, style: styles.inputIcon }), _jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.inputLabel, children: "Create Password" }), _jsx(TextInput, { style: styles.input, placeholder: "Enter your password", placeholderTextColor: colors.secondaryText, value: password, onChangeText: setPassword, secureTextEntry: !showPassword })] }), _jsx(TouchableOpacity, { onPress: () => {
                                        setShowPassword((current) => !current);
                                    }, activeOpacity: 0.7, children: _jsx(Ionicons, { name: showPassword
                                            ? 'eye-off-outline'
                                            : 'eye-outline', size: 20, color: colors.secondaryText }) })] }), password.length > 0 && (_jsxs(View, { style: styles.strengthRow, children: [_jsxs(Text, { style: [
                                        styles.strengthLabel,
                                        {
                                            color: strength.color,
                                        },
                                    ], children: ["Password strength:", ' ', strength.label] }), _jsx(View, { style: styles.strengthBarsRow, children: [1, 2, 3].map((bar) => (_jsx(View, { style: [
                                            styles.strengthBar,
                                            {
                                                backgroundColor: bar <=
                                                    strength.bars
                                                    ? strength.color
                                                    : colors.border,
                                            },
                                        ] }, bar))) })] })), _jsxs(View, { style: styles.inputWrapper, children: [_jsx(Ionicons, { name: "lock-closed-outline", size: 18, color: colors.secondaryText, style: styles.inputIcon }), _jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.inputLabel, children: "Confirm Password" }), _jsx(TextInput, { style: styles.input, placeholder: "Re-enter your password", placeholderTextColor: colors.secondaryText, value: confirmPassword, onChangeText: setConfirmPassword, secureTextEntry: !showConfirmPassword })] }), _jsx(TouchableOpacity, { onPress: () => {
                                        setShowConfirmPassword((current) => !current);
                                    }, activeOpacity: 0.7, children: _jsx(Ionicons, { name: showConfirmPassword
                                            ? 'eye-off-outline'
                                            : 'eye-outline', size: 20, color: colors.secondaryText }) })] }), _jsxs(View, { style: styles.requirementsBox, children: [_jsx(Text, { style: styles.requirementsTitle, children: "Password requirements" }), passwordRequirements.map((requirement) => (_jsxs(View, { style: styles.requirementRow, children: [_jsx(Ionicons, { name: requirement.met
                                                ? 'checkmark-circle'
                                                : 'ellipse-outline', size: 16, color: requirement.met
                                                ? colors.success
                                                : colors.secondaryText }), _jsx(Text, { style: styles.requirementText, children: requirement.label })] }, requirement.label)))] }), _jsxs(View, { style: styles.sectionHeader, children: [_jsx(Ionicons, { name: "mail-outline", size: 18, color: colors.accent }), _jsx(Text, { style: styles.sectionTitle, children: "EMAIL VERIFICATION" })] }), _jsx(Text, { style: styles.sectionSubtitle, children: "Firebase will send an email verification link when you create your account." }), _jsxs(View, { style: styles.inputWrapper, children: [_jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.inputLabel, children: "Email Address" }), _jsx(Text, { style: styles.input, children: email ||
                                                'Enter your email in Step 1' })] }), _jsx(TouchableOpacity, { style: styles.smallButton, activeOpacity: 0.8, onPress: () => {
                                        Alert.alert('Verification unavailable', 'Email verification will be connected when the authentication backend is available.');
                                    }, children: _jsx(Text, { style: styles.smallButtonText, children: "Verification link on sign-up" }) })] }), _jsxs(View, { style: styles.inputWrapper, children: [_jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.inputLabel, children: "Verification Code" }), _jsx(TextInput, { style: styles.input, placeholder: "Enter 6-digit code", placeholderTextColor: colors.secondaryText, value: verificationCode, onChangeText: setVerificationCode, keyboardType: "numeric", maxLength: 6 })] }), _jsx(TouchableOpacity, { style: styles.smallButtonDisabled, disabled: true, children: _jsx(Text, { style: styles.smallButtonDisabledText, children: "Verify Code" }) })] }), _jsxs(View, { style: styles.twoFARow, children: [_jsx(Ionicons, { name: "shield-outline", size: 18, color: colors.accent }), _jsxs(View, { style: styles.twoFAContent, children: [_jsx(Text, { style: styles.twoFATitle, children: "TWO-FACTOR AUTHENTICATION (OPTIONAL)" }), _jsx(Text, { style: styles.twoFASubtitle, children: "Add an extra layer of security to protect your account." })] })] }), _jsxs(View, { style: styles.twoFAToggleRow, children: [_jsxs(View, { style: styles.inputContent, children: [_jsx(Text, { style: styles.twoFAToggleLabel, children: "Enable 2FA" }), _jsx(Text, { style: styles.twoFAToggleSubtitle, children: "Two-factor authentication is not available yet." })] }), _jsx(Switch, { value: false, disabled: true, trackColor: {
                                        false: colors.border,
                                        true: colors.accent,
                                    }, thumbColor: colors.text })] }), _jsxs(TouchableOpacity, { style: styles.termsRow, onPress: () => {
                                setAgreedToTerms((current) => !current);
                            }, activeOpacity: 0.8, children: [_jsx(Ionicons, { name: agreedToTerms
                                        ? 'checkbox'
                                        : 'square-outline', size: 18, color: colors.accent }), _jsxs(Text, { style: styles.termsText, children: ["I agree to the", ' ', _jsx(Text, { style: styles.termsLink, children: "Terms of Service" }), ' ', "and", ' ', _jsx(Text, { style: styles.termsLink, children: "Privacy Policy" })] })] })] })), _jsxs(View, { style: styles.buttonRow, children: [step > 1 && (_jsx(TouchableOpacity, { style: styles.backOutlineButton, onPress: handleBack, activeOpacity: 0.8, children: _jsx(Text, { style: styles.backOutlineButtonText, children: "Back" }) })), _jsx(TouchableOpacity, { style: [
                                styles.continueButton,
                                step === 1 &&
                                    styles.continueButtonFull,
                            ], onPress: handleContinue, disabled: isSubmitting, activeOpacity: 0.85, children: _jsx(Text, { style: styles.continueButtonText, children: step === 3
                                    ? isSubmitting
                                        ? 'Creating Account...'
                                        : 'Create Account'
                                    : 'Continue' }) })] }), _jsx(View, { style: styles.dotsRow, children: [1, 2, 3].map((dot) => (_jsx(View, { style: [
                            styles.dot,
                            step === dot &&
                                styles.dotActive,
                        ] }, dot))) }), _jsxs(View, { style: styles.loginRow, children: [_jsxs(Text, { style: styles.loginText, children: ["Already have an account?", ' '] }), _jsx(TouchableOpacity, { onPress: () => {
                                router.replace({
                                    pathname: '/auth/login',
                                    params: {
                                        role: 'customer',
                                    },
                                });
                            }, activeOpacity: 0.7, children: _jsx(Text, { style: styles.loginLink, children: "Log in" }) })] }), _jsx(OptionPickerModal, { visible: optionPicker !== null, title: optionPicker?.title ?? 'Choose an option', options: optionPicker?.options ?? [], selectedValue: optionPicker?.selectedValue ?? null, onClose: () => setOptionPicker(null), onSelect: (value) => {
                            optionPicker?.onSelect(value);
                            setOptionPicker(null);
                        } })] }) }));
}
function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
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
            color: colors.text,
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 6,
        },
        subtitle: {
            color: colors.secondaryText,
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
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
            zIndex: 2,
        },
        stepCircleActive: {
            backgroundColor: colors.accent,
            borderColor: colors.accent,
        },
        stepNumber: {
            color: colors.secondaryText,
            fontWeight: 'bold',
            fontSize: 13,
        },
        stepNumberActive: {
            color: colors.text,
        },
        stepLabel: {
            color: colors.secondaryText,
            fontSize: 10,
            textAlign: 'center',
            marginTop: 6,
            width: '100%',
        },
        stepLabelActive: {
            color: colors.accent,
            fontWeight: 'bold',
        },
        stepConnector: {
            position: 'absolute',
            top: 14,
            left: '50%',
            right: '-50%',
            height: 2,
            backgroundColor: colors.border,
            zIndex: 1,
        },
        stepConnectorActive: {
            backgroundColor: colors.accent,
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
            color: colors.text,
            fontWeight: 'bold',
            fontSize: 13,
            marginLeft: 8,
        },
        sectionSubtitle: {
            color: colors.secondaryText,
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
            backgroundColor: colors.card,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
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
            color: colors.secondaryText,
            fontSize: 11,
        },
        input: {
            color: colors.text,
            fontSize: 13,
            paddingVertical: 2,
        },
        placeholderText: {
            color: colors.secondaryText,
            fontSize: 13,
            paddingVertical: 2,
        },
        helperText: {
            color: colors.secondaryText,
            fontSize: 11,
            marginTop: -10,
            marginBottom: 14,
        },
        unitText: {
            color: colors.accent,
            fontSize: 12,
        },
        scanButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        scanButtonText: {
            color: colors.accent,
            fontSize: 11,
            marginLeft: 4,
        },
        privacyBox: {
            flexDirection: 'row',
            backgroundColor: colors.card,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.accent,
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
            color: colors.text,
            fontSize: 12,
            fontWeight: 'bold',
        },
        privacySubtitle: {
            color: colors.secondaryText,
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
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
        },
        requirementsTitle: {
            color: colors.text,
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
            color: colors.secondaryText,
            fontSize: 11,
            marginLeft: 8,
            flex: 1,
        },
        smallButton: {
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
        },
        smallButtonText: {
            color: colors.accent,
            fontSize: 11,
            fontWeight: 'bold',
        },
        smallButtonDisabled: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
        },
        smallButtonDisabledText: {
            color: colors.secondaryText,
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
            color: colors.text,
            fontSize: 11,
            fontWeight: 'bold',
        },
        twoFASubtitle: {
            color: colors.secondaryText,
            fontSize: 11,
            marginTop: 2,
        },
        twoFAToggleRow: {
            flexDirection: 'row',
            backgroundColor: colors.card,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
        },
        twoFAToggleLabel: {
            color: colors.text,
            fontSize: 12,
            fontWeight: 'bold',
        },
        twoFAToggleSubtitle: {
            color: colors.secondaryText,
            fontSize: 10,
            marginTop: 2,
        },
        termsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        termsText: {
            color: colors.secondaryText,
            fontSize: 11,
            marginLeft: 8,
            flex: 1,
        },
        termsLink: {
            color: colors.accent,
        },
        buttonRow: {
            flexDirection: 'row',
            marginTop: 4,
        },
        backOutlineButton: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
            marginRight: 10,
        },
        backOutlineButtonText: {
            color: colors.accent,
            fontWeight: 'bold',
            fontSize: 13,
        },
        continueButton: {
            flex: 1,
            backgroundColor: colors.accent,
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
        },
        continueButtonFull: {
            flex: 1,
        },
        continueButtonText: {
            color: colors.text,
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
            backgroundColor: colors.border,
            marginHorizontal: 4,
        },
        dotActive: {
            backgroundColor: colors.accent,
            width: 16,
        },
        loginRow: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        loginText: {
            color: colors.secondaryText,
            fontSize: 12,
        },
        loginLink: {
            color: colors.accent,
            fontSize: 12,
            fontWeight: 'bold',
        },
    });
}
