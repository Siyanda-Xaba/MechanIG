import { Ionicons } from '@expo/vector-icons'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { SoundDiagnosisCaptureStatus } from '../customer/soundDiagnosisTypes'
import { useTheme } from '../theme/ThemeContext'

type SoundDiagnosisCardProps = {
  captureStatus: SoundDiagnosisCaptureStatus
  durationMillis: number
  hasRecording: boolean
  isSubmittingAnalysis: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onDiscardRecording: () => void
  onSubmitForAnalysis: () => void
}

function formatDuration(
  durationMillis: number
) {
  const totalSeconds = Math.floor(
    durationMillis / 1000
  )

  const minutes = Math.floor(
    totalSeconds / 60
  )

  const seconds = totalSeconds % 60

  return `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export default function SoundDiagnosisCard({
  captureStatus,
  durationMillis,
  hasRecording,
  isSubmittingAnalysis,
  onStartRecording,
  onStopRecording,
  onDiscardRecording,
  onSubmitForAnalysis,
}: SoundDiagnosisCardProps) {
  const { colors } = useTheme()

  const isRequestingPermission =
    captureStatus ===
    'requesting-permission'

  const isRecording =
    captureStatus === 'recording'

  const isRecorded =
    captureStatus === 'recorded' &&
    hasRecording

  const statusText = isRecording
    ? `Recording ${formatDuration(
        durationMillis
      )}`
    : isRecorded
      ? `Recorded ${formatDuration(
          durationMillis
        )}`
      : 'Ready to record'

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Sound Diagnosis
      </Text>

      <Text
        style={[
          styles.description,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        Record unusual engine, brake, or vibration sounds.
      </Text>

      <View style={styles.waveformContainer}>
        {[
          18, 30, 42, 24, 50, 34, 20, 44,
          32, 16, 38, 26,
        ].map((height, index) => (
          <View
            key={index}
            style={[
              styles.waveBar,
              {
                height,
                backgroundColor:
                  isRecording
                    ? colors.accent
                    : colors.border,
              },
            ]}
          />
        ))}
      </View>

      <View
        style={[
          styles.microphoneContainer,
          {
            borderColor: isRecording
              ? colors.danger
              : colors.accent,
          },
        ]}
      >
        <Ionicons
          name={
            isRecording
              ? 'radio-outline'
              : isRecorded
                ? 'checkmark'
                : 'mic-outline'
          }
          size={30}
          color={
            isRecording
              ? colors.danger
              : colors.accent
          }
        />
      </View>

      <Text
        style={[
          styles.statusText,
          {
            color: isRecording
              ? colors.danger
              : colors.secondaryText,
          },
        ]}
      >
        {statusText}
      </Text>

      {isRecorded ? (
        <View style={styles.recordedSection}>
          <View style={styles.recordedActions}>
            <TouchableOpacity
              activeOpacity={0.75}
              disabled={isSubmittingAnalysis}
              onPress={onDiscardRecording}
              style={[
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                  opacity:
                    isSubmittingAnalysis
                      ? 0.5
                      : 1,
                },
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={17}
                color={colors.secondaryText}
              />

              <Text
                style={[
                  styles.secondaryButtonText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Discard
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.savedIndicator,
                {
                  borderColor: colors.accent,
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={colors.accent}
              />

              <Text
                style={[
                  styles.savedIndicatorText,
                  {
                    color: colors.accent,
                  },
                ]}
              >
                Recording Ready
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            disabled={isSubmittingAnalysis}
            onPress={onSubmitForAnalysis}
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  colors.accent,
                opacity:
                  isSubmittingAnalysis
                    ? 0.6
                    : 1,
              },
            ]}
          >
            {isSubmittingAnalysis ? (
              <ActivityIndicator
                size="small"
                color="#000000"
              />
            ) : (
              <Ionicons
                name="analytics-outline"
                size={18}
                color="#000000"
              />
            )}

            <Text style={styles.buttonText}>
              {isSubmittingAnalysis
                ? 'Submitting...'
                : 'Submit for Analysis'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.75}
          disabled={isRequestingPermission}
          onPress={
            isRecording
              ? onStopRecording
              : onStartRecording
          }
          style={[
            styles.button,
            {
              backgroundColor:
                isRecording
                  ? colors.danger
                  : colors.accent,
              opacity:
                isRequestingPermission
                  ? 0.6
                  : 1,
            },
          ]}
        >
          {isRequestingPermission ? (
            <ActivityIndicator
              size="small"
              color="#000000"
            />
          ) : (
            <Ionicons
              name={
                isRecording
                  ? 'stop'
                  : 'mic-outline'
              }
              size={18}
              color="#000000"
            />
          )}

          <Text style={styles.buttonText}>
            {isRequestingPermission
              ? 'Requesting Permission...'
              : isRecording
                ? 'Stop Recording'
                : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
  },

  description: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 16,
  },

  waveformContainer: {
    height: 60,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  waveBar: {
    width: 3,
    borderRadius: 3,
  },

  microphoneContainer: {
    width: 58,
    height: 58,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 29,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusText: {
    marginTop: 10,
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  button: {
    minHeight: 42,
    marginTop: 16,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  buttonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },

  recordedSection: {
    marginTop: 16,
  },

  recordedActions: {
    flexDirection: 'row',
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  secondaryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  savedIndicator: {
    flex: 1.35,
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  savedIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
  },

  submitButton: {
    minHeight: 42,
    marginTop: 10,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
})