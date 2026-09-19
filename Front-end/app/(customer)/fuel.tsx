import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import FuelActionCard from '../../src/components/FuelActionCard'
import FuelRecentActivityCard from '../../src/components/FuelRecentActivityCard'
import StableScrollView from '../../src/components/StableScrollView'
import { useCustomerFuel } from '../../src/customer/CustomerFuelContext'
import type { FuelRequestType } from '../../src/customer/fuelTypes'
import { useTheme } from '../../src/theme/ThemeContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function CustomerFuel() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    fuelData,
    isLoadingFuel,
    fuelError,
  } = useCustomerFuel()

  const isLoading =
    isLoadingVehicles || isLoadingFuel

  const recentActivity =
    fuelData?.recentActivity ?? []

  const fuelLevelColor =
    fuelData?.fuelLevel === null ||
    fuelData?.fuelLevel === undefined
      ? colors.secondaryText
      : fuelData.fuelLevel <= 20
        ? colors.danger
        : fuelData.fuelLevel <= 50
          ? colors.warning
          : colors.success

  function handleFuelRequest(
    requestType: FuelRequestType
  ) {
    const fuelType = fuelData?.fuelType

    const compatibleFuelTypes =
      fuelData?.compatibleFuelTypes ?? []

    router.push({
      pathname: '/fuel-delivery-request',
      params: {
        requestType,

        ...(fuelType
          ? {
              fuelType,
            }
          : {}),

        compatibleFuelTypes:
          JSON.stringify(
            compatibleFuelTypes
          ),
      },
    })
  }

  function handleScheduleTopUp() {
    const fuelType = fuelData?.fuelType

    const compatibleFuelTypes =
      fuelData?.compatibleFuelTypes ?? []

    router.push({
      pathname: '/fuel-top-up-schedule',
      params: {
        ...(fuelType
          ? {
              fuelType,
            }
          : {}),

        compatibleFuelTypes:
          JSON.stringify(
            compatibleFuelTypes
          ),
      },
    })
  }

  function handleTrackDelivery() {
    const activeDeliveryId =
      fuelData?.activeDeliveryId

    if (activeDeliveryId) {
      router.push({
        pathname:
          '/fuel-delivery-tracking',
        params: {
          deliveryId:
            activeDeliveryId,
        },
      })

      return
    }

    router.push(
      '/fuel-delivery-tracking'
    )
  }

  function handleFuelHistory() {
    router.push('/fuel-history')
  }

  function handleSavedLocations() {
    router.push(
      '/fuel-saved-locations'
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
      edges={['top']}
    >
      <StableScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Fuel Services
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
          Manage fuel delivery, nearby
          stations, and emergency
          top-ups.
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
          {isLoading ? (
            <Text
              style={[
                styles.message,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Loading fuel
              information...
            </Text>
          ) : !selectedVehicle ? (
            <Text
              style={[
                styles.message,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              No vehicle selected
            </Text>
          ) : (
            <>
              <View
                style={
                  styles.vehicleTopRow
                }
              >
                <View>
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
                      styles.registration,
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
                </View>

                <MaterialCommunityIcons
                  name="gas-station-outline"
                  size={34}
                  color={fuelLevelColor}
                />
              </View>

              <View
                style={
                  styles.statsGrid
                }
              >
                <View
                  style={
                    styles.statItem
                  }
                >
                  <Text
                    style={[
                      styles.statLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Fuel Level
                  </Text>

                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          fuelLevelColor,
                      },
                    ]}
                  >
                    {fuelData?.fuelLevel !==
                      null &&
                    fuelData?.fuelLevel !==
                      undefined
                      ? `${fuelData.fuelLevel}%`
                      : '—'}
                  </Text>
                </View>

                <View
                  style={
                    styles.statItem
                  }
                >
                  <Text
                    style={[
                      styles.statLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Estimated Range
                  </Text>

                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {fuelData?.estimatedRangeKm !==
                      null &&
                    fuelData?.estimatedRangeKm !==
                      undefined
                      ? `${fuelData.estimatedRangeKm} km`
                      : '—'}
                  </Text>
                </View>

                <View
                  style={
                    styles.statItem
                  }
                >
                  <Text
                    style={[
                      styles.statLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Fuel Type
                  </Text>

                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {fuelData?.fuelType ??
                      '—'}
                  </Text>
                </View>

                <View
                  style={
                    styles.statItem
                  }
                >
                  <Text
                    style={[
                      styles.statLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Nearest Station
                  </Text>

                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {fuelData
                      ?.nearestStation
                      ?.distanceKm !==
                      null &&
                    fuelData
                      ?.nearestStation
                      ?.distanceKm !==
                      undefined
                      ? `${fuelData.nearestStation.distanceKm} km`
                      : '—'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View
          style={[
            styles.deliveryCard,
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
              styles.deliveryHeader
            }
          >
            <View>
              <Text
                style={[
                  styles.deliveryTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Fuel Delivery
              </Text>

              <Text
                style={[
                  styles.deliveryStatus,
                  {
                    color:
                      colors.success,
                  },
                ]}
              >
                Driver available nearby
              </Text>
            </View>

            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={30}
              color={colors.accent}
            />
          </View>

          <Text
            style={[
              styles.deliveryDescription,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Get fuel delivered to your
            location quickly and safely.
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              handleFuelRequest(
                'standard'
              )
            }
            style={[
              styles.requestButton,
              {
                backgroundColor:
                  colors.accent,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="gas-station"
              size={18}
              color="#000000"
            />

            <Text
              style={
                styles.requestButtonText
              }
            >
              Request Fuel
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={styles.actionsGrid}
        >
          <FuelActionCard
            title="Nearby Stations"
            description="Find fuel stations close to you."
            icon="map-marker-radius-outline"
            onPress={() => {
              router.push(
                '/nearby-fuel-stations'
              )
            }}
          />

          <FuelActionCard
            title="Emergency Fuel"
            description="Request urgent fuel assistance."
            icon="alert-circle-outline"
            onPress={() =>
              handleFuelRequest(
                'emergency'
              )
            }
          />

          <FuelActionCard
            title="Track Delivery"
            description="View your active fuel delivery."
            icon="truck-fast-outline"
            onPress={
              handleTrackDelivery
            }
          />

          <FuelActionCard
            title="Schedule Top-up"
            description="Plan a future fuel delivery."
            icon="calendar-clock-outline"
            onPress={
              handleScheduleTopUp
            }
          />

          <FuelActionCard
            title="Fuel History"
            description="View previous fuel activity."
            icon="history"
            onPress={
              handleFuelHistory
            }
          />

          <FuelActionCard
            title="Saved Locations"
            description="Manage your frequent delivery locations."
            icon="map-marker-star-outline"
            onPress={
              handleSavedLocations
            }
          />
        </View>

        <FuelRecentActivityCard
          activities={recentActivity}
          onViewAllPress={
            handleFuelHistory
          }
          onActivityPress={(
            activity
          ) => {
            console.log(
              'Selected fuel activity:',
              activity.id
            )
          }}
        />

        {fuelError ? (
          <Text
            style={[
              styles.errorText,
              {
                color: colors.danger,
              },
            ]}
          >
            {fuelError}
          </Text>
        ) : null}
      </StableScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  title: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
  },

  vehicleCard: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },

  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
  },

  registration: {
    marginTop: 4,
    fontSize: 11,
  },

  statsGrid: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
  },

  statItem: {
    width: '50%',
  },

  statLabel: {
    fontSize: 9,
  },

  statValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
  },

  deliveryCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },

  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  deliveryTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  deliveryStatus: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
  },

  deliveryDescription: {
    marginTop: 12,
    fontSize: 11,
    lineHeight: 16,
  },

  requestButton: {
    minHeight: 42,
    marginTop: 16,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  requestButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },

  actionsGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },

  message: {
    paddingVertical: 40,
    textAlign: 'center',
    fontSize: 12,
  },

  errorText: {
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
  },
})