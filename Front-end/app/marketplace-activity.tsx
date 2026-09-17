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

import MarketplaceActivityCard from '../src/components/MarketplaceActivityCard'
import { useMarketplaceActivity } from '../src/customer/useMarketplaceActivity'
import { useTheme } from '../src/theme/ThemeContext'
import { useVehicle } from '../src/vehicles/VehicleContext'

export default function MarketplaceActivityScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    activity,
    isLoadingActivity,
    activityError,
    refreshActivity,
  } = useMarketplaceActivity(
    selectedVehicle?.id
  )

  const isLoading =
    isLoadingVehicles ||
    isLoadingActivity

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
            Marketplace Activity
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
          Recent Activity
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
          Review recent Marketplace
          actions linked to your
          account and selected vehicle.
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
              Loading activity...
            </Text>
          </View>
        ) : activityError ? (
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
              Unable to Load Activity
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
              {activityError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={
                refreshActivity
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
        ) : activity.length ===
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
              name="history"
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
              No Marketplace Activity
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
              Your Marketplace activity
              will appear here when
              backend account activity
              is available.
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.activityList
            }
          >
            {activity.map(
              (item) => (
                <MarketplaceActivityCard
                  key={item.id}
                  activity={item}
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
            Production Marketplace
            history must come from the
            authenticated customer
            account and backend activity
            records.
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

  activityList: {
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