import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
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
import { useState } from 'react'

import DiagnosticActionCard from '../components/DiagnosticActionCard'
import { useTheme } from '../theme/ThemeContext'
import { useProblemDescription } from './useProblemDescription'

const MAX_DESCRIPTION_LENGTH = 1000

export default function CustomerProblemDescriptionAction() {
  const router = useRouter()
  const { colors } = useTheme()

  const [
    isModalVisible,
    setIsModalVisible,
  ] = useState(false)

  const {
    description,
    analysisResult,
    isSubmittingDescription,
    problemDescriptionError,
    setDescription,
    submitDescription,
    clearDescription,
    clearProblemDescriptionError,
    clearAnalysisResult,
  } = useProblemDescription()

  const trimmedDescription =
    description.trim()

  const canSubmit =
    trimmedDescription.length > 0 &&
    !isSubmittingDescription

  function handleOpen() {
    clearProblemDescriptionError()
    clearAnalysisResult()
    setIsModalVisible(true)
  }

  function handleClose() {
    if (isSubmittingDescription) {
      return
    }

    setIsModalVisible(false)
    clearDescription()
  }

  async function handleSubmit() {
    const result =
      await submitDescription()

    if (!result?.resultId) {
      return
    }

    setIsModalVisible(false)
    clearDescription()

    router.push({
      pathname:
        '/diagnostic-result/[resultId]',
      params: {
        resultId: result.resultId,
      },
    })
  }

  return (
    <>
      <DiagnosticActionCard
        title="Describe a Problem"
        description="Tell MechanIQ what you notice."
        icon="message-text"
        onPress={handleOpen}
      />

      <Modal
        visible={isModalVisible}
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
                  style={
                    styles.headerContent
                  }
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Describe a Problem
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
                    Tell MechanIQ what you
                    are seeing, hearing,
                    smelling, or feeling
                    while driving.
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={
                    isSubmittingDescription
                  }
                  onPress={handleClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close problem description"
                  style={
                    styles.closeButton
                  }
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
                  Your description is a
                  manual observation. It
                  does not replace verified
                  OBD readings or confirm a
                  diagnosis.
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
                What are you noticing?
              </Text>

              <TextInput
                value={description}
                onChangeText={
                  setDescription
                }
                editable={
                  !isSubmittingDescription
                }
                multiline
                maxLength={
                  MAX_DESCRIPTION_LENGTH
                }
                textAlignVertical="top"
                placeholder="Example: The engine makes a rattling sound when starting cold, and the noise becomes quieter after a few minutes."
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
                      problemDescriptionError
                        ? colors.danger
                        : colors.border,
                  },
                ]}
              />

              <View
                style={
                  styles.inputFooter
                }
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
                  Include when it happens
                  and anything that makes
                  it better or worse.
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
                  {description.length}/
                  {MAX_DESCRIPTION_LENGTH}
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
                        ? 'Description submitted'
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
                disabled={!canSubmit}
                onPress={() => {
                  void handleSubmit()
                }}
                style={[
                  styles.submitButton,
                  {
                    backgroundColor:
                      colors.accent,
                    opacity: canSubmit
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
    </>
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

  infoCard: {
    marginTop: 16,
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
    minHeight: 145,
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