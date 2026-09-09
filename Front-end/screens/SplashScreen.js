import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const LOGO_WIDTH = Math.min(width * 0.82, 380);

function LoadingDots({ activeIndex }) {
  return (
    <View style={styles.dotsRow}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i === activeIndex ? '#3DD9F5' : '#1C3A4A' },
          ]}
        />
      ))}
    </View>
  );
}

export default function SplashScreen({ navigation }) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 550);

    // Move on to the login screen once the splash has had time to show.
    const timeout = setTimeout(() => {
      navigation?.replace?.('Login');
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fadeIn, navigation]);

  return (
    <View style={styles.container}>
      {/* base background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#050B14', '#050B14', '#0B1A2C']}
          style={StyleSheet.absoluteFill}
        />
        {/* soft glow, offset to the right like the reference */}
        <LinearGradient
          colors={['rgba(38,150,220,0.35)', 'rgba(38,150,220,0)']}
          start={{ x: 0.9, y: 0.25 }}
          end={{ x: 0.3, y: 0.6 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeIn }]}>
        <Image
          source={require('../assets/mechaniq-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.footer}>
        <LoadingDots activeIndex={activeDot} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
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
    height: LOGO_WIDTH * 0.62, // matches the logo's aspect ratio; adjust if needed
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
});