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

import { useFuelHistory } from '../src/customer/useFuelHistory'
import { useTheme } from '../src/theme/ThemeContext'
import { useVehicle } from '../src/vehicles/VehicleContext'

export default function FuelHistoryScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    history,
    isLoadingHistory,
    historyError,
    refreshHistory,
  } = useFuelHistory(
    selectedVehicle?.id ?? null
  )

  const isLoading =
    isLoadingVehicles ||
    isLoadingHistory

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
            Fuel History
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={refreshHistory}
            disabled={
              isLoadingHistory
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
              name="refresh"
              size={19}
              color={
                isLoadingHistory
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
          Fuel Activity
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
          Review fuel deliveries,
          scheduled top-ups, and other
          fuel activity for your
          selected vehicle.
        </Text>

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
          <View
            style={
              styles.vehicleHeader
            }
          >
            <MaterialCommunityIcons
              name="car-outline"
              size={22}
              color={colors.accent}
            />

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
          </View>

          {isLoadingVehicles ? (
            <Text
              style={[
                styles.vehicleMessage,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Loading vehicle...
            </Text>
          ) : selectedVehicle ? (
            <>
              <Text
                style={[
                  styles.vehicleName,
                  {
                    color: colors.text,
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
                  styles.registration,
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
            </>
          ) : (
            <Text
              style={[
                styles.vehicleMessage,
                {
                  color: colors.danger,
                },
              ]}
            >
              No vehicle selected.
            </Text>
          )}
        </View>

        {isLoading ? (
          <View
            style={styles.stateContainer}
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
              Loading fuel history...
            </Text>
          </View>
        ) : historyError ? (
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
              size={42}
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
              Unable to load history
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {historyError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={refreshHistory}
              style={[
                styles.retryButton,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            >
              <Ionicons
                name="refresh"
                size={17}
                color="#000000"
              />

              <Text
                style={
                  styles.retryButtonText
                }
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : !selectedVehicle ? (
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
              name="car-off"
              size={42}
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
              No vehicle selected
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Select a vehicle before
              viewing its fuel history.
            </Text>
          </View>
        ) : history.length === 0 ? (
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
              size={42}
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
              No fuel activity yet
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Fuel deliveries and
              scheduled top-ups will
              appear here when activity
              is available.
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.historySection
            }
          >
            <View
              style={
                styles.sectionHeader
              }
            >
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Activity
              </Text>

              <Text
                style={[
                  styles.activityCount,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {history.length}{' '}
                {history.length === 1
                  ? 'record'
                  : 'records'}
              </Text>
            </View>

            {history.map(
              (activity) => {
                const status =
                  activity.status.toLowerCase()

                const statusColor =
                  status ===
                    'completed'
                    ? colors.success
                    : status ===
                        'cancelled'
                      ? colors.danger
                      : status ===
                          'scheduled'
                        ? colors.accent
                        : colors.secondaryText

                return (
                  <View
                    key={activity.id}
                    style={[
                      styles.activityCard,
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
                        styles.activityIcon,
                        {
                          borderColor:
                            statusColor,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="gas-station-outline"
                        size={22}
                        color={
                          statusColor
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.activityContent
                      }
                    >
                      <View
                        style={
                          styles.activityTopRow
                        }
                      >
                        <Text
                          style={[
                            styles.activityTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {
                            activity.title
                          }
                        </Text>

                        <View
                          style={[
                            styles.statusBadge,
                            {
                              borderColor:
                                statusColor,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  statusColor,
                              },
                            ]}
                          >
                            {
                              activity.status
                            }
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.activityDescription,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {
                          activity.description
                        }
                      </Text>

                      <View
                        style={
                          styles.activityTimeRow
                        }
                      >
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color={
                            colors.secondaryText
                          }
                        />

                        <Text
                          style={[
                            styles.activityTime,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {
                            activity.occurredAt
                          }
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              }
            )}
          </View>
        )}
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
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  vehicleLabel: {
    fontSize: 9,
    fontWeight: '600',
  },

  vehicleName: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
  },

  registration: {
    marginTop: 4,
    fontSize: 10,
  },

  vehicleMessage: {
    marginTop: 12,
    fontSize: 11,
  },

  stateContainer: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateText: {
    marginTop: 12,
    fontSize: 11,
  },

  stateCard: {
    minHeight: 220,
    marginTop: 18,
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

  historySection: {
    marginTop: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  activityCount: {
    fontSize: 9,
  },

  activityCard: {
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  activityIcon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityContent: {
    flex: 1,
    marginLeft: 12,
  },

  activityTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:
      'space-between',
    gap: 8,
  },

  activityTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },

  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 8,
    fontWeight: '700',
  },

  activityDescription: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 15,
  },

  activityTimeRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  activityTime: {
    fontSize: 9,
  },
})