import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useFuelDeliveryRequest } from '../src/customer/useFuelDeliveryRequest'
import type {
  FuelRequestType,
} from '../src/customer/fuelTypes'
import { useForegroundLocation } from '../src/location/useForegroundLocation'
import { useTheme } from '../src/theme/ThemeContext'
import { useVehicle } from '../src/vehicles/VehicleContext'

export default function FuelDeliveryRequestScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const params = useLocalSearchParams<{
    fuelType?: string | string[]
    compatibleFuelTypes?:
      | string
      | string[]
    requestType?: string | string[]
  }>()

  const routeFuelType = Array.isArray(
    params.fuelType
  )
    ? params.fuelType[0]
    : params.fuelType

  const compatibleFuelTypesParam =
    Array.isArray(
      params.compatibleFuelTypes
    )
      ? params.compatibleFuelTypes[0]
      : params.compatibleFuelTypes

  const requestTypeParam =
    Array.isArray(params.requestType)
      ? params.requestType[0]
      : params.requestType

  const requestType: FuelRequestType =
    requestTypeParam === 'emergency'
      ? 'emergency'
      : 'standard'

  const isEmergency =
    requestType === 'emergency'

  const compatibleFuelTypes =
    useMemo(() => {
      if (
        !compatibleFuelTypesParam
      ) {
        return routeFuelType
          ? [routeFuelType]
          : []
      }

      try {
        const parsed = JSON.parse(
          compatibleFuelTypesParam
        )

        if (!Array.isArray(parsed)) {
          return routeFuelType
            ? [routeFuelType]
            : []
        }

        const validFuelTypes =
          parsed.filter(
            (
              item
            ): item is string =>
              typeof item ===
                'string' &&
              item.trim().length > 0
          )

        return Array.from(
          new Set(validFuelTypes)
        )
      } catch {
        return routeFuelType
          ? [routeFuelType]
          : []
      }
    }, [
      compatibleFuelTypesParam,
      routeFuelType,
    ])

  const [
    selectedFuelType,
    setSelectedFuelType,
  ] = useState<string | null>(
    routeFuelType ?? null
  )

  useEffect(() => {
    if (
      selectedFuelType &&
      compatibleFuelTypes.includes(
        selectedFuelType
      )
    ) {
      return
    }

    if (
      routeFuelType &&
      compatibleFuelTypes.includes(
        routeFuelType
      )
    ) {
      setSelectedFuelType(
        routeFuelType
      )
      return
    }

    setSelectedFuelType(
      compatibleFuelTypes[0] ??
        null
    )
  }, [
    compatibleFuelTypes,
    routeFuelType,
    selectedFuelType,
  ])

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    location,
    isLoadingLocation,
    locationError,
    refreshLocation,
  } = useForegroundLocation()

  const {
    isSubmittingRequest,
    requestError,
    submitFuelRequest,
    clearRequestError,
  } = useFuelDeliveryRequest()

  const [
    quantityText,
    setQuantityText,
  ] = useState('')

  const quantityLitres =
    Number(quantityText)

  const hasValidQuantity =
    Number.isFinite(
      quantityLitres
    ) && quantityLitres > 0

  const canSubmit =
    !isLoadingVehicles &&
    !isLoadingLocation &&
    !isSubmittingRequest &&
    selectedVehicle !== null &&
    selectedFuelType !== null &&
    location !== null &&
    hasValidQuantity

  async function handleSubmit() {
    if (
      !selectedVehicle ||
      !selectedFuelType ||
      !location ||
      !hasValidQuantity
    ) {
      return
    }

    const result =
      await submitFuelRequest({
        vehicleId:
          selectedVehicle.id,

        requestType,

        fuelType:
          selectedFuelType,

        quantityLitres,

        deliveryLocation: {
          label:
            'Current location',

          address: null,

          coordinate: location,
        },

        scheduledFor: null,
      })

    if (!result) {
      return
    }

    router.replace({
      pathname:
        '/fuel-delivery-tracking',
      params: {
        deliveryId:
          result.deliveryId,
      },
    })
  }

  function handleFuelTypeSelect(
    fuelType: string
  ) {
    clearRequestError()
    setSelectedFuelType(fuelType)
  }

  function handleQuantityChange(
    value: string
  ) {
    clearRequestError()

    const sanitizedValue =
      value.replace(
        /[^0-9.]/g,
        ''
      )

    const decimalParts =
      sanitizedValue.split('.')

    if (
      decimalParts.length > 2
    ) {
      return
    }

    setQuantityText(
      sanitizedValue
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            colors.background,
        },
      ]}
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
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.content
          }
        >
          <View
            style={styles.header}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                router.back()
              }
              style={[
                styles.headerButton,
                {
                  borderColor:
                    colors.border,
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
                  color:
                    colors.text,
                },
              ]}
            >
              {isEmergency
                ? 'Emergency Fuel'
                : 'Request Fuel'}
            </Text>

            <View
              style={
                styles.headerPlaceholder
              }
            />
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            {isEmergency
              ? 'Emergency Fuel Assistance'
              : 'Fuel Delivery'}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {isEmergency
              ? 'Request urgent fuel assistance for your selected vehicle at your current location.'
              : 'Request fuel for your selected vehicle at your current location.'}
          </Text>

          {isEmergency ? (
            <View
              style={[
                styles.emergencyNotice,
                {
                  borderColor:
                    colors.danger,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={22}
                color={colors.danger}
              />

              <Text
                style={[
                  styles.emergencyNoticeText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Emergency fuel is for
                urgent fuel assistance.
                Service coverage and
                driver availability must
                still be confirmed by
                the backend.
              </Text>
            </View>
          ) : null}

          <View
            style={[
              styles.vehicleCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={
                styles.sectionHeader
              }
            >
              <MaterialCommunityIcons
                name="car-outline"
                size={22}
                color={colors.accent}
              />

              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Selected Vehicle
              </Text>
            </View>

            {isLoadingVehicles ? (
              <Text
                style={[
                  styles.secondaryText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Loading vehicle...
              </Text>
            ) : selectedVehicle ? (
              <>
                <Text
                  style={[
                    styles.vehicleName,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {
                    selectedVehicle.make
                  }{' '}
                  {
                    selectedVehicle.model
                  }
                </Text>

                <Text
                  style={[
                    styles.secondaryText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  {
                    selectedVehicle.registration
                  }
                </Text>
              </>
            ) : (
              <Text
                style={[
                  styles.secondaryText,
                  {
                    color:
                      colors.danger,
                  },
                ]}
              >
                No vehicle selected.
              </Text>
            )}
          </View>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.fieldLabel,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Fuel Type
            </Text>

            {compatibleFuelTypes.length >
            0 ? (
              <View
                style={
                  styles.fuelOptions
                }
              >
                {compatibleFuelTypes.map(
                  (fuelType) => {
                    const isSelected =
                      selectedFuelType ===
                      fuelType

                    return (
                      <TouchableOpacity
                        key={
                          fuelType
                        }
                        activeOpacity={
                          0.75
                        }
                        onPress={() =>
                          handleFuelTypeSelect(
                            fuelType
                          )
                        }
                        style={[
                          styles.fuelOption,
                          {
                            borderColor:
                              isSelected
                                ? colors.accent
                                : colors.border,
                            backgroundColor:
                              isSelected
                                ? colors.accent
                                : colors.background,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="gas-station-outline"
                          size={19}
                          color={
                            isSelected
                              ? '#000000'
                              : colors.accent
                          }
                        />

                        <Text
                          style={[
                            styles.fuelOptionText,
                            {
                              color:
                                isSelected
                                  ? '#000000'
                                  : colors.text,
                            },
                          ]}
                        >
                          {fuelType}
                        </Text>

                        {isSelected ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#000000"
                          />
                        ) : null}
                      </TouchableOpacity>
                    )
                  }
                )}
              </View>
            ) : (
              <View
                style={[
                  styles.unavailableField,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={19}
                  color={colors.danger}
                />

                <Text
                  style={[
                    styles.unavailableText,
                    {
                      color:
                        colors.danger,
                    },
                  ]}
                >
                  Compatible fuel
                  information is
                  unavailable.
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.compatibilityNote,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Only compatible fuel
              options for the selected
              vehicle should be offered.
              The backend will validate
              compatibility again before
              creating the delivery.
            </Text>

            <Text
              style={[
                styles.fieldLabel,
                styles.quantityLabel,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Quantity
            </Text>

            <View
              style={[
                styles.quantityField,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <TextInput
                value={quantityText}
                onChangeText={
                  handleQuantityChange
                }
                placeholder="Enter amount"
                placeholderTextColor={
                  colors.secondaryText
                }
                keyboardType="decimal-pad"
                style={[
                  styles.quantityInput,
                  {
                    color:
                      colors.text,
                  },
                ]}
              />

              <Text
                style={[
                  styles.quantityUnit,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                litres
              </Text>
            </View>

            {quantityText.length >
              0 &&
            !hasValidQuantity ? (
              <Text
                style={[
                  styles.validationText,
                  {
                    color:
                      colors.danger,
                  },
                ]}
              >
                Enter a quantity
                greater than 0 litres.
              </Text>
            ) : null}
          </View>

          <View
            style={[
              styles.locationCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={
                styles.sectionHeader
              }
            >
              <Ionicons
                name="location-outline"
                size={22}
                color={colors.accent}
              />

              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Delivery Location
              </Text>
            </View>

            {isLoadingLocation ? (
              <Text
                style={[
                  styles.secondaryText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Getting your current
                location...
              </Text>
            ) : locationError ? (
              <>
                <Text
                  style={[
                    styles.secondaryText,
                    {
                      color:
                        colors.danger,
                    },
                  ]}
                >
                  {locationError}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={
                    refreshLocation
                  }
                  style={[
                    styles.retryButton,
                    {
                      borderColor:
                        colors.accent,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={17}
                    color={
                      colors.accent
                    }
                  />

                  <Text
                    style={[
                      styles.retryText,
                      {
                        color:
                          colors.accent,
                      },
                    ]}
                  >
                    Try Location Again
                  </Text>
                </TouchableOpacity>
              </>
            ) : location ? (
              <>
                <Text
                  style={[
                    styles.locationTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  Current Location
                </Text>

                <Text
                  style={[
                    styles.secondaryText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Your device location
                  will be sent securely
                  with the delivery
                  request.
                </Text>
              </>
            ) : (
              <Text
                style={[
                  styles.secondaryText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Location unavailable.
              </Text>
            )}
          </View>

          <View
            style={[
              styles.infoCard,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={19}
              color={colors.accent}
            />

            <Text
              style={[
                styles.infoText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Final pricing, service
              coverage, fuel
              compatibility, and driver
              availability will be
              confirmed by the MechanIQ
              delivery backend before a
              request is created.
            </Text>
          </View>

          {requestError ? (
            <View
              style={[
                styles.errorCard,
                {
                  borderColor:
                    colors.danger,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={20}
                color={colors.danger}
              />

              <Text
                style={[
                  styles.errorText,
                  {
                    color:
                      colors.danger,
                  },
                ]}
              >
                {requestError}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            activeOpacity={
              canSubmit
                ? 0.75
                : 1
            }
            disabled={!canSubmit}
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  canSubmit
                    ? isEmergency
                      ? colors.danger
                      : colors.accent
                    : colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={
                isEmergency
                  ? 'alert-circle-outline'
                  : 'truck-delivery-outline'
              }
              size={20}
              color={
                canSubmit
                  ? '#000000'
                  : colors.secondaryText
              }
            />

            <Text
              style={[
                styles.submitButtonText,
                {
                  color:
                    canSubmit
                      ? '#000000'
                      : colors.secondaryText,
                },
              ]}
            >
              {isSubmittingRequest
                ? 'Submitting...'
                : isEmergency
                  ? 'Request Emergency Fuel'
                  : 'Request Fuel'}
            </Text>
          </TouchableOpacity>
        </StableScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  headerButton: {
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
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },

  emergencyNotice: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  emergencyNoticeText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },

  vehicleCard: {
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  formCard: {
    marginTop: 14,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  locationCard: {
    marginTop: 14,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },

  vehicleName: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
  },

  secondaryText: {
    marginTop: 5,
    fontSize: 10,
    lineHeight: 15,
  },

  fieldLabel: {
    fontSize: 9,
    fontWeight: '600',
  },

  fuelOptions: {
    marginTop: 8,
    gap: 8,
  },

  fuelOption: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  fuelOptionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },

  unavailableField: {
    minHeight: 48,
    marginTop: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  unavailableText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },

  compatibilityNote: {
    marginTop: 8,
    fontSize: 9,
    lineHeight: 14,
  },

  quantityLabel: {
    marginTop: 16,
  },

  quantityField: {
    minHeight: 48,
    marginTop: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityInput: {
    flex: 1,
    minHeight: 46,
    fontSize: 13,
  },

  quantityUnit: {
    marginLeft: 8,
    fontSize: 11,
  },

  validationText: {
    marginTop: 6,
    fontSize: 9,
  },

  locationTitle: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
  },

  retryButton: {
    alignSelf: 'flex-start',
    minHeight: 36,
    marginTop: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  retryText: {
    fontSize: 10,
    fontWeight: '700',
  },

  infoCard: {
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  infoText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },

  errorCard: {
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },

  submitButton: {
    minHeight: 48,
    marginTop: 18,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  submitButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
})