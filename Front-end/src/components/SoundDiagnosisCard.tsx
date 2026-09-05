import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '../theme/ThemeContext'

type SoundDiagnosisCardProps = {
  onStartScan: () => void
}

export default function SoundDiagnosisCard({
  onStartScan,
}: SoundDiagnosisCardProps) {
  const { colors } = useTheme()

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
        {[18, 30, 42, 24, 50, 34, 20, 44, 32, 16, 38, 26].map(
          (height, index) => (
            <View
              key={index}
              style={[
                styles.waveBar,
                {
                  height,
                  backgroundColor: colors.accent,
                },
              ]}
            />
          )
        )}
      </View>

      <View
        style={[
          styles.microphoneContainer,
          {
            borderColor: colors.accent,
          },
        ]}
      >
        <Ionicons
          name="mic-outline"
          size={30}
          color={colors.accent}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onStartScan}
        style={[
          styles.button,
          {
            backgroundColor: colors.accent,
          },
        ]}
      >
        <Ionicons
          name="mic-outline"
          size={18}
          color="#000000"
        />

        <Text style={styles.buttonText}>
          Start Scan
        </Text>
      </TouchableOpacity>
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
})