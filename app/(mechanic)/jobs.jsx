import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'
import { useMechanicJobs } from '../../src/mechanic/MechanicJobsContext'
import {
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

  const {
    jobsData,
    isLoadingJobs,
    jobsError,
    refreshJobs,
  } = useMechanicJobs()

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
      return 0
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
                    {getFilterCount(filter)}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        {isLoadingJobs &&
        !jobsData ? (
          <View
            style={styles.stateContainer}
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
        ) : filteredJobs.length === 0 ? (
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
              No {
                MECHANIC_JOB_FILTER_LABELS[
                  selectedFilter
                ]
              } Jobs
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
              appear here when available.
            </Text>
          </View>
        ) : (
          <View style={styles.jobsList}>
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                colors={colors}
              />
            ))}
          </View>
        )}
      </StableScrollView>
    </SafeAreaView>
  )
}

function JobCard({
  job,
  colors,
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
    </View>
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
})