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
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'; // for icons

export default function LoginScreen({ navigation }) {
  // keep track of what the user types
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Signing in with:', emailOrPhone, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/MechanicIQLogo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Heading */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login to your account to continue{'\n'}as a customer
        </Text>

        {/* Email or phone input */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#2FD5D5"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email or Phone Number"
            placeholderTextColor="#888888"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            autoCapitalize="none"
          />
        </View>

        {/* Password input */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#2FD5D5"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Forgot password link */}
        <TouchableOpacity style={styles.forgotWrapper}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign in button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>SIGN IN</Text>
        </TouchableOpacity>

        {/* OR divider */}
        <Text style={styles.orText}>OR</Text>

        {/* Continue with Google */}
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign
            name="google"
            size={18}
            color="#EA4335"
            style={styles.inputIcon}
          />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Continue with Apple */}
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign
            name="apple1"
            size={18}
            color="#FFFFFF"
            style={styles.inputIcon}
          />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>

        {/* Create account link */}
        <View style={styles.createAccountWrapper}>
          <Text style={styles.createAccountText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.createAccountLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 160,
    height: 90,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2FD5D5',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 12,
    fontSize: 14,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#2FD5D5',
    fontSize: 12,
  },
  signInButton: {
    backgroundColor: '#2FD5D5',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  orText: {
    color: '#888888',
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 12,
    marginBottom: 14,
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  createAccountWrapper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  createAccountText: {
    color: '#CCCCCC',
    fontSize: 13,
  },
  createAccountLink: {
    color: '#2FD5D5',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
