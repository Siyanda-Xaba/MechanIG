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

import { useMarketplaceStore } from '../../src/customer/useMarketplaceStore'
import { useTheme } from '../../src/theme/ThemeContext'

export default function MarketplaceStoreScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    storeId,
  } = useLocalSearchParams<{
    storeId?: string
  }>()

  const {
    store,
    isLoadingStore,
    storeError,
    refreshStore,
  } = useMarketplaceStore(storeId)

  const statusColor =
    store?.isOpen === true
      ? colors.success
      : store?.isOpen === false
        ? colors.danger
        : colors.secondaryText

  const statusLabel =
    store?.isOpen === true
      ? store.closingTime
        ? `Open • Closing ${store.closingTime}`
        : 'Open'
      : store?.isOpen === false
        ? 'Closed'
        : 'Status unavailable'

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
            Store Details
          </Text>

          <View
            style={
              styles.headerPlaceholder
            }
          />
        </View>

        {isLoadingStore ? (
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
              Loading store...
            </Text>
          </View>
        ) : storeError ? (
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
              Unable to Load Store
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
              {storeError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={refreshStore}
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
        ) : store ? (
          <>
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.storeIcon,
                  {
                    borderColor:
                      colors.accent,
                  },
                ]}
              >
                <Ionicons
                  name="storefront-outline"
                  size={42}
                  color={colors.accent}
                />
              </View>

              <Text
                style={[
                  styles.storeName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {store.name}
              </Text>

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
                  name="map-marker-outline"
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
                  Location
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
                {store.address ??
                  'Store address unavailable.'}
              </Text>

              <View
                style={
                  styles.metaRow
                }
              >
                <Text
                  style={[
                    styles.metaLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Distance
                </Text>

                <Text
                  style={[
                    styles.metaValue,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {store.distanceKm !==
                  null
                    ? `${store.distanceKm} km`
                    : 'Unavailable'}
                </Text>
              </View>

              <View
                style={
                  styles.metaRow
                }
              >
                <Text
                  style={[
                    styles.metaLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Map coordinates
                </Text>

                <Text
                  style={[
                    styles.metaValue,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {store.latitude !==
                    null &&
                  store.longitude !==
                    null
                    ? 'Available'
                    : 'Unavailable'}
                </Text>
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
                  name="clock-outline"
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
                  Store Status
                </Text>
              </View>

              <Text
                style={[
                  styles.statusDetail,
                  {
                    color: statusColor,
                  },
                ]}
              >
                {statusLabel}
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
                Full trading hours will
                be provided by validated
                Marketplace store data
                when the backend is
                connected.
              </Text>
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
                  name="package-variant-closed"
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
                  Products & Stock
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
                Store inventory, live
                stock and current pricing
                are not available from
                the development data.
                Production values must
                come from the validated
                Marketplace backend or
                provider.
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
                Store location, opening
                status, product
                availability and pricing
                should be confirmed from
                authoritative provider
                data before being used
                for purchasing or
                navigation.
              </Text>
            </View>
          </>
        ) : null}
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

  heroCard: {
    marginTop: 12,
    padding: 22,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
  },

  storeIcon: {
    width: 82,
    height: 82,
    borderWidth: 1,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
  },

  storeName: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },

  status: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '700',
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

  infoText: {
    marginTop: 10,
    fontSize: 10,
    lineHeight: 16,
  },

  statusDetail: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
  },

  metaRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: 12,
  },

  metaLabel: {
    flex: 1,
    fontSize: 9,
  },

  metaValue: {
    fontSize: 10,
    fontWeight: '700',
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