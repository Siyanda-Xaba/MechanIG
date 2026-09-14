import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import MarketplaceActivityCard from '../../src/components/MarketplaceActivityCard'
import MarketplaceProductCard from '../../src/components/MarketplaceProductCard'
import MarketplaceStoreCard from '../../src/components/MarketplaceStoreCard'
import { useCustomerMarketplace } from '../../src/customer/CustomerMarketplaceContext'
import {
  MarketplaceCategory,
  MarketplaceProduct,
  MarketplaceStore,
} from '../../src/customer/marketplaceTypes'
import { useTheme } from '../../src/theme/ThemeContext'

export default function CustomerMarketplace() {
  const { colors } = useTheme()

  const {
    marketplaceData,
    isLoadingMarketplace,
    marketplaceError,
  } = useCustomerMarketplace()

  const [searchQuery, setSearchQuery] =
    useState('')

  const [selectedCategory, setSelectedCategory] =
    useState<MarketplaceCategory | null>(null)

  const categories =
    marketplaceData?.categories ?? []

  const products =
    marketplaceData?.recommendedProducts ?? []

  const nearbyStores =
    marketplaceData?.nearbyStores ?? []

  const recentActivity =
    marketplaceData?.recentActivity ?? []

  const filteredProducts = products.filter(
    (product) => {
      const matchesCategory =
        selectedCategory === null ||
        product.category === selectedCategory

      const normalizedQuery =
        searchQuery.trim().toLowerCase()

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

      return matchesCategory && matchesSearch
    }
  )

  const handleProductPress = (
    product: MarketplaceProduct
  ) => {
    console.log(
      'Selected product:',
      product.id
    )
  }

  const handleStorePress = (
    store: MarketplaceStore
  ) => {
    console.log(
      'Selected store:',
      store.id
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Marketplace
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Find compatible parts, compare prices, and discover nearby stores.
        </Text>

        {/* Search */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.secondaryText}
            />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for parts, brands, or stores..."
              placeholderTextColor={
                colors.secondaryText
              }
              returnKeyType="search"
              style={[
                styles.searchInput,
                {
                  color: colors.text,
                },
              ]}
            />

            {searchQuery.length > 0 ? (
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

          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() => {}}
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={21}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        {/* Search by Picture */}
        <TouchableOpacity
          activeOpacity={0.75}
          style={[
            styles.imageSearchCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
          onPress={() => {}}
        >
          <View
            style={[
              styles.imageSearchIcon,
              {
                borderColor:
                  colors.accent,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={24}
              color={colors.accent}
            />
          </View>

          <View style={styles.imageSearchContent}>
            <Text
              style={[
                styles.imageSearchTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Search by Picture
            </Text>

            <Text
              style={[
                styles.imageSearchDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Take or upload a photo to identify a vehicle part.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={colors.secondaryText}
          />
        </TouchableOpacity>

        {/* Categories */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Categories
        </Text>

        {isLoadingMarketplace ? (
          <Text
            style={[
              styles.message,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Loading marketplace...
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.categoriesRow
            }
          >
            {categories.map(
              (category) => {
                const isSelected =
                  selectedCategory ===
                  category

                return (
                  <TouchableOpacity
                    key={category}
                    activeOpacity={0.75}
                    onPress={() => {
                      setSelectedCategory(
                        isSelected
                          ? null
                          : category
                      )
                    }}
                    style={[
                      styles.categoryCard,
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
                    <MaterialCommunityIcons
                      name={getCategoryIcon(
                        category
                      )}
                      size={22}
                      color={
                        isSelected
                          ? '#000000'
                          : colors.accent
                      }
                    />

                    <Text
                      style={[
                        styles.categoryLabel,
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
        )}

        {/* Recommended Products */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitleInline,
              {
                color: colors.text,
              },
            ]}
          >
            Recommended for Your Vehicle
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
          >
            <Text
              style={[
                styles.viewAll,
                {
                  color: colors.accent,
                },
              ]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {filteredProducts.length === 0 ? (
          <View
            style={[
              styles.emptyProducts,
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
              size={34}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.emptyProductsText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              No matching products found.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.productsRow
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
          </ScrollView>
        )}

        {/* Nearby Stores */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitleInline,
              {
                color: colors.text,
              },
            ]}
          >
            Nearby Stores
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
          >
            <Text
              style={[
                styles.viewAll,
                {
                  color: colors.accent,
                },
              ]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {nearbyStores.length === 0 ? (
          <View
            style={[
              styles.emptyProducts,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="storefront-outline"
              size={34}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.emptyProductsText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              No nearby stores available.
            </Text>
          </View>
        ) : (
          <View style={styles.storesList}>
            {nearbyStores.map(
              (store) => (
                <MarketplaceStoreCard
                  key={store.id}
                  store={store}
                  onPress={
                    handleStorePress
                  }
                />
              )
            )}
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitleInline,
              {
                color: colors.text,
              },
            ]}
          >
            Recent Activity
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
          >
            <Text
              style={[
                styles.viewAll,
                {
                  color: colors.accent,
                },
              ]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {recentActivity.length === 0 ? (
          <View
            style={[
              styles.emptyProducts,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="history"
              size={34}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.emptyProductsText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              No marketplace activity yet.
            </Text>
          </View>
        ) : (
          <View style={styles.activityList}>
            {recentActivity.map(
              (activity) => (
                <MarketplaceActivityCard
                  key={activity.id}
                  activity={activity}
                />
              )
            )}
          </View>
        )}

        {marketplaceError ? (
          <Text
            style={[
              styles.errorText,
              {
                color: colors.danger,
              },
            ]}
          >
            {marketplaceError}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

function getCategoryIcon(
  category: MarketplaceCategory
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
  safeArea: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  title: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
  },

  searchRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 8,
  },

  searchContainer: {
    flex: 1,
    minHeight: 48,
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

  filterButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageSearchCard: {
    minHeight: 78,
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  imageSearchIcon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageSearchContent: {
    flex: 1,
  },

  imageSearchTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  imageSearchDescription: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 14,
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: '700',
  },

  categoriesRow: {
    gap: 9,
    paddingRight: 4,
  },

  categoryCard: {
    width: 82,
    minHeight: 74,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryLabel: {
    marginTop: 7,
    fontSize: 9,
    fontWeight: '700',
  },

  sectionHeader: {
    marginTop: 22,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  sectionTitleInline: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },

  viewAll: {
    fontSize: 11,
    fontWeight: '600',
  },

  productsRow: {
    gap: 10,
    paddingRight: 4,
  },

  storesList: {
    gap: 10,
  },

  activityList: {
    gap: 10,
  },

  emptyProducts: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  emptyProductsText: {
    fontSize: 10,
  },

  message: {
    paddingVertical: 20,
    fontSize: 11,
    textAlign: 'center',
  },

  errorText: {
    marginTop: 12,
    fontSize: 11,
    textAlign: 'center',
  },
})