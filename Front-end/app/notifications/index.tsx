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
  CustomerNotification,
  CustomerNotificationCategory,
} from '../../src/customer/customerNotificationTypes'
import { useCustomerNotifications } from '../../src/customer/useCustomerNotifications'
import { useTheme } from '../../src/theme/ThemeContext'

export default function CustomerNotificationsScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    notificationsData,
    isLoadingNotifications,
    notificationsError,
    refreshNotifications,
  } = useCustomerNotifications()

  const notifications =
    notificationsData?.notifications ?? []

  function handleNotificationPress(
    notification: CustomerNotification
  ) {
    if (!notification.action) {
      return
    }

    switch (notification.action.type) {
      case 'diagnostics': {
        if (notification.action.resultId) {
          router.push({
            pathname:
              '/diagnostic-result/[resultId]',
            params: {
              resultId:
                notification.action.resultId,
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

      case 'service': {
        if (notification.action.mechanicId) {
          router.push({
            pathname:
              '/workshop-booking/[mechanicId]',
            params: {
              mechanicId:
                notification.action.mechanicId,
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

  if (isLoadingNotifications) {
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
          Loading notifications...
        </Text>
      </SafeAreaView>
    )
  }

  if (notificationsError) {
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
          Unable to load notifications
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
          {notificationsError}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={refreshNotifications}
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

          <Text style={styles.retryButtonText}>
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
              Notifications
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
              Vehicle, service and account updates
            </Text>
          </View>

          {notificationsData &&
          notificationsData.unreadCount > 0 ? (
            <View
              style={[
                styles.unreadBadge,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            >
              <Text style={styles.unreadBadgeText}>
                {
                  notificationsData.unreadCount
                }
              </Text>
            </View>
          ) : null}
        </View>

        {notifications.length === 0 ? (
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
            <View
              style={[
                styles.emptyIcon,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={32}
                color={
                  colors.secondaryText
                }
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No notifications
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
              Vehicle alerts, mechanic responses, service updates and other MechanIQ notifications will appear here.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Recent
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
                  {notifications.length}{' '}
                  {notifications.length === 1
                    ? 'notification'
                    : 'notifications'}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={refreshNotifications}
                accessibilityRole="button"
                accessibilityLabel="Refresh notifications"
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

            <View
              style={styles.notificationsList}
            >
              {notifications.map(
                (notification) => {
                  const icon =
                    getNotificationIcon(
                      notification.category
                    )

                  return (
                    <TouchableOpacity
                      key={notification.id}
                      activeOpacity={0.75}
                      disabled={
                        notification.action ===
                        null
                      }
                      onPress={() =>
                        handleNotificationPress(
                          notification
                        )
                      }
                      style={[
                        styles.notificationCard,
                        {
                          backgroundColor:
                            colors.card,
                          borderColor:
                            notification.isRead
                              ? colors.border
                              : colors.accent,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.notificationIcon,
                          {
                            borderColor:
                              notification.isRead
                                ? colors.border
                                : colors.accent,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={icon}
                          size={23}
                          color={
                            notification.isRead
                              ? colors.secondaryText
                              : colors.accent
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.notificationContent
                        }
                      >
                        <View
                          style={
                            styles.notificationTitleRow
                          }
                        >
                          <Text
                            style={[
                              styles.notificationTitle,
                              {
                                color:
                                  colors.text,
                              },
                            ]}
                          >
                            {
                              notification.title
                            }
                          </Text>

                          {!notification.isRead ? (
                            <View
                              style={[
                                styles.unreadDot,
                                {
                                  backgroundColor:
                                    colors.accent,
                                },
                              ]}
                            />
                          ) : null}
                        </View>

                        <Text
                          style={[
                            styles.notificationMessage,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {
                            notification.message
                          }
                        </Text>

                        <Text
                          style={[
                            styles.notificationTime,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {
                            notification.createdAt
                          }
                        </Text>
                      </View>

                      {notification.action ? (
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
          </>
        )}

        <View
          style={[
            styles.backendNotice,
            {
              borderColor: colors.border,
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
            Notification delivery and read state will be synchronized with the MechanIQ backend. This screen does not simulate mechanic responses or push events locally.
          </Text>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
}

function getNotificationIcon(
  category: CustomerNotificationCategory
):
  | 'car-search'
  | 'gas-station'
  | 'calendar-check-outline'
  | 'shopping-outline'
  | 'account-outline' {
  switch (category) {
    case 'diagnostics':
      return 'car-search'

    case 'fuel':
      return 'gas-station'

    case 'service':
      return 'calendar-check-outline'

    case 'marketplace':
      return 'shopping-outline'

    case 'account':
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

  unreadBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  unreadBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
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

  notificationsList: {
    gap: 10,
  },

  notificationCard: {
    minHeight: 94,
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  notificationIcon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationContent: {
    flex: 1,
    marginHorizontal: 11,
  },

  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notificationTitle: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
  },

  unreadDot: {
    width: 7,
    height: 7,
    marginLeft: 8,
    borderRadius: 4,
  },

  notificationMessage: {
    marginTop: 5,
    fontSize: 9.5,
    lineHeight: 14,
  },

  notificationTime: {
    marginTop: 6,
    fontSize: 8.5,
  },

  emptyCard: {
    minHeight: 230,
    marginTop: 24,
    padding: 24,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderWidth: 1,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '700',
  },

  emptyDescription: {
    marginTop: 7,
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