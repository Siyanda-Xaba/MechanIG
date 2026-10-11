import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '../theme/ThemeContext'

type QuickActionCardProps = {
  title: string
  description: string
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  onPress: () => void
}

export default function QuickActionCard({
  title,
  description,
  icon,
  onPress,
}: QuickActionCardProps) {
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
          size={24}
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
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 92,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: '700',
  },

  description: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 13,
  },
})