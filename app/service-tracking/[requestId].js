import { useCallback } from 'react'

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

import {
  SafeAreaView,
} from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'

import {
  auth,
} from '../../src/firebase/firebase'

import {
  MECHANIC_JOB_FILTER_LABELS,
} from '../../src/mechanic/jobsTypes'

import {
  SERVICE_REQUEST_STATUS_LABELS,
} from '../../src/serviceRequests/serviceTrackingTypes'

import {
  useServiceTracking,
} from '../../src/serviceRequests/useServiceTracking'

import {
  useTheme,
} from '../../src/theme/ThemeContext'

const TRAVEL_STATUS_LABELS = {
  'not-required': 'Travel Not Required',
  'not-started': 'Travel Not Started',
  'en-route': 'Mechanic En Route',
  arrived: 'Mechanic Arrived',
}

function getJobStatusLabel(status) {
  if (!status) {
    return 'Not Available'
  }

  if (status === 'cancelled') {
    return 'Cancelled'
  }

  return (
    MECHANIC_JOB_FILTER_LABELS[status] ??
    'Status Unavailable'
  )
}

function getRequestStatusLabel(status) {
  return (
    SERVICE_REQUEST_STATUS_LABELS[status] ??
    'Status Unavailable'
  )
}

function getTravelStatusLabel(status) {
  if (!status) {
    return 'Not Available'
  }

  return (
    TRAVEL_STATUS_LABELS[status] ??
    'Status Unavailable'
  )
}

