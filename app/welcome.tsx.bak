import {
  Ionicons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '../src/theme/ThemeContext'

export default function WelcomeScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  function handleCustomerSignUp() {
    router.push(
      '/auth/customer-signup'
    )
  }

  function handleMechanicSignUp() {
    router.push(
      '/auth/mechanic-signup'
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/mechaniq-logo.png')}
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
        Create Your Account
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
        Choose how you want to join
        MechanIQ
      </Text>

      <View style={styles.cardRow}>
        <View
          style={[
            styles.card,
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
              styles.iconCircle,
              {
                borderColor:
                  colors.accent,
              },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={28}
              color={colors.accent}
            />
          </View>

          <Text
            style={[
              styles.cardTitle,
              {
                color: colors.text,
              },
            ]}
          >
            I'M A CUSTOMER
          </Text>

          <Text
            style={[
              styles.cardDescription,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Manage your vehicles, run
            diagnostics, order fuel,
            find mechanics and more.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              {
                backgroundColor:
                  colors.accent,
              },
            ]}
            onPress={
              handleCustomerSignUp
            }
          >
            <Text style={styles.buttonText}>
              CONTINUE AS CUSTOMER
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
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
              styles.iconCircle,
              {
                borderColor:
                  colors.accent,
              },
            ]}
          >
            <Ionicons
              name="build-outline"
              size={28}
              color={colors.accent}
            />
          </View>

          <Text
            style={[
              styles.cardTitle,
              {
                color: colors.text,
              },
            ]}
          >
            I'M A MECHANIC
          </Text>

          <Text
            style={[
              styles.cardDescription,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Manage jobs, diagnostics,
            customers, bookings and
            workshop activity.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              {
                backgroundColor:
                  colors.accent,
              },
            ]}
            onPress={
              handleMechanicSignUp
            }
          >
            <Text style={styles.buttonText}>
              CONTINUE AS MECHANIC
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.loginRow}>
        <Text
          style={[
            styles.loginText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Already have an account?{' '}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.replace(
              '/auth/login'
            )
          }}
        >
          <Text
            style={[
              styles.loginLink,
              {
                color: colors.accent,
              },
            ]}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  logo: {
    width: 190,
    height: 110,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 30,
    textAlign: 'center',
  },

  cardRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },

  card: {
    flex: 1,
    minHeight: 235,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  cardTitle: {
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 9,
    textAlign: 'center',
  },

  cardDescription: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 15,
    textAlign: 'center',
    marginBottom: 15,
  },

  button: {
    width: '100%',
    minHeight: 38,
    borderRadius: 7,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 9,
    textAlign: 'center',
  },

  loginRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginText: {
    fontSize: 12,
  },

  loginLink: {
    fontSize: 12,
    fontWeight: '700',
  },
})