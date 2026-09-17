import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'

import FuelMap from '../src/components/FuelMap'
import { useForegroundLocation } from '../src/location/useForegroundLocation'
import { useTheme } from '../src/theme/ThemeContext'

export default function NearbyFuelStationsScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    location,
    isLoadingLocation,
    locationError,
    refreshLocation,
  } = useForegroundLocation()

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
            onPress={() => router.back()}
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
            Nearby Stations
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
          Fuel Stations Near You
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
          View your current location and
          available nearby fuel stations.
        </Text>

        <View style={styles.mapSection}>
          <FuelMap
            customerLocation={location}
            isLoading={
              isLoadingLocation
            }
            errorMessage={
              locationError
            }
            height={330}
          />
        </View>

        {locationError ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={refreshLocation}
            style={[
              styles.retryButton,
              {
                backgroundColor:
                  colors.accent,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={18}
              color="#000000"
            />

            <Text
              style={
                styles.retryButtonText
              }
            >
              Try Location Again
            </Text>
          </TouchableOpacity>
        ) : null}

        {!isLoadingLocation &&
        !locationError ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="gas-station-off-outline"
              size={38}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Station data unavailable
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Your location can still be
              displayed on the map.
              Nearby fuel stations will
              appear once the station
              provider is connected.
            </Text>
          </View>
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
    justifyContent: 'space-between',
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

  mapSection: {
    marginTop: 20,
  },

  retryButton: {
    minHeight: 44,
    marginTop: 14,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  retryButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyCard: {
    marginTop: 16,
    minHeight: 150,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '700',
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
})