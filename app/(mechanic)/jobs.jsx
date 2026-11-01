import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  useMemo,
  useState,
} from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'
import { useForegroundLocation } from '../../src/location/useForegroundLocation'
import { useMechanicJobs } from '../../src/mechanic/MechanicJobsContext'
import {
  MECHANIC_JOB_ACTIONS,
  MECHANIC_JOB_FILTER_LABELS,
  MECHANIC_JOB_FILTERS,
} from '../../src/mechanic/jobsTypes'
import { useTheme } from '../../src/theme/ThemeContext'

const jobFilters = [
  MECHANIC_JOB_FILTERS.PENDING,
  MECHANIC_JOB_FILTERS.ACCEPTED,
  MECHANIC_JOB_FILTERS.IN_PROGRESS,
  MECHANIC_JOB_FILTERS.COMPLETED,
]

export default function MechanicJobs() {
  const { colors } = useTheme()
  const router = useRouter()

  const {
    jobsData,
    isLoadingJobs,
    jobsError,
    refreshJobs,

    activeJobAction,
    jobActionError,
    clearJobActionError,
    performJobAction,
    isJobActionInProgress,
  } = useMechanicJobs()

  const {
    isLoadingLocation,
    locationError,
    refreshLocation,
  } = useForegroundLocation({
    autoLoad: false,
  })

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState(
    MECHANIC_JOB_FILTERS.PENDING
  )

  const filteredJobs = useMemo(() => {
    if (!jobsData?.jobs) {
      return []
    }

    return jobsData.jobs.filter(
      (job) =>
        job.status === selectedFilter
    )
  }, [
    jobsData,
    selectedFilter,
  ])

  function getFilterCount(filter) {
    if (!jobsData) {
      return '--'
    }

    switch (filter) {
      case MECHANIC_JOB_FILTERS.PENDING:
        return jobsData.totalPending

      case MECHANIC_JOB_FILTERS.ACCEPTED:
        return jobsData.totalAccepted

      case MECHANIC_JOB_FILTERS.IN_PROGRESS:
        return jobsData.totalInProgress

      case MECHANIC_JOB_FILTERS.COMPLETED:
        return jobsData.totalCompleted

      default:
        return 0
    }
  }

  async function performConfirmedAction(
    job,
    action
  ) {
    clearJobActionError()

    await performJobAction({
      jobId: job.id,
      action,
    })
  }

  function handleCreateEstimate(job) {
    router.push({
      pathname: '/mechanic-estimate',
      params: {
        jobId: job.id,
      },
    })
  }

  function handleJobAction(
    job,
    action
  ) {
    clearJobActionError()

    switch (action) {
      case MECHANIC_JOB_ACTIONS.ACCEPT:
        Alert.alert(
          'Accept job?',
          'Accept this job and add it to your active work?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Accept Job',
              onPress: () =>
                performConfirmedAction(
                  job,
                  action
                ),
            },
          ]
        )
        return

      case MECHANIC_JOB_ACTIONS.REJECT:
        Alert.alert(
          'Reject job?',
          'Rejecting this job will eventually notify the customer and update the assignment through the MechanIQ backend.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Reject Job',
              style: 'destructive',
              onPress: () =>
                performConfirmedAction(
                  job,
                  action
                ),
            },
          ]
        )
        return

      case MECHANIC_JOB_ACTIONS.START_TRIP:
        Alert.alert(
          'Start trip?',
          'Your current location is required to begin a mobile service trip. Once backend tracking is connected, your permitted travel location can be shared with the customer while you are en route.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Start Trip',
              onPress: async () => {
                clearJobActionError()

                const currentLocation =
                  await refreshLocation()

                if (!currentLocation) {
                  return
                }

                await performJobAction({
                  jobId: job.id,
                  action,
                  mechanicLocation: {
                    latitude:
                      currentLocation.latitude,

                    longitude:
                      currentLocation.longitude,

                    capturedAt:
                      new Date().toISOString(),
                  },
                })
              },
            },
          ]
        )
        return

      case MECHANIC_JOB_ACTIONS.OPEN_MAP: {
        const latitude =
          job.serviceLocation?.latitude

        const longitude =
          job.serviceLocation?.longitude

        const hasCoordinates =
          Number.isFinite(latitude) &&
          Number.isFinite(longitude)

        const address =
          job.serviceLocation?.address
            ?.trim() ?? ''

        if (
          !hasCoordinates &&
          !address
        ) {
          Alert.alert(
            'Location unavailable',
            'A validated service address or coordinates are required before this job can be opened in Maps.'
          )
          return
        }

        const destination =
          hasCoordinates
            ? `${latitude},${longitude}`
            : address

        const mapUrl =
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            destination
          )}`

        Linking.openURL(mapUrl).catch(
          () => {
            Alert.alert(
              'Unable to open Maps',
              'The service location could not be opened on this device.'
            )
          }
        )
        return
      }

      case MECHANIC_JOB_ACTIONS.MARK_ARRIVED:
        Alert.alert(
          'Mark as arrived?',
          'Confirm that you have arrived at the service location.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Mark Arrived',
              onPress: () =>
                performConfirmedAction(
                  job,
                  action
                ),
            },
          ]
        )
        return

      case MECHANIC_JOB_ACTIONS.START_JOB:
        Alert.alert(
          'Start job?',
          'Mark this job as in progress?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Start Job',
              onPress: () =>
                performConfirmedAction(
                  job,
                  action
                ),
            },
          ]
        )
        return

      case MECHANIC_JOB_ACTIONS.COMPLETE_JOB:
        Alert.alert(
          'Complete job?',
          'Job completion will eventually require the authoritative work summary and final service details before the backend marks the job complete.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Complete Job',
              onPress: () =>
                performConfirmedAction(
                  job,
                  action
                ),
            },
          ]
        )
        return

      default:
        return
    }
  }

  const visibleActionError =
    jobActionError ||
    locationError

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
              Jobs
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
              Manage your assigned work
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={refreshJobs}
            accessibilityRole="button"
            accessibilityLabel="Refresh jobs"
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
            styles.filterContainer,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          {jobFilters.map((filter) => {
            const isSelected =
              selectedFilter === filter

            return (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.8}
                onPress={() => {
                  clearJobActionError()
                  setSelectedFilter(filter)
                }}
                style={[
                  styles.filterButton,
                  isSelected && {
                    backgroundColor:
                      colors.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : colors.secondaryText,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {
                    MECHANIC_JOB_FILTER_LABELS[
                      filter
                    ]
                  }
                </Text>

                <View
                  style={[
                    styles.filterCount,
                    {
                      backgroundColor:
                        isSelected
                          ? 'rgba(255,255,255,0.16)'
                          : colors.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterCountText,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : colors.text,
                      },
                    ]}
                  >
                    {getFilterCount(
                      filter
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        {visibleActionError ? (
          <View
            style={[
              styles.actionErrorCard,
              {
                backgroundColor:
                  colors.card,
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
                styles.actionErrorText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {visibleActionError}
            </Text>
          </View>
        ) : null}

        {isLoadingJobs &&
        !jobsData ? (
          <View
            style={
              styles.stateContainer
            }
          >
            <ActivityIndicator
              size="small"
              color={colors.accent}
            />

            <Text
              style={[
                styles.stateText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Loading jobs...
            </Text>
          </View>
        ) : jobsError ? (
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
              size={30}
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
              Jobs unavailable
            </Text>

            <Text
              style={[
                styles.stateText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {jobsError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={refreshJobs}
              style={[
                styles.retryButton,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : !jobsData ? (
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
              name="briefcase-alert-outline"
              size={30}
              color={colors.warning}
            />

            <Text
              style={[
                styles.stateTitle,
                { color: colors.text },
              ]}
            >
              Job information unavailable
            </Text>

            <Text
              style={[
                styles.stateText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Assigned jobs have not been verified.
              Please try refreshing.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={refreshJobs}
              style={[
                styles.retryButton,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredJobs.length ===
          0 ? (
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
              name="briefcase-check-outline"
              size={32}
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
              No{' '}
              {
                MECHANIC_JOB_FILTER_LABELS[
                  selectedFilter
                ]
              }{' '}
              Jobs
            </Text>

            <Text
              style={[
                styles.stateText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Jobs in this status will
              appear here when
              available.
            </Text>
          </View>
        ) : (
          <View
            style={styles.jobsList}
          >
            {filteredJobs.map(
              (job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  colors={colors}
                  isLoadingLocation={
                    isLoadingLocation
                  }
                  hasActiveJobAction={
                    Boolean(activeJobAction)
                  }
                  isJobActionInProgress={
                    isJobActionInProgress
                  }
                  onJobAction={
                    handleJobAction
                  }
                  onCreateEstimate={
                    handleCreateEstimate
                  }
                />
              )
            )}
          </View>
        )}
      </StableScrollView>
    </SafeAreaView>
  )
}

function JobCard({
  job,
  colors,
  isLoadingLocation,
  hasActiveJobAction,
  isJobActionInProgress,
  onJobAction,
  onCreateEstimate,
}) {
  const statusColor =
    getStatusColor(
      job.status,
      colors
    )

  const amountLabel =
    job.estimatedAmount != null &&
    job.currency
      ? `${job.currency} ${job.estimatedAmount.toLocaleString()}`
      : null

  const allowedActions =
    job.allowedActions ?? []

  // A mechanic job transition or location lookup locks all job actions.
  // The context remains the authoritative guard against duplicate requests.
  const areActionsDisabled =
    hasActiveJobAction || isLoadingLocation

  const isMobileJob =
    job.serviceLocationType ===
    'mobile'

  const canCreateEstimate = [
    'pending',
    'accepted',
    'in-progress',
  ].includes(job.status)

  return (
    <View
      style={[
        styles.jobCard,
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
          styles.jobCardHeader
        }
      >
        <View
          style={
            styles.jobTitleContainer
          }
        >
          <Text
            style={[
              styles.jobTitle,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {job.serviceType}
          </Text>

          {job.priority ===
          'urgent' ? (
            <View
              style={[
                styles.urgentBadge,
                {
                  backgroundColor:
                    `${colors.danger}1A`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="alert-outline"
                size={13}
                color={colors.danger}
              />

              <Text
                style={[
                  styles.urgentText,
                  {
                    color:
                      colors.danger,
                  },
                ]}
              >
                Urgent
              </Text>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                `${statusColor}1A`,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  statusColor,
              },
            ]}
          />

          <Text
            style={[
              styles.statusText,
              {
                color: statusColor,
              },
            ]}
          >
            {
              MECHANIC_JOB_FILTER_LABELS[
                job.status
              ] ?? job.status
            }
          </Text>
        </View>
      </View>

      <View
        style={
          styles.vehicleRow
        }
      >
        <View
          style={[
            styles.vehicleIcon,
            {
              backgroundColor:
                `${colors.accent}18`,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="car-outline"
            size={22}
            color={colors.accent}
          />
        </View>

        <View
          style={
            styles.vehicleDetails
          }
        >
          <Text
            style={[
              styles.customerName,
              {
                color: colors.text,
              },
            ]}
          >
            {job.customerName ??
              'Customer'}
          </Text>

          <Text
            style={[
              styles.vehicleLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {job.vehicleLabel ??
              'Vehicle details unavailable'}
          </Text>
        </View>
      </View>

      {job.description ? (
        <Text
          style={[
            styles.description,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {job.description}
        </Text>
      ) : null}

      <View
        style={[
          styles.divider,
          {
            backgroundColor:
              colors.border,
          },
        ]}
      />

      <View
        style={styles.detailsGrid}
      >
        <JobDetail
          icon="calendar-outline"
          label="Date"
          value={
            job.scheduledDate ??
            'Not scheduled'
          }
          colors={colors}
        />

        <JobDetail
          icon="time-outline"
          label="Time"
          value={
            job.scheduledTime ??
            'Not scheduled'
          }
          colors={colors}
        />

        <JobDetail
          icon="location-outline"
          label="Location"
          value={
            job.locationLabel ??
            'Not available'
          }
          colors={colors}
        />

        <JobDetail
          icon="wallet-outline"
          label="Estimate"
          value={
            amountLabel ??
            'Not available'
          }
          colors={colors}
        />
      </View>

      {isMobileJob ? (
        <MobileJobTravelCard
          job={job}
          colors={colors}
        />
      ) : null}

      {allowedActions.length >
        0 ||
      canCreateEstimate ? (
        <View
          style={
            styles.actionsContainer
          }
        >
          {allowedActions.map(
            (action) => {
              const isBusy =
                isJobActionInProgress(
                  job.id,
                  action
                ) ||
                (action ===
                  MECHANIC_JOB_ACTIONS.START_TRIP &&
                  isLoadingLocation)

              return (
                <JobActionButton
                  key={action}
                  action={action}
                  colors={colors}
                  isBusy={isBusy}
                  disabled={
                    areActionsDisabled
                  }
                  onPress={() =>
                    onJobAction(
                      job,
                      action
                    )
                  }
                />
              )
            }
          )}

          {canCreateEstimate ? (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={
                areActionsDisabled
              }
              onPress={() =>
                onCreateEstimate(job)
              }
              style={[
                styles.actionButton,
                {
                  backgroundColor:
                    'transparent',
                  borderColor:
                    colors.accent,
                  opacity:
                    areActionsDisabled
                      ? 0.6
                      : 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={18}
                color={colors.accent}
              />

              <Text
                style={[
                  styles.actionButtonText,
                  {
                    color:
                      colors.accent,
                  },
                ]}
              >
                Create Estimate
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

function MobileJobTravelCard({
  job,
  colors,
}) {
  const travelColor =
    getTravelStatusColor(
      job.travelStatus,
      colors
    )

  const destinationLabel =
    job.serviceLocation?.address ??
    job.serviceLocation?.label ??
    job.locationLabel ??
    'Customer location'

  return (
    <View
      style={[
        styles.travelCard,
        {
          backgroundColor:
            colors.background,
          borderColor:
            colors.border,
        },
      ]}
    >
      <View
        style={
          styles.travelHeader
        }
      >
        <View
          style={[
            styles.travelIcon,
            {
              backgroundColor:
                `${travelColor}18`,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="map-marker-path"
            size={21}
            color={travelColor}
          />
        </View>

        <View
          style={
            styles.travelTitleContainer
          }
        >
          <Text
            style={[
              styles.travelTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Mobile Service
          </Text>

          <Text
            style={[
              styles.travelStatus,
              {
                color: travelColor,
              },
            ]}
          >
            {formatTravelStatus(
              job.travelStatus
            )}
          </Text>
        </View>

        {job.locationSharingActive ? (
          <View
            style={[
              styles.sharingBadge,
              {
                borderColor:
                  colors.success,
              },
            ]}
          >
            <View
              style={[
                styles.sharingDot,
                {
                  backgroundColor:
                    colors.success,
                },
              ]}
            />

            <Text
              style={[
                styles.sharingText,
                {
                  color:
                    colors.success,
                },
              ]}
            >
              Sharing
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={
          styles.travelDestinationRow
        }
      >
        <Ionicons
          name="location-outline"
          size={17}
          color={colors.accent}
        />

        <Text
          style={[
            styles.travelDestination,
            {
              color:
                colors.secondaryText,
            },
          ]}
          numberOfLines={2}
        >
          {destinationLabel}
        </Text>
      </View>

      <View
        style={
          styles.travelMetrics
        }
      >
        <TravelMetric
          label="Distance"
          value={
            job.distanceToServiceKm !=
            null
              ? `${job.distanceToServiceKm} km`
              : 'Pending route'
          }
          colors={colors}
        />

        <TravelMetric
          label="ETA"
          value={
            job.estimatedArrivalAt ??
            'Pending route'
          }
          colors={colors}
        />
      </View>

      {!(
        Number.isFinite(
          job.serviceLocation?.latitude
        ) &&
        Number.isFinite(
          job.serviceLocation?.longitude
        )
      ) ? (
        <Text
          style={[
            styles.routeNotice,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Map, route distance and ETA
          will appear when the backend
          provides a validated service
          location.
        </Text>
      ) : null}
    </View>
  )
}

function TravelMetric({
  label,
  value,
  colors,
}) {
  return (
    <View
      style={styles.travelMetric}
    >
      <Text
        style={[
          styles.travelMetricLabel,
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
          styles.travelMetricValue,
          {
            color: colors.text,
          },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  )
}

function JobActionButton({
  action,
  colors,
  isBusy,
  disabled,
  onPress,
}) {
  const actionDefinition =
    getActionDefinition(
      action,
      colors
    )

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isBusy}
      onPress={onPress}
      style={[
        styles.actionButton,
        {
          backgroundColor:
            actionDefinition
              .isPrimary
              ? actionDefinition.color
              : 'transparent',

          borderColor:
            actionDefinition.color,

          opacity: disabled || isBusy
            ? 0.6
            : 1,
        },
      ]}
    >
      {isBusy ? (
        <ActivityIndicator
          size="small"
          color={
            actionDefinition.isPrimary
              ? '#FFFFFF'
              : actionDefinition.color
          }
        />
      ) : (
        <MaterialCommunityIcons
          name={
            actionDefinition.icon
          }
          size={18}
          color={
            actionDefinition.isPrimary
              ? '#FFFFFF'
              : actionDefinition.color
          }
        />
      )}

      <Text
        style={[
          styles.actionButtonText,
          {
            color:
              actionDefinition.isPrimary
                ? '#FFFFFF'
                : actionDefinition.color,
          },
        ]}
      >
        {actionDefinition.label}
      </Text>
    </TouchableOpacity>
  )
}

function JobDetail({
  icon,
  label,
  value,
  colors,
}) {
  return (
    <View
      style={styles.detailItem}
    >
      <Ionicons
        name={icon}
        size={17}
        color={colors.accent}
      />

      <View
        style={
          styles.detailTextContainer
        }
      >
        <Text
          style={[
            styles.detailLabel,
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
            styles.detailValue,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  )
}

function getActionDefinition(
  action,
  colors
) {
  switch (action) {
    case MECHANIC_JOB_ACTIONS.ACCEPT:
      return {
        label: 'Accept Job',
        icon:
          'check-circle-outline',
        color: colors.accent,
        isPrimary: true,
      }

    case MECHANIC_JOB_ACTIONS.REJECT:
      return {
        label: 'Reject',
        icon:
          'close-circle-outline',
        color: colors.danger,
        isPrimary: false,
      }

    case MECHANIC_JOB_ACTIONS.START_TRIP:
      return {
        label: 'Start Trip',
        icon: 'navigation-variant-outline',
        color: colors.accent,
        isPrimary: true,
      }

    case MECHANIC_JOB_ACTIONS.OPEN_MAP:
      return {
        label: 'Open Map',
        icon: 'map-outline',
        color: colors.accent,
        isPrimary: false,
      }

    case MECHANIC_JOB_ACTIONS.MARK_ARRIVED:
      return {
        label: 'Mark Arrived',
        icon:
          'map-marker-check-outline',
        color: colors.accent,
        isPrimary: true,
      }

    case MECHANIC_JOB_ACTIONS.START_JOB:
      return {
        label: 'Start Job',
        icon: 'play-circle-outline',
        color: colors.accent,
        isPrimary: true,
      }

    case MECHANIC_JOB_ACTIONS.COMPLETE_JOB:
      return {
        label: 'Complete Job',
        icon:
          'check-decagram-outline',
        color: colors.success,
        isPrimary: false,
      }

    default:
      return {
        label: 'Continue',
        icon:
          'arrow-right-circle-outline',
        color: colors.accent,
        isPrimary: false,
      }
  }
}

function getStatusColor(
  status,
  colors
) {
  switch (status) {
    case 'pending':
      return colors.warning

    case 'accepted':
      return colors.accent

    case 'in-progress':
      return colors.highlight

    case 'completed':
      return colors.success

    case 'cancelled':
      return colors.danger

    default:
      return colors.secondaryText
  }
}

function getTravelStatusColor(
  status,
  colors
) {
  switch (status) {
    case 'en-route':
      return colors.accent

    case 'arrived':
      return colors.success

    case 'not-started':
      return colors.warning

    default:
      return colors.secondaryText
  }
}

function formatTravelStatus(status) {
  switch (status) {
    case 'not-started':
      return 'Trip Not Started'

    case 'en-route':
      return 'En Route'

    case 'arrived':
      return 'Arrived'

    case 'not-required':
      return 'Travel Not Required'

    default:
      return 'Travel Status Unavailable'
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
    marginBottom: 20,
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
  },

  refreshButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterContainer: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    marginBottom: 18,
  },

  filterButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 11,
    paddingHorizontal: 4,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    textAlign: 'center',
  },

  filterCount: {
    minWidth: 24,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterCountText: {
    fontSize: 10,
    fontWeight: '800',
  },

  actionErrorCard: {
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  actionErrorText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },

  stateContainer: {
    paddingVertical: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateCard: {
    minHeight: 220,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  stateText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  retryButton: {
    minWidth: 120,
    height: 42,
    marginTop: 18,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  jobsList: {
    gap: 14,
  },

  jobCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  jobCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:
      'space-between',
    gap: 10,
  },

  jobTitleContainer: {
    flex: 1,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  urgentBadge: {
    alignSelf: 'flex-start',
    marginTop: 7,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  urgentText: {
    fontSize: 10,
    fontWeight: '800',
  },

  statusBadge: {
    minHeight: 28,
    borderRadius: 9,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },

  vehicleRow: {
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleDetails: {
    flex: 1,
    marginLeft: 11,
  },

  customerName: {
    fontSize: 13.5,
    fontWeight: '700',
  },

  vehicleLabel: {
    marginTop: 3,
    fontSize: 12,
  },

  description: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    marginVertical: 15,
  },

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
  },

  detailItem: {
    width: '50%',
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailTextContainer: {
    flex: 1,
    marginLeft: 8,
  },

  detailLabel: {
    fontSize: 9.5,
    fontWeight: '600',
  },

  detailValue: {
    marginTop: 2,
    fontSize: 11.5,
    fontWeight: '700',
  },

  travelCard: {
    marginTop: 16,
    padding: 13,
    borderWidth: 1,
    borderRadius: 14,
  },

  travelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  travelIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  travelTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },

  travelTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  travelStatus: {
    marginTop: 2,
    fontSize: 9.5,
    fontWeight: '700',
  },

  sharingBadge: {
    minHeight: 24,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  sharingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  sharingText: {
    fontSize: 8.5,
    fontWeight: '700',
  },

  travelDestinationRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
  },

  travelDestination: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },

  travelMetrics: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 9,
  },

  travelMetric: {
    flex: 1,
  },

  travelMetricLabel: {
    fontSize: 8.5,
    fontWeight: '600',
  },

  travelMetricValue: {
    marginTop: 3,
    fontSize: 10.5,
    fontWeight: '700',
  },

  routeNotice: {
    marginTop: 11,
    fontSize: 9,
    lineHeight: 14,
  },

  actionsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  actionButton: {
    flexGrow: 1,
    minWidth: 130,
    minHeight: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  actionButtonText: {
    fontSize: 11,
    fontWeight: '800',
  },
})