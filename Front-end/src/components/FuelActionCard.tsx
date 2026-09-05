import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '../theme/ThemeContext'

type FuelActionCardProps = {
  title: string
  description: string
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  onPress: () => void
}

export default function FuelActionCard({
  title,
  description,
  icon,
  onPress,
}: FuelActionCardProps) {
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
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 112,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
  },

  description: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 13,
  },
})