import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
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
import { useForegroundLocation } from '../src/location/useForegroundLocation'
import { useTheme } from '../src/theme/ThemeContext'
import { useVehicle } from '../src/vehicles/VehicleContext'

type PickerMode =
  | 'date'
  | 'time'
  | null

function createInitialScheduleDate() {
  const date = new Date()

  date.setHours(
    date.getHours() + 1,
    0,
    0,
    0
  )

  return date
}

export default function FuelTopUpScheduleScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const params = useLocalSearchParams<{
    fuelType?: string | string[]
    compatibleFuelTypes?:
      | string
      | string[]
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

  const compatibleFuelTypes =
    useMemo(() => {
      if (!compatibleFuelTypesParam) {
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

  const [
    quantityText,
    setQuantityText,
  ] = useState('')

  const [
    scheduledFor,
    setScheduledFor,
  ] = useState(
    createInitialScheduleDate
  )

  const [
    pickerMode,
    setPickerMode,
  ] =
    useState<PickerMode>(null)

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

  const quantityLitres =
    Number(quantityText)

  const hasValidQuantity =
    Number.isFinite(
      quantityLitres
    ) && quantityLitres > 0

  const isFutureSchedule =
    scheduledFor.getTime() >
    Date.now()

  const canSubmit =
    !isLoadingVehicles &&
    !isLoadingLocation &&
    !isSubmittingRequest &&
    selectedVehicle !== null &&
    selectedFuelType !== null &&
    location !== null &&
    hasValidQuantity &&
    isFutureSchedule

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

  function handlePickerChange(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {
    if (
      Platform.OS === 'android'
    ) {
      setPickerMode(null)
    }

    if (
      event.type === 'dismissed' ||
      !selectedDate
    ) {
      return
    }

    setScheduledFor(
      (current) => {
        const updated =
          new Date(current)

        if (
          pickerMode === 'date'
        ) {
          updated.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          )
        }

        if (
          pickerMode === 'time'
        ) {
          updated.setHours(
            selectedDate.getHours(),
            selectedDate.getMinutes(),
            0,
            0
          )
        }

        return updated
      }
    )

    clearRequestError()
  }

  async function handleSubmit() {
    if (
      !selectedVehicle ||
      !selectedFuelType ||
      !location ||
      !hasValidQuantity ||
      !isFutureSchedule
    ) {
      return
    }

    const result =
      await submitFuelRequest({
        vehicleId:
          selectedVehicle.id,

        requestType: 'standard',

        fuelType:
          selectedFuelType,

        quantityLitres,

        deliveryLocation: {
          label:
            'Current location',

          address: null,

          coordinate: location,
        },

        scheduledFor:
          scheduledFor.toISOString(),
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

  const formattedDate =
    scheduledFor.toLocaleDateString(
      undefined,
      {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )

  const formattedTime =
    scheduledFor.toLocaleTimeString(
      undefined,
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )

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
              Schedule Top-up
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
            Schedule Fuel
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
            Choose a future date and
            time for fuel delivery to
            your current location.
          </Text>

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
                        key={fuelType}
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
            )}

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
          </View>

          <View
            style={[
              styles.scheduleCard,
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
                name="calendar-clock-outline"
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
                Delivery Schedule
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                setPickerMode(
                  'date'
                )
              }
              style={[
                styles.scheduleField,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.accent}
              />

              <View
                style={
                  styles.scheduleFieldText
                }
              >
                <Text
                  style={[
                    styles.scheduleLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Date
                </Text>

                <Text
                  style={[
                    styles.scheduleValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {formattedDate}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={
                  colors.secondaryText
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                setPickerMode(
                  'time'
                )
              }
              style={[
                styles.scheduleField,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.accent}
              />

              <View
                style={
                  styles.scheduleFieldText
                }
              >
                <Text
                  style={[
                    styles.scheduleLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Time
                </Text>

                <Text
                  style={[
                    styles.scheduleValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {formattedTime}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={
                  colors.secondaryText
                }
              />
            </TouchableOpacity>

            {!isFutureSchedule ? (
              <Text
                style={[
                  styles.validationText,
                  {
                    color:
                      colors.danger,
                  },
                ]}
              >
                Select a future delivery
                date and time.
              </Text>
            ) : null}

            {pickerMode ? (
              <View
                style={
                  styles.pickerContainer
                }
              >
                <DateTimePicker
                  value={scheduledFor}
                  mode={pickerMode}
                  minimumDate={
                    pickerMode ===
                    'date'
                      ? new Date()
                      : undefined
                  }
                  display={
                    Platform.OS === 'ios'
                      ? 'spinner'
                      : 'default'
                  }
                  onChange={
                    handlePickerChange
                  }
                />

                {Platform.OS ===
                'ios' ? (
                  <TouchableOpacity
                    activeOpacity={
                      0.75
                    }
                    onPress={() =>
                      setPickerMode(
                        null
                      )
                    }
                    style={[
                      styles.doneButton,
                      {
                        backgroundColor:
                          colors.accent,
                      },
                    ]}
                  >
                    <Text
                      style={
                        styles.doneButtonText
                      }
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
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
                  The selected delivery
                  time and your current
                  location will be sent
                  with the scheduled
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
                    ? colors.accent
                    : colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-check-outline"
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
                ? 'Scheduling...'
                : 'Schedule Top-up'}
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

  scheduleCard: {
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

  unavailableText: {
    marginTop: 8,
    fontSize: 10,
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

  scheduleField: {
    minHeight: 56,
    marginTop: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduleFieldText: {
    flex: 1,
    marginLeft: 10,
  },

  scheduleLabel: {
    fontSize: 9,
  },

  scheduleValue: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
  },

  pickerContainer: {
    marginTop: 12,
  },

  doneButton: {
    minHeight: 38,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  doneButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },

  validationText: {
    marginTop: 8,
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