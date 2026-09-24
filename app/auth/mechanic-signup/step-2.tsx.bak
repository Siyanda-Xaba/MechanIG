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
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useMechanicSignUp } from '../../../src/auth/mechanic/MechanicSignUpContext'
import StableScrollView from '../../../src/components/StableScrollView'
import {
  CYAN,
  DropdownRow,
  FieldRow,
  MUTED,
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
    <SafeAreaView
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <StableScrollView
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

          <View style={styles.section}>
            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="construct-outline"
                size={18}
                color={CYAN}
              />

              <Text
                style={styles.sectionTitle}
              >
                PROFESSIONAL DETAILS
              </Text>
            </View>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Tell us about your workshop,
              experience and services.
            </Text>

            <FieldRow
              icon={
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={MUTED}
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

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <FieldRow
                  icon={
                    <Ionicons
                      name="locate-outline"
                      size={18}
                      color={MUTED}
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
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <FieldRow
                  icon={
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={MUTED}
                    />
                  }
                  label="Years of Experience"
                  placeholder="Enter years"
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
                />
              </View>
            </View>

            <FieldRow
              icon={
                <Ionicons
                  name="school-outline"
                  size={18}
                  color={MUTED}
                />
              }
              label="Qualifications / Certifications"
              placeholder="Enter your qualifications and certifications"
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

            <DropdownRow
              icon={
                <Ionicons
                  name="construct-outline"
                  size={18}
                  color={MUTED}
                />
              }
              label="Specialisation"
              placeholder="Select your specialisation"
              value={
                step2Data.specialisation
              }
              onPress={() =>
                setSpecialisationOpen(true)
              }
            />

            <Modal
              visible={specialisationOpen}
              transparent
              animationType="fade"
              onRequestClose={() =>
                setSpecialisationOpen(false)
              }
            >
              <Pressable
                style={
                  styles.modalOverlay
                }
                onPress={() =>
                  setSpecialisationOpen(
                    false
                  )
                }
              >
                <Pressable
                  style={
                    styles.dropdownModal
                  }
                  onPress={() => {}}
                >
                  <Text
                    style={
                      styles.modalTitle
                    }
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

            <DropdownRow
              icon={
                <Ionicons
                  name="car-outline"
                  size={18}
                  color={MUTED}
                />
              }
              label="Vehicle Brands Supported"
              placeholder="Select vehicle brands"
              value={
                step2Data.vehicleBrands
                  .length > 0
                  ? step2Data.vehicleBrands.join(
                      ', '
                    )
                  : ''
              }
              onPress={() =>
                setVehicleBrandsOpen(true)
              }
            />

            <Modal
              visible={vehicleBrandsOpen}
              transparent
              animationType="fade"
              onRequestClose={() =>
                setVehicleBrandsOpen(false)
              }
            >
              <Pressable
                style={
                  styles.modalOverlay
                }
                onPress={() =>
                  setVehicleBrandsOpen(
                    false
                  )
                }
              >
                <Pressable
                  style={
                    styles.dropdownModal
                  }
                  onPress={() => {}}
                >
                  <Text
                    style={
                      styles.modalTitle
                    }
                  >
                    Select Vehicle Brands
                  </Text>

                  <Text
                    style={
                      styles.modalSubtext
                    }
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

            <View style={styles.row}>
              <View
                style={styles.halfWidth}
              >
                <FieldRow
                  icon={
                    <MaterialCommunityIcons
                      name="card-account-details-outline"
                      size={18}
                      color={MUTED}
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
                />
              </View>

              <View
                style={styles.halfWidth}
              >
                <FieldRow
                  icon={
                    <MaterialCommunityIcons
                      name="card-account-details-outline"
                      size={18}
                      color={MUTED}
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
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View
              style={styles.sectionHeader}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={CYAN}
              />

              <Text
                style={styles.sectionTitle}
              >
                VERIFICATION DOCUMENTS
              </Text>
            </View>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Upload verification
              documents for your mechanic
              profile.
            </Text>

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
          </View>

          <View style={styles.row}>
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

            <View style={{ width: 10 }} />

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
          </View>

          <SignUpFooter
            onSignIn={() => {
              router.replace(
                '/auth/login'
              )
            }}
          />
        </StableScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}