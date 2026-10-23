import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons'

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import {
  useConnectivity,
} from './ConnectivityContext'

import {
  useTheme,
} from '../theme/ThemeContext'

/**
 * Shared offline indicator for the
 * Customer and Mechanic dashboards.
 *
 * This component only communicates
 * connectivity status.
 *
 * It does not:
 * - Simulate backend availability
 * - Queue transactions
 * - Synchronize data
 * - Authorize offline operations
 */
export default function OfflineStatusBanner() {
  const {
    isOffline,
  } = useConnectivity()

  const {
    colors,
  } = useTheme()

  const insets = useSafeAreaInsets()

  if (!isOffline) {
    return null
  }

  /*
   * Both dashboards have an established
   * floating bottom tab bar:
   *
   * Height: 68
   * Bottom: max(insets.bottom - 10, 2)
   *
   * Position the banner above that bar
   * without changing navigation dimensions.
   */
  const tabBarBottom = Math.max(
    insets.bottom - 10,
    2
  )

  const bannerBottom =
    tabBarBottom + 68 + 12

  return (
    <View
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          bottom: bannerBottom,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="wifi-off"
        size={21}
        color={colors.warning}
      />

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          You're offline
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Some information may be outdated.
          Online actions require a connection.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    left: 16,
    right: 16,

    zIndex: 20,
    elevation: 8,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderWidth: 1,
    borderRadius: 14,

    gap: 12,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 12,
    fontWeight: '700',
  },

  description: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
  },
})