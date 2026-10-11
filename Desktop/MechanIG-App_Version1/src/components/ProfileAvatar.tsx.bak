import { Ionicons } from '@expo/vector-icons'
import { Image, StyleSheet, View } from 'react-native'

import { useTheme } from '../theme/ThemeContext'

type ProfileAvatarProps = {
  imageUrl?: string | null
  size?: number
}

export default function ProfileAvatar({
  imageUrl,
  size = 44,
}: ProfileAvatarProps) {
  const { colors } = useTheme()

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.accent,
          },
        ]}
      />
    )
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: colors.accent,
          backgroundColor: colors.card,
        },
      ]}
    >
      <Ionicons
        name="person-outline"
        size={size * 0.5}
        color={colors.secondaryText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 1.5,
  },

  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
})