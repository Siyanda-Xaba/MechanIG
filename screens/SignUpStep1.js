import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  styles,
  CYAN,
  FieldRow,
  SignUpHeader,
  SignUpFooter,
} from './SignUpShared';

export default function SignUpStep1({ navigation, route }) {

  const initial = route?.params || {};

  const [form, setForm] = useState({
    fullName: initial.fullName || '',
    email: initial.email || '',
    phone: initial.phone || '',
    idNumber: initial.idNumber || '',
    businessName: initial.businessName || '',
    businessType: initial.businessType || '',
    yearsInBusiness: initial.yearsInBusiness || '',
    employees: initial.employees || '',
    address: initial.address || '',
    city: initial.city || '',
    province: initial.province || '',
  });

  const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
  const [provinceOpen, setProvinceOpen] = useState(false);

  const businessTypes = [
    'Independent Workshop',
    'Dealership',
    'Mobile Mechanic',
    'Auto Repair Centre',
    'Fleet Workshop',
    'Specialised Auto Workshop',
  ];

  const provinces = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Limpopo',
    'Mpumalanga',
    'Free State',
    'North West',
    'Northern Cape',
  ];

  const update = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleContinue = () => {
    navigation?.navigate?.('SignUpStep2', {
      ...initial,
      ...form,
    });
  };

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

        <SignUpHeader
          step={1}
          onBack={() => navigation?.goBack?.()}
        />

        <FieldRow
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color={CYAN}
            />
          }
          label="Full Name"
          placeholder="Enter your full name"
          value={form.fullName}
          onChangeText={update('fullName')}
        />

        <FieldRow
          icon={
            <Ionicons
              name="mail-outline"
              size={20}
              color={CYAN}
            />
          }
          label="Email Address"
          placeholder="Enter your email address"
          keyboardType="email-address"
          value={form.email}
          onChangeText={update('email')}
        />

        <FieldRow
          icon={
            <Ionicons
              name="call-outline"
              size={20}
              color={CYAN}
            />
          }
          label="Phone Number"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={update('phone')}
        />

        <FieldRow
          icon={
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={20}
              color={CYAN}
            />
          }
          label="ID Number / Passport"
          placeholder="Enter ID number or passport number"
          value={form.idNumber}
          onChangeText={update('idNumber')}
        />

        <FieldRow
          icon={
            <Ionicons
              name="storefront-outline"
              size={20}
              color={CYAN}
            />
          }
          label="Workshop / Business Name"
          placeholder="Enter your workshop or business name"
          value={form.businessName}
          onChangeText={update('businessName')}
        />

        {/* BUSINESS TYPE */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldLabelRow}>
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={CYAN}
            />

            <Text style={styles.fieldLabel}>
              Business Type
            </Text>
          </View>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setBusinessTypeOpen(true)}
            activeOpacity={0.8}
          >
            <Text
              style={
                form.businessType
                  ? styles.fieldInput
                  : styles.fieldPlaceholder
              }
            >
              {form.businessType || 'Select your business type'}
            </Text>

            <Ionicons
              name="chevron-down"
              size={20}
              color={CYAN}
            />
          </TouchableOpacity>
        </View>

        {/* BUSINESS TYPE MODAL */}
        <Modal
          visible={businessTypeOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setBusinessTypeOpen(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setBusinessTypeOpen(false)}
          >
            <View style={styles.dropdownModal}>
              <Text style={styles.modalTitle}>
                Select Business Type
              </Text>

              {businessTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownOption}
                  onPress={() => {
                    update('businessType')(type);
                    setBusinessTypeOpen(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>

        <View style={styles.halfRow}>

          <FieldRow
            icon={
              <Ionicons
                name="calendar-outline"
                size={20}
                color={CYAN}
              />
            }
            label="Years in Business"
            placeholder="Enter years in business"
            keyboardType="number-pad"
            value={form.yearsInBusiness}
            onChangeText={update('yearsInBusiness')}
            style={styles.halfField}
          />

          <FieldRow
            icon={
              <Ionicons
                name="people-outline"
                size={20}
                color={CYAN}
              />
            }
            label="Number of Employees"
            placeholder="Enter number of employees"
            keyboardType="number-pad"
            value={form.employees}
            onChangeText={update('employees')}
            style={styles.halfField}
          />

        </View>

        <FieldRow
          icon={
            <Ionicons
              name="location-outline"
              size={20}
              color={CYAN}
            />
          }
          label="Street Address"
          placeholder="Enter your street address"
          value={form.address}
          onChangeText={update('address')}
        />

        <View style={styles.halfRow}>

          <FieldRow
            icon={
              <Ionicons
                name="business-outline"
                size={20}
                color={CYAN}
              />
            }
            label="City"
            placeholder="Enter your city"
            value={form.city}
            onChangeText={update('city')}
            style={styles.halfField}
          />

          {/* PROVINCE */}
          <View style={[styles.fieldContainer, styles.halfField]}>
            <View style={styles.fieldLabelRow}>
              <Ionicons
                name="map-outline"
                size={20}
                color={CYAN}
              />

              <Text style={styles.fieldLabel}>
                Province
              </Text>
            </View>

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setProvinceOpen(true)}
              activeOpacity={0.8}
            >
              <Text
                style={
                  form.province
                    ? styles.fieldInput
                    : styles.fieldPlaceholder
                }
              >
                {form.province || 'Select your province'}
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color={CYAN}
              />
            </TouchableOpacity>
          </View>

        </View>

        {/* PROVINCE MODAL */}
        <Modal
          visible={provinceOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setProvinceOpen(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setProvinceOpen(false)}
          >
            <View style={styles.dropdownModal}>
              <Text style={styles.modalTitle}>
                Select Province
              </Text>

              {provinces.map((province) => (
                <TouchableOpacity
                  key={province}
                  style={styles.dropdownOption}
                  onPress={() => {
                    update('province')(province);
                    setProvinceOpen(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>
                    {province}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>

        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>
        </TouchableOpacity>

        <SignUpFooter navigation={navigation} />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}