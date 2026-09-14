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

import { MarketplaceProduct } from '../customer/marketplaceTypes'
import { useTheme } from '../theme/ThemeContext'

type MarketplaceProductCardProps = {
  product: MarketplaceProduct
  onPress: (product: MarketplaceProduct) => void
}

export default function MarketplaceProductCard({
  product,
  onPress,
}: MarketplaceProductCardProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(product)}
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
          styles.imagePlaceholder,
          {
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={getProductIcon(product.category)}
          size={40}
          color={colors.accent}
        />
      </View>

      {product.compatibleWithSelectedVehicle === true ? (
        <View
          style={[
            styles.compatibilityPill,
            {
              borderColor: colors.success,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="check"
            size={10}
            color={colors.success}
          />

          <Text
            style={[
              styles.compatibilityText,
              {
                color: colors.success,
              },
            ]}
          >
            Compatible
          </Text>
        </View>
      ) : null}

      <Text
        style={[
          styles.name,
          {
            color: colors.text,
          },
        ]}
        numberOfLines={1}
      >
        {product.name}
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.secondaryText,
          },
        ]}
        numberOfLines={1}
      >
        {product.subtitle}
      </Text>

      <View style={styles.bottomRow}>
        <Text
          style={[
            styles.price,
            {
              color: colors.text,
            },
          ]}
        >
          {product.price !== null
            ? `R ${product.price.toLocaleString()}`
            : 'Price unavailable'}
        </Text>

        {product.rating !== null ? (
          <View style={styles.ratingRow}>
            <Ionicons
              name="star"
              size={12}
              color={colors.warning}
            />

            <Text
              style={[
                styles.rating,
                {
                  color: colors.text,
                },
              ]}
            >
              {product.rating}
            </Text>

            <Text
              style={[
                styles.reviewCount,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              ({product.reviewCount})
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

function getProductIcon(
  category: MarketplaceProduct['category']
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (category) {
    case 'Brakes':
      return 'disc'

    case 'Engine':
      return 'engine-outline'

    case 'Battery':
      return 'car-battery'

    case 'Tyres':
      return 'tire'

    case 'Fluids':
      return 'oil'

    default:
      return 'car-cog'
  }
}

const styles = StyleSheet.create({
  card: {
    width: 164,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
  },

  imagePlaceholder: {
    height: 92,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  compatibilityPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  compatibilityText: {
    fontSize: 7,
    fontWeight: '700',
  },

  name: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 9,
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },

  price: {
    fontSize: 11,
    fontWeight: '800',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  rating: {
    fontSize: 8,
    fontWeight: '700',
  },

  reviewCount: {
    fontSize: 7,
  },
})