import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useUser } from '../users/UserContext'

const { width } = Dimensions.get('window')

const LOGO_WIDTH = Math.min(
  width * 0.82,
  380
)

function LoadingDots({
  activeIndex,
}: {
  activeIndex: number
}) {
  return (
    <View style={styles.dotsRow}>
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === activeIndex
                  ? '#3DD9F5'
                  : '#1C3A4A',
            },
          ]}
        />
      ))}
    </View>
  )
}

export default function SplashScreen() {
  const router = useRouter()
  const { user, isLoadingUser } = useUser()

  const fadeIn = useRef(
    new Animated.Value(0)
  ).current

  const [
    activeDot,
    setActiveDot,
  ] = useState(0)

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start()

    const interval = setInterval(() => {
      setActiveDot(
        (previous) =>
          (previous + 1) % 3
      )
    }, 550)

    const timeout = setTimeout(() => {
      if (!isLoadingUser) {
        router.replace(
          user ? '/(customer)' : '/auth/login'
        )
      }
    }, 1200)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [fadeIn, isLoadingUser, router, user])

  return (
    <View style={styles.container}>
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            '#050B14',
            '#050B14',
            '#0B1A2C',
          ]}
          style={StyleSheet.absoluteFill}
        />

        <LinearGradient
          colors={[
            'rgba(38, 150, 220, 0.35)',
            'rgba(38, 150, 220, 0)',
          ]}
          start={{
            x: 0.9,
            y: 0.25,
          }}
          end={{
            x: 0.3,
            y: 0.6,
          }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeIn,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/mechaniq-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.footer}>
        <LoadingDots
          activeIndex={activeDot}
        />

        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B14',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    alignItems: 'center',
  },

  logo: {
    width: LOGO_WIDTH,
    height: LOGO_WIDTH * 0.62,
  },

  footer: {
    position: 'absolute',
    bottom: 70,
    alignItems: 'center',
  },

  dotsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  dot: {
    width: 22,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },

  loadingText: {
    color: '#6B8A9E',
    fontSize: 13,
    letterSpacing: 1,
  },
})
