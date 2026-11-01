import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack?.()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Image
            source={require('../assets/mechaniq-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Log in to your account to continue{'\n'}as a mechanic
        </Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#3DD9F5" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email or Phone Number"
            placeholderTextColor="#7A8A94"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#3DD9F5" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7A8A94"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#C7D2D9"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotWrapper}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} activeOpacity={0.85}>
          <Text style={styles.signInText}>SIGN IN</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
          <AntDesign name="google" size={20} color="#EA4335" style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
          <AntDesign name="apple1" size={22} color="#FFFFFF" style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                  <TouchableOpacity onPress={() => navigation?.navigate?.('SignUpStep1')}>
                      <Text style={styles.footerLink}>Create Mechanic Account</Text>
                  </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const CYAN = '#2DD9F0';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 8,
    marginBottom: 4,
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 4,
  },
  logo: {
    width: 260,
    height: 160,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    color: '#9AA7AE',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C3B42',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: CYAN,
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: CYAN,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signInText: {
    color: '#00131A',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2C3B42',
  },
  dividerText: {
    color: '#7A8A94',
    fontSize: 13,
    marginHorizontal: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C3B42',
    borderRadius: 14,
    height: 56,
    marginBottom: 16,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#9AA7AE',
    fontSize: 14,
  },
  footerLink: {
    color: CYAN,
    fontSize: 14,
    fontWeight: '600',
  },
});