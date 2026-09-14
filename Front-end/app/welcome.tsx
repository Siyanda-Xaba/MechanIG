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

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/mechaniq-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>
        Welcome to{' '}
        <Text style={styles.titleAccent}>
          MechanIQ
        </Text>
      </Text>

      <Text style={styles.subtitle}>
        Choose how you want to continue
      </Text>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconCircle,
              {
                borderColor: '#00E5FF',
              },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={28}
              color="#00E5FF"
            />
          </View>

          <Text style={styles.cardTitle}>
            I'M A CUSTOMER
          </Text>

          <Text
            style={styles.cardDescription}
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
                  '#00E5FF',
              },
            ]}
            onPress={() => {
              router.push({
                pathname:
                  '/auth/login',
                params: {
                  role: 'customer',
                },
              })
            }}
          >
            <Text style={styles.buttonText}>
              CONTINUE AS CUSTOMER
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View
            style={[
              styles.iconCircle,
              {
                borderColor: '#00E5FF',
              },
            ]}
          >
            <Ionicons
              name="build-outline"
              size={28}
              color="#00E5FF"
            />
          </View>

          <Text style={styles.cardTitle}>
            I'M A MECHANIC
          </Text>

          <Text
            style={styles.cardDescription}
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
                  '#00E5FF',
              },
            ]}
            onPress={() => {
              router.push({
                pathname:
                  '/auth/login',
                params: {
                  role: 'mechanic',
                },
              })
            }}
          >
            <Text style={styles.buttonText}>
              CONTINUE AS MECHANIC
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },

  titleAccent: {
    color: '#00E5FF',
  },

  subtitle: {
    color: '#BDBDBD',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 30,
  },

  cardRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },

  card: {
    flex: 1,
    minHeight: 235,
    backgroundColor: '#010101',
    borderWidth: 1,
    borderColor: '#333333',
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
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 9,
    textAlign: 'center',
  },

  cardDescription: {
    flex: 1,
    color: '#BDBDBD',
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
    color: '#000000',
    fontWeight: '800',
    fontSize: 9,
    textAlign: 'center',
  },
})