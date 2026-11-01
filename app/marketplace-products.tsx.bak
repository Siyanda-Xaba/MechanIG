import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'

import MarketplaceProductCard from '../src/components/MarketplaceProductCard'
import { useMarketplaceProducts } from '../src/customer/useMarketplaceProducts'
import type {
  MarketplaceCategory,
  MarketplaceProduct,
} from '../src/customer/marketplaceTypes'
import { useTheme } from '../src/theme/ThemeContext'
import { useVehicle } from '../src/vehicles/VehicleContext'

export default function MarketplaceProductsScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    products,
    isLoadingProducts,
    productsError,
    refreshProducts,
  } = useMarketplaceProducts(
    selectedVehicle?.id
  )

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<MarketplaceCategory | null>(
      null
    )

  const categories = Array.from(
    new Set(
      products.map(
        (product) => product.category
      )
    )
  )

  const filteredProducts =
    products.filter((product) => {
      const matchesCategory =
        selectedCategory === null ||
        product.category ===
          selectedCategory

      const normalizedQuery =
        searchQuery
          .trim()
          .toLowerCase()

      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name
          .toLowerCase()
          .includes(normalizedQuery) ||
        product.subtitle
          .toLowerCase()
          .includes(normalizedQuery) ||
        product.category
          .toLowerCase()
          .includes(normalizedQuery)

      return (
        matchesCategory &&
        matchesSearch
      )
    })

  function handleProductPress(
    product: MarketplaceProduct
  ) {
    router.push({
      pathname:
        '/marketplace-product/[productId]',
      params: {
        productId: product.id,
      },
    })
  }

  const isLoading =
    isLoadingVehicles ||
    isLoadingProducts

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
        keyboardShouldPersistTaps="handled"
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
            Products
          </Text>

          <View
            style={
              styles.headerPlaceholder
            }
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
          Recommended Products
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Browse Marketplace products
          for your selected vehicle.
        </Text>

        {selectedVehicle ? (
          <View
            style={[
              styles.vehicleCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="car-outline"
              size={21}
              color={colors.accent}
            />

            <View
              style={
                styles.vehicleContent
              }
            >
              <Text
                style={[
                  styles.vehicleLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Selected Vehicle
              </Text>

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
            </View>
          </View>
        ) : null}

        {!isLoading &&
        !productsError &&
        products.length > 0 ? (
          <>
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={
                  colors.secondaryText
                }
              />

              <TextInput
                value={searchQuery}
                onChangeText={
                  setSearchQuery
                }
                placeholder="Search products..."
                placeholderTextColor={
                  colors.secondaryText
                }
                returnKeyType="search"
                style={[
                  styles.searchInput,
                  {
                    color:
                      colors.text,
                  },
                ]}
              />

              {searchQuery.length >
              0 ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    setSearchQuery('')
                  }
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={
                      colors.secondaryText
                    }
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.categoriesRow
              }
            >
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  setSelectedCategory(
                    null
                  )
                }
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor:
                      selectedCategory ===
                      null
                        ? colors.accent
                        : colors.card,
                    borderColor:
                      selectedCategory ===
                      null
                        ? colors.accent
                        : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        selectedCategory ===
                        null
                          ? '#000000'
                          : colors.text,
                    },
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              {categories.map(
                (category) => {
                  const isSelected =
                    selectedCategory ===
                    category

                  return (
                    <TouchableOpacity
                      key={category}
                      activeOpacity={0.75}
                      onPress={() =>
                        setSelectedCategory(
                          isSelected
                            ? null
                            : category
                        )
                      }
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor:
                            isSelected
                              ? colors.accent
                              : colors.card,
                          borderColor:
                            isSelected
                              ? colors.accent
                              : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color:
                              isSelected
                                ? '#000000'
                                : colors.text,
                          },
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  )
                }
              )}
            </ScrollView>
          </>
        ) : null}

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
              Loading products...
            </Text>
          </View>
        ) : productsError ? (
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
                  color:
                    colors.text,
                },
              ]}
            >
              Unable to Load Products
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
              {productsError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={
                refreshProducts
              }
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
        ) : products.length ===
          0 ? (
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
              name="package-variant-closed"
              size={38}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              No Products Available
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
              No Marketplace products
              are currently available
              for the selected vehicle.
            </Text>
          </View>
        ) : filteredProducts.length ===
          0 ? (
          <View
            style={[
              styles.noResultsCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={34}
              color={
                colors.secondaryText
              }
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
              No products match your
              current search or category.
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.productsGrid
            }
          >
            {filteredProducts.map(
              (product) => (
                <MarketplaceProductCard
                  key={product.id}
                  product={product}
                  onPress={
                    handleProductPress
                  }
                />
              )
            )}
          </View>
        )}

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
            Production prices, stock,
            seller information and
            vehicle compatibility must
            come from validated
            Marketplace or provider
            data.
          </Text>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
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

  title: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },

  vehicleCard: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  vehicleContent: {
    flex: 1,
  },

  vehicleLabel: {
    fontSize: 8,
  },

  vehicleName: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '700',
  },

  searchContainer: {
    minHeight: 48,
    marginTop: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  searchInput: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 0,
    fontSize: 11,
  },

  categoriesRow: {
    marginTop: 12,
    gap: 8,
    paddingRight: 4,
  },

  categoryChip: {
    minHeight: 34,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryText: {
    fontSize: 9,
    fontWeight: '700',
  },

  centeredState: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateCard: {
    minHeight: 210,
    marginTop: 24,
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
    textAlign: 'center',
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

  noResultsCard: {
    minHeight: 150,
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productsGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  noticeCard: {
    marginTop: 18,
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