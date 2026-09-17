import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'

import { useMarketplaceProduct } from '../../src/customer/useMarketplaceProduct'
import type { MarketplaceProduct } from '../../src/customer/marketplaceTypes'
import { useTheme } from '../../src/theme/ThemeContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function MarketplaceProductScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    productId,
  } = useLocalSearchParams<{
    productId?: string
  }>()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    product,
    isLoadingProduct,
    productError,
    refreshProduct,
  } = useMarketplaceProduct(
    productId,
    selectedVehicle?.id
  )

  const isLoading =
    isLoadingVehicles ||
    isLoadingProduct

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <StableScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.back()
            }
            style={[
              styles.headerButton,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Product Details
          </Text>

          <View
            style={
              styles.headerPlaceholder
            }
          />
        </View>

        {isLoading ? (
          <View
            style={
              styles.centeredState
            }
          >
            <ActivityIndicator
              size="large"
              color={colors.accent}
            />

            <Text
              style={[
                styles.stateText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Loading product...
            </Text>
          </View>
        ) : productError ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={34}
              color={colors.danger}
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Unable to Load Product
            </Text>

            <Text
              style={[
                styles.stateText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {productError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={refreshProduct}
              style={[
                styles.retryButton,
                {
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.retryButtonText,
                  {
                    color:
                      colors.accent,
                  },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : product ? (
          <>
            <View
              style={[
                styles.imageCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={getProductIcon(
                  product
                )}
                size={72}
                color={colors.accent}
              />

              <Text
                style={[
                  styles.imageFallbackText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Product image unavailable
              </Text>
            </View>

            <View
              style={
                styles.titleSection
              }
            >
              <View
                style={
                  styles.categoryRow
                }
              >
                <Text
                  style={[
                    styles.category,
                    {
                      color:
                        colors.accent,
                    },
                  ]}
                >
                  {product.category}
                </Text>

                {product.compatibleWithSelectedVehicle ===
                true ? (
                  <View
                    style={[
                      styles.compatibilityPill,
                      {
                        borderColor:
                          colors.success,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="check"
                      size={12}
                      color={
                        colors.success
                      }
                    />

                    <Text
                      style={[
                        styles.compatibilityPillText,
                        {
                          color:
                            colors.success,
                        },
                      ]}
                    >
                      Compatible
                    </Text>
                  </View>
                ) : product.compatibleWithSelectedVehicle ===
                  false ? (
                  <View
                    style={[
                      styles.compatibilityPill,
                      {
                        borderColor:
                          colors.danger,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={12}
                      color={
                        colors.danger
                      }
                    />

                    <Text
                      style={[
                        styles.compatibilityPillText,
                        {
                          color:
                            colors.danger,
                        },
                      ]}
                    >
                      Not Compatible
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text
                style={[
                  styles.productName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {product.name}
              </Text>

              <Text
                style={[
                  styles.productSubtitle,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {product.subtitle}
              </Text>

              <View
                style={
                  styles.priceRatingRow
                }
              >
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

                {product.rating !==
                null ? (
                  <View
                    style={
                      styles.ratingRow
                    }
                  >
                    <Ionicons
                      name="star"
                      size={16}
                      color={
                        colors.warning
                      }
                    />

                    <Text
                      style={[
                        styles.rating,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {product.rating}
                    </Text>

                    <Text
                      style={[
                        styles.reviewCount,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      (
                      {
                        product.reviewCount
                      }{' '}
                      reviews)
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <View
                style={
                  styles.infoHeader
                }
              >
                <MaterialCommunityIcons
                  name="car-cog"
                  size={22}
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.infoTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Vehicle Compatibility
                </Text>
              </View>

              {selectedVehicle ? (
                <>
                  <Text
                    style={[
                      styles.vehicleName,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {
                      selectedVehicle.make
                    }{' '}
                    {
                      selectedVehicle.model
                    }
                  </Text>

                  <Text
                    style={[
                      styles.infoText,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    {
                      selectedVehicle.registration
                    }
                  </Text>

                  <CompatibilityMessage
                    product={product}
                  />
                </>
              ) : (
                <Text
                  style={[
                    styles.infoText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Select a vehicle to
                  verify product
                  compatibility.
                </Text>
              )}
            </View>

            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <View
                style={
                  styles.infoHeader
                }
              >
                <Ionicons
                  name="storefront-outline"
                  size={21}
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.infoTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Seller & Availability
                </Text>
              </View>

              <Text
                style={[
                  styles.infoText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Seller, stock and
                availability information
                will be provided by the
                validated Marketplace
                backend.
              </Text>
            </View>

            <View
              style={[
                styles.noticeCard,
                {
                  borderColor:
                    colors.warning,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={21}
                color={colors.warning}
              />

              <Text
                style={[
                  styles.noticeText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Marketplace prices,
                availability and fitment
                must be confirmed by
                validated backend or
                provider data before a
                purchase is completed.
              </Text>
            </View>
          </>
        ) : null}
      </StableScrollView>
    </SafeAreaView>
  )
}

function CompatibilityMessage({
  product,
}: {
  product: MarketplaceProduct
}) {
  const { colors } = useTheme()

  if (
    product.compatibleWithSelectedVehicle ===
    true
  ) {
    return (
      <View
        style={[
          styles.compatibilityMessage,
          {
            borderColor:
              colors.success,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={19}
          color={colors.success}
        />

        <Text
          style={[
            styles.compatibilityMessageText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Current Marketplace data marks
          this product as compatible with
          the selected vehicle.
        </Text>
      </View>
    )
  }

  if (
    product.compatibleWithSelectedVehicle ===
    false
  ) {
    return (
      <View
        style={[
          styles.compatibilityMessage,
          {
            borderColor:
              colors.danger,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="close-circle-outline"
          size={19}
          color={colors.danger}
        />

        <Text
          style={[
            styles.compatibilityMessageText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Current Marketplace data marks
          this product as incompatible
          with the selected vehicle.
        </Text>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.compatibilityMessage,
        {
          borderColor:
            colors.warning,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="help-circle-outline"
        size={19}
        color={colors.warning}
      />

      <Text
        style={[
          styles.compatibilityMessageText,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        Compatibility has not yet been
        confirmed for the selected
        vehicle.
      </Text>
    </View>
  )
}

function getProductIcon(
  product: MarketplaceProduct
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (product.category) {
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
  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  headerButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  headerPlaceholder: {
    width: 38,
  },

  centeredState: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateCard: {
    minHeight: 230,
    marginTop: 30,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
  },

  stateText: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 9,
  },

  retryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  imageCard: {
    height: 230,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageFallbackText: {
    marginTop: 12,
    fontSize: 10,
  },

  titleSection: {
    marginTop: 18,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: 12,
  },

  category: {
    fontSize: 11,
    fontWeight: '700',
  },

  compatibilityPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  compatibilityPillText: {
    fontSize: 8,
    fontWeight: '700',
  },

  productName: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
  },

  productSubtitle: {
    marginTop: 5,
    fontSize: 12,
  },

  priceRatingRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: 12,
  },

  price: {
    fontSize: 20,
    fontWeight: '800',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  rating: {
    fontSize: 11,
    fontWeight: '700',
  },

  reviewCount: {
    fontSize: 9,
  },

  infoCard: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
  },

  vehicleName: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
  },

  infoText: {
    marginTop: 7,
    fontSize: 10,
    lineHeight: 16,
  },

  compatibilityMessage: {
    marginTop: 12,
    padding: 11,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  compatibilityMessageText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },

  noticeCard: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  noticeText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 15,
  },
})