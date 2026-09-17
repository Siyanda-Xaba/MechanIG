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
import { useMechanicSearch } from '../../src/customer/useMechanicSearch'
import { useTheme } from '../../src/theme/ThemeContext'

export default function FindMechanicScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const params = useLocalSearchParams<{
    resultId?: string | string[]
  }>()

  const resultId = Array.isArray(params.resultId)
    ? params.resultId[0]
    : params.resultId

  const {
    mechanicSearchResult,
    isLoadingMechanics,
    mechanicSearchError,
    refreshMechanics,
  } = useMechanicSearch(resultId)

  if (isLoadingMechanics) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor: colors.background,
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
              color: colors.secondaryText,
            },
          ]}
        >
          Finding suitable mechanics...
        </Text>
      </SafeAreaView>
    )
  }

  if (mechanicSearchError) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor: colors.background,
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
            styles.errorTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Unable to find mechanics
        </Text>

        <Text
          style={[
            styles.errorMessage,
            {
              color: colors.secondaryText,
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
              backgroundColor: colors.accent,
            },
          ]}
        >
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

  const mechanics =
    mechanicSearchResult?.mechanics ?? []

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StableScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={[
              styles.headerButton,
              {
                borderColor: colors.border,
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
            Find a Mechanic
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Recommended Mechanics
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Mechanics matched to your diagnostic result and
          service requirements.
        </Text>

        {mechanics.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="account-search-outline"
              size={42}
              color={colors.secondaryText}
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No mechanics found
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              No matching mechanic recommendations are
              available right now.
            </Text>
          </View>
        ) : (
          mechanics.map((mechanic) => {
            const availabilityColor =
              mechanic.availability === 'available'
                ? colors.success
                : mechanic.availability === 'busy'
                  ? colors.warning
                  : colors.secondaryText

            const availabilityLabel =
              mechanic.availability === 'available'
                ? 'Available'
                : mechanic.availability === 'busy'
                  ? 'Busy'
                  : 'Unavailable'

            return (
              <View
                key={mechanic.id}
                style={[
                  styles.mechanicCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Mechanic Header */}
                <View style={styles.mechanicHeader}>
                  <View
                    style={[
                      styles.avatar,
                      {
                        borderColor: colors.accent,
                      },
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={28}
                      color={colors.accent}
                    />
                  </View>

                  <View style={styles.mechanicInfo}>
                    <View style={styles.nameRow}>
                      <Text
                        style={[
                          styles.mechanicName,
                          {
                            color: colors.text,
                          },
                        ]}
                      >
                        {mechanic.name}
                      </Text>

                      {mechanic.verified ? (
                        <MaterialCommunityIcons
                          name="check-decagram"
                          size={17}
                          color={colors.accent}
                        />
                      ) : null}
                    </View>

                    {mechanic.businessName ? (
                      <Text
                        style={[
                          styles.businessName,
                          {
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {mechanic.businessName}
                      </Text>
                    ) : null}

                    <View style={styles.ratingRow}>
                      <Ionicons
                        name="star"
                        size={13}
                        color={colors.warning}
                      />

                      <Text
                        style={[
                          styles.ratingText,
                          {
                            color: colors.text,
                          },
                        ]}
                      >
                        {mechanic.rating ?? '—'}
                      </Text>

                      <Text
                        style={[
                          styles.reviewText,
                          {
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        ({mechanic.reviewCount} reviews)
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.availabilityPill,
                      {
                        borderColor: availabilityColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.availabilityText,
                        {
                          color: availabilityColor,
                        },
                      ]}
                    >
                      {availabilityLabel}
                    </Text>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={18}
                    color={colors.accent}
                  />

                  <View style={styles.detailContent}>
                    <Text
                      style={[
                        styles.detailLabel,
                        {
                          color: colors.secondaryText,
                        },
                      ]}
                    >
                      Location
                    </Text>

                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {mechanic.location.address}
                    </Text>
                  </View>

                  {mechanic.location.distanceKm !== null ? (
                    <Text
                      style={[
                        styles.distanceText,
                        {
                          color: colors.secondaryText,
                        },
                      ]}
                    >
                      {mechanic.location.distanceKm} km
                    </Text>
                  ) : null}
                </View>

                {/* Specialties */}
                <Text
                  style={[
                    styles.sectionLabel,
                    {
                      color: colors.secondaryText,
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
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.specialtyText,
                            {
                              color: colors.text,
                            },
                          ]}
                        >
                          {specialty}
                        </Text>
                      </View>
                    )
                  )}
                </View>

                {/* Service Options */}
                <View style={styles.serviceOptions}>
                  {mechanic.supportsMobileService ? (
                    <View style={styles.serviceItem}>
                      <MaterialCommunityIcons
                        name="car-wrench"
                        size={18}
                        color={colors.accent}
                      />

                      <Text
                        style={[
                          styles.serviceText,
                          {
                            color: colors.text,
                          },
                        ]}
                      >
                        Mobile Service
                      </Text>
                    </View>
                  ) : null}

                  {mechanic.supportsWorkshopBooking ? (
                    <View style={styles.serviceItem}>
                      <MaterialCommunityIcons
                        name="calendar-check-outline"
                        size={18}
                        color={colors.accent}
                      />

                      <Text
                        style={[
                          styles.serviceText,
                          {
                            color: colors.text,
                          },
                        ]}
                      >
                        Workshop Booking
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  {mechanic.supportsMobileService ? (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={[
                        styles.outlineAction,
                        {
                          borderColor: colors.accent,
                        },
                      ]}
                      onPress={() => {
                        router.push({
                          pathname:
                            '/mechanic-request/[mechanicId]',
                          params: {
                            mechanicId: mechanic.id,
                            ...(resultId
                              ? {
                                  resultId,
                                }
                              : {}),
                          },
                        })
                      }}
                    >
                      <MaterialCommunityIcons
                        name="car-wrench"
                        size={18}
                        color={colors.accent}
                      />

                      <Text
                        style={[
                          styles.outlineActionText,
                          {
                            color: colors.accent,
                          },
                        ]}
                      >
                        Request Mechanic
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {mechanic.supportsWorkshopBooking ? (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={[
                        styles.primaryAction,
                        {
                          backgroundColor: colors.accent,
                        },
                      ]}
                      onPress={() => {
                        router.push({
                          pathname:
                            '/workshop-booking/[mechanicId]',
                          params: {
                            mechanicId: mechanic.id,
                            ...(resultId
                              ? {
                                  resultId,
                                }
                              : {}),
                          },
                        })
                      }}
                    >
                      <MaterialCommunityIcons
                        name="calendar-check-outline"
                        size={18}
                        color="#000000"
                      />

                      <Text style={styles.primaryActionText}>
                        Book Service
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )
          })
        )}
      </StableScrollView>
    </SafeAreaView>
  )
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

  retryButton: {
    minHeight: 42,
    marginTop: 20,
    paddingHorizontal: 24,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
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

  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
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

  emptyCard: {
    marginTop: 20,
    minHeight: 180,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },

  mechanicCard: {
    marginTop: 18,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  mechanicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 52,
    height: 52,
    borderWidth: 1.5,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mechanicInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  mechanicName: {
    fontSize: 15,
    fontWeight: '700',
  },

  businessName: {
    marginTop: 3,
    fontSize: 10,
  },

  ratingRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  ratingText: {
    fontSize: 10,
    fontWeight: '700',
  },

  reviewText: {
    fontSize: 9,
  },

  availabilityPill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 7,
  },

  availabilityText: {
    fontSize: 8,
    fontWeight: '700',
  },

  detailRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 8,
  },

  detailValue: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
  },

  distanceText: {
    fontSize: 9,
  },

  sectionLabel: {
    marginTop: 18,
    fontSize: 9,
    fontWeight: '600',
  },

  specialties: {
    marginTop: 8,
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

  serviceOptions: {
    marginTop: 16,
    gap: 8,
  },

  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  serviceText: {
    fontSize: 10,
    fontWeight: '600',
  },

  actions: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 8,
  },

  outlineAction: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  outlineActionText: {
    fontSize: 9,
    fontWeight: '700',
  },

  primaryAction: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 8,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  primaryActionText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '700',
  },
})