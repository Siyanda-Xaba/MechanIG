import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  useEffect,
  useState,
} from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'

import type {
  CustomerNotificationCategoryPreference,
} from '../src/customer/customerNotificationPreferenceTypes'
import type {
  CustomerNotificationCategory,
} from '../src/customer/customerNotificationTypes'
import { useCustomerNotificationPreferences } from '../src/customer/useCustomerNotificationPreferences'
import { useUpdateCustomerNotificationPreferences } from '../src/customer/useUpdateCustomerNotificationPreferences'
import { useTheme } from '../src/theme/ThemeContext'
import { useUser } from '../src/users/UserContext'

type NotificationCategoryDefinition = {
  category: CustomerNotificationCategory
  title: string
  description: string
  icon:
    keyof typeof MaterialCommunityIcons.glyphMap
}

const notificationCategories:
  NotificationCategoryDefinition[] = [
    {
      category: 'diagnostics',
      title: 'Diagnostics',
      description:
        'Vehicle health, diagnostic results, and important diagnostic alerts.',
      icon: 'car-wrench',
    },
    {
      category: 'service',
      title: 'Service & Repairs',
      description:
        'Bookings, mechanic responses, service reminders, and repair updates.',
      icon: 'wrench-outline',
    },
    {
      category: 'fuel',
      title: 'Fuel',
      description:
        'Fuel delivery, scheduled top-ups, and supported fuel-service updates.',
      icon: 'gas-station-outline',
    },
    {
      category: 'marketplace',
      title: 'Marketplace',
      description:
        'Relevant marketplace activity, orders, and supported product updates.',
      icon: 'shopping-outline',
    },
    {
      category: 'account',
      title: 'Account',
      description:
        'Important account, profile, security, and service-related information.',
      icon: 'account-outline',
    },
  ]

function createDefaultDraft():
  CustomerNotificationCategoryPreference[] {
  return notificationCategories.map(
    ({ category }) => ({
      category,
      pushEnabled: false,
      emailEnabled: false,
    })
  )
}

