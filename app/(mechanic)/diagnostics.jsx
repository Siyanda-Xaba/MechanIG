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
import { useMechanicDiagnostics } from '../../src/mechanic/MechanicDiagnosticsContext'
import {
  MECHANIC_DIAGNOSTIC_STATUS_LABELS,
  MECHANIC_DIAGNOSTIC_STATUSES,
} from '../../src/mechanic/diagnosticsTypes'
import { useTheme } from '../../src/theme/ThemeContext'

const diagnosticFilters = [
  MECHANIC_DIAGNOSTIC_STATUSES.PENDING_REVIEW,
  MECHANIC_DIAGNOSTIC_STATUSES.IN_REVIEW,
  MECHANIC_DIAGNOSTIC_STATUSES.COMPLETED,
]

export default function MechanicDiagnostics() {
  const { colors } = useTheme()

  const {
    diagnosticsData,
    isLoadingDiagnostics,
    diagnosticsError,
    refreshDiagnostics,
  } = useMechanicDiagnostics()

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState(
    MECHANIC_DIAGNOSTIC_STATUSES.PENDING_REVIEW
  )

  const filteredDiagnostics = useMemo(() => {
    if (!diagnosticsData?.diagnostics) {
      return []
    }

    return diagnosticsData.diagnostics.filter(
      (diagnostic) =>
        diagnostic.status === selectedFilter
    )
  }, [
    diagnosticsData,
    selectedFilter,
  ])

  function getFilterCount(filter) {
    if (!diagnosticsData) {
      return 0
    }

    switch (filter) {
      case MECHANIC_DIAGNOSTIC_STATUSES.PENDING_REVIEW:
        return diagnosticsData.totalPendingReview

      case MECHANIC_DIAGNOSTIC_STATUSES.IN_REVIEW:
        return diagnosticsData.totalInReview

      case MECHANIC_DIAGNOSTIC_STATUSES.COMPLETED:
        return diagnosticsData.totalCompleted

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
              Diagnostics
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
              Review assigned vehicle diagnostics
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={refreshDiagnostics}
            accessibilityRole="button"
            accessibilityLabel="Refresh diagnostics"
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
          {diagnosticFilters.map(
            (filter) => {
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
                      MECHANIC_DIAGNOSTIC_STATUS_LABELS[
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
            }
          )}
        </View>

        <View
          style={[
            styles.obdNotice,
            {
              backgroundColor:
                `${colors.accent}12`,
              borderColor:
                `${colors.accent}45`,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="car-connected"
            size={22}
            color={colors.accent}
          />

          <View style={styles.obdNoticeText}>
            <Text
              style={[
                styles.obdNoticeTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Authoritative vehicle data only
            </Text>

            <Text
              style={[
                styles.obdNoticeDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Sensor readings and diagnostic codes
              appear only when supplied by an
              authoritative OBD or backend source.
            </Text>
          </View>
        </View>

        {isLoadingDiagnostics &&
        !diagnosticsData ? (
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
              Loading diagnostics...
            </Text>
          </View>
        ) : diagnosticsError ? (
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
              Diagnostics unavailable
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
              {diagnosticsError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={refreshDiagnostics}
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
        ) : filteredDiagnostics.length ===
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
              name="engine-off-outline"
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
                MECHANIC_DIAGNOSTIC_STATUS_LABELS[
                  selectedFilter
                ]
              }{' '}
              Diagnostics
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
              Diagnostic records in this status
              will appear here when assigned.
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.diagnosticsList
            }
          >
            {filteredDiagnostics.map(
              (diagnostic) => (
                <DiagnosticCard
                  key={diagnostic.id}
                  diagnostic={diagnostic}
                  colors={colors}
                />
              )
            )}
          </View>
        )}
      </StableScrollView>
    </SafeAreaView>
  )
}

function DiagnosticCard({
  diagnostic,
  colors,
}) {
  const severityColor =
    getSeverityColor(
      diagnostic.severity,
      colors
    )

  const statusColor =
    getStatusColor(
      diagnostic.status,
      colors
    )

  return (
    <View
      style={[
        styles.diagnosticCard,
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
          styles.cardHeader
        }
      >
        <View
          style={
            styles.cardTitleContainer
          }
        >
          <Text
            style={[
              styles.vehicleTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {diagnostic.vehicleLabel ??
              'Vehicle'}
          </Text>

          <Text
            style={[
              styles.customerName,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {diagnostic.customerName ??
              'Customer'}
          </Text>
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
              MECHANIC_DIAGNOSTIC_STATUS_LABELS[
                diagnostic.status
              ] ?? diagnostic.status
            }
          </Text>
        </View>
      </View>

      <View
        style={styles.metaRow}
      >
        <View
          style={[
            styles.severityBadge,
            {
              backgroundColor:
                `${severityColor}16`,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getSeverityIcon(
              diagnostic.severity
            )}
            size={14}
            color={severityColor}
          />

          <Text
            style={[
              styles.severityText,
              {
                color:
                  severityColor,
              },
            ]}
          >
            {formatSeverity(
              diagnostic.severity
            )}
          </Text>
        </View>

        <View
          style={[
            styles.sourceBadge,
            {
              backgroundColor:
                colors.background,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={getSourceIcon(
              diagnostic.source
            )}
            size={14}
            color={
              colors.secondaryText
            }
          />

          <Text
            style={[
              styles.sourceText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {formatSource(
              diagnostic.source
            )}
          </Text>
        </View>
      </View>

      <View
        style={styles.issueSection}
      >
        <Text
          style={[
            styles.sectionLabel,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Reported Issue
        </Text>

        <Text
          style={[
            styles.issueText,
            {
              color: colors.text,
            },
          ]}
        >
          {diagnostic.reportedIssue ??
            'No issue description available.'}
        </Text>
      </View>

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
        style={styles.dataRow}
      >
        <DiagnosticDataSummary
          icon="gauge"
          label="Readings"
          value={
            diagnostic.readings.length > 0
              ? `${diagnostic.readings.length} available`
              : 'No authoritative readings'
          }
          available={
            diagnostic.readings.length > 0
          }
          colors={colors}
        />

        <DiagnosticDataSummary
          icon="alert-octagon-outline"
          label="Trouble Codes"
          value={
            diagnostic.troubleCodes.length >
            0
              ? `${diagnostic.troubleCodes.length} available`
              : 'No verified codes'
          }
          available={
            diagnostic.troubleCodes.length >
            0
          }
          colors={colors}
        />
      </View>

      {diagnostic.mechanicSummary ? (
        <>
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
            style={styles.summarySection}
          >
            <Text
              style={[
                styles.sectionLabel,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Mechanic Summary
            </Text>

            <Text
              style={[
                styles.summaryText,
                {
                  color: colors.text,
                },
              ]}
            >
              {
                diagnostic.mechanicSummary
              }
            </Text>
          </View>
        </>
      ) : null}
    </View>
  )
}

function DiagnosticDataSummary({
  icon,
  label,
  value,
  available,
  colors,
}) {
  return (
    <View
      style={[
        styles.dataSummary,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={
          available
            ? colors.accent
            : colors.secondaryText
        }
      />

      <Text
        style={[
          styles.dataLabel,
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
          styles.dataValue,
          {
            color: available
              ? colors.text
              : colors.secondaryText,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  )
}

function getStatusColor(
  status,
  colors
) {
  switch (status) {
    case 'pending-review':
      return colors.warning

    case 'in-review':
      return colors.accent

    case 'completed':
      return colors.success

    default:
      return colors.secondaryText
  }
}

function getSeverityColor(
  severity,
  colors
) {
  switch (severity) {
    case 'critical':
      return colors.danger

    case 'warning':
      return colors.warning

    case 'info':
      return colors.accent

    default:
      return colors.secondaryText
  }
}

function getSeverityIcon(severity) {
  switch (severity) {
    case 'critical':
      return 'alert-octagon-outline'

    case 'warning':
      return 'alert-outline'

    default:
      return 'information-outline'
  }
}

function getSourceIcon(source) {
  switch (source) {
    case 'obd':
      return 'car-connected'

    case 'workshop-inspection':
      return 'wrench-outline'

    default:
      return 'account-voice'
  }
}

function formatSeverity(severity) {
  switch (severity) {
    case 'critical':
      return 'Critical'

    case 'warning':
      return 'Warning'

    default:
      return 'Info'
  }
}

function formatSource(source) {
  switch (source) {
    case 'obd':
      return 'OBD'

    case 'workshop-inspection':
      return 'Workshop Inspection'

    case 'customer-report':
      return 'Customer Report'

    default:
      return source
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
    marginBottom: 16,
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

  obdNotice: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  obdNoticeText: {
    flex: 1,
    marginLeft: 11,
  },

  obdNoticeTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },

  obdNoticeDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
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

  diagnosticsList: {
    gap: 14,
  },

  diagnosticCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:
      'space-between',
    gap: 10,
  },

  cardTitleContainer: {
    flex: 1,
  },

  vehicleTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  customerName: {
    marginTop: 4,
    fontSize: 12,
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
    fontSize: 9.5,
    fontWeight: '800',
  },

  metaRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  severityBadge: {
    minHeight: 28,
    borderRadius: 9,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  severityText: {
    fontSize: 10,
    fontWeight: '800',
  },

  sourceBadge: {
    minHeight: 28,
    borderRadius: 9,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  sourceText: {
    fontSize: 10,
    fontWeight: '700',
  },

  issueSection: {
    marginTop: 16,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  issueText: {
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    marginVertical: 15,
  },

  dataRow: {
    flexDirection: 'row',
    gap: 10,
  },

  dataSummary: {
    flex: 1,
    minHeight: 102,
    borderRadius: 13,
    padding: 12,
  },

  dataLabel: {
    marginTop: 8,
    fontSize: 9.5,
    fontWeight: '700',
  },

  dataValue: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },

  summarySection: {
    paddingBottom: 2,
  },

  summaryText: {
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 18,
  },
})