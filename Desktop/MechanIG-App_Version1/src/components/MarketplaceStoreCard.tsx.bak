import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { MarketplaceStore } from '../customer/marketplaceTypes'
import { useTheme } from '../theme/ThemeContext'

type MarketplaceStoreCardProps = {
  store: MarketplaceStore
  onPress: (store: MarketplaceStore) => void
}

export default function MarketplaceStoreCard({
  store,
  onPress,
}: MarketplaceStoreCardProps) {
  const { colors } = useTheme()

  const statusColor =
    store.isOpen === true
      ? colors.success
      : store.isOpen === false
        ? colors.danger
        : colors.secondaryText

  const statusLabel =
    store.isOpen === true
      ? store.closingTime
        ? `Closing ${store.closingTime}`
        : 'Open'
      : store.isOpen === false
        ? 'Closed'
        : 'Status unavailable'

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
        <Ionicons
          name="storefront-outline"
          size={23}
          color={colors.accent}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            {
              color: colors.text,
            },
          ]}
        >
          {store.name}
        </Text>

        <View style={styles.locationRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={13}
            color={colors.secondaryText}
          />

          <Text
            style={[
              styles.locationText,
              {
                color: colors.secondaryText,
              },
            ]}
            numberOfLines={1}
          >
            {store.distanceKm !== null
              ? `${store.distanceKm} km`
              : 'Distance unavailable'}

            {store.address
              ? ` • ${store.address}`
              : ''}
          </Text>
        </View>

        <Text
          style={[
            styles.status,
            {
              color: statusColor,
            },
          ]}
        >
          {statusLabel}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onPress(store)}
        style={[
          styles.button,
          {
            borderColor: colors.accent,
          },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: colors.accent,
            },
          ]}
        >
          View Store
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    fontSize: 12,
    fontWeight: '700',
  },

  locationRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  locationText: {
    flex: 1,
    fontSize: 8,
  },

  status: {
    marginTop: 6,
    fontSize: 9,
    fontWeight: '700',
  },

  button: {
    minHeight: 34,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 8,
    fontWeight: '700',
  },
})