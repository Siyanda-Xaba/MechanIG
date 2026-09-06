import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import CommonSymptomsGrid from '../../src/components/CommonSymptomsGrid'
import DiagnosticActionCard from '../../src/components/DiagnosticActionCard'
import RecentDiagnosticsList from '../../src/components/RecentDiagnosticsList'
import SoundDiagnosisCard from '../../src/components/SoundDiagnosisCard'
import { useCustomerDiagnostics } from '../../src/customer/CustomerDiagnosticsContext'
import { useDiagnosticScan } from '../../src/customer/useDiagnosticScan'
import { useTheme } from '../../src/theme/ThemeContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function CustomerDiagnostics() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    diagnosticsData,
    isLoadingDiagnostics,
    diagnosticsError,
  } = useCustomerDiagnostics()

  const {
    scanResult,
    isStartingScan,
    scanError,
    startScan,
    clearScanResult,
  } = useDiagnosticScan()

  const isLoading =
    isLoadingVehicles || isLoadingDiagnostics

  const commonSymptoms =
    diagnosticsData?.commonSymptoms ?? []

  const recentScans =
    diagnosticsData?.recentScans ?? []

  async function handleScanAgain() {
    const result = await startScan()

    if (!result?.resultId) {
      return
    }

    router.push({
      pathname:
        '/diagnostic-result/[resultId]',
      params: {
        resultId: result.resultId,
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
          Diagnostics
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          AI-powered insights to keep your car in top shape.
        </Text>

        {/* Vehicle */}
        <View
          style={[
            styles.vehicleCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {isLoading ? (
            <Text
              style={[
                styles.message,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Loading diagnostics...
            </Text>
          ) : !selectedVehicle ? (
            <Text
              style={[
                styles.message,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              No vehicle selected
            </Text>
          ) : (
            <>
              <View style={styles.vehicleTopRow}>
                <View>
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
                      styles.registration,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {selectedVehicle.registration}
                  </Text>

                  <Text
                    style={[
                      styles.vehicleDetails,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {selectedVehicle.fuelType} •{' '}
                    {selectedVehicle.year}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="car-outline"
                  size={34}
                  color={colors.accent}
                />
              </View>

              <View
                style={[
                  styles.scanRow,
                  {
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.lastScanLabel,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    Last scan
                  </Text>

                  <Text
                    style={[
                      styles.lastScanValue,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {diagnosticsData?.summary.lastScanAt ??
                      'No scans yet'}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.75}
                  disabled={isStartingScan}
                  onPress={handleScanAgain}
                  style={[
                    styles.scanButton,
                    {
                      backgroundColor: colors.accent,
                      opacity: isStartingScan
                        ? 0.55
                        : 1,
                    },
                  ]}
                >
                  {isStartingScan ? (
                    <ActivityIndicator
                      size="small"
                      color="#000000"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="car-search"
                      size={18}
                      color="#000000"
                    />
                  )}

                  <Text style={styles.scanButtonText}>
                    {isStartingScan
                      ? 'Starting...'
                      : 'Scan Again'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Scan feedback */}
        {scanResult ? (
          <View
            style={[
              styles.scanFeedbackCard,
              {
                backgroundColor: colors.card,
                borderColor:
                  scanResult.status ===
                  'obd-not-connected'
                    ? colors.warning
                    : scanResult.status ===
                        'ready'
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
                    scanResult.status ===
                    'obd-not-connected'
                      ? colors.warning
                      : colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={
                  scanResult.status ===
                  'obd-not-connected'
                    ? 'connection'
                    : scanResult.status ===
                        'ready'
                      ? 'check-circle-outline'
                      : 'information-outline'
                }
                size={22}
                color={
                  scanResult.status ===
                  'obd-not-connected'
                    ? colors.warning
                    : colors.accent
                }
              />
            </View>

            <View style={styles.scanFeedbackContent}>
              <Text
                style={[
                  styles.scanFeedbackTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {scanResult.status ===
                'obd-not-connected'
                  ? 'OBD device not connected'
                  : scanResult.status ===
                      'obd-unsupported'
                    ? 'OBD device unsupported'
                    : scanResult.status ===
                        'ready'
                      ? 'Scan ready'
                      : 'Scan unavailable'}
              </Text>

              <Text
                style={[
                  styles.scanFeedbackMessage,
                  {
                    color: colors.secondaryText,
                  },
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
              <Text
                style={[
                  styles.scanFeedbackTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Unable to start scan
              </Text>

              <Text
                style={[
                  styles.scanFeedbackMessage,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                {scanError}
              </Text>
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

        {/* Sound Diagnosis */}
        <SoundDiagnosisCard
          onStartScan={() => {
            // Microphone recording flow will be connected here.
          }}
        />

        {/* Diagnostic Actions */}
        <View style={styles.actionsRow}>
          <DiagnosticActionCard
            title="Scan a Part"
            description="Use camera to identify visible parts."
            icon="camera"
            onPress={() => {
              // Camera/gallery + image recognition flow
              // will be connected here.
            }}
          />

          <DiagnosticActionCard
            title="Describe a Problem"
            description="Tell MechanIQ what you notice."
            icon="message-text"
            onPress={() => {
              // Problem description flow
              // will be connected here.
            }}
          />
        </View>

        {/* Common Symptoms */}
        <CommonSymptomsGrid
          symptoms={commonSymptoms}
          onSymptomPress={(symptom) => {
            console.log(
              'Selected symptom:',
              symptom.label
            )
          }}
        />

        {/* Recent Diagnostics */}
        <RecentDiagnosticsList
          scans={recentScans}
          onViewAllPress={() => {
            // Full diagnostics history screen
            // will be connected later.
          }}
          onScanPress={(scan) => {
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
          }}
        />

        {diagnosticsError ? (
          <Text
            style={[
              styles.errorText,
              {
                color: colors.danger,
              },
            ]}
          >
            {diagnosticsError}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
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

  vehicleCard: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 150,
  },

  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
  },

  registration: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '500',
  },

  vehicleDetails: {
    marginTop: 4,
    fontSize: 10,
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
    fontSize: 9,
  },

  lastScanValue: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '700',
  },

  scanButton: {
    minHeight: 38,
    borderRadius: 8,
    paddingHorizontal: 12,
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
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scanFeedbackIcon: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanFeedbackContent: {
    flex: 1,
    marginLeft: 11,
  },

  scanFeedbackTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  scanFeedbackMessage: {
    marginTop: 4,
    fontSize: 9.5,
    lineHeight: 14,
  },

  dismissButton: {
    width: 32,
    height: 32,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },

  message: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 40,
  },

  errorText: {
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
  },
})