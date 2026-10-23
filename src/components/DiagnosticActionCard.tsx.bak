import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '../theme/ThemeContext'

type DiagnosticActionCardProps = {
  title: string
  description: string
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  onPress: () => void
}

export default function DiagnosticActionCard({
  title,
  description,
  icon,
  onPress,
}: DiagnosticActionCardProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            borderColor: colors.accent,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={25}
          color={colors.accent}
        />
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          {description}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={colors.accent}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  textContainer: {
    alignItems: 'center',
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  description: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 13,
    textAlign: 'center',
  },
})