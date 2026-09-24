import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '../theme/ThemeContext'
import { DiagnosticSymptom } from './diagnosticsTypes'
import { useProblemDescription } from './useProblemDescription'

const MAX_CONTEXT_LENGTH = 500

type CustomerSymptomAnalysisModalProps = {
  symptom: DiagnosticSymptom | null
  onClose: () => void
}

export default function CustomerSymptomAnalysisModal({
  symptom,
  onClose,
}: CustomerSymptomAnalysisModalProps) {
  const router = useRouter()
  const { colors } = useTheme()

  const [
    additionalContext,
    setAdditionalContext,
  ] = useState('')

  const {
    analysisResult,
    isSubmittingDescription,
    problemDescriptionError,
    submitDescription,
    clearDescription,
  } = useProblemDescription()

  function handleClose() {
    if (isSubmittingDescription) {
      return
    }

    setAdditionalContext('')
    clearDescription()
    onClose()
  }

  async function handleSubmit() {
    if (!symptom) {
      return
    }

    const trimmedContext =
      additionalContext.trim()

    const symptomDescription =
      trimmedContext.length > 0
        ? `Reported symptom: ${symptom.label}. Additional customer context: ${trimmedContext}`
        : `Reported symptom: ${symptom.label}.`

    const result =
      await submitDescription(
        symptomDescription
      )

    if (!result?.resultId) {
      return
    }

    setAdditionalContext('')
    clearDescription()
    onClose()

    router.push({
      pathname:
        '/diagnostic-result/[resultId]',
      params: {
        resultId: result.resultId,
      },
    })
  }

  return (
    <Modal
      visible={Boolean(symptom)}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <Pressable
          style={styles.overlay}
          onPress={handleClose}
        >
          <Pressable
            style={[
              styles.modalCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={(event) => {
              event.stopPropagation()
            }}
          >
            <View style={styles.headerRow}>
              <View
                style={styles.headerContent}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Check Symptom
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
                  Confirm what you are noticing and add any useful details.
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                disabled={
                  isSubmittingDescription
                }
                onPress={handleClose}
                accessibilityRole="button"
                accessibilityLabel="Close symptom check"
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color={
                    colors.secondaryText
                  }
                />
              </TouchableOpacity>
            </View>

            {symptom ? (
              <View
                style={[
                  styles.symptomCard,
                  {
                    backgroundColor:
                      colors.background,
                    borderColor:
                      colors.accent,
                  },
                ]}
              >
                <View
                  style={[
                    styles.symptomIcon,
                    {
                      borderColor:
                        colors.accent,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      symptom.icon as keyof typeof MaterialCommunityIcons.glyphMap
                    }
                    size={24}
                    color={colors.accent}
                  />
                </View>

                <View
                  style={styles.symptomContent}
                >
                  <Text
                    style={[
                      styles.symptomLabel,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {symptom.label}
                  </Text>

                  <Text
                    style={[
                      styles.symptomDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Customer-reported symptom
                  </Text>
                </View>
              </View>
            ) : null}

            <View
              style={[
                styles.infoCard,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={19}
                color={colors.accent}
              />

              <Text
                style={[
                  styles.infoText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Selecting a symptom does not confirm a diagnosis. It is treated as an unverified observation until supported by real diagnostic evidence.
              </Text>
            </View>

            <Text
              style={[
                styles.inputLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Add details (optional)
            </Text>

            <TextInput
              value={additionalContext}
              onChangeText={
                setAdditionalContext
              }
              editable={
                !isSubmittingDescription
              }
              multiline
              maxLength={
                MAX_CONTEXT_LENGTH
              }
              textAlignVertical="top"
              placeholder="Example: The noise happens mostly when braking at low speed and started two days ago."
              placeholderTextColor={
                colors.secondaryText
              }
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor:
                    colors.background,
                  borderColor:
                    colors.border,
                },
              ]}
            />

            <View
              style={styles.inputFooter}
            >
              <Text
                style={[
                  styles.helperText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Include when it happens and anything that makes it better or worse.
              </Text>

              <Text
                style={[
                  styles.characterCount,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {additionalContext.length}/
                {MAX_CONTEXT_LENGTH}
              </Text>
            </View>

            {problemDescriptionError ? (
              <View
                style={[
                  styles.feedbackCard,
                  {
                    borderColor:
                      colors.danger,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={20}
                  color={colors.danger}
                />

                <Text
                  style={[
                    styles.feedbackText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  {
                    problemDescriptionError
                  }
                </Text>
              </View>
            ) : null}

            {analysisResult ? (
              <View
                style={[
                  styles.feedbackCard,
                  {
                    borderColor:
                      analysisResult.status ===
                      'submitted'
                        ? colors.accent
                        : colors.warning,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    analysisResult.status ===
                    'submitted'
                      ? 'check-circle-outline'
                      : 'information-outline'
                  }
                  size={20}
                  color={
                    analysisResult.status ===
                    'submitted'
                      ? colors.accent
                      : colors.warning
                  }
                />

                <View
                  style={
                    styles.feedbackContent
                  }
                >
                  <Text
                    style={[
                      styles.feedbackTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {analysisResult.status ===
                    'submitted'
                      ? 'Symptom submitted'
                      : 'Analysis unavailable'}
                  </Text>

                  <Text
                    style={[
                      styles.feedbackMessage,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    {
                      analysisResult.message
                    }
                  </Text>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.75}
              disabled={
                !symptom ||
                isSubmittingDescription
              }
              onPress={() => {
                void handleSubmit()
              }}
              style={[
                styles.submitButton,
                {
                  backgroundColor:
                    colors.accent,
                  opacity:
                    symptom &&
                    !isSubmittingDescription
                      ? 1
                      : 0.5,
                },
              ]}
            >
              {isSubmittingDescription ? (
                <ActivityIndicator
                  size="small"
                  color="#000000"
                />
              ) : (
                <MaterialCommunityIcons
                  name="text-search"
                  size={19}
                  color="#000000"
                />
              )}

              <Text
                style={
                  styles.submitButtonText
                }
              >
                {isSubmittingDescription
                  ? 'Submitting...'
                  : 'Submit for Analysis'}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor:
      'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
  },

  modalCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  headerContent: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17,
  },

  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  symptomCard: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  symptomIcon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  symptomContent: {
    flex: 1,
    marginLeft: 11,
  },

  symptomLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  symptomDescription: {
    marginTop: 3,
    fontSize: 9,
  },

  infoCard: {
    marginTop: 14,
    padding: 11,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  infoText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
  },

  inputLabel: {
    marginTop: 16,
    fontSize: 11.5,
    fontWeight: '700',
  },

  textInput: {
    minHeight: 110,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 11,
    fontSize: 12,
    lineHeight: 18,
  },

  inputFooter: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },

  helperText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 12,
  },

  characterCount: {
    fontSize: 8.5,
    fontWeight: '600',
  },

  feedbackCard: {
    marginTop: 14,
    padding: 11,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  feedbackContent: {
    flex: 1,
  },

  feedbackTitle: {
    fontSize: 10.5,
    fontWeight: '700',
  },

  feedbackText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
  },

  feedbackMessage: {
    marginTop: 3,
    fontSize: 9.5,
    lineHeight: 14,
  },

  submitButton: {
    minHeight: 44,
    marginTop: 16,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  submitButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
})