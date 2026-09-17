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

import StableScrollView from '../src/components/StableScrollView'

import FuelMap from '../src/components/FuelMap'
import { useFuelDeliveryTracking } from '../src/customer/useFuelDeliveryTracking'
import type {
  FuelDeliveryStatus,
} from '../src/customer/fuelTypes'
import { useForegroundLocation } from '../src/location/useForegroundLocation'
import { useTheme } from '../src/theme/ThemeContext'

function getStatusLabel(
  status: FuelDeliveryStatus
) {
  switch (status) {
    case 'scheduled':
      return 'Scheduled'

    case 'driver-assigned':
      return 'Driver Assigned'

    case 'en-route':
      return 'En Route'

    case 'arrived':
      return 'Driver Arrived'

    case 'delivering':
      return 'Delivering Fuel'

    case 'completed':
      return 'Completed'

    case 'cancelled':
      return 'Cancelled'
  }
}

export default function FuelDeliveryTrackingScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const params = useLocalSearchParams<{
    deliveryId?: string | string[]
  }>()

  const deliveryId = Array.isArray(
    params.deliveryId
  )
    ? params.deliveryId[0]
    : params.deliveryId

  const {
    tracking,
    isLoadingTracking,
    trackingError,
    refreshTracking,
  } = useFuelDeliveryTracking(
    deliveryId ?? null
  )

  const {
    location,
    isLoadingLocation,
    locationError,
    refreshLocation,
  } = useForegroundLocation()

  const destinationLocation =
    tracking?.destination ?? location

  const driverLocation =
    tracking?.driver?.location ?? null

  const isLoading =
    isLoadingTracking ||
    isLoadingLocation

  const mapError =
    locationError ??
    trackingError

  if (!deliveryId) {
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
        <View
          style={styles.emptyPage}
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
                  color: colors.text,
                },
              ]}
            >
              Track Delivery
            </Text>

            <View
              style={
                styles.headerPlaceholder
              }
            />
          </View>

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
              name="truck-delivery-outline"
              size={48}
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
              No active delivery
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
              When you have an active
              fuel delivery, its live
              status and driver location
              will appear here.
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                router.back()
              }
              style={[
                styles.primaryButton,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Back to Fuel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (
    isLoadingTracking &&
    !tracking
  ) {
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
          Loading delivery tracking...
        </Text>
      </SafeAreaView>
    )
  }

  if (
    trackingError &&
    !tracking
  ) {
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
          name="truck-alert-outline"
          size={48}
          color={colors.danger}
        />

        <Text
          style={[
            styles.errorTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Tracking unavailable
        </Text>

        <Text
          style={[
            styles.errorMessage,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {trackingError}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            refreshTracking
          }
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                colors.accent,
            },
          ]}
        >
          <Text
            style={
              styles.primaryButtonText
            }
          >
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() =>
            router.back()
          }
          style={[
            styles.secondaryButton,
            {
              borderColor:
                colors.border,
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
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
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
                color: colors.text,
              },
            ]}
          >
            Track Delivery
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              refreshTracking()
              refreshLocation()
            }}
            style={[
              styles.headerButton,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="refresh"
              size={19}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Fuel Delivery
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
          Follow your delivery status and
          driver location.
        </Text>

        {tracking ? (
          <>
            <View
              style={[
                styles.statusCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <View
                style={styles.statusTopRow}
              >
                <View>
                  <Text
                    style={[
                      styles.statusLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Delivery Status
                  </Text>

                  <Text
                    style={[
                      styles.statusValue,
                      {
                        color:
                          colors.accent,
                      },
                    ]}
                  >
                    {getStatusLabel(
                      tracking.status
                    )}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="truck-fast-outline"
                  size={32}
                  color={colors.accent}
                />
              </View>

              {tracking.estimatedArrivalMinutes !==
              null ? (
                <View
                  style={styles.infoRow}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={colors.accent}
                  />

                  <View
                    style={
                      styles.infoContent
                    }
                  >
                    <Text
                      style={[
                        styles.infoLabel,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      Estimated Arrival
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {
                        tracking.estimatedArrivalMinutes
                      }{' '}
                      min
                    </Text>
                  </View>
                </View>
              ) : null}

              {tracking.destinationLabel ? (
                <View
                  style={styles.infoRow}
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={colors.accent}
                  />

                  <View
                    style={
                      styles.infoContent
                    }
                  >
                    <Text
                      style={[
                        styles.infoLabel,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      Delivery Location
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {
                        tracking.destinationLabel
                      }
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>

            <View
              style={styles.mapSection}
            >
              <FuelMap
                customerLocation={
                  destinationLocation
                }
                deliveryVehicleLocation={
                  driverLocation
                }
                routeCoordinates={
                  tracking.routeCoordinates
                }
                isLoading={isLoading}
                errorMessage={
                  mapError
                }
                height={350}
              />
            </View>

            {tracking.driver ? (
              <View
                style={[
                  styles.driverCard,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.driverIcon,
                    {
                      borderColor:
                        colors.accent,
                    },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={colors.accent}
                  />
                </View>

                <View
                  style={
                    styles.driverContent
                  }
                >
                  <Text
                    style={[
                      styles.driverLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Your Driver
                  </Text>

                  <Text
                    style={[
                      styles.driverName,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {tracking.driver.name ??
                      'Assigned driver'}
                  </Text>

                  {tracking.driver.vehicleDescription ? (
                    <Text
                      style={[
                        styles.driverVehicle,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      {
                        tracking.driver
                          .vehicleDescription
                      }
                      {tracking.driver
                        .vehicleRegistration
                        ? ` • ${tracking.driver.vehicleRegistration}`
                        : ''}
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.waitingCard,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-clock-outline"
                  size={28}
                  color={colors.accent}
                />

                <View
                  style={
                    styles.waitingContent
                  }
                >
                  <Text
                    style={[
                      styles.waitingTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    Waiting for driver
                    assignment
                  </Text>

                  <Text
                    style={[
                      styles.waitingDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Driver details will
                    appear when the
                    delivery backend
                    assigns a driver.
                  </Text>
                </View>
              </View>
            )}

            {tracking.updatedAt ? (
              <Text
                style={[
                  styles.updatedText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Last updated:{' '}
                {tracking.updatedAt}
              </Text>
            ) : null}
          </>
        ) : null}
      </StableScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  emptyPage: {
    flex: 1,
    paddingHorizontal: 16,
  },

  centeredPage: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  loadingText: {
    marginTop: 12,
    fontSize: 12,
  },

  errorTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
  },

  errorMessage: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  primaryButton: {
    minHeight: 42,
    marginTop: 20,
    paddingHorizontal: 24,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },

  secondaryButton: {
    minHeight: 42,
    marginTop: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },

  emptyCard: {
    marginTop: 40,
    minHeight: 230,
    padding: 24,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '700',
  },

  emptyDescription: {
    marginTop: 7,
    maxWidth: 280,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  statusCard: {
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  statusTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  statusLabel: {
    fontSize: 9,
  },

  statusValue: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '700',
  },

  infoRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 9,
  },

  infoValue: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
  },

  mapSection: {
    marginTop: 16,
  },

  driverCard: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  driverIcon: {
    width: 46,
    height: 46,
    borderWidth: 1.5,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  driverContent: {
    flex: 1,
    marginLeft: 12,
  },

  driverLabel: {
    fontSize: 9,
  },

  driverName: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '700',
  },

  driverVehicle: {
    marginTop: 4,
    fontSize: 10,
  },

  waitingCard: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  waitingContent: {
    flex: 1,
    marginLeft: 12,
  },

  waitingTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  waitingDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
  },

  updatedText: {
    marginTop: 12,
    fontSize: 9,
    textAlign: 'center',
  },
})