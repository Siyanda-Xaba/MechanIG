import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { signOutUser } from '../../src/auth/authService'
import ImageSourcePickerModal from '../../src/components/ImageSourcePickerModal'
import ProfileAvatar from '../../src/components/ProfileAvatar'
import StableScrollView from '../../src/components/StableScrollView'
import { useMechanicProfile } from '../../src/mechanic/MechanicProfileContext'
import { MECHANIC_PROFILE_SETTINGS } from '../../src/mechanic/profileService'
import { useTheme } from '../../src/theme/ThemeContext'
import { useProfileImageUpload } from '../../src/users/useProfileImageUpload'
import { useUser } from '../../src/users/UserContext'

export default function MechanicProfile() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    user,
    isLoadingUser,
    setUser,
  } = useUser()

  const {
    profileData,
    isLoadingProfile,
    profileError,
    refreshProfileData,
  } = useMechanicProfile()

  const {
    previewImageUrl,
    isSelectingImage,
    isUploadingProfileImage,
    profileImageError,
    selectAndUploadProfileImage,
    clearProfileImageError,
  } = useProfileImageUpload()

  const [
    isImageSourcePickerVisible,
    setIsImageSourcePickerVisible,
  ] = useState(false)

  const isLoading =
    isLoadingUser ||
    isLoadingProfile

  const isProfileImageBusy =
    isSelectingImage ||
    isUploadingProfileImage

  const fullName = user
    ? `${user.firstName ?? ''} ${
        user.lastName ?? ''
      }`.trim()
    : 'Mechanic'

  const professionalDetails =
    user?.professionalDetails ?? {}

  const verification =
    profileData?.verification ?? null

  const performance =
    profileData?.performance ?? null

  const availability =
    profileData?.availability ?? null

  const settings =
    MECHANIC_PROFILE_SETTINGS

  const recentActivity =
    profileData?.recentActivity ?? null

  function handleProfileImagePress() {
    clearProfileImageError()

    setIsImageSourcePickerVisible(
      true
    )
  }

  async function handleProfileImageSource(
    source
  ) {
    await selectAndUploadProfileImage(
      source
    )

    setIsImageSourcePickerVisible(
      false
    )
  }

  function handleSettingPress(setting) {
    switch (setting.id) {
      case 'personal-information':
        router.push(
          '/personal-information'
        )
        return

      case 'notifications':
        router.push(
          '/notification-preferences'
        )
        return

      case 'security':
        router.push('/security')
        return

      case 'help-support':
        router.push('/help-support')
        return

      case 'business-information':
        Alert.alert(
          'Workshop & Business',
          'Your workshop and professional information is shown on this profile. A dedicated editing screen will be connected to the mechanic profile update backend.'
        )
        return

      case 'availability':
        Alert.alert(
          'Availability',
          'Mechanic availability editing will be connected when the availability backend contract is available.'
        )
        return
    }
  }

  function handleRefreshPress() {
    refreshProfileData()
  }

  function handleSignOutPress() {
    Alert.alert(
      'Sign out?',
      'You can sign back in at any time.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOutUser()

              setUser(null)

              router.replace(
                '/auth/login'
              )
            } catch {
              Alert.alert(
                'Unable to sign out',
                'Please try again.'
              )
            }
          },
        },
      ]
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
        <View style={styles.header}>
          <View>
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
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Manage your mechanic
              account and workshop
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={
              handleRefreshPress
            }
            accessibilityRole="button"
            accessibilityLabel="Refresh mechanic profile"
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
            <Ionicons
              name="refresh-outline"
              size={21}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          {isLoading ? (
            <View
              style={
                styles.loadingContainer
              }
            >
              <ActivityIndicator
                size="small"
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
                Loading profile...
              </Text>
            </View>
          ) : !user ? (
            <View
              style={
                styles.loadingContainer
              }
            >
              <Ionicons
                name="person-outline"
                size={34}
                color={
                  colors.secondaryText
                }
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
                Mechanic profile
                unavailable.
              </Text>
            </View>
          ) : (
            <>
              <View
                style={
                  styles.profileTopRow
                }
              >
                <View
                  style={
                    styles.avatarContainer
                  }
                >
                  <ProfileAvatar
                    imageUrl={
                      previewImageUrl ??
                      user.profileImageUrl
                    }
                    size={66}
                  />

                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={
                      isProfileImageBusy
                    }
                    onPress={
                      handleProfileImagePress
                    }
                    style={[
                      styles.cameraButton,
                      {
                        backgroundColor:
                          colors.accent,
                        borderColor:
                          colors.card,
                      },
                    ]}
                  >
                    {isProfileImageBusy ? (
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />
                    ) : (
                      <Ionicons
                        name="camera"
                        size={14}
                        color="#FFFFFF"
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={
                    styles.profileIdentity
                  }
                >
                  <Text
                    style={[
                      styles.userName,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {fullName ||
                      'Mechanic'}
                  </Text>

                  <Text
                    style={[
                      styles.accountLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Mechanic Account
                  </Text>

                  <VerificationBadge
                    verification={
                      verification
                    }
                    colors={colors}
                  />
                </View>
              </View>

              {profileImageError ? (
                <View
                  style={[
                    styles.imageErrorContainer,
                    {
                      borderColor:
                        colors.danger,
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={17}
                    color={
                      colors.danger
                    }
                  />

                  <Text
                    style={[
                      styles.imageErrorText,
                      {
                        color:
                          colors.danger,
                      },
                    ]}
                  >
                    {
                      profileImageError
                    }
                  </Text>
                </View>
              ) : null}

              <View
                style={
                  styles.contactList
                }
              >
                <ProfileDetailRow
                  icon="mail-outline"
                  value={
                    user.email ??
                    'Email unavailable'
                  }
                  colors={colors}
                />

                <ProfileDetailRow
                  icon="call-outline"
                  value={
                    user.phone ??
                    'Phone unavailable'
                  }
                  colors={colors}
                />

                <ProfileDetailRow
                  icon="storefront-outline"
                  value={
                    user.businessName ??
                    'Workshop name unavailable'
                  }
                  colors={colors}
                />

                <ProfileDetailRow
                  icon="location-outline"
                  value={
                    formatAddress(user)
                  }
                  colors={colors}
                />
              </View>
            </>
          )}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Performance
        </Text>

        <View
          style={styles.summaryGrid}
        >
          <SummaryCard
            icon="star-outline"
            label="Rating"
            value={
              performance?.rating != null
                ? performance.rating.toFixed(
                    1
                  )
                : '—'
            }
            colors={colors}
          />

          <SummaryCard
            icon="check-decagram-outline"
            label="Completed"
            value={
              performance?.completedJobs ??
              '—'
            }
            colors={colors}
          />

          <SummaryCard
            icon="message-star-outline"
            label="Reviews"
            value={
              performance?.reviewCount ??
              '—'
            }
            colors={colors}
            onPress={() =>
              router.push('/mechanic-reviews')
            }
          />
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Verification
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
          <VerificationRow
            label="Identity"
            isVerified={
              verification
                ?.identityVerified ??
              null
            }
            colors={colors}
          />

          <VerificationRow
            label="Trade Certificate"
            isVerified={
              verification
                ?.tradeCertificateVerified ??
              null
            }
            colors={colors}
          />

          <VerificationRow
            label="Business"
            isVerified={
              verification
                ?.businessVerified ??
              null
            }
            colors={colors}
            isLast
          />
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Workshop & Professional
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
          <InformationRow
            icon="storefront-outline"
            label="Business Type"
            value={
              user?.businessType ??
              'Not available'
            }
            colors={colors}
          />

          <InformationRow
            icon="calendar-outline"
            label="Years in Business"
            value={
              user?.yearsInBusiness
                ? `${user.yearsInBusiness} years`
                : 'Not available'
            }
            colors={colors}
          />

          <InformationRow
            icon="construct-outline"
            label="Specialisation"
            value={
              professionalDetails
                .specialisation ??
              'Not available'
            }
            colors={colors}
          />

          <InformationRow
            icon="school-outline"
            label="Qualifications"
            value={
              professionalDetails
                .qualifications ??
              'Not available'
            }
            colors={colors}
          />

          <InformationRow
            icon="map-marker-radius-outline"
            label="Service Area"
            value={
              professionalDetails
                .serviceRadius ??
              'Not available'
            }
            colors={colors}
          />

          <InformationRow
            icon="clock-outline"
            label="Experience"
            value={
              professionalDetails
                .yearsExperience
                ? `${professionalDetails.yearsExperience} years`
                : 'Not available'
            }
            colors={colors}
          />

          <InformationRow
            icon="card-account-details-outline"
            label="Trade / License"
            value={
              professionalDetails
                .licenseNumber ??
              'Not available'
            }
            colors={colors}
          />

          <InformationRow
            icon="file-document-outline"
            label="Business Registration"
            value={
              professionalDetails
                .registrationNumber ??
              'Not available'
            }
            colors={colors}
            isLast
          />
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Availability
        </Text>

        <View
          style={[
            styles.availabilityCard,
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
              styles.availabilityIcon,
              {
                backgroundColor:
                  `${getAvailabilityColor(
                    availability,
                    colors
                  )}18`,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={25}
              color={getAvailabilityColor(
                availability,
                colors
              )}
            />
          </View>

          <View
            style={
              styles.availabilityContent
            }
          >
            <Text
              style={[
                styles.availabilityTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {formatAvailabilityStatus(
                availability?.status
              )}
            </Text>

            <Text
              style={[
                styles.availabilityDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {availability?.serviceRadiusLabel ??
                (availability?.status ===
                'not-configured'
                  ? 'Availability preferences have not been configured.'
                  : availability
                    ? 'Service radius unavailable.'
                    : 'Verified availability preferences are unavailable.')}
            </Text>
          </View>
        </View>

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
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          {settings.map(
            (setting, index) => (
              <TouchableOpacity
                key={setting.id}
                activeOpacity={0.75}
                onPress={() =>
                  handleSettingPress(
                    setting
                  )
                }
                style={[
                  styles.settingRow,
                  index !==
                  settings.length - 1
                    ? {
                        borderBottomWidth:
                          1,
                        borderBottomColor:
                          colors.border,
                      }
                    : null,
                ]}
              >
                <View
                  style={[
                    styles.settingIcon,
                    {
                      borderColor:
                        colors.accent,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getSettingIcon(
                      setting.id
                    )}
                    size={21}
                    color={
                      colors.accent
                    }
                  />
                </View>

                <View
                  style={
                    styles.settingContent
                  }
                >
                  <Text
                    style={[
                      styles.settingTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {setting.title}
                  </Text>

                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    {
                      setting.description
                    }
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
            )
          )}
        </View>

        <View
          style={
            styles.sectionHeader
          }
        >
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
        </View>

        <View
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
          {recentActivity === null ? (
            <View style={styles.emptyActivity}>
              <MaterialCommunityIcons
                name="history"
                size={28}
                color={colors.secondaryText}
              />
              <Text
                style={[
                  styles.emptyActivityText,
                  { color: colors.secondaryText },
                ]}
              >
                Recent profile activity is unavailable.
              </Text>
            </View>
          ) : recentActivity.length ===
          0 ? (
            <View
              style={
                styles.emptyActivity
              }
            >
              <MaterialCommunityIcons
                name="history"
                size={28}
                color={
                  colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.emptyActivityText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                No recent profile
                activity.
              </Text>
            </View>
          ) : (
            recentActivity.map(
              (activity, index) => (
                <View
                  key={activity.id}
                  style={[
                    styles.activityRow,
                    index !==
                    recentActivity.length -
                      1
                      ? {
                          borderBottomWidth:
                            1,
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
                      size={20}
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
                        styles.activityTitle,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {activity.title}
                    </Text>

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
                  </View>

                  <Text
                    style={[
                      styles.activityTime,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    {activity.occurredAt ??
                      ''}
                  </Text>
                </View>
              )
            )
          )}
        </View>

        {profileError ? (
          <View
            style={[
              styles.errorContainer,
              {
                borderColor:
                  colors.danger,
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
                  color:
                    colors.danger,
                },
              ]}
            >
              {profileError}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            handleSignOutPress
          }
          style={[
            styles.signOutButton,
            {
              borderColor:
                colors.danger,
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
                color:
                  colors.danger,
              },
            ]}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </StableScrollView>

      <ImageSourcePickerModal
        visible={
          isImageSourcePickerVisible
        }
        isBusy={
          isProfileImageBusy
        }
        title="Change Profile Photo"
        description="Take a new profile photo or choose an existing image from your device."
        onCameraPress={() =>
          handleProfileImageSource(
            'camera'
          )
        }
        onLibraryPress={() =>
          handleProfileImageSource(
            'library'
          )
        }
        onClose={() => {
          if (!isProfileImageBusy) {
            setIsImageSourcePickerVisible(
              false
            )
          }
        }}
      />
    </SafeAreaView>
  )
}

function ProfileDetailRow({
  icon,
  value,
  colors,
}) {
  return (
    <View
      style={styles.contactRow}
    >
      <Ionicons
        name={icon}
        size={17}
        color={colors.accent}
      />

      <Text
        style={[
          styles.contactText,
          {
            color:
              colors.secondaryText,
          },
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  colors,
  onPress,
}) {
  const CardContainer = onPress
    ? TouchableOpacity
    : View

  return (
    <CardContainer
      {...(onPress
        ? {
            activeOpacity: 0.75,
            onPress,
            accessibilityRole: 'button',
            accessibilityLabel: 'View customer reviews',
          }
        : {})}
      style={[
        styles.summaryCard,
        {
          backgroundColor:
            colors.card,
          borderColor:
            colors.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={21}
        color={colors.accent}
      />

      <Text
        style={[
          styles.summaryValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.summaryLabel,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        {label}
      </Text>
      {onPress ? (
        <Ionicons
          name="chevron-forward"
          size={13}
          color={colors.secondaryText}
          style={styles.summaryCardChevron}
        />
      ) : null}
    </CardContainer>
  )
}

function VerificationBadge({
  verification,
  colors,
}) {
  const status =
    verification?.status ?? null

  const color =
    status === 'verified'
      ? colors.success
      : status === 'pending'
        ? colors.warning
        : status === 'rejected'
          ? colors.danger
          : colors.secondaryText

  return (
    <View
      style={[
        styles.verificationBadge,
        {
          borderColor: color,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={
          status === 'verified'
            ? 'check-decagram'
            : 'shield-outline'
        }
        size={13}
        color={color}
      />

      <Text
        style={[
          styles.verificationBadgeText,
          {
            color,
          },
        ]}
      >
        {status
          ? formatVerificationStatus(status)
          : 'Status unavailable'}
      </Text>
    </View>
  )
}

function VerificationRow({
  label,
  isVerified,
  colors,
  isLast = false,
}) {
  const color = isVerified === true
    ? colors.success
    : colors.secondaryText

  return (
    <View
      style={[
        styles.verificationRow,
        !isLast
          ? {
              borderBottomWidth: 1,
              borderBottomColor:
                colors.border,
            }
          : null,
      ]}
    >
      <MaterialCommunityIcons
        name={
          isVerified === true
            ? 'check-circle-outline'
            : isVerified === false
              ? 'clock-outline'
              : 'help-circle-outline'
        }
        size={21}
        color={color}
      />

      <Text
        style={[
          styles.verificationLabel,
          {
            color: colors.text,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.verificationState,
          {
            color,
          },
        ]}
      >
        {isVerified === true
          ? 'Verified'
          : isVerified === false
            ? 'Not verified'
            : 'Unavailable'}
      </Text>
    </View>
  )
}

function InformationRow({
  icon,
  label,
  value,
  colors,
  isLast = false,
}) {
  return (
    <View
      style={[
        styles.informationRow,
        !isLast
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
          styles.informationIcon,
          {
            backgroundColor:
              `${colors.accent}18`,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={19}
          color={colors.accent}
        />
      </View>

      <View
        style={
          styles.informationContent
        }
      >
        <Text
          style={[
            styles.informationLabel,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.informationValue,
            {
              color: colors.text,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  )
}

function formatVerificationStatus(
  status
) {
  switch (status) {
    case 'verified':
      return 'Verified'

    case 'pending':
      return 'Verification Pending'

    case 'rejected':
      return 'Verification Rejected'

    default:
      return 'Not Verified'
  }
}

function formatAvailabilityStatus(
  status
) {
  switch (status) {
    case 'available':
      return 'Available'

    case 'busy':
      return 'Busy'

    case 'unavailable':
      return 'Unavailable'

    case 'not-configured':
      return 'Not Configured'

    default:
      return 'Status unavailable'
  }
}

function getAvailabilityColor(
  availability,
  colors
) {
  switch (availability?.status) {
    case 'available':
      return colors.success

    case 'busy':
      return colors.warning

    case 'unavailable':
      return colors.danger

    default:
      return colors.secondaryText
  }
}

function formatAddress(user) {
  const addressParts = [
    user?.address,
    user?.city,
    user?.province,
  ].filter(Boolean)

  return addressParts.length
    ? addressParts.join(', ')
    : 'Workshop address unavailable'
}

function getSettingIcon(id) {
  switch (id) {
    case 'personal-information':
      return 'account-outline'

    case 'business-information':
      return 'storefront-outline'

    case 'availability':
      return 'calendar-clock-outline'

    case 'notifications':
      return 'bell-outline'

    case 'security':
      return 'shield-lock-outline'

    case 'help-support':
      return 'help-circle-outline'

    default:
      return 'cog-outline'
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
    paddingBottom: 120,
  },

  header: {
    marginTop: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },

  refreshButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  loadingContainer: {
    minHeight: 150,
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
    width: 29,
    height: 29,
    borderRadius: 15,
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
    fontWeight: '800',
  },

  accountLabel: {
    marginTop: 4,
    fontSize: 11,
  },

  verificationBadge: {
    alignSelf: 'flex-start',
    minHeight: 24,
    marginTop: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  verificationBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },

  imageErrorContainer: {
    marginTop: 13,
    minHeight: 44,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  imageErrorText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
  },

  contactList: {
    marginTop: 17,
    gap: 11,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  contactText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },

  sectionTitle: {
    marginTop: 19,
    marginBottom: 9,
    fontSize: 15,
    fontWeight: '700',
  },

  summaryGrid: {
    flexDirection: 'row',
    gap: 9,
  },

  summaryCard: {
    flex: 1,
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
  },

  summaryLabel: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },

  summaryCardChevron: {
    position: 'absolute',
    right: 6,
    top: 8,
  },

  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
  },

  verificationRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },

  verificationLabel: {
    flex: 1,
    marginLeft: 11,
    fontSize: 11.5,
    fontWeight: '600',
  },

  verificationState: {
    fontSize: 9.5,
    fontWeight: '700',
  },

  informationRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
  },

  informationIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  informationContent: {
    flex: 1,
    marginLeft: 11,
  },

  informationLabel: {
    fontSize: 9.5,
    fontWeight: '600',
  },

  informationValue: {
    marginTop: 3,
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 16,
  },

  availabilityCard: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  availabilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  availabilityContent: {
    flex: 1,
    marginLeft: 13,
  },

  availabilityTitle: {
    fontSize: 13,
    fontWeight: '700',
  },

  availabilityDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
  },

  settingsCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 13,
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
    marginTop: 19,
    marginBottom: 9,
  },

  sectionTitleInline: {
    fontSize: 15,
    fontWeight: '700',
  },

  activityCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 13,
  },

  emptyActivity: {
    minHeight: 105,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  emptyActivityText: {
    fontSize: 10,
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
    marginLeft: 11,
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

  activityTime: {
    maxWidth: 80,
    marginLeft: 8,
    fontSize: 9,
    textAlign: 'right',
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