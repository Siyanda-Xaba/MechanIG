import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import ProfileAvatar from '../../src/components/ProfileAvatar'
import StableScrollView from '../../src/components/StableScrollView'
import { useTimeGreeting } from '../../src/hooks/useTimeGreeting'
import { useMechanicHome } from '../../src/mechanic/MechanicHomeContext'
import { useMechanicNotifications } from '../../src/mechanic/useMechanicNotifications'
import { useTheme } from '../../src/theme/ThemeContext'
import { useUser } from '../../src/users/UserContext'

export default function MechanicHome() {
  const router = useRouter()
  const { colors } = useTheme()
  const greeting = useTimeGreeting()

  const {
    user,
    isLoadingUser,
  } = useUser()

  const {
    homeData,
    isLoadingHome,
    homeError,
    refreshHomeData,
  } = useMechanicHome()

  const {
    notificationsData,
  } = useMechanicNotifications()

  const firstName =
    user?.firstName ?? 'Mechanic'

  const unreadNotificationCount =
    notificationsData?.unreadCount ?? 0

  function formatEarnings() {
    if (!homeData?.earnings) {
      return 'N/A'
    }

    return `${homeData.earnings.currency} ${homeData.earnings.amount.toLocaleString()}`
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
        showsVerticalScrollIndicator={false}
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
                {greeting},
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
              activeOpacity={0.75}
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
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={colors.accent}
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
                  '/(mechanic)/profile'
                )
              }}
              accessibilityRole="button"
              accessibilityLabel="Open mechanic profile"
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

        {isLoadingHome &&
        !homeData ? (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              color={colors.accent}
              size="large"
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
              Loading dashboard...
            </Text>
          </View>
        ) : null}

        {homeError &&
        !homeData ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={34}
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
              Dashboard unavailable
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
              onPress={() => {
                void refreshHomeData()
              }}
              style={[
                styles.retryButton,
                {
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.retryButtonText,
                  {
                    color:
                      colors.accent,
                  },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {homeData ? (
          <>
            {/* Overview */}
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Overview
            </Text>

            <View
              style={
                styles.statsGrid
              }
            >
              <DashboardStatCard
                icon="check-circle-outline"
                title="Jobs Completed"
                value={
                  homeData.jobsCompleted != null
                    ? String(homeData.jobsCompleted)
                    : 'N/A'
                }
                backgroundColor={
                  colors.card
                }
                borderColor={
                  colors.border
                }
                textColor={colors.text}
                secondaryTextColor={
                  colors.secondaryText
                }
                accentColor={
                  colors.accent
                }
              />

              <DashboardStatCard
                icon="briefcase-clock-outline"
                title="Pending Jobs"
                value={
                  homeData.pendingJobs != null
                    ? String(homeData.pendingJobs)
                    : 'N/A'
                }
                backgroundColor={
                  colors.card
                }
                borderColor={
                  colors.border
                }
                textColor={colors.text}
                secondaryTextColor={
                  colors.secondaryText
                }
                accentColor={
                  colors.accent
                }
              />

              <DashboardStatCard
                icon="calendar-check-outline"
                title="Bookings"
                value={
                  homeData.bookings != null
                    ? String(homeData.bookings)
                    : 'N/A'
                }
                backgroundColor={
                  colors.card
                }
                borderColor={
                  colors.border
                }
                textColor={colors.text}
                secondaryTextColor={
                  colors.secondaryText
                }
                accentColor={
                  colors.accent
                }
              />

              <DashboardStatCard
                icon="star-outline"
                title="Rating"
                value={
                  homeData.rating != null
                    ? homeData.rating.toFixed(
                        1
                      )
                    : 'N/A'
                }
                backgroundColor={
                  colors.card
                }
                borderColor={
                  colors.border
                }
                textColor={colors.text}
                secondaryTextColor={
                  colors.secondaryText
                }
                accentColor={
                  colors.accent
                }
              />
            </View>

            {/* Earnings */}
            <View
              style={[
                styles.earningsCard,
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
                  styles.earningsIcon,
                  {
                    borderColor:
                      colors.accent,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="cash-multiple"
                  size={25}
                  color={colors.accent}
                />
              </View>

              <View
                style={
                  styles.earningsContent
                }
              >
                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Earnings
                </Text>

                <Text
                  style={[
                    styles.earningsValue,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {formatEarnings()}
                </Text>
              </View>
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
              style={
                styles.quickActionsGrid
              }
            >
              <MechanicQuickAction
                icon="calendar-plus"
                title="New Booking"
                description="Create workshop or mobile service booking"
                onPress={() => {
                  router.push(
                    '/mechanic-new-booking'
                  )
                }}
                backgroundColor={
                  colors.card
                }
                borderColor={
                  colors.border
                }
                textColor={colors.text}
                secondaryTextColor={
                  colors.secondaryText
                }
                accentColor={
                  colors.accent
                }
              />

              <MechanicQuickAction
                icon="calendar-clock-outline"
                title="Update Availability"
                description="Manage when you can take new work"
                onPress={() => {
                  router.push(
                    '/mechanic-availability'
                  )
                }}
                backgroundColor={
                  colors.card
                }
                borderColor={
                  colors.border
                }
                textColor={colors.text}
                secondaryTextColor={
                  colors.secondaryText
                }
                accentColor={
                  colors.accent
                }
              />

              <MechanicQuickAction
                icon="clipboard-text-outline"
                title="Create Estimate"
                description="Prepare pricing for linked service work"
                onPress={() => {
                  router.push(
                    '/mechanic-estimate'
                  )
                }}
                backgroundColor={
                  colors.card
                }
                borderColor={
                  colors.border
                }
                textColor={colors.text}
                secondaryTextColor={
                  colors.secondaryText
                }
                accentColor={
                  colors.accent
                }
              />

              <MechanicQuickAction
                icon="clipboard-plus-outline"
                title="Add Walk-in Job"
                description="Start intake for unscheduled workshop work"
                onPress={() => {
                  router.push(
                    '/mechanic-walk-in'
                  )
                }}
                backgroundColor={
                  colors.card
                }
                borderColor={
                  colors.border
                }
                textColor={colors.text}
                secondaryTextColor={
                  colors.secondaryText
                }
                accentColor={
                  colors.accent
                }
              />
            </View>

            {/* Schedule */}
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Schedule
            </Text>

            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {homeData.dataAvailability?.schedule !== true ? (
                <EmptySection
                  icon="calendar-blank-outline"
                  message="Schedule unavailable until mechanic data is connected."
                  color={colors.secondaryText}
                />
              ) : homeData.schedule.length ===
              0 ? (
                <EmptySection
                  icon="calendar-blank-outline"
                  message="No scheduled work."
                  color={
                    colors.secondaryText
                  }
                />
              ) : (
                homeData.schedule.map(
                  (
                    item,
                    index
                  ) => (
                    <View
                      key={item.id}
                      style={[
                        styles.scheduleItem,
                        index !==
                        homeData.schedule
                          .length -
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
                          styles.scheduleIcon,
                          {
                            borderColor:
                              colors.accent,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="calendar-clock-outline"
                          size={22}
                          color={
                            colors.accent
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.scheduleContent
                        }
                      >
                        <Text
                          style={[
                            styles.itemTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {item.title}
                        </Text>

                        <Text
                          style={[
                            styles.itemDescription,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {[
                            item.customerName,
                            item.vehicleLabel,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(' • ')}
                        </Text>

                        <Text
                          style={[
                            styles.itemMeta,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {item.date}
                          {' • '}
                          {item.time}
                        </Text>
                      </View>

                      <JobStatusBadge
                        status={
                          item.status
                        }
                        accentColor={
                          colors.accent
                        }
                        highlightColor={
                          colors.highlight
                        }
                        warningColor={
                          colors.warning
                        }
                        successColor={
                          colors.success
                        }
                        dangerColor={
                          colors.danger
                        }
                      />
                    </View>
                  )
                )
              )}
            </View>

            {/* Service Alerts */}
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Service Alerts
            </Text>

            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {homeData.dataAvailability?.serviceAlerts !== true ? (
                <EmptySection
                  icon="bell-check-outline"
                  message="Service alerts unavailable until mechanic data is connected."
                  color={colors.secondaryText}
                />
              ) : homeData.serviceAlerts
                .length === 0 ? (
                <EmptySection
                  icon="bell-check-outline"
                  message="No service alerts."
                  color={
                    colors.secondaryText
                  }
                />
              ) : (
                homeData.serviceAlerts.map(
                  (
                    alert,
                    index
                  ) => (
                    <View
                      key={alert.id}
                      style={[
                        styles.alertItem,
                        index !==
                        homeData
                          .serviceAlerts
                          .length -
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
                          styles.alertIcon,
                          {
                            borderColor:
                              getAlertColor(
                                alert.severity,
                                colors.accent,
                                colors.warning,
                                colors.danger
                              ),
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="alert-outline"
                          size={22}
                          color={getAlertColor(
                            alert.severity,
                            colors.accent,
                            colors.warning,
                            colors.danger
                          )}
                        />
                      </View>

                      <View
                        style={
                          styles.alertContent
                        }
                      >
                        <Text
                          style={[
                            styles.itemTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {alert.title}
                        </Text>

                        <Text
                          style={[
                            styles.itemDescription,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {
                            alert.description
                          }
                        </Text>
                      </View>
                    </View>
                  )
                )
              )}
            </View>

            {/* Recent Activity */}
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

            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {homeData.dataAvailability?.recentActivity !== true ? (
                <EmptySection
                  icon="history"
                  message="Recent activity unavailable until mechanic data is connected."
                  color={colors.secondaryText}
                />
              ) : homeData.recentActivity
                .length === 0 ? (
                <EmptySection
                  icon="history"
                  message="No recent activity."
                  color={
                    colors.secondaryText
                  }
                />
              ) : (
                homeData.recentActivity.map(
                  (
                    activity,
                    index
                  ) => (
                    <View
                      key={
                        activity.id
                      }
                      style={[
                        styles.activityItem,
                        index !==
                        homeData
                          .recentActivity
                          .length -
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
                          styles.activityIcon,
                          {
                            borderColor:
                              colors.accent,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="history"
                          size={21}
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
                        <Text
                          style={[
                            styles.itemTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {
                            activity.title
                          }
                        </Text>

                        <Text
                          style={[
                            styles.itemDescription,
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
                            styles.itemMeta,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {activity.time}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.activityStatus,
                          {
                            color:
                              getActivityStatusColor(
                                activity.status,
                                colors.accent,
                                colors.highlight,
                                colors.warning,
                                colors.success,
                                colors.danger,
                                colors.secondaryText
                              ),
                          },
                        ]}
                      >
                        {activity.status}
                      </Text>
                    </View>
                  )
                )
              )}
            </View>

            {homeError ? (
              <Text
                style={[
                  styles.inlineError,
                  {
                    color:
                      colors.danger,
                  },
                ]}
              >
                {homeError}
              </Text>
            ) : null}
          </>
        ) : null}
      </StableScrollView>
    </SafeAreaView>
  )
}

function DashboardStatCard({
  icon,
  title,
  value,
  backgroundColor,
  borderColor,
  textColor,
  secondaryTextColor,
  accentColor,
}) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={25}
        color={accentColor}
      />

      <Text
        style={[
          styles.statValue,
          {
            color: textColor,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        numberOfLines={1}
        style={[
          styles.statLabel,
          {
            color:
              secondaryTextColor,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  )
}

function MechanicQuickAction({
  icon,
  title,
  description,
  onPress,
  backgroundColor,
  borderColor,
  textColor,
  secondaryTextColor,
  accentColor,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.quickActionCard,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.quickActionIcon,
          {
            borderColor:
              accentColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={accentColor}
        />
      </View>

      <Text
        style={[
          styles.quickActionTitle,
          {
            color: textColor,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.quickActionDescription,
          {
            color:
              secondaryTextColor,
          },
        ]}
      >
        {description}
      </Text>
    </TouchableOpacity>
  )
}

function JobStatusBadge({
  status,
  accentColor,
  highlightColor,
  warningColor,
  successColor,
  dangerColor,
}) {
  const label = getJobStatusLabel(
    status
  )

  const statusColor =
    getJobStatusColor(
      status,
      accentColor,
      highlightColor,
      warningColor,
      successColor,
      dangerColor
    )

  return (
    <View
      style={[
        styles.statusBadge,
        {
          borderColor: statusColor,
        },
      ]}
    >
      <Text
        style={[
          styles.statusBadgeText,
          {
            color: statusColor,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

function EmptySection({
  icon,
  message,
  color,
}) {
  return (
    <View
      style={styles.emptySection}
    >
      <MaterialCommunityIcons
        name={icon}
        size={26}
        color={color}
      />

      <Text
        style={[
          styles.emptySectionText,
          {
            color,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  )
}

function getJobStatusLabel(
  status
) {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'accepted':
      return 'Accepted'
    case 'in-progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
  }
}

function getJobStatusColor(
  status,
  accentColor,
  highlightColor,
  warningColor,
  successColor,
  dangerColor
) {
  switch (status) {
    case 'pending':
      return warningColor
    case 'accepted':
      return accentColor
    case 'in-progress':
      return highlightColor
    case 'completed':
      return successColor
    case 'cancelled':
      return dangerColor
  }
}

function getAlertColor(
  severity,
  accentColor,
  warningColor,
  dangerColor
) {
  switch (severity) {
    case 'info':
      return accentColor
    case 'warning':
      return warningColor
    case 'urgent':
      return dangerColor
  }
}

function getActivityStatusColor(
  status,
  accentColor,
  highlightColor,
  warningColor,
  successColor,
  dangerColor,
  fallbackColor
) {
  switch (
    status.trim().toLowerCase()
  ) {
    case 'pending':
      return warningColor
    case 'accepted':
      return accentColor
    case 'in progress':
    case 'in-progress':
      return highlightColor
    case 'completed':
      return successColor
    case 'cancelled':
    case 'canceled':
      return dangerColor
    default:
      return fallbackColor
  }
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
    justifyContent:
      'space-between',
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

  notificationButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },

  greetingContainer: {
    maxWidth: 105,
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

  loadingContainer: {
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  loadingText: {
    fontSize: 12,
    fontWeight: '500',
  },

  stateCard: {
    marginTop: 12,
    minHeight: 230,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
  },

  stateDescription: {
    marginTop: 6,
    maxWidth: 260,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 18,
  },

  retryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '700',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    rowGap: 12,
  },

  statCard: {
    width: '48.2%',
    minHeight: 118,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  statValue: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
  },

  statLabel: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '500',
  },

  earningsCard: {
    marginTop: 12,
    minHeight: 82,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  earningsIcon: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  earningsContent: {
    flex: 1,
    marginLeft: 12,
  },

  cardLabel: {
    fontSize: 10,
    fontWeight: '500',
  },

  earningsValue: {
    marginTop: 4,
    fontSize: 19,
    fontWeight: '800',
  },

  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    rowGap: 12,
  },

  quickActionCard: {
    width: '48.2%',
    minHeight: 142,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  quickActionIcon: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickActionTitle: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
  },

  quickActionDescription: {
    marginTop: 4,
    fontSize: 9.5,
    lineHeight: 14,
  },

  sectionCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  scheduleItem: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  scheduleIcon: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scheduleContent: {
    flex: 1,
    marginHorizontal: 10,
  },

  itemTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  itemDescription: {
    marginTop: 4,
    fontSize: 9.5,
    lineHeight: 14,
  },

  itemMeta: {
    marginTop: 4,
    fontSize: 8.5,
    fontWeight: '500',
  },

  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 8,
  },

  statusBadgeText: {
    fontSize: 7.5,
    fontWeight: '700',
  },

  alertItem: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  alertIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  alertContent: {
    flex: 1,
    marginLeft: 10,
  },

  activityItem: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  activityIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityContent: {
    flex: 1,
    marginHorizontal: 10,
  },

  activityStatus: {
    maxWidth: 70,
    fontSize: 8.5,
    fontWeight: '700',
    textAlign: 'right',
  },

  emptySection: {
    minHeight: 105,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  emptySectionText: {
    fontSize: 10.5,
    fontWeight: '500',
  },

  inlineError: {
    marginTop: 14,
    fontSize: 10,
    textAlign: 'center',
  },
})