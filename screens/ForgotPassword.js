import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {

  // Controls which step we're on
  const [step, setStep] = useState('email');

  // Email input
  const [email, setEmail] = useState('');

  // OTP input
  const [otp, setOtp] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  // Countdown timer
  const [countdown, setCountdown] = useState(30);

  // Start countdown when OTP screen appears
  useEffect(() => {
    if (step !== 'otp') {
      return;
    }

    if (countdown === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [step, countdown]);


  // -----------------------------
  // SEND OTP
  // -----------------------------

  const handleSendOTP = () => {

    if (!email.trim()) {
      Alert.alert(
        'Email Required',
        'Please enter your email address.'
      );
      return;
    }

    if (!email.includes('@')) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return;
    }

    setLoading(true);

    // Simulate sending OTP
    setTimeout(() => {

      setLoading(false);

      setCountdown(30);

      setStep('otp');

      Alert.alert(
        'OTP Sent',
        `A verification code has been sent to ${email}.`
      );

    }, 1000);
  };


  // -----------------------------
  // VERIFY OTP
  // -----------------------------

  const handleVerifyOTP = () => {

    if (otp.length !== 6) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 6-digit verification code.'
      );
      return;
    }

    setLoading(true);

    // Simulated OTP
    setTimeout(() => {

      setLoading(false);

      if (otp === '123456') {

        Alert.alert(
          'Verified',
          'Your email has been successfully verified.',
          [
            {
              text: 'Continue',
              onPress: () => {
                navigation.navigate('ResetPassword');
              },
            },
          ]
        );

      } else {

        Alert.alert(
          'Incorrect OTP',
          'The verification code you entered is incorrect.'
        );

      }

    }, 800);
  };


  // -----------------------------
  // RESEND OTP
  // -----------------------------

  const handleResendOTP = () => {

    if (countdown > 0) {
      return;
    }

    setCountdown(30);

    Alert.alert(
      'OTP Resent',
      `A new verification code has been sent to ${email}.`
    );
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >

        {/* BACK BUTTON */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>


        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.lockIcon}>
            🔐
          </Text>

          <Text style={styles.title}>
            Forgot Password?
          </Text>

          <Text style={styles.subtitle}>
            {step === 'email'
              ? 'Enter your email address and we’ll send you a verification code.'
              : 'Enter the 6-digit code we sent to your email address.'
            }
          </Text>

        </View>


        {/* STEP INDICATOR */}

        <View style={styles.steps}>

          <View
            style={[
              styles.stepCircle,
              styles.activeStep,
            ]}
          >
            <Text style={styles.stepNumber}>1</Text>
          </View>

          <View
            style={[
              styles.stepLine,
              step === 'otp' && styles.activeLine,
            ]}
          />

          <View
            style={[
              styles.stepCircle,
              step === 'otp' && styles.activeStep,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                step !== 'otp' && styles.inactiveNumber,
              ]}
            >
              2
            </Text>
          </View>

        </View>


        {/* EMAIL STEP */}

        {step === 'email' && (

          <View style={styles.form}>

            <Text style={styles.label}>
              Email Address
            </Text>

            <View style={styles.inputContainer}>

              <Text style={styles.inputIcon}>
                @
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#777777"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

            </View>


            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSendOTP}
              disabled={loading}
            >

              <Text style={styles.primaryButtonText}>
                {loading ? 'SENDING...' : 'SEND OTP'}
              </Text>

            </TouchableOpacity>

          </View>

        )}


        {/* OTP STEP */}

        {step === 'otp' && (

          <View style={styles.form}>

            <Text style={styles.label}>
              Verification Code
            </Text>

            <Text style={styles.emailText}>
              Code sent to:
            </Text>

            <Text style={styles.emailValue}>
              {email}
            </Text>


            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor="#555555"
              value={otp}
              onChangeText={(text) =>
                setOtp(text.replace(/[^0-9]/g, ''))
              }
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
            />


            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleVerifyOTP}
              disabled={loading}
            >

              <Text style={styles.primaryButtonText}>
                {loading ? 'VERIFYING...' : 'VERIFY OTP'}
              </Text>

            </TouchableOpacity>


            {/* RESEND */}

            <View style={styles.resendContainer}>

              <Text style={styles.resendText}>
                Didn't receive the code?
              </Text>

              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={countdown > 0}
              >

                <Text
                  style={[
                    styles.resendButton,
                    countdown > 0 && styles.disabledResend,
                  ]}
                >
                  {countdown > 0
                    ? ` Resend in ${countdown}s`
                    : ' Resend OTP'
                  }
                </Text>

              </TouchableOpacity>

            </View>


            {/* CHANGE EMAIL */}

            <TouchableOpacity
              style={styles.changeEmailButton}
              onPress={() => {
                setStep('email');
                setOtp('');
              }}
            >

              <Text style={styles.changeEmailText}>
                ← Change email address
              </Text>

            </TouchableOpacity>

          </View>

        )}

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 55,
    paddingBottom: 40,
  },


  // BACK BUTTON

  backButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  backArrow: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '300',
  },


  // HEADER

  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },

  lockIcon: {
    fontSize: 45,
    marginBottom: 20,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },

  subtitle: {
    color: '#BDBDBD',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 15,
  },


  // STEPS

  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },

  stepCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeStep: {
    backgroundColor: '#00E5FF',
    borderColor: '#00E5FF',
  },

  stepNumber: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  inactiveNumber: {
    color: '#777777',
  },

  stepLine: {
    width: 80,
    height: 2,
    backgroundColor: '#333333',
    marginHorizontal: 8,
  },

  activeLine: {
    backgroundColor: '#00E5FF',
  },


  // FORM

  form: {
    width: '100%',
  },

  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },


  // INPUT

  inputContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 25,
  },

  inputIcon: {
    color: '#00E5FF',
    fontSize: 25,
    fontWeight: 'bold',
    marginRight: 12,
  },

  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
  },


  // OTP

  emailText: {
    color: '#777777',
    fontSize: 14,
    marginBottom: 3,
  },

  emailValue: {
    color: '#00E5FF',
    fontSize: 15,
    marginBottom: 20,
  },

  otpInput: {
    height: 70,
    borderWidth: 1,
    borderColor: '#00E5FF',
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 12,
    marginBottom: 25,
  },


  // BUTTON

  primaryButton: {
    height: 58,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  primaryButtonText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1,
  },


  // RESEND

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    flexWrap: 'wrap',
  },

  resendText: {
    color: '#BDBDBD',
    fontSize: 14,
  },

  resendButton: {
    color: '#00E5FF',
    fontSize: 14,
    fontWeight: '600',
  },

  disabledResend: {
    color: '#555555',
  },


  // CHANGE EMAIL

  changeEmailButton: {
    alignItems: 'center',
    marginTop: 30,
  },

  changeEmailText: {
    color: '#00E5FF',
    fontSize: 15,
  },

});