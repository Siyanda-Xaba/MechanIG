// WelcomeScreen.js
// This is the first screen users see - they pick if they're a customer or a mechanic

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // for the person/wrench icons

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo + tagline */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/MechanicIQLogo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Heading */}
      <Text style={styles.title}>
        Welcome to <Text style={styles.titleAccent}>MechanIQ</Text>
      </Text>
      <Text style={styles.subtitle}>Choose how you want to continue</Text>

      {/* Two role cards */}
      <View style={styles.cardRow}>
        {/* Customer card */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { borderColor: '#2FD5D5' }]}>
            <Ionicons name="person-outline" size={28} color="#2FD5D5" />
          </View>
          <Text style={styles.cardTitle}>IM A CUSTOMER</Text>
          <Text style={styles.cardDescription}>
            Manage your vehicle, get AI diagnostics, order fuel, find
            mechanics & more.
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2FD5D5' }]}
            onPress={() => navigation.navigate('Login', { role: 'customer' })}
          >
            <Text style={styles.buttonText}>CONTINUE AS CUSTOMER</Text>
          </TouchableOpacity>
        </View>

        {/* Mechanic card */}
        <View style={styles.card}>
          <View style={[styles.iconCircle, { borderColor: '#4CAF50' }]}>
            <Ionicons name="build-outline" size={28} color="#4CAF50" />
          </View>
          <Text style={styles.cardTitle}>IM A MECHANIC</Text>
          <Text style={styles.cardDescription}>
            Manage your vehicle, get AI diagnostics, order fuel, find
            mechanics & more.
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4CAF50' }]}
            onPress={() => navigation.navigate('Login', { role: 'mechanic' })}
          >
            <Text style={styles.buttonText}>CONTINUE AS MECHANIC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // dark background to match the design
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 90,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  titleAccent: {
    color: '#2FD5D5',
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 30,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    color: '#AAAAAA',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 14,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 10,
  },
});