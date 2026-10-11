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
  UploadRow,
  SignUpHeader,
  SignUpFooter,
} from './SignUpShared';

export default function SignUpStep2({ navigation, route }) {

  const initial = route?.params || {};

  const [form, setForm] = useState({
    workshopLocation: initial.workshopLocation || '',
    serviceRadius: initial.serviceRadius || '',
    yearsExperience: initial.yearsExperience || '',
    qualifications: initial.qualifications || '',
    specialisation: initial.specialisation || '',
    vehicleBrands: initial.vehicleBrands || [],
    licenseNumber: initial.licenseNumber || '',
    registrationNumber: initial.registrationNumber || '',
  });

  const [specialisationOpen, setSpecialisationOpen] = useState(false);
  const [vehicleBrandsOpen, setVehicleBrandsOpen] = useState(false);

  const specialisations = [
    'General Mechanic',
    'Auto Electrical',
    'Engine Repair',
    'Brakes & Suspension',
    'Vehicle Diagnostics',
    'Transmission Repair',
    'Air Conditioning',
  ];

  const vehicleBrands = [
    'Toyota',
    'Volkswagen',
    'Ford',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Nissan',
    'Hyundai',
    'Kia',
    'Honda',
  ];

  const update = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleVehicleBrand = (brand) => {
    setForm((f) => {
      const currentBrands = f.vehicleBrands || [];

      if (currentBrands.includes(brand)) {
        return {
          ...f,
          vehicleBrands: currentBrands.filter(
            (item) => item !== brand
          ),
        };
      }

      return {
        ...f,
        vehicleBrands: [...currentBrands, brand],
      };
    });
  };

  const handleContinue = () => {
    navigation?.navigate?.('SignUpStep3', {
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
          step={2}
          onBack={() => navigation?.goBack?.()}
        />

        {/* WORKSHOP LOCATION */}

        <FieldRow
          icon={
            <Ionicons
              name="location-outline"
              size={20}
              color={CYAN}
            />
          }
          label="Workshop Location"
          placeholder="Enter your workshop location"
          value={form.workshopLocation}
          onChangeText={update('workshopLocation')}
        />

        {/* SERVICE AREA + EXPERIENCE */}

        <View style={styles.halfRow}>

          <FieldRow
            icon={
              <Ionicons
                name="locate-outline"
                size={20}
                color={CYAN}
              />
            }
            label="Service Area / Radius"
            placeholder="e.g., 25 km"
            value={form.serviceRadius}
            onChangeText={update('serviceRadius')}
            style={styles.halfField}
          />

          <FieldRow
            icon={
              <Ionicons
                name="calendar-outline"
                size={20}
                color={CYAN}
              />
            }
            label="Years of Mechanical Experience"
            placeholder="Enter years of experience"
            keyboardType="number-pad"
            value={form.yearsExperience}
            onChangeText={update('yearsExperience')}
            style={styles.halfField}
          />

        </View>

        {/* QUALIFICATIONS */}

        <FieldRow
          icon={
            <Ionicons
              name="school-outline"
              size={20}
              color={CYAN}
            />
          }
          label="Qualifications / Certifications"
          placeholder="Enter your qualifications & certifications"
          value={form.qualifications}
          onChangeText={update('qualifications')}
        />

        {/* SPECIALISATION */}

        <View style={styles.fieldContainer}>

          <View style={styles.fieldLabelRow}>

            <Ionicons
              name="construct-outline"
              size={20}
              color={CYAN}
            />

            <Text style={styles.fieldLabel}>
              Specialisation
            </Text>

          </View>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setSpecialisationOpen(true)}
            activeOpacity={0.8}
          >

            <Text
              style={
                form.specialisation
                  ? styles.dropdownSelectedText
                  : styles.fieldPlaceholder
              }
            >
              {form.specialisation ||
                'Select your specialisation'}
            </Text>

            <Ionicons
              name="chevron-down"
              size={20}
              color={CYAN}
            />

          </TouchableOpacity>

        </View>

        {/* SPECIALISATION MODAL */}

        <Modal
          visible={specialisationOpen}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setSpecialisationOpen(false)
          }
        >

          <Pressable
            style={styles.modalOverlay}
            onPress={() =>
              setSpecialisationOpen(false)
            }
          >

            <View style={styles.dropdownModal}>

              <Text style={styles.modalTitle}>
                Select Specialisation
              </Text>

              {specialisations.map((item) => (

                <TouchableOpacity
                  key={item}
                  style={styles.dropdownOption}
                  onPress={() => {

                    update('specialisation')(item);

                    setSpecialisationOpen(false);

                  }}
                >

                  <Text style={styles.dropdownOptionText}>
                    {item}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>

          </Pressable>

        </Modal>

        {/* VEHICLE BRANDS */}

        <View style={styles.fieldContainer}>

          <View style={styles.fieldLabelRow}>

            <Ionicons
              name="car-outline"
              size={20}
              color={CYAN}
            />

            <Text style={styles.fieldLabel}>
              Vehicle Brands Supported
            </Text>

          </View>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setVehicleBrandsOpen(true)}
            activeOpacity={0.8}
          >

            <Text
              style={
                form.vehicleBrands.length > 0
                  ? styles.dropdownSelectedText
                  : styles.fieldPlaceholder
              }
              numberOfLines={2}
            >
              {form.vehicleBrands.length > 0
                ? form.vehicleBrands.join(', ')
                : 'Select vehicle brands'}
            </Text>

            <Ionicons
              name="chevron-down"
              size={20}
              color={CYAN}
            />

          </TouchableOpacity>

        </View>

        {/* VEHICLE BRANDS MODAL */}

        <Modal
          visible={vehicleBrandsOpen}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setVehicleBrandsOpen(false)
          }
        >

          <Pressable
            style={styles.modalOverlay}
            onPress={() =>
              setVehicleBrandsOpen(false)
            }
          >

            <View style={styles.dropdownModal}>

              <Text style={styles.modalTitle}>
                Select Vehicle Brands
              </Text>

              <Text style={styles.modalSubtext}>
                Select all brands your workshop supports
              </Text>

              {vehicleBrands.map((brand) => {

                const selected =
                  form.vehicleBrands.includes(brand);

                return (

                  <TouchableOpacity
                    key={brand}
                    style={styles.dropdownOption}
                    onPress={() =>
                      toggleVehicleBrand(brand)
                    }
                  >

                    <Text style={styles.dropdownOptionText}>
                      {brand}
                    </Text>

                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={CYAN}
                      />
                    )}

                  </TouchableOpacity>

                );

              })}

              <TouchableOpacity
                style={styles.modalDoneButton}
                onPress={() =>
                  setVehicleBrandsOpen(false)
                }
              >

                <Text style={styles.modalDoneText}>
                  Done
                </Text>

              </TouchableOpacity>

            </View>

          </Pressable>

        </Modal>

        {/* LICENSE + REGISTRATION */}

        <View style={styles.halfRow}>

          <FieldRow
            icon={
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={20}
                color={CYAN}
              />
            }
            label="Trade Test / License Number"
            placeholder="Enter license number"
            value={form.licenseNumber}
            onChangeText={update('licenseNumber')}
            style={styles.halfField}
          />

          <FieldRow
            icon={
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={20}
                color={CYAN}
              />
            }
            label="Business Registration Number"
            placeholder="Enter registration number"
            value={form.registrationNumber}
            onChangeText={update('registrationNumber')}
            style={styles.halfField}
          />

        </View>

        {/* DOCUMENT UPLOADS */}

        <UploadRow label="Upload ID Document" />

        <UploadRow label="Upload Trade Certificate" />

        <UploadRow
          label="Upload Workshop Registration / Proof of Business"
        />

        <UploadRow
          label="Upload Profile Photo (optional)"
        />

        {/* CONTINUE */}

        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={handleContinue}
        >

          <Text style={styles.continueText}>
            Continue
          </Text>

        </TouchableOpacity>

        {/* BACK */}

        <TouchableOpacity
          style={styles.backOutlineButton}
          activeOpacity={0.85}
          onPress={() => navigation?.goBack?.()}
        >

          <Text style={styles.backOutlineText}>
            Back
          </Text>

        </TouchableOpacity>

        <SignUpFooter navigation={navigation} />

      </ScrollView>

    </KeyboardAvoidingView>
  );
}