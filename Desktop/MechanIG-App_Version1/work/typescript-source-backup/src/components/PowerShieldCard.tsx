import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '../theme/ThemeContext'

type PowerShieldCardProps = {
  nextOutageTime?: string | null
  onSchedulePress: () => void
}

export default function PowerShieldCard({
  nextOutageTime,
  onSchedulePress,
}: PowerShieldCardProps) {
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
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Power Shield
        </Text>

        <View
          style={[
            styles.shieldIcon,
            {
              borderColor: colors.accent,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="shield-outline"
            size={20}
            color={colors.accent}
          />
        </View>
      </View>

      <Text
        style={[
          styles.label,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        Next outage
      </Text>

      <Text
        style={[
          styles.time,
          {
            color: colors.accent,
          },
        ]}
      >
        {nextOutageTime ?? 'Not available'}
      </Text>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onSchedulePress}
        style={[
          styles.button,
          {
            backgroundColor: colors.accent,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="gas-station"
          size={17}
          color="#000000"
        />

        <Text style={styles.buttonText}>
          Schedule fuel top-up
        </Text>

        <Ionicons
          name="chevron-forward"
          size={16}
          color="#000000"
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 150,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
  },

  shieldIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    marginTop: 10,
    fontSize: 10,
  },

  time: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '700',
  },

  button: {
    minHeight: 38,
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  buttonText: {
    flex: 1,
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
})