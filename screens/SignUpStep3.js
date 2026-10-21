import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  styles,
  CYAN,
  GREEN,
  MUTED,
  PasswordRow,
  SignUpHeader,
  SignUpFooter,
} from './SignUpShared';

export default function SignUpStep3({ navigation, route }) {
  const initial = route?.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [agree, setAgree] = useState(true);

  const handleCreateAccount = () => {
    // All collected data across the three steps is available in `initial`
    // plus the password fields here — send it to your backend/auth here.
    navigation?.reset?.({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <SignUpHeader step={3} onBack={() => navigation?.goBack?.()} />

        <PasswordRow
          label="Create Password"
          placeholder="Enter a strong password"
          value={password}
          onChangeText={setPassword}
          visible={pwVisible}
          onToggleVisible={() => setPwVisible((v) => !v)}
        />
        <PasswordRow
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          visible={confirmVisible}
          onToggleVisible={() => setConfirmVisible((v) => !v)}
        />

        <View style={styles.requirementsBox}>
          <Text style={styles.requirementsTitle}>Password requirements</Text>
          {[
            'At least 8 characters long',
            'Include uppercase and lowercase letters',
            'Include at least one number',
            'Include at least one special character (e.g. @ # ! %)',
          ].map((req) => (
            <View style={styles.requirementRow} key={req}>
              <Ionicons name="checkmark-circle" size={16} color={GREEN} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>

        <View style={styles.verificationBox}>
          <View style={styles.verificationHeaderRow}>
            <Ionicons name="mail-outline" size={20} color={CYAN} />
            <View style={styles.verificationHeaderText}>
              <Text style={styles.fieldLabel}>Email Verification</Text>
              <Text style={styles.verificationSubtext}>
                We&apos;ll send a verification code to your email address.
              </Text>
            </View>
          </View>

          <View style={styles.verificationInputRow}>
            <View style={styles.verificationInputArea}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <Text style={styles.fieldPlaceholder}>{initial.email || 'john.doe@email.com'}</Text>
            </View>
            <TouchableOpacity style={styles.sendCodeButton}>
              <Text style={styles.sendCodeText}>Send Code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.verificationInputRow}>
            <View style={styles.verificationInputArea}>
              <Text style={styles.fieldLabel}>Verification Code</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Enter 6-digit code"
                placeholderTextColor={MUTED}
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity style={styles.verifyCodeButton}>
              <Text style={styles.verifyCodeText}>Verify Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.twoFactorRow}>
          <Ionicons name="shield-checkmark-outline" size={20} color={CYAN} />
          <View style={styles.twoFactorTextArea}>
            <Text style={styles.fieldLabel}>Two-Factor Authentication (Optional)</Text>
            <Text style={styles.verificationSubtext}>
              Add an extra layer of security to protect your account.
            </Text>
          </View>
          <Switch
            value={twoFactor}
            onValueChange={setTwoFactor}
            trackColor={{ false: '#3A4750', true: CYAN }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity style={styles.agreeRow} onPress={() => setAgree((v) => !v)} activeOpacity={0.7}>
          <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
            {agree && <Ionicons name="checkmark" size={14} color="#00131A" />}
          </View>
          <Text style={styles.agreeText}>
            I agree to the <Text style={styles.agreeLink}>Terms of Service</Text> and{' '}
            <Text style={styles.agreeLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} activeOpacity={0.85} onPress={handleCreateAccount}>
          <Text style={styles.continueText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backOutlineButton}
          activeOpacity={0.85}
          onPress={() => navigation?.goBack?.()}
        >
          <Text style={styles.backOutlineText}>Back</Text>
        </TouchableOpacity>

        <SignUpFooter navigation={navigation} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}