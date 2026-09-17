import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Modal,
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
import StableScrollView from '../../src/components/StableScrollView'
import { useCustomerMarketplace } from '../../src/customer/CustomerMarketplaceContext'
import {
  MarketplaceCategory,
  MarketplaceProduct,
  MarketplaceProductFilters,
  MarketplaceProductSort,
  MarketplaceStore,
} from '../../src/customer/marketplaceTypes'
import { useTheme } from '../../src/theme/ThemeContext'

const defaultProductFilters: MarketplaceProductFilters = {
  compatibleOnly: false,
  sortBy: 'recommended',
}

const sortOptions: {
  value: MarketplaceProductSort
  label: string
}[] = [
  {
    value: 'recommended',
    label: 'Recommended',
  },
  {
    value: 'price-low-to-high',
    label: 'Price: Low to High',
  },
  {
    value: 'price-high-to-low',
    label: 'Price: High to Low',
  },
  {
    value: 'rating-high-to-low',
    label: 'Rating: High to Low',
  },
]

export default function CustomerMarketplace() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    marketplaceData,
    isLoadingMarketplace,
    marketplaceError,
  } = useCustomerMarketplace()

  const [searchQuery, setSearchQuery] =
    useState('')

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<MarketplaceCategory | null>(
      null
    )

  const [
    productFilters,
    setProductFilters,
  ] =
    useState<MarketplaceProductFilters>(
      defaultProductFilters
    )

  const [
    draftProductFilters,
    setDraftProductFilters,
  ] =
    useState<MarketplaceProductFilters>(
      defaultProductFilters
    )

  const [
    isFilterVisible,
    setIsFilterVisible,
  ] = useState(false)

  const categories =
    marketplaceData?.categories ?? []

  const products =
    marketplaceData?.recommendedProducts ?? []

  const nearbyStores =
    marketplaceData?.nearbyStores ?? []

  const recentActivity =
    marketplaceData?.recentActivity ?? []

  const filteredProducts = products
    .filter((product) => {
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

      const matchesCompatibility =
        !productFilters.compatibleOnly ||
        product.compatibleWithSelectedVehicle ===
          true

      return (
        matchesCategory &&
        matchesSearch &&
        matchesCompatibility
      )
    })
    .sort((first, second) =>
      compareProducts(
        first,
        second,
        productFilters.sortBy
      )
    )

  const hasActiveFilters =
    productFilters.compatibleOnly ||
    productFilters.sortBy !==
      'recommended'

  function openFilters() {
    setDraftProductFilters(
      productFilters
    )
    setIsFilterVisible(true)
  }

  function closeFilters() {
    setIsFilterVisible(false)
  }

  function applyFilters() {
    setProductFilters(
      draftProductFilters
    )
    setIsFilterVisible(false)
  }

  function resetFilters() {
    setDraftProductFilters(
      defaultProductFilters
    )
    setProductFilters(
      defaultProductFilters
    )
  }

  const handleProductPress = (
    product: MarketplaceProduct
  ) => {
    router.push({
      pathname:
        '/marketplace-product/[productId]',
      params: {
        productId: product.id,
      },
    })
  }

  const handleStorePress = (
    store: MarketplaceStore
  ) => {
    router.push({
      pathname:
        '/marketplace-store/[storeId]',
      params: {
        storeId: store.id,
      },
    })
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      edges={['top']}
    >
      <StableScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
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
              color:
                colors.secondaryText,
            },
          ]}
        >
          Find compatible parts,
          compare prices, and discover
          nearby stores.
        </Text>

        <View
          style={styles.searchRow}
        >
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
              placeholder="Search for parts, brands, or stores..."
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

          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  hasActiveFilters
                    ? colors.accent
                    : colors.border,
              },
            ]}
            onPress={openFilters}
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={21}
              color={colors.accent}
            />

            {hasActiveFilters ? (
              <View
                style={[
                  styles.filterIndicator,
                  {
                    backgroundColor:
                      colors.accent,
                    borderColor:
                      colors.card,
                  },
                ]}
              />
            ) : null}
          </TouchableOpacity>
        </View>

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
          onPress={() =>
            router.push(
              '/marketplace-picture-search'
            )
          }
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

          <View
            style={
              styles.imageSearchContent
            }
          >
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
              Take or upload a photo to
              identify a vehicle part.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={
              colors.secondaryText
            }
          />
        </TouchableOpacity>

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

        <View
          style={styles.sectionHeader}
        >
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
            onPress={() =>
              router.push(
                '/marketplace-products'
              )
            }
          >
            <Text
              style={[
                styles.viewAll,
                {
                  color:
                    colors.accent,
                },
              ]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {filteredProducts.length ===
        0 ? (
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

        <View
          style={styles.sectionHeader}
        >
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
            onPress={() =>
              router.push(
                '/marketplace-stores'
              )
            }
          >
            <Text
              style={[
                styles.viewAll,
                {
                  color:
                    colors.accent,
                },
              ]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {nearbyStores.length ===
        0 ? (
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
          <View
            style={styles.storesList}
          >
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

        <View
          style={styles.sectionHeader}
        >
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
            onPress={() =>
              router.push(
                '/marketplace-activity'
              )
            }
          >
            <Text
              style={[
                styles.viewAll,
                {
                  color:
                    colors.accent,
                },
              ]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {recentActivity.length ===
        0 ? (
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
              No marketplace activity
              yet.
            </Text>
          </View>
        ) : (
          <View
            style={styles.activityList}
          >
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
                color:
                  colors.danger,
              },
            ]}
          >
            {marketplaceError}
          </Text>
        ) : null}
      </StableScrollView>

      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        onRequestClose={
          closeFilters
        }
      >
        <View
          style={
            styles.modalBackdrop
          }
        >
          <TouchableOpacity
            activeOpacity={1}
            style={
              styles.modalDismissArea
            }
            onPress={closeFilters}
          />

          <View
            style={[
              styles.filterSheet,
              {
                backgroundColor:
                  colors.background,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={
                styles.filterHeader
              }
            >
              <Text
                style={[
                  styles.filterTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Filter Products
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeFilters}
                style={[
                  styles.closeButton,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.filterSectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Compatibility
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                setDraftProductFilters(
                  (current) => ({
                    ...current,
                    compatibleOnly:
                      !current.compatibleOnly,
                  })
                )
              }
              style={[
                styles.filterOption,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    draftProductFilters.compatibleOnly
                      ? colors.accent
                      : colors.border,
                },
              ]}
            >
              <View
                style={
                  styles.filterOptionContent
                }
              >
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={21}
                  color={
                    draftProductFilters.compatibleOnly
                      ? colors.accent
                      : colors.secondaryText
                  }
                />

                <View
                  style={
                    styles.filterOptionText
                  }
                >
                  <Text
                    style={[
                      styles.filterOptionTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    Compatible only
                  </Text>

                  <Text
                    style={[
                      styles.filterOptionDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Show only products
                    currently marked as
                    compatible with the
                    selected vehicle.
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor:
                      draftProductFilters.compatibleOnly
                        ? colors.accent
                        : colors.border,
                    backgroundColor:
                      draftProductFilters.compatibleOnly
                        ? colors.accent
                        : 'transparent',
                  },
                ]}
              >
                {draftProductFilters.compatibleOnly ? (
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color="#000000"
                  />
                ) : null}
              </View>
            </TouchableOpacity>

            <Text
              style={[
                styles.filterSectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Sort By
            </Text>

            <View
              style={
                styles.sortOptions
              }
            >
              {sortOptions.map(
                (option) => {
                  const isSelected =
                    draftProductFilters.sortBy ===
                    option.value

                  return (
                    <TouchableOpacity
                      key={
                        option.value
                      }
                      activeOpacity={0.75}
                      onPress={() =>
                        setDraftProductFilters(
                          (current) => ({
                            ...current,
                            sortBy:
                              option.value,
                          })
                        )
                      }
                      style={[
                        styles.sortOption,
                        {
                          backgroundColor:
                            colors.card,
                          borderColor:
                            isSelected
                              ? colors.accent
                              : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          {
                            color:
                              isSelected
                                ? colors.accent
                                : colors.text,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>

                      <View
                        style={[
                          styles.radioOuter,
                          {
                            borderColor:
                              isSelected
                                ? colors.accent
                                : colors.border,
                          },
                        ]}
                      >
                        {isSelected ? (
                          <View
                            style={[
                              styles.radioInner,
                              {
                                backgroundColor:
                                  colors.accent,
                              },
                            ]}
                          />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  )
                }
              )}
            </View>

            <View
              style={
                styles.filterActions
              }
            >
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={resetFilters}
                style={[
                  styles.resetButton,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.resetButtonText,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  Reset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={applyFilters}
                style={[
                  styles.applyButton,
                  {
                    backgroundColor:
                      colors.accent,
                  },
                ]}
              >
                <Text
                  style={
                    styles.applyButtonText
                  }
                >
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

function compareProducts(
  first: MarketplaceProduct,
  second: MarketplaceProduct,
  sortBy: MarketplaceProductSort
) {
  switch (sortBy) {
    case 'price-low-to-high':
      return compareNullableNumbers(
        first.price,
        second.price,
        'ascending'
      )

    case 'price-high-to-low':
      return compareNullableNumbers(
        first.price,
        second.price,
        'descending'
      )

    case 'rating-high-to-low':
      return compareNullableNumbers(
        first.rating,
        second.rating,
        'descending'
      )

    case 'recommended':
    default:
      return 0
  }
}

function compareNullableNumbers(
  first: number | null,
  second: number | null,
  direction:
    | 'ascending'
    | 'descending'
) {
  if (
    first === null &&
    second === null
  ) {
    return 0
  }

  if (first === null) {
    return 1
  }

  if (second === null) {
    return -1
  }

  return direction === 'ascending'
    ? first - second
    : second - first
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
    position: 'relative',
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterIndicator: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderWidth: 1,
    borderRadius: 4,
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

  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0, 0, 0, 0.65)',
  },

  modalDismissArea: {
    flex: 1,
  },

  filterSheet: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  filterTitle: {
    fontSize: 19,
    fontWeight: '800',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterSectionTitle: {
    marginTop: 20,
    marginBottom: 9,
    fontSize: 12,
    fontWeight: '700',
  },

  filterOption: {
    minHeight: 74,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: 12,
  },

  filterOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  filterOptionText: {
    flex: 1,
  },

  filterOptionTitle: {
    fontSize: 11,
    fontWeight: '700',
  },

  filterOptionDescription: {
    marginTop: 4,
    fontSize: 8,
    lineHeight: 13,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sortOptions: {
    gap: 8,
  },

  sortOption: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  sortOptionText: {
    fontSize: 10,
    fontWeight: '600',
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  filterActions: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 10,
  },

  resetButton: {
    minHeight: 48,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  applyButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  applyButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
})