import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import {
  useMemo,
  useState,
} from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'
import { useMechanicDiagnostics } from '../../src/mechanic/MechanicDiagnosticsContext'
import {
  MECHANIC_DIAGNOSTIC_ACTIONS,
  MECHANIC_DIAGNOSTIC_MODES,
  MECHANIC_DIAGNOSTIC_MODE_LABELS,
  MECHANIC_DIAGNOSTIC_SEVERITIES,
} from '../../src/mechanic/diagnosticsTypes'
import { useTheme } from '../../src/theme/ThemeContext'

const diagnosticModes = [
  MECHANIC_DIAGNOSTIC_MODES.WORKSHOP_INSPECTION,
  MECHANIC_DIAGNOSTIC_MODES.OBD,
  MECHANIC_DIAGNOSTIC_MODES.COMBINED,
]

const findingSeverities = [
  MECHANIC_DIAGNOSTIC_SEVERITIES.INFO,
  MECHANIC_DIAGNOSTIC_SEVERITIES.WARNING,
  MECHANIC_DIAGNOSTIC_SEVERITIES.CRITICAL,
]

export default function MechanicDiagnosticWorkspace() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    diagnosticId,
  } = useLocalSearchParams()

  const {
    diagnosticsData,
    isLoadingDiagnostics,
    diagnosticsError,
    refreshDiagnostics,

    diagnosticActionError,
    clearDiagnosticActionError,
    performDiagnosticAction,
    isDiagnosticActionInProgress,
  } = useMechanicDiagnostics()

  const resolvedDiagnosticId =
    Array.isArray(diagnosticId)
      ? diagnosticId[0]
      : diagnosticId

  const diagnostic =
    useMemo(() => {
      if (
        !resolvedDiagnosticId ||
        !diagnosticsData?.diagnostics
      ) {
        return null
      }

      return (
        diagnosticsData.diagnostics.find(
          (item) =>
            item.id ===
            resolvedDiagnosticId
        ) ?? null
      )
    }, [
      diagnosticsData,
      resolvedDiagnosticId,
    ])

  const [
    selectedMode,
    setSelectedMode,
  ] = useState(
    MECHANIC_DIAGNOSTIC_MODES
      .WORKSHOP_INSPECTION
  )

  const [
    activeSessionId,
    setActiveSessionId,
  ] = useState(null)

  const [
    findingTitle,
    setFindingTitle,
  ] = useState('')

  const [
    findingDescription,
    setFindingDescription,
  ] = useState('')

  const [
    findingSeverity,
    setFindingSeverity,
  ] = useState(
    MECHANIC_DIAGNOSTIC_SEVERITIES.INFO
  )

  const [
    draftFindings,
    setDraftFindings,
  ] = useState([])

  const [
    mechanicSummary,
    setMechanicSummary,
  ] = useState('')

  const [
    localFormError,
    setLocalFormError,
  ] = useState(null)

  const [
    showObdActionError,
    setShowObdActionError,
  ] = useState(false)

  const isStartingSession =
    isDiagnosticActionInProgress(
      resolvedDiagnosticId,
      MECHANIC_DIAGNOSTIC_ACTIONS
        .START_DIAGNOSTIC
    )

  const isConnectingObd =
    isDiagnosticActionInProgress(
      resolvedDiagnosticId,
      MECHANIC_DIAGNOSTIC_ACTIONS
        .CONNECT_OBD
    )

  const isSavingFinding =
    activeSessionId
      ? isDiagnosticActionInProgress(
          activeSessionId,
          MECHANIC_DIAGNOSTIC_ACTIONS
            .ADD_FINDING
        )
      : false

  const isCompletingDiagnostic =
    activeSessionId
      ? isDiagnosticActionInProgress(
          activeSessionId,
          MECHANIC_DIAGNOSTIC_ACTIONS
            .COMPLETE_DIAGNOSTIC
        )
      : false

  const visibleError =
    localFormError ??
    (
      showObdActionError
        ? null
        : diagnosticActionError
    )

  async function handleStartSession() {
    if (!diagnostic) {
      return
    }

    setShowObdActionError(false)
    setLocalFormError(null)
    clearDiagnosticActionError()

    const session =
      await performDiagnosticAction({
        action:
          MECHANIC_DIAGNOSTIC_ACTIONS
            .START_DIAGNOSTIC,

        diagnosticId:
          diagnostic.id,

        mode: selectedMode,
      })

    if (session?.id) {
      setActiveSessionId(
        session.id
      )
    }
  }

  function handleAddDraftFinding() {
    setShowObdActionError(false)
    setLocalFormError(null)

    if (!findingTitle.trim()) {
      setLocalFormError(
        'Enter a finding title before adding it to the diagnostic draft.'
      )

      return
    }

    const draftFinding = {
      id:
        `draft-finding-${draftFindings.length + 1}`,

      title:
        findingTitle.trim(),

      description:
        findingDescription.trim() ||
        null,

      severity:
        findingSeverity,
    }

    setDraftFindings(
      (currentFindings) => [
        ...currentFindings,
        draftFinding,
      ]
    )

    setFindingTitle('')
    setFindingDescription('')

    setFindingSeverity(
      MECHANIC_DIAGNOSTIC_SEVERITIES.INFO
    )
  }

  function handleRemoveDraftFinding(
    findingId
  ) {
    setDraftFindings(
      (currentFindings) =>
        currentFindings.filter(
          (finding) =>
            finding.id !== findingId
        )
    )
  }

  async function handleSaveFinding(
    finding
  ) {
    if (!activeSessionId) {
      setShowObdActionError(false)
      setLocalFormError(
        'Start an authoritative diagnostic session before saving findings to MechanIQ.'
      )

      return
    }

    setShowObdActionError(false)
    setLocalFormError(null)
    clearDiagnosticActionError()

    await performDiagnosticAction({
      action:
        MECHANIC_DIAGNOSTIC_ACTIONS
          .ADD_FINDING,

      sessionId:
        activeSessionId,

      finding: {
        title:
          finding.title,

        description:
          finding.description,

        severity:
          finding.severity,
      },
    })
  }

  async function handleConnectObd() {
    setLocalFormError(null)
    setShowObdActionError(true)
    clearDiagnosticActionError()

    await performDiagnosticAction({
      action:
        MECHANIC_DIAGNOSTIC_ACTIONS
          .CONNECT_OBD,

      diagnosticId:
        diagnostic?.id ??
        resolvedDiagnosticId,
    })
  }

  async function handleCompleteDiagnostic() {
    if (!activeSessionId) {
      setShowObdActionError(false)
      setLocalFormError(
        'Start an authoritative diagnostic session before completing the diagnostic.'
      )

      return
    }

    if (
      !mechanicSummary.trim()
    ) {
      setShowObdActionError(false)
      setLocalFormError(
        'Enter a mechanic summary before completing the diagnostic.'
      )

      return
    }

    setShowObdActionError(false)
    setLocalFormError(null)
    clearDiagnosticActionError()

    await performDiagnosticAction({
      action:
        MECHANIC_DIAGNOSTIC_ACTIONS
          .COMPLETE_DIAGNOSTIC,

      sessionId:
        activeSessionId,

      mechanicSummary:
        mechanicSummary.trim(),
    })
  }

  if (
    isLoadingDiagnostics &&
    !diagnosticsData
  ) {
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
            styles.centeredText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Loading diagnostic...
        </Text>
      </SafeAreaView>
    )
  }

  if (
    diagnosticsError &&
    !diagnosticsData
  ) {
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
          size={46}
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
          Diagnostic unavailable
        </Text>

        <Text
          style={[
            styles.centeredText,
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
          onPress={
            refreshDiagnostics
          }
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                colors.accent,
            },
          ]}
        >
          <Text
            style={
              styles.primaryButtonText
            }
          >
            Try Again
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (!diagnostic) {
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
          name="car-search"
          size={46}
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
          Diagnostic not found
        </Text>

        <Text
          style={[
            styles.centeredText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          This diagnostic record is no
          longer available.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.back()
          }
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
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              router.back()
            }
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={[
              styles.headerButton,
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

          <View
            style={styles.headerText}
          >
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Diagnostic Workspace
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
              Perform vehicle inspection
              and diagnostics
            </Text>
          </View>
        </View>

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
                backgroundColor:
                  `${colors.accent}18`,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="car-wrench"
              size={25}
              color={colors.accent}
            />
          </View>

          <View
            style={
              styles.vehicleContent
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
        </View>

        <View
          style={[
            styles.issueCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionEyebrow,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            REPORTED ISSUE
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
            styles.authorityNotice,
            {
              backgroundColor:
                `${colors.accent}12`,
              borderColor:
                `${colors.accent}45`,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={21}
            color={colors.accent}
          />

          <Text
            style={[
              styles.authorityNoticeText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Manual findings entered here
            are mechanic observations.
            Sensor readings and DTCs remain
            separate and must come from a
            real OBD or authoritative
            backend source.
          </Text>
        </View>

        {visibleError ? (
          <View
            style={[
              styles.errorCard,
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
                styles.errorText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {visibleError}
            </Text>
          </View>
        ) : null}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Diagnostic Mode
        </Text>

        <View
          style={
            styles.modeGrid
          }
        >
          {diagnosticModes.map(
            (mode) => {
              const isSelected =
                selectedMode === mode

              return (
                <TouchableOpacity
                  key={mode}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedMode(
                      mode
                    )

                    setShowObdActionError(
                      false
                    )

                    setLocalFormError(
                      null
                    )

                    clearDiagnosticActionError()
                  }}
                  style={[
                    styles.modeCard,
                    {
                      backgroundColor:
                        colors.card,

                      borderColor:
                        isSelected
                          ? colors.accent
                          : colors.border,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      getModeIcon(
                        mode
                      )
                    }
                    size={24}
                    color={
                      isSelected
                        ? colors.accent
                        : colors.secondaryText
                    }
                  />

                  <Text
                    style={[
                      styles.modeTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {
                      MECHANIC_DIAGNOSTIC_MODE_LABELS[
                        mode
                      ]
                    }
                  </Text>

                  <Text
                    style={[
                      styles.modeDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    {getModeDescription(
                      mode
                    )}
                  </Text>
                </TouchableOpacity>
              )
            }
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={
            isStartingSession ||
            activeSessionId !== null
          }
          onPress={
            handleStartSession
          }
          style={[
            styles.startSessionButton,
            {
              backgroundColor:
                colors.accent,

              opacity:
                isStartingSession ||
                activeSessionId !==
                  null
                  ? 0.6
                  : 1,
            },
          ]}
        >
          {isStartingSession ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={20}
              color="#FFFFFF"
            />
          )}

          <Text
            style={
              styles.startSessionText
            }
          >
            {activeSessionId
              ? 'Diagnostic Session Active'
              : 'Start Diagnostic Session'}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Workshop Findings
        </Text>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.inputLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Finding title
          </Text>

          <TextInput
            value={findingTitle}
            onChangeText={
              setFindingTitle
            }
            placeholder="e.g. Brake pad wear observed"
            placeholderTextColor={
              colors.secondaryText
            }
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor:
                  colors.background,
                borderColor:
                  colors.border,
              },
            ]}
          />

          <Text
            style={[
              styles.inputLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Notes
          </Text>

          <TextInput
            value={
              findingDescription
            }
            onChangeText={
              setFindingDescription
            }
            placeholder="Describe the mechanic inspection finding"
            placeholderTextColor={
              colors.secondaryText
            }
            multiline
            textAlignVertical="top"
            style={[
              styles.input,
              styles.multilineInput,
              {
                color: colors.text,
                backgroundColor:
                  colors.background,
                borderColor:
                  colors.border,
              },
            ]}
          />

          <Text
            style={[
              styles.inputLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Severity
          </Text>

          <View
            style={
              styles.severityRow
            }
          >
            {findingSeverities.map(
              (severity) => {
                const isSelected =
                  findingSeverity ===
                  severity

                const severityColor =
                  getSeverityColor(
                    severity,
                    colors
                  )

                return (
                  <TouchableOpacity
                    key={severity}
                    activeOpacity={0.8}
                    onPress={() =>
                      setFindingSeverity(
                        severity
                      )
                    }
                    style={[
                      styles.severityButton,
                      {
                        borderColor:
                          isSelected
                            ? severityColor
                            : colors.border,

                        backgroundColor:
                          isSelected
                            ? `${severityColor}15`
                            : colors.background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityButtonText,
                        {
                          color:
                            isSelected
                              ? severityColor
                              : colors.secondaryText,
                        },
                      ]}
                    >
                      {formatSeverity(
                        severity
                      )}
                    </Text>
                  </TouchableOpacity>
                )
              }
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              handleAddDraftFinding
            }
            style={[
              styles.secondaryActionButton,
              {
                borderColor:
                  colors.accent,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={18}
              color={colors.accent}
            />

            <Text
              style={[
                styles.secondaryActionText,
                {
                  color:
                    colors.accent,
                },
              ]}
            >
              Add Draft Finding
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.draftNotice,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Draft findings stay only in
            this screen until an
            authoritative diagnostic
            session exists and the backend
            confirms they were saved.
          </Text>
        </View>

        {draftFindings.length >
        0 ? (
          <View
            style={
              styles.findingsList
            }
          >
            {draftFindings.map(
              (finding) => (
                <DraftFindingCard
                  key={finding.id}
                  finding={finding}
                  colors={colors}
                  canSave={
                    activeSessionId !==
                    null
                  }
                  isSaving={
                    isSavingFinding
                  }
                  onSave={() =>
                    handleSaveFinding(
                      finding
                    )
                  }
                  onRemove={() =>
                    handleRemoveDraftFinding(
                      finding.id
                    )
                  }
                />
              )
            )}
          </View>
        ) : null}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          OBD Data
        </Text>

        <View
          style={[
            styles.obdCard,
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
              styles.obdIcon,
              {
                backgroundColor:
                  `${colors.accent}18`,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="car-connected"
              size={25}
              color={colors.accent}
            />
          </View>

          <Text
            style={[
              styles.obdTitle,
              {
                color: colors.text,
              },
            ]}
          >
            OBD Connection
          </Text>

          <Text
            style={[
              styles.obdDescription,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Readings and trouble codes
            will appear here only after a
            real vehicle connection
            provides authoritative data.
          </Text>

          <View
            style={
              styles.obdSummaryRow
            }
          >
            <DataSummary
              label="Readings"
              value={
                diagnostic.readings
                  .length > 0
                  ? String(
                      diagnostic
                        .readings
                        .length
                    )
                  : 'None'
              }
              colors={colors}
            />

            <DataSummary
              label="DTCs"
              value={
                diagnostic
                  .troubleCodes
                  .length > 0
                  ? String(
                      diagnostic
                        .troubleCodes
                        .length
                    )
                  : 'None'
              }
              colors={colors}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={
              isConnectingObd
            }
            onPress={
              handleConnectObd
            }
            style={[
              styles.secondaryActionButton,
              {
                borderColor:
                  colors.accent,

                opacity:
                  isConnectingObd
                    ? 0.6
                    : 1,
              },
            ]}
          >
            {isConnectingObd ? (
              <ActivityIndicator
                size="small"
                color={colors.accent}
              />
            ) : (
              <MaterialCommunityIcons
                name="connection"
                size={18}
                color={colors.accent}
              />
            )}

            <Text
              style={[
                styles.secondaryActionText,
                {
                  color:
                    colors.accent,
                },
              ]}
            >
              Connect OBD
            </Text>
          </TouchableOpacity>

          {showObdActionError &&
          diagnosticActionError ? (
            <View
              style={[
                styles.obdFeedbackCard,
                {
                  backgroundColor:
                    colors.background,
                  borderColor:
                    colors.warning,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color={colors.warning}
              />

              <Text
                style={[
                  styles.obdFeedbackText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {
                  diagnosticActionError
                }
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Mechanic Summary
        </Text>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <TextInput
            value={
              mechanicSummary
            }
            onChangeText={
              setMechanicSummary
            }
            placeholder="Summarize the diagnosis, findings and recommended next steps"
            placeholderTextColor={
              colors.secondaryText
            }
            multiline
            textAlignVertical="top"
            style={[
              styles.input,
              styles.summaryInput,
              {
                color: colors.text,
                backgroundColor:
                  colors.background,
                borderColor:
                  colors.border,
              },
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={
              isCompletingDiagnostic
            }
            onPress={
              handleCompleteDiagnostic
            }
            style={[
              styles.completeButton,
              {
                borderColor:
                  colors.success,

                opacity:
                  isCompletingDiagnostic
                    ? 0.6
                    : 1,
              },
            ]}
          >
            {isCompletingDiagnostic ? (
              <ActivityIndicator
                size="small"
                color={colors.success}
              />
            ) : (
              <MaterialCommunityIcons
                name="check-decagram-outline"
                size={19}
                color={colors.success}
              />
            )}

            <Text
              style={[
                styles.completeButtonText,
                {
                  color:
                    colors.success,
                },
              ]}
            >
              Complete Diagnostic
            </Text>
          </TouchableOpacity>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
}

function DraftFindingCard({
  finding,
  colors,
  canSave,
  isSaving,
  onSave,
  onRemove,
}) {
  const severityColor =
    getSeverityColor(
      finding.severity,
      colors
    )

  return (
    <View
      style={[
        styles.findingCard,
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
          styles.findingHeader
        }
      >
        <View
          style={
            styles.findingTitleContainer
          }
        >
          <Text
            style={[
              styles.findingTitle,
              {
                color: colors.text,
              },
            ]}
          >
            {finding.title}
          </Text>

          <Text
            style={[
              styles.findingSeverity,
              {
                color:
                  severityColor,
              },
            ]}
          >
            {formatSeverity(
              finding.severity
            )}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onRemove}
        >
          <Ionicons
            name="trash-outline"
            size={19}
            color={colors.danger}
          />
        </TouchableOpacity>
      </View>

      {finding.description ? (
        <Text
          style={[
            styles.findingDescription,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {finding.description}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.8}
        disabled={
          !canSave ||
          isSaving
        }
        onPress={onSave}
        style={[
          styles.saveFindingButton,
          {
            borderColor:
              canSave
                ? colors.accent
                : colors.border,

            opacity:
              canSave
                ? 1
                : 0.55,
          },
        ]}
      >
        {isSaving ? (
          <ActivityIndicator
            size="small"
            color={colors.accent}
          />
        ) : (
          <MaterialCommunityIcons
            name="content-save-outline"
            size={17}
            color={
              canSave
                ? colors.accent
                : colors.secondaryText
            }
          />
        )}

        <Text
          style={[
            styles.saveFindingText,
            {
              color:
                canSave
                  ? colors.accent
                  : colors.secondaryText,
            },
          ]}
        >
          {canSave
            ? 'Save Finding'
            : 'Session Required'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function DataSummary({
  label,
  value,
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
      <Text
        style={[
          styles.dataSummaryLabel,
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
          styles.dataSummaryValue,
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

function getModeIcon(mode) {
  switch (mode) {
    case MECHANIC_DIAGNOSTIC_MODES.OBD:
      return 'car-connected'

    case MECHANIC_DIAGNOSTIC_MODES.COMBINED:
      return 'tools'

    default:
      return 'wrench-outline'
  }
}

function getModeDescription(mode) {
  switch (mode) {
    case MECHANIC_DIAGNOSTIC_MODES.OBD:
      return 'Use verified vehicle data from a real OBD connection.'

    case MECHANIC_DIAGNOSTIC_MODES.COMBINED:
      return 'Combine physical inspection with authoritative OBD data.'

    default:
      return 'Record physical inspection findings entered by the mechanic.'
  }
}

function getSeverityColor(
  severity,
  colors
) {
  switch (severity) {
    case MECHANIC_DIAGNOSTIC_SEVERITIES.CRITICAL:
      return colors.danger

    case MECHANIC_DIAGNOSTIC_SEVERITIES.WARNING:
      return colors.warning

    default:
      return colors.accent
  }
}

function formatSeverity(severity) {
  switch (severity) {
    case MECHANIC_DIAGNOSTIC_SEVERITIES.CRITICAL:
      return 'Critical'

    case MECHANIC_DIAGNOSTIC_SEVERITIES.WARNING:
      return 'Warning'

    default:
      return 'Info'
  }
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

  centeredText: {
    marginTop: 10,
    maxWidth: 290,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  stateTitle: {
    marginTop: 14,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },

  header: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerButton: {
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
    fontSize: 22,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 10,
  },

  vehicleCard: {
    minHeight: 82,
    padding: 14,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleContent: {
    flex: 1,
    marginLeft: 12,
  },

  vehicleTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  customerName: {
    marginTop: 4,
    fontSize: 11,
  },

  issueCard: {
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 15,
  },

  sectionEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  issueText: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
  },

  authorityNotice: {
    marginTop: 12,
    padding: 13,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  authorityNoticeText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 15,
  },

  errorCard: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  errorText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 15,
  },

  sectionTitle: {
    marginTop: 22,
    marginBottom: 11,
    fontSize: 16,
    fontWeight: '800',
  },

  modeGrid: {
    gap: 10,
  },

  modeCard: {
    minHeight: 94,
    padding: 13,
    borderWidth: 1,
    borderRadius: 14,
  },

  modeTitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
  },

  modeDescription: {
    marginTop: 4,
    fontSize: 9.5,
    lineHeight: 14,
  },

  startSessionButton: {
    minHeight: 48,
    marginTop: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  startSessionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  formCard: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 15,
  },

  inputLabel: {
    marginBottom: 6,
    fontSize: 9.5,
    fontWeight: '700',
  },

  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 11,
    fontSize: 11,
  },

  multilineInput: {
    minHeight: 96,
    paddingTop: 11,
    marginBottom: 14,
  },

  summaryInput: {
    minHeight: 130,
    paddingTop: 11,
  },

  severityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },

  severityButton: {
    flex: 1,
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  severityButtonText: {
    fontSize: 9.5,
    fontWeight: '800',
  },

  secondaryActionButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  secondaryActionText: {
    fontSize: 10.5,
    fontWeight: '800',
  },

  draftNotice: {
    marginTop: 10,
    fontSize: 8.5,
    lineHeight: 13,
  },

  findingsList: {
    marginTop: 12,
    gap: 10,
  },

  findingCard: {
    padding: 13,
    borderWidth: 1,
    borderRadius: 13,
  },

  findingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  findingTitleContainer: {
    flex: 1,
  },

  findingTitle: {
    fontSize: 11.5,
    fontWeight: '800',
  },

  findingSeverity: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '700',
  },

  findingDescription: {
    marginTop: 8,
    fontSize: 9.5,
    lineHeight: 15,
  },

  saveFindingButton: {
    minHeight: 38,
    marginTop: 11,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  saveFindingText: {
    fontSize: 9.5,
    fontWeight: '800',
  },

  obdCard: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
  },

  obdIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  obdTitle: {
    marginTop: 11,
    fontSize: 13,
    fontWeight: '800',
  },

  obdDescription: {
    marginTop: 5,
    fontSize: 9.5,
    lineHeight: 15,
  },

  obdSummaryRow: {
    marginVertical: 13,
    flexDirection: 'row',
    gap: 10,
  },

  obdFeedbackCard: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  obdFeedbackText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },

  dataSummary: {
    flex: 1,
    padding: 11,
    borderRadius: 11,
  },

  dataSummaryLabel: {
    fontSize: 8.5,
    fontWeight: '600',
  },

  dataSummaryValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '800',
  },

  completeButton: {
    minHeight: 46,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  completeButtonText: {
    fontSize: 10.5,
    fontWeight: '800',
  },

  primaryButton: {
    minWidth: 150,
    minHeight: 44,
    marginTop: 18,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  secondaryButton: {
    minWidth: 150,
    minHeight: 44,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
})
