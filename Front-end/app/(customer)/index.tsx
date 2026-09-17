import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import MaintenanceReminderCard from '../../src/components/MaintenanceReminderCard'
import PowerShieldCard from '../../src/components/PowerShieldCard'
import ProfileAvatar from '../../src/components/ProfileAvatar'
import QuickActionCard from '../../src/components/QuickActionCard'
import RecentActivityCard from '../../src/components/RecentActivityCard'
import Vehicle3DViewer from '../../src/components/Vehicle3DViewer'
import VehicleHealthRing from '../../src/components/VehicleHealthRing'
import { useCustomerHome } from '../../src/customer/CustomerHomeContext'
import {
  CustomerActivityAction,
} from '../../src/customer/homeTypes'
import { useCustomerNotifications } from '../../src/customer/useCustomerNotifications'
import { useTheme } from '../../src/theme/ThemeContext'
import { useUser } from '../../src/users/UserContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'
import { getVehicleModelSource } from '../../src/vehicles/modelRegistry'

export default function CustomerHome() {
  const router = useRouter()
  const { colors } = useTheme()

  const [
    isVehicleSelectorOpen,
    setIsVehicleSelectorOpen,
  ] = useState(false)

  const [
    isVehicleModelInteracting,
    setIsVehicleModelInteracting,
  ] = useState(false)

  const {
    user,
    isLoadingUser,
  } = useUser()

  const {
    vehicles,
    selectedVehicle,
    isLoadingVehicles,
    selectVehicle,
  } = useVehicle()

  const {
    homeData,
    isLoadingHome,
    homeError,
  } = useCustomerHome()

  const {
    notificationsData,
  } = useCustomerNotifications()

  const vehicleModel = selectedVehicle
    ? getVehicleModelSource(
        selectedVehicle.modelKey
      )
    : null

  const firstName =
    user?.firstName ?? 'Driver'

  const isVehicleLoading =
    isLoadingVehicles || isLoadingHome

  const maintenanceReminder =
    homeData?.maintenanceReminders?.[0] ??
    null

  const recentActivity =
    homeData?.recentActivity ?? []

  const unreadNotificationCount =
    notificationsData?.unreadCount ?? 0

  function handleVehicleSelection(
    vehicleId: string
  ) {
    selectVehicle(vehicleId)
    setIsVehicleSelectorOpen(false)
  }

  function handleActivityAction(
    action: CustomerActivityAction
  ) {
    switch (action.type) {
      case 'diagnostics': {
        if (action.resultId) {
          router.push({
            pathname:
              '/diagnostic-result/[resultId]',
            params: {
              resultId: action.resultId,
            },
          })

          return
        }

        router.push(
          '/(customer)/diagnostics'
        )
        return
      }

      case 'fuel': {
        router.push('/(customer)/fuel')
        return
      }

      case 'maintenance': {
        router.push('/maintenance')
        return
      }

      case 'service': {
        if (action.mechanicId) {
          router.push({
            pathname:
              '/workshop-booking/[mechanicId]',
            params: {
              mechanicId:
                action.mechanicId,
            },
          })

          return
        }

        router.push('/book-service')
        return
      }

      case 'marketplace': {
        router.push(
          '/(customer)/marketplace'
        )
        return
      }

      case 'profile': {
        router.push('/(customer)/profile')
        return
      }
    }
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
        scrollEnabled={
          !isVehicleModelInteracting
        }
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/mechaniq-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.headerRight}>
            <View
              style={
                styles.greetingContainer
              }
            >
              <Text
                style={[
                  styles.greeting,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Good Morning,
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.userName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isLoadingUser
                  ? 'Loading...'
                  : firstName}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                router.push(
                  '/notifications'
                )
              }}
              accessibilityRole="button"
              accessibilityLabel="Open notifications"
              style={[
                styles.notificationButton,
                {
                  borderColor:
                    colors.border,
                  backgroundColor:
                    colors.card,
                },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={colors.text}
              />

              {unreadNotificationCount >
              0 ? (
                <View
                  style={[
                    styles.notificationBadge,
                    {
                      backgroundColor:
                        colors.accent,
                    },
                  ]}
                >
                  <Text
                    style={
                      styles.notificationBadgeText
                    }
                  >
                    {unreadNotificationCount >
                    9
                      ? '9+'
                      : unreadNotificationCount}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => {
                router.push(
                  '/(customer)/profile'
                )
              }}
              accessibilityRole="button"
              accessibilityLabel="Open profile"
            >
              <ProfileAvatar
                imageUrl={
                  user?.profileImageUrl
                }
                size={42}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Card */}
        <View
          style={[
            styles.vehicleCard,
            {
              backgroundColor:
                colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {isVehicleLoading ? (
            <View
              style={
                styles.vehicleMessageContainer
              }
            >
              <Text
                style={[
                  styles.vehicleMessage,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Loading vehicle...
              </Text>
            </View>
          ) : !selectedVehicle ? (
            <View
              style={
                styles.vehicleMessageContainer
              }
            >
              <MaterialCommunityIcons
                name="car-outline"
                size={34}
                color={
                  colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.vehicleMessage,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                No vehicle selected
              </Text>
            </View>
          ) : (
            <>
              <View
                style={
                  styles.vehicleHeader
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

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsVehicleSelectorOpen(
                      (currentValue) =>
                        !currentValue
                    )
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Select vehicle"
                  style={[
                    styles.vehicleSelector,
                    {
                      borderColor:
                        isVehicleSelectorOpen
                          ? colors.accent
                          : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      isVehicleSelectorOpen
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={18}
                    color={
                      colors.accent
                    }
                  />
                </TouchableOpacity>
              </View>

              {isVehicleSelectorOpen ? (
                <View
                  style={[
                    styles.vehicleSelectorMenu,
                    {
                      backgroundColor:
                        colors.background,
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  {vehicles.map(
                    (
                      vehicle,
                      index
                    ) => {
                      const isSelected =
                        vehicle.id ===
                        selectedVehicle.id

                      return (
                        <TouchableOpacity
                          key={vehicle.id}
                          activeOpacity={0.75}
                          onPress={() =>
                            handleVehicleSelection(
                              vehicle.id
                            )
                          }
                          style={[
                            styles.vehicleSelectorOption,
                            index !==
                            vehicles.length -
                              1
                              ? {
                                  borderBottomWidth: 1,
                                  borderBottomColor:
                                    colors.border,
                                }
                              : null,
                          ]}
                        >
                          <View
                            style={[
                              styles.vehicleSelectorIcon,
                              {
                                borderColor:
                                  isSelected
                                    ? colors.accent
                                    : colors.border,
                              },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="car-outline"
                              size={21}
                              color={
                                isSelected
                                  ? colors.accent
                                  : colors.secondaryText
                              }
                            />
                          </View>

                          <View
                            style={
                              styles.vehicleSelectorContent
                            }
                          >
                            <View
                              style={
                                styles.vehicleSelectorTitleRow
                              }
                            >
                              <Text
                                numberOfLines={
                                  1
                                }
                                style={[
                                  styles.vehicleSelectorTitle,
                                  {
                                    color:
                                      colors.text,
                                  },
                                ]}
                              >
                                {
                                  vehicle.make
                                }{' '}
                                {
                                  vehicle.model
                                }
                              </Text>

                              {vehicle.isPrimary ? (
                                <View
                                  style={[
                                    styles.primaryBadge,
                                    {
                                      borderColor:
                                        colors.accent,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.primaryBadgeText,
                                      {
                                        color:
                                          colors.accent,
                                      },
                                    ]}
                                  >
                                    Primary
                                  </Text>
                                </View>
                              ) : null}
                            </View>

                            <Text
                              style={[
                                styles.vehicleSelectorRegistration,
                                {
                                  color:
                                    colors.secondaryText,
                                },
                              ]}
                            >
                              {
                                vehicle.registration
                              }
                              {' • '}
                              {
                                vehicle.year
                              }
                            </Text>
                          </View>

                          {isSelected ? (
                            <Ionicons
                              name="checkmark-circle"
                              size={21}
                              color={
                                colors.accent
                              }
                            />
                          ) : (
                            <Ionicons
                              name="ellipse-outline"
                              size={21}
                              color={
                                colors.secondaryText
                              }
                            />
                          )}
                        </TouchableOpacity>
                      )
                    }
                  )}
                </View>
              ) : null}

              <View
                style={
                  styles.vehicleMainContent
                }
              >
                <View
                  style={
                    styles.vehicleModelContainer
                  }
                >
                  <View
                    style={[
                      styles.vehicleModelFrame,
                      {
                        backgroundColor:
                          colors.background,
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    <Vehicle3DViewer
                      modelSource={
                        vehicleModel
                      }
                      height={155}
                      onInteractionChange={
                        setIsVehicleModelInteracting
                      }
                    />
                  </View>
                </View>

                <View
                  style={
                    styles.healthContainer
                  }
                >
                  <Text
                    style={[
                      styles.healthTitle,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Vehicle Health
                  </Text>

                  <VehicleHealthRing
                    score={
                      homeData?.vehicleHealthScore ??
                      null
                    }
                    size={78}
                    strokeWidth={7}
                  />

                  <Text
                    style={[
                      styles.healthLabel,
                      {
                        color:
                          colors.accent,
                      },
                    ]}
                  >
                    {homeData?.vehicleHealthLabel ??
                      'Not available'}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusRow,
                  {
                    borderTopColor:
                      colors.border,
                  },
                ]}
              >
                <VehicleStatusItem
                  icon="gas-station"
                  label="Fuel Level"
                  value={
                    homeData?.fuelLevel !=
                    null
                      ? `${homeData.fuelLevel}%`
                      : 'N/A'
                  }
                  colors={colors}
                />

                <VehicleStatusItem
                  icon="wrench-outline"
                  label="Next Service"
                  value={
                    homeData?.nextServiceKm !=
                    null
                      ? `${homeData.nextServiceKm.toLocaleString()} km`
                      : 'N/A'
                  }
                  colors={colors}
                />

                <VehicleStatusItem
                  icon="battery-high"
                  label="Battery"
                  value={
                    homeData?.batteryStatus ??
                    'N/A'
                  }
                  colors={colors}
                />

                <VehicleStatusItem
                  icon="tire"
                  label="Tyres"
                  value={
                    homeData?.tyreStatus ??
                    'N/A'
                  }
                  colors={colors}
                />
              </View>
            </>
          )}

          {homeError ? (
            <Text
              style={[
                styles.errorText,
                {
                  color: colors.danger,
                },
              ]}
            >
              {homeError}
            </Text>
          ) : null}
        </View>

        {/* Quick Actions */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Quick Actions
        </Text>

        <View
          style={styles.quickActionsGrid}
        >
          <QuickActionCard
            title="Diagnose Vehicle"
            description="Scan & check vehicle health"
            icon="car-search"
            onPress={() => {
              router.push(
                '/(customer)/diagnostics'
              )
            }}
          />

          <QuickActionCard
            title="Order Fuel"
            description="Request fuel delivery"
            icon="gas-station"
            onPress={() => {
              router.push(
                '/(customer)/fuel'
              )
            }}
          />

          <QuickActionCard
            title="Find Mechanic"
            description="Find trusted mechanics"
            icon="account-wrench-outline"
            onPress={() => {
              router.push(
                '/find-mechanic'
              )
            }}
          />

          <QuickActionCard
            title="Book Service"
            description="Schedule service appointments"
            icon="calendar-check-outline"
            onPress={() => {
              router.push(
                '/book-service'
              )
            }}
          />
        </View>

        {/* Power Shield + Maintenance */}
        <View
          style={styles.dashboardRow}
        >
          <PowerShieldCard
            nextOutageTime={
              homeData?.nextOutageTime ??
              null
            }
            onSchedulePress={() => {
              router.push(
                '/(customer)/fuel'
              )
            }}
          />

          <MaintenanceReminderCard
            reminder={
              maintenanceReminder
            }
            onPress={() => {
              router.push(
                '/maintenance'
              )
            }}
          />
        </View>

        {/* Recent Activity */}
        <RecentActivityCard
          activities={recentActivity}
          onViewAllPress={() => {
            router.push('/activity')
          }}
          onActivityPress={(
            activity
          ) => {
            if (!activity.action) {
              return
            }

            handleActivityAction(
              activity.action
            )
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

type VehicleStatusItemProps = {
  icon:
    | 'gas-station'
    | 'wrench-outline'
    | 'battery-high'
    | 'tire'
  label: string
  value: string
  colors: {
    text: string
    secondaryText: string
    accent: string
  }
}

function VehicleStatusItem({
  icon,
  label,
  value,
  colors,
}: VehicleStatusItemProps) {
  return (
    <View style={styles.statusItem}>
      <MaterialCommunityIcons
        name={icon}
        size={19}
        color={colors.accent}
      />

      <Text
        numberOfLines={1}
        style={[
          styles.statusLabel,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        numberOfLines={1}
        style={[
          styles.statusValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>
    </View>
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

  header: {
    width: '100%',
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    width: 115,
    height: 62,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  greetingContainer: {
    maxWidth: 92,
    alignItems: 'flex-end',
  },

  greeting: {
    fontSize: 10,
    fontWeight: '400',
  },

  userName: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
  },

  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  notificationBadge: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    position: 'absolute',
    top: -4,
    right: -4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadgeText: {
    color: '#000000',
    fontSize: 7,
    fontWeight: '800',
  },

  vehicleCard: {
    width: '100%',
    minHeight: 300,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },

  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
  },

  registration: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '500',
  },

  vehicleSelector: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleSelectorMenu: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  vehicleSelectorOption: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleSelectorIcon: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleSelectorContent: {
    flex: 1,
    marginHorizontal: 10,
  },

  vehicleSelectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },

  vehicleSelectorTitle: {
    maxWidth: 150,
    fontSize: 11,
    fontWeight: '700',
  },

  vehicleSelectorRegistration: {
    marginTop: 4,
    fontSize: 9,
  },

  primaryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 5,
  },

  primaryBadgeText: {
    fontSize: 7.5,
    fontWeight: '700',
  },

  vehicleMainContent: {
    minHeight: 165,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleModelContainer: {
    flex: 1,
    minWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },

  vehicleModelFrame: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  healthContainer: {
    width: 105,
    alignItems: 'center',
    justifyContent: 'center',
  },

  healthTitle: {
    marginBottom: 7,
    fontSize: 10,
    fontWeight: '500',
  },

  healthLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
  },

  statusRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },

  statusItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },

  statusLabel: {
    marginTop: 4,
    fontSize: 8,
    textAlign: 'center',
  },

  statusValue: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },

  vehicleMessageContainer: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  vehicleMessage: {
    fontSize: 13,
    fontWeight: '500',
  },

  errorText: {
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '700',
  },

  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },

  dashboardRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
})