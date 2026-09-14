import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import ProfileAvatar from '../../src/components/ProfileAvatar'
import { useCustomerProfile } from '../../src/customer/CustomerProfileContext'
import {
  CustomerProfileActivity,
  CustomerProfileActivityType,
  CustomerProfileQuickAction,
  CustomerProfileQuickActionId,
  CustomerProfileSetting,
  CustomerProfileSettingId,
} from '../../src/customer/customerProfileTypes'
import { useTheme } from '../../src/theme/ThemeContext'
import { useUser } from '../../src/users/UserContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function CustomerProfile() {
  const { colors } = useTheme()

  const {
    user,
    isLoadingUser,
  } = useUser()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    profileData,
    isLoadingProfile,
    profileError,
  } = useCustomerProfile()

  const isLoading =
    isLoadingUser ||
    isLoadingVehicles ||
    isLoadingProfile

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Driver'

  const quickActions =
    profileData?.quickActions ?? []

  const settings =
    profileData?.settings ?? []

  const recentActivity =
    profileData?.recentActivity ?? []

  function handleProfileImagePress() {
    // Profile image camera/gallery selection
    // will be implemented here.
    //
    // Profile is intentionally the only screen
    // allowed to change profileImageUrl.
  }

  function handleVehiclePress() {
    // Vehicle details / vehicle-management flow
    // will be connected here.
  }

  function handleQuickActionPress(
    action: CustomerProfileQuickAction
  ) {
    switch (action.id) {
      case 'vehicle-details':
        handleVehiclePress()
        return

      case 'service-history':
        // Service history flow
        return

      case 'saved-addresses':
        // Saved addresses flow
        return

      case 'payment-methods':
        // Payment methods flow
        return
    }
  }

  function handleSettingPress(
    setting: CustomerProfileSetting
  ) {
    switch (setting.id) {
      case 'personal-information':
        // Personal information editor
        return

      case 'notifications':
        // Notification preferences
        return

      case 'security':
        // Security settings
        return

      case 'help-support':
        // Help and support flow
        return
    }
  }

  function handleActivityPress(
    activity: CustomerProfileActivity
  ) {
    switch (activity.type) {
      case 'profile-updated':
        // Profile activity detail
        return

      case 'service-booking-confirmed':
        // Service booking detail
        return
    }
  }

  function handleSignOutPress() {
    // Authentication is owned by the shared auth flow.
    // The real sign-out service/action will plug in here
    // when teammate auth integration is available.
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Profile
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Manage your account, vehicles, and preferences.
        </Text>

        {/* Main Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="small"
                color={colors.accent}
              />

              <Text
                style={[
                  styles.loadingText,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                Loading profile...
              </Text>
            </View>
          ) : !user ? (
            <View style={styles.loadingContainer}>
              <Ionicons
                name="person-outline"
                size={34}
                color={colors.secondaryText}
              />

              <Text
                style={[
                  styles.loadingText,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                Profile information is unavailable.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.profileTopRow}>
                <View style={styles.avatarContainer}>
                  <ProfileAvatar
                    imageUrl={user.profileImageUrl}
                    size={74}
                  />

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={handleProfileImagePress}
                    style={[
                      styles.cameraButton,
                      {
                        backgroundColor: colors.accent,
                        borderColor: colors.card,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="camera"
                      size={14}
                      color="#000000"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.profileIdentity}>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.userName,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {fullName}
                  </Text>

                  <View style={styles.accountRow}>
                    <Text
                      style={[
                        styles.accountLabel,
                        {
                          color: colors.secondaryText,
                        },
                      ]}
                    >
                      {profileData?.accountLabel ??
                        'Driver Account'}
                    </Text>

                    {profileData?.isVerified ? (
                      <View
                        style={[
                          styles.verifiedBadge,
                          {
                            borderColor: colors.accent,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={12}
                          color={colors.accent}
                        />

                        <Text
                          style={[
                            styles.verifiedText,
                            {
                              color: colors.accent,
                            },
                          ]}
                        >
                          Verified
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={styles.contactList}>
                <View style={styles.contactRow}>
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color={colors.accent}
                  />

                  <Text
                    style={[
                      styles.contactText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {user.phone}
                  </Text>
                </View>

                <View style={styles.contactRow}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={colors.accent}
                  />

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.contactText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {user.email}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: colors.border,
                  },
                ]}
              />

              {selectedVehicle ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={handleVehiclePress}
                  style={styles.vehicleRow}
                >
                  <View
                    style={[
                      styles.vehicleImagePlaceholder,
                      {
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="car-side"
                      size={48}
                      color={colors.accent}
                    />
                  </View>

                  <View style={styles.vehicleIdentity}>
                    <Text
                      numberOfLines={1}
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

                    <View
                      style={[
                        styles.registrationBadge,
                        {
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.registration,
                          {
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {selectedVehicle.registration}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.vehicleDivider,
                      {
                        backgroundColor: colors.border,
                      },
                    ]}
                  />

                  <View style={styles.primaryVehicleInfo}>
                    <View
                      style={[
                        styles.primaryVehicleIcon,
                        {
                          borderColor: colors.accent,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="car-outline"
                        size={19}
                        color={colors.accent}
                      />
                    </View>

                    <View style={styles.primaryVehicleText}>
                      <Text
                        style={[
                          styles.primaryVehicleLabel,
                          {
                            color: colors.text,
                          },
                        ]}
                      >
                        {selectedVehicle.isPrimary
                          ? 'Primary Vehicle'
                          : 'Selected Vehicle'}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={[
                          styles.primaryVehicleDetails,
                          {
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {selectedVehicle.fuelType} •{' '}
                        {selectedVehicle.year}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={handleVehiclePress}
                  style={styles.noVehicleRow}
                >
                  <MaterialCommunityIcons
                    name="car-outline"
                    size={24}
                    color={colors.accent}
                  />

                  <Text
                    style={[
                      styles.noVehicleText,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    No vehicle selected
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.75}
              onPress={() =>
                handleQuickActionPress(action)
              }
              style={[
                styles.quickActionCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={getQuickActionIcon(action.id)}
                size={25}
                color={colors.accent}
              />

              <View style={styles.quickActionBottom}>
                <Text
                  style={[
                    styles.quickActionTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {action.title}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.secondaryText}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Settings */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Account Settings
        </Text>

        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {settings.map((setting, index) => (
            <TouchableOpacity
              key={setting.id}
              activeOpacity={0.75}
              onPress={() =>
                handleSettingPress(setting)
              }
              style={[
                styles.settingRow,
                index !== settings.length - 1
                  ? {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }
                  : null,
              ]}
            >
              <View
                style={[
                  styles.settingIcon,
                  {
                    borderColor: colors.accent,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={getSettingIcon(setting.id)}
                  size={22}
                  color={colors.accent}
                />
              </View>

              <View style={styles.settingContent}>
                <Text
                  style={[
                    styles.settingTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {setting.title}
                </Text>

                <Text
                  style={[
                    styles.settingDescription,
                    {
                      color: colors.secondaryText,
                    },
                  ]}
                >
                  {setting.description}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitleInline,
              {
                color: colors.text,
              },
            ]}
          >
            Recent Activity
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              // Full customer account activity
              // will be connected later.
            }}
          >
            <Text
              style={[
                styles.viewAll,
                {
                  color: colors.accent,
                },
              ]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.activityCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {recentActivity.length === 0 ? (
            <View style={styles.emptyActivity}>
              <MaterialCommunityIcons
                name="history"
                size={28}
                color={colors.secondaryText}
              />

              <Text
                style={[
                  styles.emptyActivityText,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                No recent profile activity.
              </Text>
            </View>
          ) : (
            recentActivity.map((activity, index) => (
              <TouchableOpacity
                key={activity.id}
                activeOpacity={0.75}
                onPress={() =>
                  handleActivityPress(activity)
                }
                style={[
                  styles.activityRow,
                  index !==
                  recentActivity.length - 1
                    ? {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      }
                    : null,
                ]}
              >
                <View
                  style={[
                    styles.activityIcon,
                    {
                      borderColor: colors.accent,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getActivityIcon(
                      activity.type
                    )}
                    size={21}
                    color={colors.accent}
                  />
                </View>

                <View style={styles.activityContent}>
                  <Text
                    style={[
                      styles.activityTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {activity.title}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={[
                      styles.activityDescription,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {activity.description}
                  </Text>
                </View>

                <View style={styles.activityRight}>
                  <Text
                    style={[
                      styles.activityTime,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {activity.occurredAt}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={colors.secondaryText}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Error */}
        {profileError ? (
          <View
            style={[
              styles.errorContainer,
              {
                borderColor: colors.danger,
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.danger}
            />

            <Text
              style={[
                styles.errorText,
                {
                  color: colors.danger,
                },
              ]}
            >
              {profileError}
            </Text>
          </View>
        ) : null}

        {/* Sign Out */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleSignOutPress}
          style={[
            styles.signOutButton,
            {
              borderColor: colors.danger,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="logout"
            size={22}
            color={colors.danger}
          />

          <Text
            style={[
              styles.signOutText,
              {
                color: colors.danger,
              },
            ]}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function getQuickActionIcon(
  id: CustomerProfileQuickActionId
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (id) {
    case 'vehicle-details':
      return 'car-wrench'

    case 'service-history':
      return 'history'

    case 'saved-addresses':
      return 'map-marker-outline'

    case 'payment-methods':
      return 'credit-card-outline'
  }
}

function getSettingIcon(
  id: CustomerProfileSettingId
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (id) {
    case 'personal-information':
      return 'account-outline'

    case 'notifications':
      return 'bell-outline'

    case 'security':
      return 'shield-lock-outline'

    case 'help-support':
      return 'help-circle-outline'
  }
}

function getActivityIcon(
  type: CustomerProfileActivityType
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (type) {
    case 'profile-updated':
      return 'account-outline'

    case 'service-booking-confirmed':
      return 'wrench-outline'
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

  profileCard: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },

  loadingContainer: {
    minHeight: 170,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  loadingText: {
    fontSize: 11,
    textAlign: 'center',
  },

  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarContainer: {
    position: 'relative',
  },

  cameraButton: {
    position: 'absolute',
    right: -3,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileIdentity: {
    flex: 1,
    marginLeft: 14,
  },

  userName: {
    fontSize: 18,
    fontWeight: '700',
  },

  accountRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
  },

  accountLabel: {
    fontSize: 11,
  },

  verifiedBadge: {
    minHeight: 22,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
  },

  contactList: {
    marginTop: 16,
    gap: 10,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  contactText: {
    flex: 1,
    fontSize: 11,
  },

  divider: {
    height: 1,
    marginTop: 16,
    marginBottom: 12,
  },

  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
  },

  vehicleImagePlaceholder: {
    width: 82,
    height: 58,
    borderWidth: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleIdentity: {
    width: 98,
    marginLeft: 10,
  },

  vehicleName: {
    fontSize: 14,
    fontWeight: '700',
  },

  registrationBadge: {
    alignSelf: 'flex-start',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  registration: {
    fontSize: 9,
  },

  vehicleDivider: {
    width: 1,
    height: 46,
    marginHorizontal: 10,
  },

  primaryVehicleInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  primaryVehicleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryVehicleText: {
    flex: 1,
    marginLeft: 8,
  },

  primaryVehicleLabel: {
    fontSize: 10,
    fontWeight: '600',
  },

  primaryVehicleDetails: {
    marginTop: 2,
    fontSize: 9,
  },

  noVehicleRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  noVehicleText: {
    flex: 1,
    fontSize: 11,
  },

  quickActionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },

  quickActionCard: {
    flex: 1,
    minHeight: 98,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },

  quickActionBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },

  quickActionTitle: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '700',
  },

  settingsCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  settingRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  settingTitle: {
    fontSize: 12,
    fontWeight: '600',
  },

  settingDescription: {
    marginTop: 3,
    fontSize: 9.5,
    lineHeight: 13,
  },

  sectionHeader: {
    marginTop: 18,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitleInline: {
    fontSize: 15,
    fontWeight: '700',
  },

  viewAll: {
    fontSize: 11,
    fontWeight: '600',
  },

  activityCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  activityRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activityIcon: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityContent: {
    flex: 1,
    marginLeft: 12,
  },

  activityTitle: {
    fontSize: 11.5,
    fontWeight: '600',
  },

  activityDescription: {
    marginTop: 3,
    fontSize: 9.5,
    lineHeight: 13,
  },

  activityRight: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  activityTime: {
    maxWidth: 86,
    fontSize: 9,
    textAlign: 'right',
  },

  emptyActivity: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  emptyActivityText: {
    fontSize: 10,
  },

  errorContainer: {
    marginTop: 14,
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 10,
  },

  signOutButton: {
    minHeight: 48,
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  signOutText: {
    fontSize: 13,
    fontWeight: '600',
  },
})