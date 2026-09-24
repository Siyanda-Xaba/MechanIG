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

import StableScrollView from '../../src/components/StableScrollView'

import {
  CustomerMaintenanceReminder,
  MaintenanceReminderStatus,
} from '../../src/customer/maintenanceTypes'
import { useCustomerMaintenance } from '../../src/customer/useCustomerMaintenance'
import { useTheme } from '../../src/theme/ThemeContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function CustomerMaintenanceScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    selectedVehicle,
  } = useVehicle()

  const {
    maintenanceData,
    isLoadingMaintenance,
    maintenanceError,
    refreshMaintenance,
  } = useCustomerMaintenance()

  const reminders =
    maintenanceData?.reminders ?? []

  function handleBookService(
    reminder: CustomerMaintenanceReminder
  ) {
    if (reminder.serviceId) {
      router.push({
        pathname: '/book-service/schedule',
        params: {
          serviceId: reminder.serviceId,
        },
      })

      return
    }

    router.push('/book-service')
  }

  if (isLoadingMaintenance) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text
          style={[
            styles.loadingText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Loading maintenance...
        </Text>
      </SafeAreaView>
    )
  }

  if (maintenanceError) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
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
          Unable to load maintenance
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
          {maintenanceError}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={refreshMaintenance}
          style={[
            styles.retryButton,
            {
              backgroundColor:
                colors.accent,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={18}
            color="#000000"
          />

          <Text
            style={styles.retryButtonText}
          >
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[
            styles.secondaryButton,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              {
                color: colors.text,
              },
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={[
              styles.backButton,
              {
                backgroundColor:
                  colors.card,
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

          <View style={styles.headerText}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Maintenance
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
              Service reminders for your vehicle
            </Text>
          </View>
        </View>

        {/* Vehicle */}
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
            <View
              style={[
                styles.vehicleIcon,
                {
                  borderColor:
                    colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="car-outline"
                size={24}
                color={colors.accent}
              />
            </View>

            <View
              style={styles.vehicleContent}
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
                Selected vehicle
              </Text>

              <Text
                style={[
                  styles.vehicleName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {selectedVehicle.make}{' '}
                {selectedVehicle.model}
              </Text>

              <Text
                style={[
                  styles.vehicleRegistration,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                {selectedVehicle.registration}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Service Reminders
            </Text>

            <Text
              style={[
                styles.sectionDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {reminders.length}{' '}
              {reminders.length === 1
                ? 'reminder'
                : 'reminders'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={refreshMaintenance}
            accessibilityRole="button"
            accessibilityLabel="Refresh maintenance"
            style={[
              styles.refreshButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={19}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        {reminders.length === 0 ? (
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
              name="wrench-outline"
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
              No maintenance reminders
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
              Upcoming service reminders for the selected vehicle will appear here.
            </Text>
          </View>
        ) : (
          <View
            style={styles.remindersList}
          >
            {reminders.map(
              (reminder) => {
                const statusLabel =
                  getStatusLabel(
                    reminder.status
                  )

                return (
                  <View
                    key={reminder.id}
                    style={[
                      styles.reminderCard,
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
                        styles.reminderHeader
                      }
                    >
                      <View
                        style={[
                          styles.reminderIcon,
                          {
                            borderColor:
                              colors.accent,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="wrench-outline"
                          size={23}
                          color={
                            colors.accent
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.reminderIdentity
                        }
                      >
                        <Text
                          style={[
                            styles.reminderTitle,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {reminder.title}
                        </Text>

                        <Text
                          style={[
                            styles.reminderStatus,
                            {
                              color:
                                getStatusColor(
                                  reminder.status,
                                  colors
                                ),
                            },
                          ]}
                        >
                          {statusLabel}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.reminderDescription,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      {
                        reminder.description
                      }
                    </Text>

                    <View
                      style={
                        styles.dueInformation
                      }
                    >
                      {reminder.dueInKm !==
                      null ? (
                        <View
                          style={[
                            styles.dueItem,
                            {
                              borderColor:
                                colors.border,
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="speedometer"
                            size={18}
                            color={
                              colors.accent
                            }
                          />

                          <View>
                            <Text
                              style={[
                                styles.dueLabel,
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
                                styles.dueValue,
                                {
                                  color:
                                    colors.text,
                                },
                              ]}
                            >
                              {reminder.dueInKm.toLocaleString()}{' '}
                              km
                            </Text>
                          </View>
                        </View>
                      ) : null}

                      {reminder.dueInDays !==
                      null ? (
                        <View
                          style={[
                            styles.dueItem,
                            {
                              borderColor:
                                colors.border,
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={18}
                            color={
                              colors.accent
                            }
                          />

                          <View>
                            <Text
                              style={[
                                styles.dueLabel,
                                {
                                  color:
                                    colors.secondaryText,
                                },
                              ]}
                            >
                              Time
                            </Text>

                            <Text
                              style={[
                                styles.dueValue,
                                {
                                  color:
                                    colors.text,
                                },
                              ]}
                            >
                              {reminder.dueInDays}{' '}
                              days
                            </Text>
                          </View>
                        </View>
                      ) : null}
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() =>
                        handleBookService(
                          reminder
                        )
                      }
                      style={[
                        styles.bookButton,
                        {
                          backgroundColor:
                            colors.accent,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="calendar-check-outline"
                        size={19}
                        color="#000000"
                      />

                      <Text
                        style={
                          styles.bookButtonText
                        }
                      >
                        Book Service
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              }
            )}
          </View>
        )}

        <View
          style={[
            styles.backendNotice,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={17}
            color={colors.accent}
          />

          <Text
            style={[
              styles.backendNoticeText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Maintenance recommendations will later be synchronized with vehicle mileage, service history, manufacturer intervals and validated diagnostic data. MechanIQ does not treat these frontend reminders as proof that a service is required or completed.
          </Text>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
}

function getStatusLabel(
  status: MaintenanceReminderStatus
) {
  switch (status) {
    case 'upcoming':
      return 'Upcoming'

    case 'due-soon':
      return 'Due Soon'

    case 'overdue':
      return 'Overdue'
  }
}

function getStatusColor(
  status: MaintenanceReminderStatus,
  colors: {
    accent: string
    warning: string
    danger: string
  }
) {
  switch (status) {
    case 'upcoming':
      return colors.accent

    case 'due-soon':
      return colors.warning

    case 'overdue':
      return colors.danger
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  centeredPage: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 12,
  },

  stateTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },

  stateDescription: {
    marginTop: 8,
    maxWidth: 300,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  retryButton: {
    minWidth: 160,
    minHeight: 44,
    marginTop: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  retryButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },

  secondaryButton: {
    minWidth: 160,
    minHeight: 44,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  header: {
    marginTop: 8,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 10,
  },

  vehicleCard: {
    minHeight: 82,
    marginTop: 22,
    padding: 13,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleContent: {
    flex: 1,
    marginLeft: 12,
  },

  vehicleLabel: {
    fontSize: 8.5,
  },

  vehicleName: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
  },

  vehicleRegistration: {
    marginTop: 3,
    fontSize: 9,
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  sectionDescription: {
    marginTop: 3,
    fontSize: 9.5,
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  remindersList: {
    gap: 12,
  },

  reminderCard: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reminderIcon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reminderIdentity: {
    flex: 1,
    marginLeft: 11,
  },

  reminderTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  reminderStatus: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '700',
  },

  reminderDescription: {
    marginTop: 14,
    fontSize: 10,
    lineHeight: 15,
  },

  dueInformation: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },

  dueItem: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dueLabel: {
    fontSize: 8,
  },

  dueValue: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
  },

  bookButton: {
    minHeight: 46,
    marginTop: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  bookButtonText: {
    color: '#000000',
    fontSize: 10.5,
    fontWeight: '800',
  },

  emptyCard: {
    minHeight: 200,
    padding: 22,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
  },

  emptyDescription: {
    marginTop: 6,
    maxWidth: 270,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },

  backendNotice: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  backendNoticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 8.5,
    lineHeight: 13,
  },
})