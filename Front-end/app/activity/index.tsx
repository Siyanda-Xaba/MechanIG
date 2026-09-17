import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
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
  CustomerActivityAction,
  RecentActivityItem,
} from '../../src/customer/homeTypes'
import { useCustomerHome } from '../../src/customer/CustomerHomeContext'
import { useTheme } from '../../src/theme/ThemeContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function CustomerActivityHistoryScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    homeData,
    isLoadingHome,
    homeError,
    refreshHomeData,
  } = useCustomerHome()

  const activities =
    homeData?.recentActivity ?? []

  const isLoading =
    isLoadingVehicles || isLoadingHome

  function handleActivityPress(
    activity: RecentActivityItem
  ) {
    if (!activity.action) {
      return
    }

    handleActivityAction(activity.action)
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

        router.push('/(customer)/diagnostics')
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
        router.push('/(customer)/marketplace')
        return
      }

      case 'profile': {
        router.push('/(customer)/profile')
        return
      }
    }
  }

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
          Loading activity...
        </Text>
      </SafeAreaView>
    )
  }

  if (homeError) {
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
          Unable to load activity
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
          {homeError}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={refreshHomeData}
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
            accessibilityRole="button"
            accessibilityLabel="Go back"
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
              Activity History
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
              Recent vehicle and account activity
            </Text>
          </View>
        </View>

        {/* Vehicle context */}
        {selectedVehicle ? (
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
              style={[
                styles.vehicleIcon,
                {
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="car-outline"
                size={23}
                color={colors.accent}
              />
            </View>

            <View
              style={styles.vehicleContent}
            >
              <Text
                style={[
                  styles.vehicleLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Activity for
              </Text>

              <Text
                style={[
                  styles.vehicleName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {selectedVehicle.make}{' '}
                {selectedVehicle.model}
              </Text>

              <Text
                style={[
                  styles.vehicleRegistration,
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
          </View>
        ) : null}

        <View
          style={styles.sectionHeader}
        >
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Recent Activity
            </Text>

            <Text
              style={[
                styles.sectionDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {activities.length}{' '}
              {activities.length === 1
                ? 'activity'
                : 'activities'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={refreshHomeData}
            accessibilityRole="button"
            accessibilityLabel="Refresh activity"
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
              size={19}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        {activities.length === 0 ? (
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
              name="history"
              size={40}
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
              No recent activity
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
              Diagnostics, fuel, service, maintenance and Marketplace activity will appear here.
            </Text>
          </View>
        ) : (
          <View
            style={styles.activityList}
          >
            {activities.map(
              (activity) => {
                const icon =
                  getActivityIcon(
                    activity.action
                  )

                return (
                  <TouchableOpacity
                    key={activity.id}
                    activeOpacity={0.75}
                    disabled={
                      activity.action ===
                      null
                    }
                    onPress={() =>
                      handleActivityPress(
                        activity
                      )
                    }
                    style={[
                      styles.activityCard,
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
                        styles.activityIcon,
                        {
                          borderColor:
                            colors.accent,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={icon}
                        size={22}
                        color={
                          colors.accent
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.activityContent
                      }
                    >
                      <View
                        style={
                          styles.activityTitleRow
                        }
                      >
                        <Text
                          style={[
                            styles.activityTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {activity.title}
                        </Text>

                        <View
                          style={[
                            styles.statusBadge,
                            {
                              borderColor:
                                colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  colors.accent,
                              },
                            ]}
                          >
                            {
                              activity.status
                            }
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.activityDescription,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {
                          activity.description
                        }
                      </Text>

                      <Text
                        style={[
                          styles.activityTime,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {activity.time}
                      </Text>
                    </View>

                    {activity.action ? (
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={
                          colors.secondaryText
                        }
                      />
                    ) : null}
                  </TouchableOpacity>
                )
              }
            )}
          </View>
        )}

        <View
          style={[
            styles.backendNotice,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={17}
            color={colors.accent}
          />

          <Text
            style={[
              styles.backendNoticeText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Full activity history will eventually come from MechanIQ backend records. Navigation actions only use identifiers when a real related diagnostic, delivery, mechanic or service record exists.
          </Text>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
}

function getActivityIcon(
  action: CustomerActivityAction | null
):
  | 'history'
  | 'car-search'
  | 'gas-station'
  | 'wrench-outline'
  | 'calendar-check-outline'
  | 'shopping-outline'
  | 'account-outline' {
  if (!action) {
    return 'history'
  }

  switch (action.type) {
    case 'diagnostics':
      return 'car-search'

    case 'fuel':
      return 'gas-station'

    case 'maintenance':
      return 'wrench-outline'

    case 'service':
      return 'calendar-check-outline'

    case 'marketplace':
      return 'shopping-outline'

    case 'profile':
      return 'account-outline'
  }
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
  },

  stateTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },

  stateDescription: {
    marginTop: 8,
    maxWidth: 300,
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
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 3,
    fontSize: 10,
  },

  vehicleCard: {
    minHeight: 82,
    marginTop: 22,
    padding: 13,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleContent: {
    flex: 1,
    marginLeft: 12,
  },

  vehicleLabel: {
    fontSize: 8.5,
  },

  vehicleName: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
  },

  vehicleRegistration: {
    marginTop: 3,
    fontSize: 9,
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  sectionDescription: {
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

  activityList: {
    gap: 10,
  },

  activityCard: {
    minHeight: 98,
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activityIcon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityContent: {
    flex: 1,
    marginHorizontal: 11,
  },

  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  activityTitle: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
  },

  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 7.5,
    fontWeight: '700',
  },

  activityDescription: {
    marginTop: 5,
    fontSize: 9.5,
    lineHeight: 14,
  },

  activityTime: {
    marginTop: 6,
    fontSize: 8.5,
  },

  emptyCard: {
    minHeight: 210,
    padding: 22,
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
    maxWidth: 280,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },

  backendNotice: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  backendNoticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 8.5,
    lineHeight: 13,
  },
})