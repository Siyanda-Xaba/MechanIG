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

import { useSavedFuelLocations } from '../src/customer/useSavedFuelLocations'
import { useTheme } from '../src/theme/ThemeContext'

export default function FuelSavedLocationsScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    savedLocations,
    isLoadingSavedLocations,
    savedLocationsError,
    refreshSavedLocations,
  } = useSavedFuelLocations()

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StableScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={[
              styles.headerButton,
              {
                borderColor: colors.border,
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
            Saved Locations
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={refreshSavedLocations}
            disabled={isLoadingSavedLocations}
            style={[
              styles.headerButton,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="refresh"
              size={19}
              color={
                isLoadingSavedLocations
                  ? colors.secondaryText
                  : colors.accent
              }
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Delivery Locations
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Manage locations you use frequently for fuel delivery and scheduled
          top-ups.
        </Text>

        {isLoadingSavedLocations ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.accent}
            />

            <Text
              style={[
                styles.loadingText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Loading saved locations...
            </Text>
          </View>
        ) : savedLocationsError ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="map-marker-alert-outline"
              size={46}
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
              Unable to load locations
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              {savedLocationsError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={refreshSavedLocations}
              style={[
                styles.retryButton,
                {
                  backgroundColor: colors.accent,
                },
              ]}
            >
              <Ionicons
                name="refresh"
                size={17}
                color="#000000"
              />

              <Text style={styles.retryButtonText}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : savedLocations.length === 0 ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="map-marker-plus-outline"
              size={48}
              color={colors.secondaryText}
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No saved locations
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Saved fuel delivery locations will appear here once location
              management is connected to persistent customer data.
            </Text>
          </View>
        ) : (
          <View style={styles.locationsSection}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Your Locations
              </Text>

              <Text
                style={[
                  styles.locationCount,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                {savedLocations.length}{' '}
                {savedLocations.length === 1
                  ? 'location'
                  : 'locations'}
              </Text>
            </View>

            {savedLocations.map((location) => (
              <View
                key={location.id}
                style={[
                  styles.locationCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: location.isDefault
                      ? colors.accent
                      : colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.locationIcon,
                    {
                      borderColor: location.isDefault
                        ? colors.accent
                        : colors.border,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={24}
                    color={
                      location.isDefault
                        ? colors.accent
                        : colors.secondaryText
                    }
                  />
                </View>

                <View style={styles.locationContent}>
                  <View style={styles.locationTopRow}>
                    <Text
                      style={[
                        styles.locationLabel,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {location.label}
                    </Text>

                    {location.isDefault ? (
                      <View
                        style={[
                          styles.defaultBadge,
                          {
                            borderColor: colors.accent,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.defaultText,
                            {
                              color: colors.accent,
                            },
                          ]}
                        >
                          Default
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.locationAddress,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {location.address ?? 'Saved delivery location'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View
          style={[
            styles.infoCard,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={19}
            color={colors.accent}
          />

          <Text
            style={[
              styles.infoText,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Saved addresses and coordinates are customer account data and will
            be stored through the MechanIQ backend rather than only on this
            device.
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

  loadingContainer: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 11,
  },

  stateCard: {
    minHeight: 230,
    marginTop: 20,
    padding: 24,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
  },

  stateDescription: {
    marginTop: 7,
    maxWidth: 280,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
  },

  retryButton: {
    minHeight: 40,
    marginTop: 18,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  retryButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },

  locationsSection: {
    marginTop: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  locationCount: {
    fontSize: 9,
  },

  locationCard: {
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationContent: {
    flex: 1,
    marginLeft: 12,
  },

  locationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  locationLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },

  locationAddress: {
    marginTop: 5,
    fontSize: 10,
    lineHeight: 15,
  },

  defaultBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
  },

  defaultText: {
    fontSize: 8,
    fontWeight: '700',
  },

  infoCard: {
    marginTop: 18,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  infoText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },
})