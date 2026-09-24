import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'

import { useTheme } from '../src/theme/ThemeContext'
import type { CreateVehicleInput } from '../src/vehicles/types'
import { useCreateVehicle } from '../src/vehicles/useCreateVehicle'

type VehicleFormState = {
  make: string
  model: string
  year: string
  color: string
  fuelType: string
  registration: string
  isPrimary: boolean
}

type VehicleFormErrors = Partial<
  Record<
    Exclude<keyof VehicleFormState, 'isPrimary'>,
    string
  >
>

const initialForm: VehicleFormState = {
  make: '',
  model: '',
  year: '',
  color: '',
  fuelType: '',
  registration: '',
  isPrimary: false,
}

export default function AddVehicleScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    isCreatingVehicle,
    createVehicleError,
    createVehicle,
    clearCreateVehicleError,
  } = useCreateVehicle()

  const [form, setForm] =
    useState<VehicleFormState>(initialForm)

  const [formErrors, setFormErrors] =
    useState<VehicleFormErrors>({})

  function updateField(
    field: keyof VehicleFormState,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    if (field !== 'isPrimary') {
      setFormErrors((current) => ({
        ...current,
        [field]: undefined,
      }))
    }

    clearCreateVehicleError()
  }

  function validateForm():
    | CreateVehicleInput
    | null {
    const errors: VehicleFormErrors = {}

    const make = form.make.trim()
    const model = form.model.trim()
    const color = form.color.trim()
    const fuelType = form.fuelType.trim()
    const registration =
      form.registration.trim().toUpperCase()

    const year = Number(form.year.trim())
    const currentYear =
      new Date().getFullYear() + 1

    if (!make) {
      errors.make = 'Vehicle make is required.'
    }

    if (!model) {
      errors.model = 'Vehicle model is required.'
    }

    if (!form.year.trim()) {
      errors.year = 'Vehicle year is required.'
    } else if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > currentYear
    ) {
      errors.year =
        'Enter a valid vehicle year.'
    }

    if (!color) {
      errors.color = 'Vehicle colour is required.'
    }

    if (!fuelType) {
      errors.fuelType =
        'Fuel type is required.'
    }

    if (!registration) {
      errors.registration =
        'Registration is required.'
    }

    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return null
    }

    return {
      make,
      model,
      year,
      color,
      fuelType,
      registration,
      isPrimary: form.isPrimary,
    }
  }

  async function handleSubmit() {
    const input = validateForm()

    if (!input) {
      return
    }

    const savedVehicle =
      await createVehicle(input)

    if (savedVehicle) {
      router.back()
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <StableScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isCreatingVehicle}
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Add Vehicle
            </Text>

            <View style={styles.headerPlaceholder} />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Vehicle Information
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Add another vehicle to your MechanIQ
            account.
          </Text>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <VehicleField
              label="Make"
              placeholder="e.g. BMW"
              value={form.make}
              error={formErrors.make}
              onChangeText={(value) =>
                updateField('make', value)
              }
              textColor={colors.text}
              secondaryTextColor={
                colors.secondaryText
              }
              borderColor={colors.border}
              dangerColor={colors.danger}
            />

            <VehicleField
              label="Model"
              placeholder="e.g. 320i"
              value={form.model}
              error={formErrors.model}
              onChangeText={(value) =>
                updateField('model', value)
              }
              textColor={colors.text}
              secondaryTextColor={
                colors.secondaryText
              }
              borderColor={colors.border}
              dangerColor={colors.danger}
            />

            <VehicleField
              label="Year"
              placeholder="e.g. 2019"
              value={form.year}
              error={formErrors.year}
              keyboardType="number-pad"
              maxLength={4}
              onChangeText={(value) =>
                updateField('year', value)
              }
              textColor={colors.text}
              secondaryTextColor={
                colors.secondaryText
              }
              borderColor={colors.border}
              dangerColor={colors.danger}
            />

            <VehicleField
              label="Colour"
              placeholder="e.g. Black"
              value={form.color}
              error={formErrors.color}
              onChangeText={(value) =>
                updateField('color', value)
              }
              textColor={colors.text}
              secondaryTextColor={
                colors.secondaryText
              }
              borderColor={colors.border}
              dangerColor={colors.danger}
            />

            <VehicleField
              label="Fuel Type"
              placeholder="e.g. Petrol 95"
              value={form.fuelType}
              error={formErrors.fuelType}
              onChangeText={(value) =>
                updateField('fuelType', value)
              }
              textColor={colors.text}
              secondaryTextColor={
                colors.secondaryText
              }
              borderColor={colors.border}
              dangerColor={colors.danger}
            />

            <VehicleField
              label="Registration"
              placeholder="e.g. CAA 123 456"
              value={form.registration}
              error={formErrors.registration}
              autoCapitalize="characters"
              onChangeText={(value) =>
                updateField(
                  'registration',
                  value
                )
              }
              textColor={colors.text}
              secondaryTextColor={
                colors.secondaryText
              }
              borderColor={colors.border}
              dangerColor={colors.danger}
            />

            <View
              style={[
                styles.primaryRow,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.primaryIcon,
                  {
                    borderColor: colors.accent,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="car-outline"
                  size={21}
                  color={colors.accent}
                />
              </View>

              <View style={styles.primaryContent}>
                <Text
                  style={[
                    styles.primaryTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Set as Primary Vehicle
                </Text>

                <Text
                  style={[
                    styles.primaryDescription,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Use this vehicle as the default
                  vehicle across MechanIQ.
                </Text>
              </View>

              <Switch
                value={form.isPrimary}
                disabled={isCreatingVehicle}
                onValueChange={(value) =>
                  updateField(
                    'isPrimary',
                    value
                  )
                }
                trackColor={{
                  false: colors.border,
                  true: colors.accent,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {createVehicleError ? (
            <View
              style={[
                styles.errorCard,
                {
                  borderColor: colors.danger,
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={19}
                color={colors.danger}
              />

              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.danger,
                  },
                ]}
              >
                {createVehicleError}
              </Text>
            </View>
          ) : null}

          <View
            style={[
              styles.noticeCard,
              {
                borderColor: colors.warning,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={colors.warning}
            />

            <Text
              style={[
                styles.noticeText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Your vehicle will only be added after
              the MechanIQ backend confirms the saved
              vehicle record. Internal vehicle model
              mapping is handled by the backend.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            disabled={isCreatingVehicle}
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              {
                backgroundColor: colors.accent,
                opacity:
                  isCreatingVehicle
                    ? 0.6
                    : 1,
              },
            ]}
          >
            {isCreatingVehicle ? (
              <ActivityIndicator
                size="small"
                color="#000000"
              />
            ) : (
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={21}
                color="#000000"
              />
            )}

            <Text style={styles.submitButtonText}>
              {isCreatingVehicle
                ? 'Adding Vehicle...'
                : 'Add Vehicle'}
            </Text>
          </TouchableOpacity>
        </StableScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

type VehicleFieldProps = {
  label: string
  placeholder: string
  value: string
  error?: string
  keyboardType?: 'default' | 'number-pad'
  maxLength?: number
  autoCapitalize?:
    | 'none'
    | 'sentences'
    | 'words'
    | 'characters'
  onChangeText: (value: string) => void
  textColor: string
  secondaryTextColor: string
  borderColor: string
  dangerColor: string
}

function VehicleField({
  label,
  placeholder,
  value,
  error,
  keyboardType = 'default',
  maxLength,
  autoCapitalize = 'words',
  onChangeText,
  textColor,
  secondaryTextColor,
  borderColor,
  dangerColor,
}: VehicleFieldProps) {
  return (
    <View style={styles.field}>
      <Text
        style={[
          styles.fieldLabel,
          {
            color: textColor,
          },
        ]}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={
          secondaryTextColor
        }
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: error
              ? dangerColor
              : borderColor,
          },
        ]}
      />

      {error ? (
        <Text
          style={[
            styles.fieldError,
            {
              color: dangerColor,
            },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  headerPlaceholder: {
    width: 38,
  },

  title: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
  },

  formCard: {
    marginTop: 18,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    gap: 14,
  },

  field: {
    gap: 6,
  },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 12,
  },

  fieldError: {
    fontSize: 9,
    lineHeight: 13,
  },

  primaryRow: {
    minHeight: 76,
    paddingTop: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  primaryIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryContent: {
    flex: 1,
  },

  primaryTitle: {
    fontSize: 11,
    fontWeight: '700',
  },

  primaryDescription: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 14,
  },

  errorCard: {
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },

  noticeCard: {
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  noticeText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 15,
  },

  submitButton: {
    minHeight: 50,
    marginTop: 18,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  submitButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
})