function formatTimestamp(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

function TrackingInfoRow({
  label,
  value,
  colors,
}) {
  return (
    <View style={styles.infoRow}>
      <Text
        style={[
          styles.infoLabel,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.infoValue,
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

export default function ServiceTrackingScreen() {
  const router = useRouter()

  const {
    colors,
  } = useTheme()

  const params = useLocalSearchParams()

  const requestId = Array.isArray(
    params.requestId
  )
    ? params.requestId[0]
    : params.requestId

  const getIdToken = useCallback(async () => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      return null
    }

    return currentUser.getIdToken()
  }, [])

  const {
    tracking,
    events,
    isLoadingTracking,
    trackingError,
    refreshTracking,
  } = useServiceTracking(
    requestId ?? null,
    {
      getIdToken,
    }
  )

  const hasRequestId =
    typeof requestId === 'string' &&
    requestId.trim().length > 0

  const requestStatus = tracking
    ? getRequestStatusLabel(
        tracking.requestStatus
      )
    : null

  const isRejected =
    tracking?.requestStatus === 'rejected'

  const isCancelled =
    tracking?.requestStatus === 'cancelled'

  const hasJob =
    Boolean(tracking?.jobId)

  // Display the review entry only for a job whose
  // completed state was confirmed by the backend.
  // The review screen independently checks eligibility.
  const canOpenReview =
    Boolean(tracking?.jobId) &&
    tracking?.jobStatus === 'completed' &&
    !isRejected &&
    !isCancelled

  const handleOpenReview = () => {
    if (!canOpenReview || !tracking?.jobId) {
      return
    }

    router.push({
      pathname: '/service-review/[jobId]',
      params: {
        jobId: tracking.jobId,
      },
    })
  }

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
            Track Service
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={refreshTracking}
            disabled={!hasRequestId || isLoadingTracking}
            style={[
              styles.headerButton,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="refresh"
              size={19}
              color={
                isLoadingTracking
                  ? colors.secondaryText
                  : colors.accent
              }
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
          Service Tracking
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          View confirmed updates about your
          mechanic request and service progress.
        </Text>

        {!hasRequestId ? (
          <View
            style={[
              styles.messageCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="clipboard-alert-outline"
              size={40}
              color={colors.secondaryText}
            />

            <Text
              style={[
                styles.messageTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No Request Selected
            </Text>

            <Text
              style={[
                styles.messageDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Select a confirmed mechanic request
              to view its tracking information.
            </Text>
          </View>
        ) : null}

        {hasRequestId &&
        isLoadingTracking &&
        !tracking ? (
          <View style={styles.loadingContainer}>
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
              Loading service tracking...
            </Text>
          </View>
        ) : null}

        {hasRequestId &&
        trackingError &&
        !tracking &&
        !isLoadingTracking ? (
          <View
            style={[
              styles.messageCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="cloud-alert-outline"
              size={42}
              color={colors.danger}
            />

            <Text
              style={[
                styles.messageTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Tracking Unavailable
            </Text>

            <Text
              style={[
                styles.messageDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              {trackingError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={refreshTracking}
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
          </View>
        ) : null}

        {tracking ? (
          <>
            {trackingError ? (
              <View
                style={[
                  styles.warningCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.danger,
                  },
                ]}
              >
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color={colors.danger}
                />

                <Text
                  style={[
                    styles.warningText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Unable to refresh tracking.
                  Showing the last confirmed update.
                  {' '}
                  {trackingError}
                </Text>
              </View>
            ) : null}

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.cardHeading}>
                <MaterialCommunityIcons
                  name="clipboard-check-outline"
                  size={24}
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Request Status
                </Text>
              </View>

              <Text
                style={[
                  styles.statusValue,
                  {
                    color:
                      isRejected || isCancelled
                        ? colors.danger
                        : colors.accent,
                  },
                ]}
              >
                {requestStatus}
              </Text>

              <TrackingInfoRow
                label="Request ID"
                value={tracking.requestId}
                colors={colors}
              />

              {tracking.updatedAt ? (
                <TrackingInfoRow
                  label="Last Updated"
                  value={formatTimestamp(
                    tracking.updatedAt
                  )}
                  colors={colors}
                />
              ) : null}

              {isRejected &&
              tracking.rejectionReason ? (
                <TrackingInfoRow
                  label="Rejection Reason"
                  value={tracking.rejectionReason}
                  colors={colors}
                />
              ) : null}

              {isCancelled &&
              tracking.cancellationReason ? (
                <TrackingInfoRow
                  label="Cancellation Reason"
                  value={tracking.cancellationReason}
                  colors={colors}
                />
              ) : null}
            </View>

            {hasJob ? (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.cardHeading}>
                  <MaterialCommunityIcons
                    name="car-wrench"
                    size={24}
                    color={colors.accent}
                  />

                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Mechanic Job
                  </Text>
                </View>

                <TrackingInfoRow
                  label="Job Status"
                  value={getJobStatusLabel(
                    tracking.jobStatus
                  )}
                  colors={colors}
                />

                {tracking.travelStatus ? (
                  <TrackingInfoRow
                    label="Travel Status"
                    value={getTravelStatusLabel(
                      tracking.travelStatus
                    )}
                    colors={colors}
                  />
                ) : null}

                {tracking.estimatedArrivalAt ? (
                  <TrackingInfoRow
                    label="Estimated Arrival"
                    value={formatTimestamp(
                      tracking.estimatedArrivalAt
                    )}
                    colors={colors}
                  />
                ) : null}

                <TrackingInfoRow
                  label="Location Sharing"
                  value={
                    tracking.locationSharingActive
                      ? 'Active'
                      : 'Not Active'
                  }
                  colors={colors}
                />

                {canOpenReview ? (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityLabel="Leave a review for this completed service"
                    onPress={handleOpenReview}
                    style={[
                      styles.reviewButton,
                      {
                        backgroundColor: colors.accent,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="star-outline"
                      size={20}
                      color="#000000"
                    />

                    <Text style={styles.reviewButtonText}>
                      Leave a Review
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.cardHeading}>
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Service History
                </Text>
              </View>

              {events.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.secondaryText,
                    },
                  ]}
                >
                  No confirmed service updates
                  are available yet.
                </Text>
              ) : (
                events.map((event) => (
                  <View
                    key={event.id}
                    style={[
                      styles.eventRow,
                      {
                        borderBottomColor:
                          colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.eventMarker,
                        {
                          backgroundColor:
                            colors.accent,
                        },
                      ]}
                    />

                    <View style={styles.eventContent}>
                      <Text
                        style={[
                          styles.eventTitle,
                          {
                            color: colors.text,
                          },
                        ]}
                      >
                        {event.eventType}
                      </Text>

                      {event.description ? (
                        <Text
                          style={[
                            styles.eventDescription,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {event.description}
                        </Text>
                      ) : null}

                      <Text
                        style={[
                          styles.eventTime,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {formatTimestamp(
                          event.occurredAt
                        )}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            <Text
              style={[
                styles.disclaimer,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Service progress is based on
              confirmed MechanIQ backend updates.
              Availability of live tracking depends
              on the active service and mechanic.
            </Text>
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

  title: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 12,
    lineHeight: 18,
  },

  loadingContainer: {
    paddingVertical: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 14,
    fontSize: 12,
  },

  messageCard: {
    marginTop: 16,
    padding: 24,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
  },

  messageTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  messageDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },

  retryButton: {
    minHeight: 44,
    marginTop: 22,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },

  warningCard: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },

  warningText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 18,
  },

  card: {
    marginTop: 14,
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
  },

  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },

  reviewButton: {
    minHeight: 46,
    marginTop: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  reviewButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },

  statusValue: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 10,
  },

  infoRow: {
    marginTop: 12,
  },

  infoLabel: {
    fontSize: 10,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 19,
  },

  eventRow: {
    flexDirection: 'row',
    paddingVertical: 13,
    borderBottomWidth: 1,
    gap: 11,
  },

  eventMarker: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 5,
  },

  eventContent: {
    flex: 1,
  },

  eventTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  eventDescription: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  eventTime: {
    fontSize: 10,
    marginTop: 5,
  },

  disclaimer: {
    fontSize: 10,
    lineHeight: 17,
    marginTop: 18,
    textAlign: 'center',
  },
})