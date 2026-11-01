import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import DiagnosisInsightsCard from '../../src/components/DiagnosisInsightsCard'
import LiveObdReadingsCard from '../../src/components/LiveObdReadingsCard'
import StableScrollView from '../../src/components/StableScrollView'
import { useDiagnosticScan } from '../../src/customer/useDiagnosticScan'
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
  const router = useRouter()
  const { colors } = useTheme()

  const {
    diagnosticsData,
    isLoadingDiagnostics,
    diagnosticsError,
    refreshDiagnostics,
  } = useMechanicDiagnostics()

  const {
    scanResult,
    isStartingScan,
    isLive,
    liveReadings,
    liveCapturedAt,
    scanError,
    connectionState,
    currentOperation,
    startScan,
    stopLive,
    clearScanResult,
  } = useDiagnosticScan({
    id: 'workshop-vehicle',
    make: 'Workshop',
    model: 'Diagnostic Vehicle',
    year: 'N/A',
    registration: 'OBD-DIAG',
    fuelType: 'N/A',
  })

  async function handleScanAgain() {
    Alert.alert(
      'Safe OBD scan',
      'MechanIQ will read only ECU-supported standard live readings and stored emissions trouble codes. It will not clear codes or change vehicle settings. The raw read responses and interpreted report will be uploaded to your MechanIQ diagnostic history. Confirm that you are authorized to test this vehicle, follow its manufacturer instructions, and keep it safely stationary. Stop prevents further requests; a request already sent may finish.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            const result = await startScan({
              authorized: true,
              selectAdapter: chooseAdapter,
            })
            if (!result?.resultId) return
          },
        },
      ]
    )
  }

  function chooseAdapter(candidateList, signal) {
    if (!candidateList || !candidateList.length) {
      return Promise.reject(new Error('No OBD adapters found.'))
    }
    if (candidateList.length === 1) {
      return Promise.resolve(candidateList[0].id)
    }
    return new Promise((resolve) => {
      let settled = false
      const settle = (id) => {
        if (settled) return
        settled = true
        signal?.removeEventListener('abort', cancel)
        resolve(id)
      }
      const cancel = () => settle(null)
      if (signal?.aborted) return settle(null)
      signal?.addEventListener('abort', cancel, { once: true })
      const adapterLabel = (adapter) =>
        `${adapter.name} (${adapter.transport === 'classic' ? 'Classic' : 'BLE'})`
      const showAdapterPage = (index) => {
        if (settled || signal?.aborted) return settle(null)
        const adapter = candidateList[index]
        const buttons = [{
          text: adapterLabel(adapter),
          onPress: () => settle(adapter.id),
        }]
        if (index + 1 < candidateList.length) {
          buttons.push({
            text: `More adapters (${candidateList.length - index - 1} left)`,
            onPress: () => setTimeout(() => showAdapterPage(index + 1), 250),
          })
        }
        buttons.push({ text: 'Cancel', style: 'cancel', onPress: () => settle(null) })
        Alert.alert(
          `Select OBD adapter (${index + 1} of ${candidateList.length})`,
          `${adapterLabel(adapter)}\nChoose this adapter or browse to the next one.`,
          buttons,
          { cancelable: false }
        )
      }
      showAdapterPage(0)
    })
  }

  function handleViewSavedScan() {
    if (!scanResult?.resultId) return
    router.push({
      pathname: '/diagnostic-result/[resultId]',
      params: { resultId: scanResult.resultId },
    })
  }

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
      return 'N/A'
    }

    let count

    switch (filter) {
      case MECHANIC_DIAGNOSTIC_STATUSES.PENDING_REVIEW:
        count = diagnosticsData.totalPendingReview
        break

      case MECHANIC_DIAGNOSTIC_STATUSES.IN_REVIEW:
        count = diagnosticsData.totalInReview
        break

      case MECHANIC_DIAGNOSTIC_STATUSES.COMPLETED:
        count = diagnosticsData.totalCompleted
        break

      default:
        return 'N/A'
    }

    return Number.isInteger(count) && count >= 0
      ? count
      : 'N/A'
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
              Perform and review vehicle diagnostics
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
            styles.vehicleCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.vehicleTopRow}>
            <View>
              <Text style={[styles.vehicleName, { color: colors.text }]}>
                Workshop Vehicle Diagnostics
              </Text>
              <Text style={[styles.registration, { color: colors.secondaryText }]}>
                OBD-II Bluetooth Scanner
              </Text>
              <Text style={[styles.vehicleDetails, { color: colors.secondaryText }]}>
                ELM327 / Bluetooth Classic & BLE • Real-time ECU
              </Text>
            </View>
            <MaterialCommunityIcons
              name="car-connected"
              size={34}
              color={colors.accent}
            />
          </View>

          <View style={[styles.scanRow, { borderTopColor: colors.border }]}>
            <View>
              <Text style={[styles.lastScanLabel, { color: colors.secondaryText }]}>
                OBD Status
              </Text>
              <Text
                style={[
                  styles.lastScanValue,
                  { color: isLive ? colors.success : colors.text },
                ]}
              >
                {isLive
                  ? 'Connected & Reading'
                  : isStartingScan
                    ? 'Connecting...'
                    : 'Ready to scan'}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              disabled={isStartingScan || isLive}
              onPress={handleScanAgain}
              style={[
                styles.scanButton,
                {
                  backgroundColor: colors.accent,
                  opacity: isStartingScan ? 0.55 : 1,
                },
              ]}
            >
              {isStartingScan ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <MaterialCommunityIcons
                  name="car-search"
                  size={18}
                  color="#000000"
                />
              )}
              <Text style={styles.scanButtonText}>
                {isStartingScan
                  ? 'Connecting...'
                  : isLive
                    ? 'OBD Connected'
                    : 'Connect to OBD'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {scanResult ? (
          <View
            style={[
              styles.scanFeedbackCard,
              {
                backgroundColor: colors.card,
                borderColor:
                  scanResult.status === 'obd-not-connected'
                    ? colors.warning
                    : scanResult.status === 'ready'
                      ? colors.accent
                      : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.scanFeedbackIcon,
                {
                  borderColor:
                    scanResult.status === 'obd-not-connected'
                      ? colors.warning
                      : colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={
                  scanResult.status === 'obd-not-connected'
                    ? 'connection'
                    : scanResult.status === 'ready'
                      ? 'check-circle-outline'
                      : 'information-outline'
                }
                size={22}
                color={
                  scanResult.status === 'obd-not-connected'
                    ? colors.warning
                    : colors.accent
                }
              />
            </View>
            <View style={styles.scanFeedbackContent}>
              <Text style={[styles.scanFeedbackTitle, { color: colors.text }]}>
                {scanResult.status === 'obd-not-connected'
                  ? 'OBD device not connected'
                  : scanResult.status === 'obd-unsupported'
                    ? 'OBD device unsupported'
                    : scanResult.status === 'ready'
                      ? 'Live connection active'
                      : 'Scan unavailable'}
              </Text>
              <Text
                style={[
                  styles.scanFeedbackMessage,
                  { color: colors.secondaryText },
                ]}
              >
                {scanResult.message}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={clearScanResult}
              accessibilityRole="button"
              accessibilityLabel="Dismiss scan message"
              style={styles.dismissButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={19}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {scanError ? (
          <View
            style={[
              styles.scanFeedbackCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.danger,
              },
            ]}
          >
            <View
              style={[
                styles.scanFeedbackIcon,
                {
                  borderColor: colors.danger,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={22}
                color={colors.danger}
              />
            </View>
            <View style={styles.scanFeedbackContent}>
              <Text style={[styles.scanFeedbackTitle, { color: colors.text }]}>
                OBD connection issue
              </Text>
              <Text
                style={[
                  styles.scanFeedbackMessage,
                  { color: colors.secondaryText },
                ]}
              >
                {scanError}
              </Text>
              {Platform.OS === 'android' && /pair|disconnect|no recognizable/i.test(scanError || '') && !/ignition|computer|ecu/i.test(scanError || '') ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS').catch(() => {})
                  }}
                  style={styles.openSettingsButton}
                >
                  <MaterialCommunityIcons name="bluetooth" size={14} color="#00EFFD" />
                  <Text style={styles.openSettingsButtonText}>
                    Open Bluetooth Settings to Pair
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={clearScanResult}
              accessibilityRole="button"
              accessibilityLabel="Dismiss scan error"
              style={styles.dismissButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={19}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <DiagnosisInsightsCard
          readings={liveReadings}
          dtcProblems={scanResult?.dtcProblems ?? []}
          isLive={isLive}
        />

        <LiveObdReadingsCard
          readings={liveReadings}
          capturedAt={liveCapturedAt}
          isLive={isLive}
          isStartingScan={isStartingScan}
          connectionState={connectionState}
          currentOperation={currentOperation}
          resultId={scanResult?.resultId}
          onStop={stopLive}
          onViewReport={handleViewSavedScan}
        />

        <Text
          style={[
            styles.sectionTitleInline,
            {
              color: colors.text,
              marginTop: 22,
              marginBottom: 10,
            },
          ]}
        >
          Assigned Diagnostics
        </Text>

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
        ) : diagnosticsError || !diagnosticsData ? (
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
              {diagnosticsError ||
                'Verified mechanic diagnostic records are currently unavailable.'}
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
                  onOpenWorkspace={() => {
                    router.push({
                      pathname:
                        '/mechanic-diagnostic/[diagnosticId]',
                      params: {
                        diagnosticId:
                          diagnostic.id,
                      },
                    })
                  }}
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
  onOpenWorkspace,
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
              'N/A'}
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
              'N/A'}
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
            'N/A'}
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
              : 'N/A'
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
              : 'N/A'
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

      {diagnostic.status !==
      MECHANIC_DIAGNOSTIC_STATUSES.COMPLETED ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenWorkspace}
          style={[
            styles.workspaceButton,
            {
              backgroundColor:
                colors.accent,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="stethoscope"
            size={18}
            color="#FFFFFF"
          />

          <Text
            style={
              styles.workspaceButtonText
            }
          >
            {diagnostic.status ===
            MECHANIC_DIAGNOSTIC_STATUSES.IN_REVIEW
              ? 'Continue Diagnostic'
              : 'Perform Diagnostic'}
          </Text>
        </TouchableOpacity>
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

  sectionTitleInline: {
    fontSize: 18,
    fontWeight: '800',
  },

  vehicleCard: {
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  vehicleName: {
    fontSize: 17,
    fontWeight: '800',
  },

  registration: {
    marginTop: 4,
    fontSize: 11.5,
    fontWeight: '600',
  },

  vehicleDetails: {
    marginTop: 4,
    fontSize: 10.5,
  },

  scanRow: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  lastScanLabel: {
    fontSize: 9.5,
  },

  lastScanValue: {
    marginTop: 3,
    fontSize: 11.5,
    fontWeight: '700',
  },

  scanButton: {
    minHeight: 38,
    borderRadius: 9,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  scanButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },

  scanFeedbackCard: {
    marginBottom: 14,
    padding: 13,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scanFeedbackIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanFeedbackContent: {
    flex: 1,
    marginLeft: 11,
  },

  scanFeedbackTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  scanFeedbackMessage: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
  },

  openSettingsButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignSelf: 'flex-start',
  },
  openSettingsButtonText: {
    color: '#00EFFD',
    fontSize: 11.5,
    fontWeight: '600',
  },
  dismissButton: {
    width: 32,
    height: 32,
    marginLeft: 6,
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

  workspaceButton: {
    minHeight: 44,
    marginTop: 16,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  workspaceButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
})