export default function NotificationPreferencesScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    user,
    isLoadingUser,
  } = useUser()

  const {
    notificationPreferences,
    isLoadingNotificationPreferences,
    notificationPreferencesError,
    refreshNotificationPreferences,
  } = useCustomerNotificationPreferences(
    user?.id ?? null
  )

  const {
    isUpdatingNotificationPreferences,
    updateNotificationPreferencesError,
    updateNotificationPreferences,
    clearUpdateNotificationPreferencesError,
  } =
    useUpdateCustomerNotificationPreferences()

  const [
    draftPreferences,
    setDraftPreferences,
  ] = useState<
    CustomerNotificationCategoryPreference[]
  >(createDefaultDraft)

  useEffect(() => {
    if (!notificationPreferences) {
      return
    }

    setDraftPreferences(
      notificationCategories.map(
        ({ category }) => {
          const savedPreference =
            notificationPreferences.categoryPreferences.find(
              (preference) =>
                preference.category ===
                category
            )

          return (
            savedPreference ?? {
              category,
              pushEnabled: false,
              emailEnabled: false,
            }
          )
        }
      )
    )
  }, [notificationPreferences])

  const isLoading =
    isLoadingUser ||
    isLoadingNotificationPreferences

  function updatePreference(
    category:
      CustomerNotificationCategory,
    channel: 'push' | 'email',
    enabled: boolean
  ) {
    clearUpdateNotificationPreferencesError()

    setDraftPreferences(
      (current) =>
        current.map(
          (preference) => {
            if (
              preference.category !==
              category
            ) {
              return preference
            }

            if (channel === 'push') {
              return {
                ...preference,
                pushEnabled: enabled,
              }
            }

            return {
              ...preference,
              emailEnabled: enabled,
            }
          }
        )
    )
  }

  async function handleSave() {
    if (!user) {
      return
    }

    const savedPreferences =
      await updateNotificationPreferences({
        customerId: user.id,
        categoryPreferences:
          draftPreferences,
      })

    if (!savedPreferences) {
      return
    }

    setDraftPreferences(
      savedPreferences.categoryPreferences
    )

    router.back()
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
            disabled={
              isUpdatingNotificationPreferences
            }
            onPress={() =>
              router.back()
            }
            style={[
              styles.backButton,
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
            Notifications
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
          Notification Preferences
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
          Choose how you would like to
          receive different types of
          MechanIQ updates.
        </Text>

        {isLoading ? (
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
            <ActivityIndicator
              size="large"
              color={colors.accent}
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Loading Preferences
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
              Retrieving your saved
              notification settings.
            </Text>
          </View>
        ) : !user ? (
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
            <Ionicons
              name="person-outline"
              size={40}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Customer Unavailable
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
              Your account information
              could not be loaded.
            </Text>
          </View>
        ) : notificationPreferencesError ? (
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
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={colors.warning}
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Preferences Unavailable
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
              {
                notificationPreferencesError
              }
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={
                refreshNotificationPreferences
              }
              style={[
                styles.retryButton,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={18}
                color={colors.text}
              />

              <Text
                style={[
                  styles.retryButtonText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.channelHeader,
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
                  styles.channelHeaderSpacer
                }
              />

              <Text
                style={[
                  styles.channelHeaderText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Push
              </Text>

              <Text
                style={[
                  styles.channelHeaderText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Email
              </Text>
            </View>

            <View
              style={[
                styles.preferencesCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {notificationCategories.map(
                (
                  definition,
                  index
                ) => {
                  const preference =
                    draftPreferences.find(
                      (item) =>
                        item.category ===
                        definition.category
                    )

                  const pushEnabled =
                    preference?.pushEnabled ??
                    false

                  const emailEnabled =
                    preference?.emailEnabled ??
                    false

                  return (
                    <View
                      key={
                        definition.category
                      }
                      style={[
                        styles.preferenceRow,
                        index !==
                        notificationCategories.length -
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
                          styles.preferenceIcon,
                          {
                            borderColor:
                              colors.accent,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={
                            definition.icon
                          }
                          size={21}
                          color={
                            colors.accent
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.preferenceContent
                        }
                      >
                        <Text
                          style={[
                            styles.preferenceTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {
                            definition.title
                          }
                        </Text>

                        <Text
                          style={[
                            styles.preferenceDescription,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {
                            definition.description
                          }
                        </Text>
                      </View>

                      <View
                        style={
                          styles.switchColumn
                        }
                      >
                        <Switch
                          style={
                            styles.compactSwitch
                          }
                          value={
                            pushEnabled
                          }
                          disabled={
                            isUpdatingNotificationPreferences
                          }
                          onValueChange={(
                            value
                          ) =>
                            updatePreference(
                              definition.category,
                              'push',
                              value
                            )
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.switchColumn
                        }
                      >
                        <Switch
                          style={
                            styles.compactSwitch
                          }
                          value={
                            emailEnabled
                          }
                          disabled={
                            isUpdatingNotificationPreferences
                          }
                          onValueChange={(
                            value
                          ) =>
                            updatePreference(
                              definition.category,
                              'email',
                              value
                            )
                          }
                        />
                      </View>
                    </View>
                  )
                }
              )}
            </View>

            {updateNotificationPreferencesError ? (
              <View
                style={[
                  styles.errorCard,
                  {
                    borderColor:
                      colors.danger,
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
                      color:
                        colors.danger,
                    },
                  ]}
                >
                  {
                    updateNotificationPreferencesError
                  }
                </Text>
              </View>
            ) : null}

            <View
              style={[
                styles.noticeCard,
                {
                  borderColor:
                    colors.warning,
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
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                These switches are a
                local draft until the
                backend confirms the
                save. Push delivery
                also requires device
                notification
                permissions, push-token
                registration, and a
                notification provider.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              disabled={
                isUpdatingNotificationPreferences
              }
              onPress={handleSave}
              style={[
                styles.saveButton,
                {
                  backgroundColor:
                    colors.accent,
                  opacity:
                    isUpdatingNotificationPreferences
                      ? 0.6
                      : 1,
                },
              ]}
            >
              {isUpdatingNotificationPreferences ? (
                <ActivityIndicator
                  size="small"
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={20}
                  color="#000000"
                />
              )}

              <Text
                style={
                  styles.saveButtonText
                }
              >
                {isUpdatingNotificationPreferences
                  ? 'Saving...'
                  : 'Save Preferences'}
              </Text>
            </TouchableOpacity>
          </>
        )}
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
    paddingBottom: 36,
  },

  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
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

  stateCard: {
    minHeight: 230,
    marginTop: 18,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  stateDescription: {
    marginTop: 7,
    maxWidth: 310,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  retryButton: {
    minHeight: 42,
    marginTop: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  retryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  channelHeader: {
    minHeight: 40,
    marginTop: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  channelHeaderSpacer: {
    flex: 1,
  },

  channelHeaderText: {
    width: 58,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },

  preferencesCard: {
    borderWidth: 1,
    borderRadius: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 12,
  },

  preferenceRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
  },

  preferenceIcon: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  preferenceContent: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
  },

  preferenceTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  preferenceDescription: {
    marginTop: 4,
    fontSize: 8.5,
    lineHeight: 13,
  },

  switchColumn: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },

  compactSwitch: {
    transform: [
      {
        scaleX: 0.76,
      },
      {
        scaleY: 0.76,
      },
    ],
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
    fontSize: 9.5,
    lineHeight: 14,
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

  saveButton: {
    minHeight: 50,
    marginTop: 18,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  saveButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
})