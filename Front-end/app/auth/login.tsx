import {
  AntDesign,
  Ionicons,
} from '@expo/vector-icons'
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import { useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type AuthRole =
  | 'customer'
  | 'mechanic'

export default function LoginScreen() {
  const router = useRouter()

  const {
    role: roleParam,
  } = useLocalSearchParams<{
    role?: string
  }>()

  const role: AuthRole =
    roleParam === 'mechanic'
      ? 'mechanic'
      : 'customer'

  const [
    emailOrPhone,
    setEmailOrPhone,
  ] = useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  function handleSignIn() {
    if (role === 'customer') {
      router.replace('/(customer)')
      return
    }

    // Mechanic authentication/dashboard
    // integration will be connected here
    // separately.
    console.log('Mechanic sign in requested', {
      emailOrPhone,
    })
  }

  function handleCreateAccount() {
    if (role === 'mechanic') {
      router.push(
        '/auth/mechanic-signup'
      )
      return
    }

    router.push(
      '/auth/customer-signup'
    )
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.content
          }
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={25}
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
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Log in to your account to
            continue{'\n'}as a {role}
          </Text>

          <View
            style={styles.inputWrapper}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#00E5FF"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Email or Phone Number"
              placeholderTextColor="#7A8A94"
              value={emailOrPhone}
              onChangeText={
                setEmailOrPhone
              }
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View
            style={styles.inputWrapper}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#00E5FF"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#7A8A94"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={
                !showPassword
              }
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowPassword(
                  (current) => !current
                )
              }}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={20}
                color="#BDBDBD"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              // Forgot-password backend
              // flow will be connected
              // later.
            }}
            style={styles.forgotWrapper}
          >
            <Text
              style={styles.forgotText}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignIn}
            style={styles.signInButton}
          >
            <Text
              style={styles.signInText}
            >
              SIGN IN
            </Text>
          </TouchableOpacity>

          <View
            style={styles.dividerRow}
          >
            <View
              style={styles.dividerLine}
            />

            <Text
              style={styles.dividerText}
            >
              OR
            </Text>

            <View
              style={styles.dividerLine}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              // Google authentication
              // will be connected later.
            }}
            style={styles.socialButton}
          >
            <AntDesign
              name="google"
              size={19}
              color="#EA4335"
              style={styles.socialIcon}
            />

            <Text
              style={styles.socialText}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              // Apple authentication
              // will be connected later.
            }}
            style={styles.socialButton}
          >
            <AntDesign
              name="apple"
              size={21}
              color="#FFFFFF"
              style={styles.socialIcon}
            />

            <Text
              style={styles.socialText}
            >
              Continue with Apple
            </Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text
              style={styles.footerText}
            >
              Don't have an account?{' '}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={
                handleCreateAccount
              }
            >
              <Text
                style={styles.footerLink}
              >
                {role === 'mechanic'
                  ? 'Create Mechanic Account'
                  : 'Create Customer Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },

  backButton: {
    width: 38,
    height: 38,
    marginTop: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 4,
  },

  logo: {
    width: 240,
    height: 145,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },

  subtitle: {
    color: '#BDBDBD',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
    textTransform: 'lowercase',
  },

  inputWrapper: {
    height: 56,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#00E5FF',
    fontSize: 13,
    fontWeight: '600',
  },

  signInButton: {
    height: 56,
    backgroundColor: '#00E5FF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  signInText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
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
    backgroundColor: '#333333',
  },

  dividerText: {
    color: '#7A8A94',
    fontSize: 13,
    marginHorizontal: 14,
  },

  socialButton: {
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  socialIcon: {
    marginRight: 10,
  },

  socialText: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  footerRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    color: '#BDBDBD',
    fontSize: 12,
  },

  footerLink: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '700',
  },
})