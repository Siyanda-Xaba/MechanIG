import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'

import MarketplaceStoreCard from '../src/components/MarketplaceStoreCard'
import { useMarketplaceStores } from '../src/customer/useMarketplaceStores'
import type { MarketplaceStore } from '../src/customer/marketplaceTypes'
import { useTheme } from '../src/theme/ThemeContext'

export default function MarketplaceStoresScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    stores,
    isLoadingStores,
    storesError,
    refreshStores,
  } = useMarketplaceStores()

  function handleStorePress(
    store: MarketplaceStore
  ) {
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
            Nearby Stores
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
          Marketplace Stores
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
          Browse nearby parts stores
          available through the
          Marketplace.
        </Text>

        {isLoadingStores ? (
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
              Loading nearby stores...
            </Text>
          </View>
        ) : storesError ? (
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
              Unable to Load Stores
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
              {storesError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={refreshStores}
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
        ) : stores.length === 0 ? (
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
            <Ionicons
              name="storefront-outline"
              size={38}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No Stores Available
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
              No nearby Marketplace
              stores are currently
              available.
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.storesList
            }
          >
            {stores.map((store) => (
              <MarketplaceStoreCard
                key={store.id}
                store={store}
                onPress={
                  handleStorePress
                }
              />
            ))}
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
            Production distance,
            location, opening status,
            stock and pricing must come
            from validated Marketplace
            or provider data.
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

  storesList: {
    marginTop: 20,
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