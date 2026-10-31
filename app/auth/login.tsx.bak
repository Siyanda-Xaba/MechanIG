import {
  AntDesign,
  Ionicons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'
import {
  getFirebaseAuthErrorMessage,
  sendPasswordReset,
  signInWithEmail,
} from '../../src/auth/authService'
import { useTheme } from '../../src/theme/ThemeContext'
import { useUser } from '../../src/users/UserContext'

export default function LoginScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { setUser } = useUser()

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

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSignIn() {
    if (!emailOrPhone.includes('@')) {
      Alert.alert(
        'Email required',
        'Sign in with the email address you used to create your account.'
      )
      return
    }

    if (!password) {
      Alert.alert('Password required', 'Enter your password to sign in.')
      return
    }

    try {
      setIsSubmitting(true)
      const user = await signInWithEmail(emailOrPhone, password)
      setUser(user)
      router.replace('/(customer)')
    } catch (error) {
      Alert.alert('Unable to sign in', getFirebaseAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleForgotPassword() {
    if (!emailOrPhone.includes('@')) {
      Alert.alert(
        'Enter your email',
        'Enter the email address for your account, then tap Forgot Password again.'
      )
      return
    }

    try {
      await sendPasswordReset(emailOrPhone)
      Alert.alert(
        'Reset email sent',
        'Check your inbox for a link to reset your password.'
      )
    } catch (error) {
      Alert.alert('Unable to reset password', getFirebaseAuthErrorMessage(error))
    }
  }

  function handleCreateAccount() {
    router.push('/welcome')
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
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.content
          }
        >
          <View
            style={styles.backButtonSpacer}
          />

          <View
            style={styles.logoContainer}
          >
            <Image
              source={require('../../assets/images/mechaniq-logo.png')}
              style={styles.logo}
              resizeMode="contain"
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
            Welcome Back
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
            Login your account to continue
          </Text>

          <View
            style={[
              styles.inputWrapper,
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
              size={20}
              color={colors.accent}
              style={styles.inputIcon}
            />

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                },
              ]}
              placeholder="Email or Phone Number"
              placeholderTextColor={
                colors.secondaryText
              }
              value={emailOrPhone}
              onChangeText={
                setEmailOrPhone
              }
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.accent}
              style={styles.inputIcon}
            />

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={
                colors.secondaryText
              }
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
                color={
                  colors.secondaryText
                }
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleForgotPassword}
            style={styles.forgotWrapper}
          >
            <Text
              style={[
                styles.forgotText,
                {
                  color: colors.accent,
                },
              ]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={isSubmitting}
            style={[
              styles.signInButton,
              {
                backgroundColor:
                  colors.accent,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={styles.signInText}
            >
              {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>

          <View
            style={styles.dividerRow}
          >
            <View
              style={[
                styles.dividerLine,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            />

            <Text
              style={[
                styles.dividerText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              OR
            </Text>

            <View
              style={[
                styles.dividerLine,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              // Google authentication
              // will be connected later.
            }}
            style={[
              styles.socialButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <AntDesign
              name="google"
              size={19}
              color="#EA4335"
              style={styles.socialIcon}
            />

            <Text
              style={[
                styles.socialText,
                {
                  color: colors.text,
                },
              ]}
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
            style={[
              styles.socialButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <AntDesign
              name="apple"
              size={21}
              color={colors.text}
              style={styles.socialIcon}
            />

            <Text
              style={[
                styles.socialText,
                {
                  color: colors.text,
                },
              ]}
            >
              Continue with Apple
            </Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text
              style={[
                styles.footerText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
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
                style={[
                  styles.footerLink,
                  {
                    color:
                      colors.accent,
                  },
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </StableScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },

  backButtonSpacer: {
    width: 38,
    height: 38,
    marginTop: 4,
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
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },

  subtitle: {
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
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
  },

  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },

  signInButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  signInText: {
    color: '#FFFFFF',
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
  },

  dividerText: {
    fontSize: 13,
    marginHorizontal: 14,
  },

  socialButton: {
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  socialIcon: {
    marginRight: 10,
  },

  socialText: {
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
    fontSize: 12,
  },

  footerLink: {
    fontSize: 12,
    fontWeight: '700',
  },
})
