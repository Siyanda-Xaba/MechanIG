import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'

import {
  BookServiceLocationPreference,
  BookServiceMatchRequest,
} from '../../src/customer/bookServiceScheduleTypes'
import {
  CustomerServiceTypeId,
} from '../../src/customer/bookServiceTypes'
import { useServiceMechanicSearch } from '../../src/customer/useServiceMechanicSearch'
import { useTheme } from '../../src/theme/ThemeContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function BookServiceOptionsScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const params = useLocalSearchParams<{
    serviceId?: string | string[]
    preferredDate?: string | string[]
    preferredTime?: string | string[]
    locationPreference?: string | string[]
  }>()

  const serviceId = getSingleParam(
    params.serviceId
  ) as CustomerServiceTypeId | null

  const preferredDate = getSingleParam(
    params.preferredDate
  )

  const preferredTime = getSingleParam(
    params.preferredTime
  )

  const rawLocationPreference =
    getSingleParam(
      params.locationPreference
    )

  const locationPreference:
    | BookServiceLocationPreference
    | null =
    rawLocationPreference === 'workshop' ||
    rawLocationPreference === 'mobile-service'
      ? rawLocationPreference
      : null

  const request: BookServiceMatchRequest | null =
    selectedVehicle?.id &&
    serviceId &&
    preferredDate &&
    preferredTime &&
    locationPreference
      ? {
          vehicleId: selectedVehicle.id,
          serviceId,
          preferredDate,
          preferredTime,
          locationPreference,
          notes: null,
        }
      : null

  const {
    mechanicSearchResult,
    isLoadingMechanics,
    mechanicSearchError,
    refreshMechanics,
  } = useServiceMechanicSearch(request)

  const isLoading =
    isLoadingVehicles ||
    isLoadingMechanics

  const mechanics =
    mechanicSearchResult?.mechanics ?? []

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text
          style={[
            styles.loadingText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Finding suitable service options...
        </Text>
      </SafeAreaView>
    )
  }

  if (!selectedVehicle || !request) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color={colors.danger}
        />

        <Text
          style={[
            styles.stateTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Service details are incomplete
        </Text>

        <Text
          style={[
            styles.stateDescription,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Choose a service and scheduling preferences before searching for available options.
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[
            styles.secondaryButton,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              {
                color: colors.text,
              },
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (mechanicSearchError) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color={colors.danger}
        />

        <Text
          style={[
            styles.stateTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Unable to find service options
        </Text>

        <Text
          style={[
            styles.stateDescription,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {mechanicSearchError}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={refreshMechanics}
          style={[
            styles.retryButton,
            {
              backgroundColor:
                colors.accent,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={18}
            color="#000000"
          />

          <Text
            style={styles.retryButtonText}
          >
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[
            styles.secondaryButton,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              {
                color: colors.text,
              },
            ]}
          >
            Change Preferences
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
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
      <StableScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                backgroundColor:
                  colors.card,
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

          <View style={styles.headerText}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Service Options
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
              Choose a suitable mechanic or workshop for your service request.
            </Text>
          </View>
        </View>

        {/* Preference summary */}
        <View
          style={[
            styles.preferenceCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View style={styles.preferenceRow}>
            <MaterialCommunityIcons
              name="car-outline"
              size={19}
              color={colors.accent}
            />

            <View style={styles.preferenceText}>
              <Text
                style={[
                  styles.preferenceLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Vehicle
              </Text>

              <Text
                style={[
                  styles.preferenceValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {selectedVehicle.make}{' '}
                {selectedVehicle.model}
              </Text>
            </View>
          </View>

          <View style={styles.preferenceRow}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={19}
              color={colors.accent}
            />

            <View style={styles.preferenceText}>
              <Text
                style={[
                  styles.preferenceLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Preferred schedule
              </Text>

              <Text
                style={[
                  styles.preferenceValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {preferredDate} •{' '}
                {preferredTime}
              </Text>
            </View>
          </View>

          <View style={styles.preferenceRow}>
            <MaterialCommunityIcons
              name={
                locationPreference ===
                'workshop'
                  ? 'garage'
                  : 'car-wrench'
              }
              size={19}
              color={colors.accent}
            />

            <View style={styles.preferenceText}>
              <Text
                style={[
                  styles.preferenceLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Service location
              </Text>

              <Text
                style={[
                  styles.preferenceValue,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {locationPreference ===
                'workshop'
                  ? 'Workshop'
                  : 'Mobile Service'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.resultsHeader}>
          <View>
            <Text
              style={[
                styles.resultsTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Suitable Options
            </Text>

            <Text
              style={[
                styles.resultsCount,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {mechanics.length}{' '}
              {mechanics.length === 1
                ? 'option'
                : 'options'}{' '}
              found
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={refreshMechanics}
            style={[
              styles.refreshButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={20}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        {mechanics.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-remove-outline"
              size={38}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No suitable options found
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Try changing your preferred date, time, or service location.
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.back()}
              style={[
                styles.changePreferenceButton,
                {
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.changePreferenceText,
                  {
                    color:
                      colors.accent,
                  },
                ]}
              >
                Change Preferences
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.optionsList}>
            {mechanics.map((mechanic) => {
              const availabilityLabel =
                mechanic.availability ===
                'available'
                  ? 'Available'
                  : mechanic.availability ===
                      'busy'
                    ? 'Busy'
                    : 'Unavailable'

              return (
                <View
                  key={mechanic.id}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor:
                        colors.card,
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <View
                      style={[
                        styles.mechanicAvatar,
                        {
                          borderColor:
                            colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="person-outline"
                        size={26}
                        color={
                          colors.accent
                        }
                      />
                    </View>

                    <View style={styles.identity}>
                      <View
                        style={
                          styles.nameRow
                        }
                      >
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.mechanicName,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {mechanic.name}
                        </Text>

                        {mechanic.verified ? (
                          <MaterialCommunityIcons
                            name="check-decagram"
                            size={16}
                            color={
                              colors.accent
                            }
                          />
                        ) : null}
                      </View>

                      {mechanic.businessName ? (
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.businessName,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {
                            mechanic.businessName
                          }
                        </Text>
                      ) : null}

                      <View style={styles.ratingRow}>
                        {mechanic.rating !==
                        null ? (
                          <>
                            <Ionicons
                              name="star"
                              size={14}
                              color={
                                colors.accent
                              }
                            />

                            <Text
                              style={[
                                styles.rating,
                                {
                                  color:
                                    colors.text,
                                },
                              ]}
                            >
                              {
                                mechanic.rating
                              }
                            </Text>
                          </>
                        ) : null}

                        <Text
                          style={[
                            styles.reviewCount,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          (
                          {
                            mechanic.reviewCount
                          }{' '}
                          reviews)
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.availabilityBadge,
                        {
                          borderColor:
                            mechanic.availability ===
                            'available'
                              ? colors.success
                              : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.availabilityText,
                          {
                            color:
                              mechanic.availability ===
                              'available'
                                ? colors.success
                                : colors.secondaryText,
                          },
                        ]}
                      >
                        {
                          availabilityLabel
                        }
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={
                        colors.secondaryText
                      }
                    />

                    <Text
                      style={[
                        styles.locationText,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      {
                        mechanic.location
                          .address
                      }
                    </Text>
                  </View>

                  <View style={styles.capabilityRow}>
                    <MaterialCommunityIcons
                      name={
                        locationPreference ===
                        'workshop'
                          ? 'garage'
                          : 'car-wrench'
                      }
                      size={18}
                      color={colors.accent}
                    />

                    <Text
                      style={[
                        styles.capabilityText,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {locationPreference ===
                      'workshop'
                        ? 'Workshop service supported'
                        : 'Mobile service supported'}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.specialtiesLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Specialties
                  </Text>

                  <View style={styles.specialties}>
                    {mechanic.specialties.map(
                      (specialty) => (
                        <View
                          key={specialty}
                          style={[
                            styles.specialtyPill,
                            {
                              borderColor:
                                colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.specialtyText,
                              {
                                color:
                                  colors.text,
                              },
                            ]}
                          >
                            {specialty}
                          </Text>
                        </View>
                      )
                    )}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    disabled={
                      mechanic.availability ===
                      'unavailable'
                    }
                    onPress={() => {
                      if (
                        locationPreference ===
                        'mobile-service'
                      ) {
                        router.push({
                          pathname:
                            '/mechanic-request/[mechanicId]',
                          params: {
                            mechanicId:
                              mechanic.id,
                          },
                        })

                        return
                      }

                      router.push({
                        pathname:
                          '/workshop-booking/[mechanicId]',
                        params: {
                          mechanicId:
                            mechanic.id,
                        },
                      })
                    }}
                    style={[
                      styles.primaryButton,
                      {
                        backgroundColor:
                          colors.accent,
                        opacity:
                          mechanic.availability ===
                          'unavailable'
                            ? 0.45
                            : 1,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        locationPreference ===
                        'mobile-service'
                          ? 'car-wrench'
                          : 'calendar-check-outline'
                      }
                      size={19}
                      color="#000000"
                    />

                    <Text
                      style={
                        styles.primaryButtonText
                      }
                    >
                      {locationPreference ===
                      'mobile-service'
                        ? 'Request Mechanic'
                        : 'Continue to Booking'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        )}

        <Text
          style={[
            styles.backendNotice,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          These matches are frontend development data only. Final service support, pricing, capacity, travel availability and appointment confirmation must be validated by the MechanIQ backend.
        </Text>
      </StableScrollView>
    </SafeAreaView>
  )
}

function getSingleParam(
  value: string | string[] | undefined
): string | null {
  if (!value) {
    return null
  }

  return Array.isArray(value)
    ? value[0] ?? null
    : value
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  centeredPage: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 12,
    textAlign: 'center',
  },

  stateTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },

  stateDescription: {
    marginTop: 8,
    maxWidth: 310,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  retryButton: {
    minWidth: 160,
    minHeight: 44,
    marginTop: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  retryButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },

  secondaryButton: {
    minWidth: 160,
    minHeight: 44,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  header: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  backButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 16,
  },

  preferenceCard: {
    marginTop: 20,
    padding: 13,
    borderWidth: 1,
    borderRadius: 14,
    gap: 13,
  },

  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  preferenceText: {
    flex: 1,
    marginLeft: 10,
  },

  preferenceLabel: {
    fontSize: 8.5,
  },

  preferenceValue: {
    marginTop: 2,
    fontSize: 10.5,
    fontWeight: '600',
  },

  resultsHeader: {
    marginTop: 22,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resultsTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  resultsCount: {
    marginTop: 3,
    fontSize: 9.5,
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionsList: {
    gap: 12,
  },

  optionCard: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mechanicAvatar: {
    width: 52,
    height: 52,
    borderWidth: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  identity: {
    flex: 1,
    marginLeft: 11,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  mechanicName: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '700',
  },

  businessName: {
    marginTop: 2,
    fontSize: 10,
  },

  ratingRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  rating: {
    fontSize: 10,
    fontWeight: '700',
  },

  reviewCount: {
    fontSize: 9,
  },

  availabilityBadge: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 7,
  },

  availabilityText: {
    fontSize: 8,
    fontWeight: '700',
  },

  locationRow: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  locationText: {
    flex: 1,
    fontSize: 9.5,
  },

  capabilityRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  capabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },

  specialtiesLabel: {
    marginTop: 15,
    marginBottom: 7,
    fontSize: 9,
    fontWeight: '600',
  },

  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  specialtyPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
  },

  specialtyText: {
    fontSize: 9,
    fontWeight: '600',
  },

  primaryButton: {
    minHeight: 46,
    marginTop: 18,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  primaryButtonText: {
    color: '#000000',
    fontSize: 10.5,
    fontWeight: '800',
  },

  emptyCard: {
    minHeight: 190,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
  },

  emptyDescription: {
    marginTop: 6,
    maxWidth: 270,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },

  changePreferenceButton: {
    minHeight: 42,
    marginTop: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  changePreferenceText: {
    fontSize: 10,
    fontWeight: '700',
  },

  backendNotice: {
    marginTop: 18,
    paddingHorizontal: 10,
    fontSize: 8.5,
    lineHeight: 13,
    textAlign: 'center',
  },
})