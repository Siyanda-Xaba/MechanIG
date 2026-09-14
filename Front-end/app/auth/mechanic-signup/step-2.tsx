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
  UploadRow,
} from '../../../src/auth/mechanic/MechanicSignUpShared'

const SPECIALISATIONS = [
  'General Mechanic',
  'Auto Electrical',
  'Engine Repair',
  'Brakes & Suspension',
  'Vehicle Diagnostics',
  'Transmission Repair',
  'Air Conditioning',
]

const VEHICLE_BRANDS = [
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
]

export default function MechanicSignUpStep2() {
  const router = useRouter()

  const {
    step2Data,
    updateStep2Field,
  } = useMechanicSignUp()

  const [
    specialisationOpen,
    setSpecialisationOpen,
  ] = useState(false)

  const [
    vehicleBrandsOpen,
    setVehicleBrandsOpen,
  ] = useState(false)

  function toggleVehicleBrand(
    brand: string
  ) {
    const currentBrands =
      step2Data.vehicleBrands

    if (currentBrands.includes(brand)) {
      updateStep2Field(
        'vehicleBrands',
        currentBrands.filter(
          (item) => item !== brand
        )
      )

      return
    }

    updateStep2Field(
      'vehicleBrands',
      [...currentBrands, brand]
    )
  }

  function handleDocumentUpload(
    documentName: string
  ) {
    Alert.alert(
      'Document upload unavailable',
      `${documentName} upload will be connected to the mechanic verification backend later.`
    )
  }

  function handleContinue() {
    const requiredFields = [
      step2Data.workshopLocation,
      step2Data.serviceRadius,
      step2Data.yearsExperience,
      step2Data.qualifications,
      step2Data.specialisation,
      step2Data.licenseNumber,
      step2Data.registrationNumber,
    ]

    const hasMissingFields =
      requiredFields.some(
        (value) => !value.trim()
      )

    if (hasMissingFields) {
      Alert.alert(
        'Professional details required',
        'Please complete all professional and workshop details before continuing.'
      )
      return
    }

    if (
      step2Data.vehicleBrands.length ===
      0
    ) {
      Alert.alert(
        'Vehicle brands required',
        'Please select at least one vehicle brand that you support.'
      )
      return
    }

    router.push(
      '/auth/mechanic-signup/step-3'
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
          step={2}
          onBack={() => router.back()}
        />

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
          value={
            step2Data.workshopLocation
          }
          onChangeText={(value) =>
            updateStep2Field(
              'workshopLocation',
              value
            )
          }
        />

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
            placeholder="e.g. 25 km"
            value={
              step2Data.serviceRadius
            }
            onChangeText={(value) =>
              updateStep2Field(
                'serviceRadius',
                value
              )
            }
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
            value={
              step2Data.yearsExperience
            }
            onChangeText={(value) =>
              updateStep2Field(
                'yearsExperience',
                value
              )
            }
            style={styles.halfField}
          />
        </View>

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
          value={
            step2Data.qualifications
          }
          onChangeText={(value) =>
            updateStep2Field(
              'qualifications',
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
            onPress={() =>
              setSpecialisationOpen(true)
            }
            activeOpacity={0.8}
          >
            <Text
              style={
                step2Data.specialisation
                  ? styles.dropdownSelectedText
                  : styles.fieldPlaceholder
              }
            >
              {step2Data.specialisation ||
                'Select your specialisation'}
            </Text>

            <Ionicons
              name="chevron-down"
              size={20}
              color={CYAN}
            />
          </TouchableOpacity>
        </View>

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
            <Pressable
              style={styles.dropdownModal}
              onPress={() => {}}
            >
              <Text
                style={styles.modalTitle}
              >
                Select Specialisation
              </Text>

              {SPECIALISATIONS.map(
                (specialisation) => (
                  <TouchableOpacity
                    key={specialisation}
                    style={
                      styles.dropdownOption
                    }
                    activeOpacity={0.8}
                    onPress={() => {
                      updateStep2Field(
                        'specialisation',
                        specialisation
                      )

                      setSpecialisationOpen(
                        false
                      )
                    }}
                  >
                    <Text
                      style={
                        styles.dropdownOptionText
                      }
                    >
                      {specialisation}
                    </Text>

                    {step2Data.specialisation ===
                      specialisation && (
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

        <View
          style={styles.fieldContainer}
        >
          <View
            style={styles.fieldLabelRow}
          >
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
            onPress={() =>
              setVehicleBrandsOpen(true)
            }
            activeOpacity={0.8}
          >
            <Text
              style={
                step2Data.vehicleBrands
                  .length > 0
                  ? styles.dropdownSelectedText
                  : styles.fieldPlaceholder
              }
              numberOfLines={2}
            >
              {step2Data.vehicleBrands
                .length > 0
                ? step2Data.vehicleBrands.join(
                    ', '
                  )
                : 'Select vehicle brands'}
            </Text>

            <Ionicons
              name="chevron-down"
              size={20}
              color={CYAN}
            />
          </TouchableOpacity>
        </View>

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
            <Pressable
              style={styles.dropdownModal}
              onPress={() => {}}
            >
              <Text
                style={styles.modalTitle}
              >
                Select Vehicle Brands
              </Text>

              <Text
                style={styles.modalSubtext}
              >
                Select all brands your
                workshop supports
              </Text>

              {VEHICLE_BRANDS.map(
                (brand) => {
                  const selected =
                    step2Data.vehicleBrands.includes(
                      brand
                    )

                  return (
                    <TouchableOpacity
                      key={brand}
                      style={
                        styles.dropdownOption
                      }
                      onPress={() =>
                        toggleVehicleBrand(
                          brand
                        )
                      }
                      activeOpacity={0.8}
                    >
                      <Text
                        style={
                          styles.dropdownOptionText
                        }
                      >
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
                  )
                }
              )}

              <TouchableOpacity
                style={
                  styles.modalDoneButton
                }
                onPress={() =>
                  setVehicleBrandsOpen(
                    false
                  )
                }
                activeOpacity={0.85}
              >
                <Text
                  style={
                    styles.modalDoneText
                  }
                >
                  Done
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

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
            value={
              step2Data.licenseNumber
            }
            onChangeText={(value) =>
              updateStep2Field(
                'licenseNumber',
                value
              )
            }
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
            value={
              step2Data.registrationNumber
            }
            onChangeText={(value) =>
              updateStep2Field(
                'registrationNumber',
                value
              )
            }
            style={styles.halfField}
          />
        </View>

        <UploadRow
          label="Upload ID Document"
          onPress={() =>
            handleDocumentUpload(
              'ID document'
            )
          }
        />

        <UploadRow
          label="Upload Trade Certificate"
          onPress={() =>
            handleDocumentUpload(
              'Trade certificate'
            )
          }
        />

        <UploadRow
          label="Upload Workshop Registration / Proof of Business"
          onPress={() =>
            handleDocumentUpload(
              'Workshop registration / proof of business'
            )
          }
        />

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

        <TouchableOpacity
          style={
            styles.backOutlineButton
          }
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Text
            style={
              styles.backOutlineText
            }
          >
            Back
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