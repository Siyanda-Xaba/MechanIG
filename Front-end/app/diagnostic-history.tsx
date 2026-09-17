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

import StableScrollView from '../src/components/StableScrollView'

import { DiagnosticScan } from '../src/customer/diagnosticsTypes'
import { useDiagnosticHistory } from '../src/customer/useDiagnosticHistory'
import { useTheme } from '../src/theme/ThemeContext'
import { useVehicle } from '../src/vehicles/VehicleContext'

export default function DiagnosticHistoryScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    diagnosticHistory,
    isLoadingDiagnosticHistory,
    diagnosticHistoryError,
    refreshDiagnosticHistory,
  } = useDiagnosticHistory()

  const isLoading =
    isLoadingVehicles ||
    isLoadingDiagnosticHistory

  function handleScanPress(
    scan: DiagnosticScan
  ) {
    if (!scan.resultId) {
      return
    }

    router.push({
      pathname:
        '/diagnostic-result/[resultId]',
      params: {
        resultId: scan.resultId,
      },
    })
  }

  if (isLoading) {
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
          Loading diagnostic history...
        </Text>
      </SafeAreaView>
    )
  }

  if (diagnosticHistoryError) {
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
          Unable to load diagnostics
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
          {diagnosticHistoryError}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            refreshDiagnosticHistory
          }
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

          <Text
            style={styles.retryButtonText}
          >
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[
            styles.secondaryButton,
            {
              borderColor:
                colors.border,
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
              Diagnostic History
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
              Previous diagnostic checks for your selected vehicle
            </Text>
          </View>
        </View>

        {selectedVehicle ? (
          <View
            style={[
              styles.vehicleCard,
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
                styles.vehicleIcon,
                {
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="car-outline"
                size={23}
                color={colors.accent}
              />
            </View>

            <View
              style={styles.vehicleContent}
            >
              <Text
                style={[
                  styles.vehicleLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Diagnostics for
              </Text>

              <Text
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

              <Text
                style={[
                  styles.vehicleRegistration,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {
                  selectedVehicle.registration
                }
              </Text>
            </View>
          </View>
        ) : null}

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
              All Diagnostics
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
              {diagnosticHistory.length}{' '}
              {diagnosticHistory.length === 1
                ? 'record'
                : 'records'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={
              refreshDiagnosticHistory
            }
            accessibilityRole="button"
            accessibilityLabel="Refresh diagnostic history"
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

        {diagnosticHistory.length === 0 ? (
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
            <MaterialCommunityIcons
              name="car-search"
              size={40}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No diagnostic history
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
              Completed diagnostic checks for this vehicle will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {diagnosticHistory.map(
              (scan) => {
                const statusColor =
                  scan.severity ===
                  'critical'
                    ? colors.danger
                    : scan.severity ===
                        'warning'
                      ? colors.warning
                      : colors.success

                return (
                  <TouchableOpacity
                    key={scan.id}
                    activeOpacity={0.75}
                    disabled={
                      !scan.resultId
                    }
                    onPress={() =>
                      handleScanPress(
                        scan
                      )
                    }
                    style={[
                      styles.historyCard,
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
                        styles.scanIcon,
                        {
                          borderColor:
                            statusColor,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={
                          scan.severity ===
                          'normal'
                            ? 'clipboard-check-outline'
                            : 'alert-circle-outline'
                        }
                        size={22}
                        color={
                          statusColor
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.scanContent
                      }
                    >
                      <View
                        style={
                          styles.scanTitleRow
                        }
                      >
                        <Text
                          style={[
                            styles.scanTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {scan.title}
                        </Text>

                        <View
                          style={[
                            styles.statusBadge,
                            {
                              borderColor:
                                statusColor,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  statusColor,
                              },
                            ]}
                          >
                            {scan.status}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.scanDescription,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {scan.description}
                      </Text>

                      <Text
                        style={[
                          styles.scanTime,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {scan.scannedAt}
                      </Text>
                    </View>

                    {scan.resultId ? (
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
        )}

        <View
          style={[
            styles.backendNotice,
            {
              borderColor:
                colors.border,
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
            Full diagnostic history will come from MechanIQ backend records for the selected vehicle. Only records with a related diagnostic result can open a result screen.
          </Text>
        </View>
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
    lineHeight: 14,
  },

  vehicleCard: {
    minHeight: 82,
    marginTop: 22,
    padding: 13,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleContent: {
    flex: 1,
    marginLeft: 12,
  },

  vehicleLabel: {
    fontSize: 8.5,
  },

  vehicleName: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
  },

  vehicleRegistration: {
    marginTop: 3,
    fontSize: 9,
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

  historyList: {
    gap: 10,
  },

  historyCard: {
    minHeight: 98,
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scanIcon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanContent: {
    flex: 1,
    marginHorizontal: 11,
  },

  scanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  scanTitle: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
  },

  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 7.5,
    fontWeight: '700',
  },

  scanDescription: {
    marginTop: 5,
    fontSize: 9.5,
    lineHeight: 14,
  },

  scanTime: {
    marginTop: 6,
    fontSize: 8.5,
  },

  emptyCard: {
    minHeight: 210,
    padding: 22,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
  },

  emptyDescription: {
    marginTop: 6,
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