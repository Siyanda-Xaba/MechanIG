import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext'
import {
  CYAN,
  FieldRow,
  SignUpFooter,
  SignUpHeader,
  styles,
} from '../../../src/auth/mechanic/MechanicSignUpShared'

const BUSINESS_TYPES = [
  'Independent Workshop',
  'Dealership',
  'Mobile Mechanic',
  'Auto Repair Centre',
  'Fleet Workshop',
  'Specialised Auto Workshop',
]

const PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'Free State',
  'North West',
  'Northern Cape',
]

export default function MechanicSignUpStep1() {
  const router = useRouter()

  const {
    step1Data,
    updateStep1Field,
  } = useMechanicSignUp()

  const [
    businessTypeOpen,
    setBusinessTypeOpen,
  ] = useState(false)

  const [
    provinceOpen,
    setProvinceOpen,
  ] = useState(false)

  function handleContinue() {
    const requiredFields = [
      step1Data.fullName,
      step1Data.email,
      step1Data.phone,
      step1Data.idNumber,
      step1Data.businessName,
      step1Data.businessType,
      step1Data.yearsInBusiness,
      step1Data.employees,
      step1Data.address,
      step1Data.city,
      step1Data.province,
    ]

    const hasMissingFields =
      requiredFields.some(
        (value) =>
          !value.trim()
      )

    if (hasMissingFields) {
      Alert.alert(
        'Details required',
        'Please complete all personal and business details before continuing.'
      )
      return
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        step1Data.email.trim()
      )

    if (!emailIsValid) {
      Alert.alert(
        'Invalid email',
        'Please enter a valid email address before continuing.'
      )
      return
    }

    router.push(
      '/auth/mechanic-signup/step-2'
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >
        <SignUpHeader
          step={1}
          onBack={() => router.back()}
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
          value={step1Data.fullName}
          onChangeText={(value) =>
            updateStep1Field(
              'fullName',
              value
            )
          }
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
          value={step1Data.email}
          onChangeText={(value) =>
            updateStep1Field(
              'email',
              value
            )
          }
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
          value={step1Data.phone}
          onChangeText={(value) =>
            updateStep1Field(
              'phone',
              value
            )
          }
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
          value={step1Data.idNumber}
          onChangeText={(value) =>
            updateStep1Field(
              'idNumber',
              value
            )
          }
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
          value={step1Data.businessName}
          onChangeText={(value) =>
            updateStep1Field(
              'businessName',
              value
            )
          }
        />

        <View
          style={styles.fieldContainer}
        >
          <View
            style={styles.fieldLabelRow}
          >
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
            onPress={() =>
              setBusinessTypeOpen(true)
            }
            activeOpacity={0.8}
          >
            <Text
              style={
                step1Data.businessType
                  ? styles.dropdownSelectedText
                  : styles.fieldPlaceholder
              }
            >
              {step1Data.businessType ||
                'Select your business type'}
            </Text>

            <Ionicons
              name="chevron-down"
              size={20}
              color={CYAN}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={businessTypeOpen}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setBusinessTypeOpen(false)
          }
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() =>
              setBusinessTypeOpen(false)
            }
          >
            <Pressable
              style={styles.dropdownModal}
              onPress={() => {}}
            >
              <Text
                style={styles.modalTitle}
              >
                Select Business Type
              </Text>

              {BUSINESS_TYPES.map(
                (businessType) => (
                  <TouchableOpacity
                    key={businessType}
                    style={
                      styles.dropdownOption
                    }
                    onPress={() => {
                      updateStep1Field(
                        'businessType',
                        businessType
                      )

                      setBusinessTypeOpen(
                        false
                      )
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={
                        styles.dropdownOptionText
                      }
                    >
                      {businessType}
                    </Text>

                    {step1Data.businessType ===
                      businessType && (
                      <Ionicons
                        name="checkmark-circle"
                        size={21}
                        color={CYAN}
                      />
                    )}
                  </TouchableOpacity>
                )
              )}
            </Pressable>
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
            value={
              step1Data.yearsInBusiness
            }
            onChangeText={(value) =>
              updateStep1Field(
                'yearsInBusiness',
                value
              )
            }
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
            value={step1Data.employees}
            onChangeText={(value) =>
              updateStep1Field(
                'employees',
                value
              )
            }
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
          value={step1Data.address}
          onChangeText={(value) =>
            updateStep1Field(
              'address',
              value
            )
          }
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
            value={step1Data.city}
            onChangeText={(value) =>
              updateStep1Field(
                'city',
                value
              )
            }
            style={styles.halfField}
          />

          <View
            style={[
              styles.fieldContainer,
              styles.halfField,
            ]}
          >
            <View
              style={
                styles.fieldLabelRow
              }
            >
              <Ionicons
                name="map-outline"
                size={20}
                color={CYAN}
              />

              <Text
                style={styles.fieldLabel}
              >
                Province
              </Text>
            </View>

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setProvinceOpen(true)
              }
              activeOpacity={0.8}
            >
              <Text
                style={
                  step1Data.province
                    ? styles.dropdownSelectedText
                    : styles.fieldPlaceholder
                }
                numberOfLines={1}
              >
                {step1Data.province ||
                  'Select your province'}
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color={CYAN}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={provinceOpen}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setProvinceOpen(false)
          }
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() =>
              setProvinceOpen(false)
            }
          >
            <Pressable
              style={styles.dropdownModal}
              onPress={() => {}}
            >
              <Text
                style={styles.modalTitle}
              >
                Select Province
              </Text>

              {PROVINCES.map(
                (province) => (
                  <TouchableOpacity
                    key={province}
                    style={
                      styles.dropdownOption
                    }
                    onPress={() => {
                      updateStep1Field(
                        'province',
                        province
                      )

                      setProvinceOpen(
                        false
                      )
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={
                        styles.dropdownOptionText
                      }
                    >
                      {province}
                    </Text>

                    {step1Data.province ===
                      province && (
                      <Ionicons
                        name="checkmark-circle"
                        size={21}
                        color={CYAN}
                      />
                    )}
                  </TouchableOpacity>
                )
              )}
            </Pressable>
          </Pressable>
        </Modal>

        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={handleContinue}
        >
          <Text
            style={styles.continueText}
          >
            Continue
          </Text>
        </TouchableOpacity>

        <SignUpFooter
          onSignIn={() => {
            router.replace({
              pathname: '/auth/login',
              params: {
                role: 'mechanic',
              },
            })
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}