import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'

import { useDiagnosticResult } from '../../src/customer/useDiagnosticResult'
import { useTheme } from '../../src/theme/ThemeContext'

export default function DiagnosticResultScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const params = useLocalSearchParams<{
    resultId?: string | string[]
  }>()

  const resultId = Array.isArray(params.resultId)
    ? params.resultId[0]
    : params.resultId

  const {
    diagnosticResult,
    isLoadingDiagnosticResult,
    diagnosticResultError,
  } = useDiagnosticResult(resultId)

  const severityColor =
    diagnosticResult?.severity === 'critical'
      ? colors.danger
      : diagnosticResult?.severity === 'warning'
        ? colors.warning
        : colors.success

  const severityLabel =
    diagnosticResult?.severity === 'critical'
      ? 'Critical'
      : diagnosticResult?.severity === 'warning'
        ? 'Review Required'
        : 'No Issues'

  if (isLoadingDiagnosticResult) {
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
          Loading diagnostic result...
        </Text>
      </SafeAreaView>
    )
  }

  if (diagnosticResultError || !diagnosticResult) {
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
            styles.errorText,
            {
              color: colors.text,
            },
          ]}
        >
          {diagnosticResultError ??
            'Diagnostic result could not be loaded.'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.backButtonText,
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

  const handleRepairAction = () => {
    if (diagnosticResult.diyEligible) {
      router.push({
        pathname: '/repair-guide/[resultId]',
        params: {
          resultId: diagnosticResult.id,
        },
      })

      return
    }

    if (
      diagnosticResult.repairLevel ===
      'mechanic-required'
    ) {
      router.push({
        pathname: '/find-mechanic/[resultId]',
        params: {
          resultId: diagnosticResult.id,
        },
      })
    }
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
            Diagnostic Result
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        {/* Result */}
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.resultIcon,
              {
                borderColor: severityColor,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={
                diagnosticResult.severity === 'normal'
                  ? 'check-circle-outline'
                  : 'alert-outline'
              }
              size={32}
              color={severityColor}
            />
          </View>

          <View
            style={[
              styles.statusPill,
              {
                borderColor: severityColor,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: severityColor,
                },
              ]}
            >
              {severityLabel}
            </Text>
          </View>

          <Text
            style={[
              styles.resultTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {diagnosticResult.title}
          </Text>

          <Text
            style={[
              styles.detectedAt,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            {diagnosticResult.detectedAt}
          </Text>

          <Text
            style={[
              styles.summary,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            {diagnosticResult.summary}
          </Text>
        </View>

        {/* Evidence */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Diagnostic Evidence
        </Text>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {diagnosticResult.evidence.map(
            (evidence, index) => (
              <View
                key={evidence.id}
                style={[
                  styles.evidenceRow,
                  index <
                    diagnosticResult.evidence.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.evidenceContent}>
                  <Text
                    style={[
                      styles.evidenceLabel,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {evidence.label}
                  </Text>

                  <Text
                    style={[
                      styles.evidenceValue,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {evidence.value}
                  </Text>
                </View>

                <View
                  style={[
                    styles.verificationPill,
                    {
                      borderColor: evidence.verified
                        ? colors.success
                        : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.verificationText,
                      {
                        color: evidence.verified
                          ? colors.success
                          : colors.secondaryText,
                      },
                    ]}
                  >
                    {evidence.verified
                      ? 'VERIFIED'
                      : 'REPORTED'}
                  </Text>
                </View>
              </View>
            )
          )}
        </View>

        {/* Possible Causes */}
        {diagnosticResult.possibleCauses.length > 0 ? (
          <>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Possible Causes
            </Text>

            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {diagnosticResult.possibleCauses.map(
                (cause) => (
                  <View
                    key={cause}
                    style={styles.causeRow}
                  >
                    <View
                      style={[
                        styles.bullet,
                        {
                          backgroundColor: colors.accent,
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.causeText,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {cause}
                    </Text>
                  </View>
                )
              )}
            </View>
          </>
        ) : null}

        {/* Recommendation */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Recommended Action
        </Text>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.recommendation,
              {
                color: colors.text,
              },
            ]}
          >
            {diagnosticResult.recommendedAction}
          </Text>
        </View>

        {/* Action */}
        {diagnosticResult.diyEligible ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleRepairAction}
            style={[
              styles.primaryAction,
              {
                backgroundColor: colors.accent,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="tools"
              size={20}
              color="#000000"
            />

            <Text style={styles.primaryActionText}>
              Fix It Yourself
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#000000"
            />
          </TouchableOpacity>
        ) : diagnosticResult.repairLevel ===
          'mechanic-required' ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleRepairAction}
            style={[
              styles.primaryAction,
              {
                backgroundColor: colors.accent,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="account-wrench-outline"
              size={21}
              color="#000000"
            />

            <Text style={styles.primaryActionText}>
              Find a Mechanic
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#000000"
            />
          </TouchableOpacity>
        ) : null}
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

  errorText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  backButton: {
    marginTop: 20,
    minHeight: 42,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
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

  resultCard: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },

  resultIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusPill: {
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },

  resultTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },

  detectedAt: {
    marginTop: 5,
    fontSize: 10,
  },

  summary: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
  },

  sectionCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  evidenceRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  evidenceContent: {
    flex: 1,
  },

  evidenceLabel: {
    fontSize: 11,
    fontWeight: '700',
  },

  evidenceValue: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
  },

  verificationPill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
  },

  verificationText: {
    fontSize: 7,
    fontWeight: '800',
  },

  causeRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  causeText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },

  recommendation: {
    paddingVertical: 12,
    fontSize: 11,
    lineHeight: 17,
  },

  primaryAction: {
    minHeight: 48,
    marginTop: 22,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  primaryActionText: {
    flex: 1,
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
})