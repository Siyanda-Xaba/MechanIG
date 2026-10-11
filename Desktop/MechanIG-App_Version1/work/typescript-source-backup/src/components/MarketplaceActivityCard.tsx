import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { MarketplaceActivity } from '../customer/marketplaceTypes'
import { useTheme } from '../theme/ThemeContext'

type MarketplaceActivityCardProps = {
  activity: MarketplaceActivity
}

export default function MarketplaceActivityCard({
  activity,
}: MarketplaceActivityCardProps) {
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
      <View
        style={[
          styles.iconContainer,
          {
            borderColor: colors.accent,
          },
        ]}
      >
        {getActivityIcon(activity.type, colors.accent)}
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {activity.title}
        </Text>

        <Text
          style={[
            styles.time,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          {activity.occurredAt}
        </Text>
      </View>

      {activity.price !== null ? (
        <Text
          style={[
            styles.price,
            {
              color: colors.text,
            },
          ]}
        >
          R {activity.price.toLocaleString()}
        </Text>
      ) : null}
    </View>
  )
}

function getActivityIcon(
  type: MarketplaceActivity['type'],
  color: string
) {
  switch (type) {
    case 'cart':
      return (
        <Ionicons
          name="cart-outline"
          size={21}
          color={color}
        />
      )

    case 'saved':
      return (
        <Ionicons
          name="bookmark-outline"
          size={21}
          color={color}
        />
      )

    case 'viewed':
      return (
        <Ionicons
          name="eye-outline"
          size={21}
          color={color}
        />
      )

    case 'purchased':
      return (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={21}
          color={color}
        />
      )

    default:
      return (
        <MaterialCommunityIcons
          name="history"
          size={21}
          color={color}
        />
      )
  }
}

const styles = StyleSheet.create({
  card: {
    minHeight: 68,
    padding: 11,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 11,
    fontWeight: '700',
  },

  time: {
    marginTop: 4,
    fontSize: 8,
  },

  price: {
    fontSize: 11,
    fontWeight: '800',
  },
})