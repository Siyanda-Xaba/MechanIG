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

import { useServiceHistory } from '../src/customer/useServiceHistory'
import { useTheme } from '../src/theme/ThemeContext'
import { useUser } from '../src/users/UserContext'
import { useVehicle } from '../src/vehicles/VehicleContext'

export default function ServiceHistoryScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    user,
    isLoadingUser,
  } = useUser()

  const {
    selectedVehicle,
    isLoadingVehicles,
  } = useVehicle()

  const {
    records,
    isLoadingServiceHistory,
    serviceHistoryError,
    refreshServiceHistory,
  } = useServiceHistory(
    user?.id ?? null,
    selectedVehicle?.id ?? null
  )

  const isLoading =
    isLoadingUser ||
    isLoadingVehicles ||
    isLoadingServiceHistory

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
              styles.backButton,
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
            Service History
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Vehicle Service Records
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          View completed and recorded workshop services for your
          selected vehicle.
        </Text>

        {selectedVehicle ? (
          <View
            style={[
              styles.vehicleCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.vehicleIcon,
                {
                  borderColor: colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="car-side"
                size={28}
                color={colors.accent}
              />
            </View>

            <View style={styles.vehicleContent}>
              <Text
                style={[
                  styles.vehicleName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {selectedVehicle.make} {selectedVehicle.model}
              </Text>

              <Text
                style={[
                  styles.vehicleRegistration,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                {selectedVehicle.registration}
              </Text>
            </View>
          </View>
        ) : null}

        {isLoading ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <ActivityIndicator
              size="large"
              color={colors.accent}
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Loading Service History
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Retrieving service records for your vehicle.
            </Text>
          </View>
        ) : !user ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={40}
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
              Customer Unavailable
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Your account information could not be loaded.
            </Text>
          </View>
        ) : !selectedVehicle ? (
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
              name="car-outline"
              size={42}
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
              No Vehicle Selected
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Select a vehicle before viewing its service history.
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                router.push('/vehicle-details')
              }
              style={[
                styles.primaryButton,
                {
                  backgroundColor: colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="car-search"
                size={19}
                color="#000000"
              />

              <Text style={styles.primaryButtonText}>
                View Vehicles
              </Text>
            </TouchableOpacity>
          </View>
        ) : serviceHistoryError ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={colors.warning}
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Service History Unavailable
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              {serviceHistoryError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={refreshServiceHistory}
              style={[
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={18}
                color={colors.text}
              />

              <Text
                style={[
                  styles.secondaryButtonText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : records.length === 0 ? (
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
              name="history"
              size={42}
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
              No Service Records
            </Text>

            <Text
              style={[
                styles.stateDescription,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Completed workshop services will appear here once they
              are available from the MechanIQ backend.
            </Text>
          </View>
        ) : (
          <View style={styles.recordsContainer}>
            {records.map((record) => (
              <View
                key={record.id}
                style={[
                  styles.recordCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.recordHeader}>
                  <View
                    style={[
                      styles.recordIcon,
                      {
                        borderColor: colors.accent,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="wrench-outline"
                      size={21}
                      color={colors.accent}
                    />
                  </View>

                  <View style={styles.recordHeaderContent}>
                    <Text
                      style={[
                        styles.recordTitle,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {record.serviceType}
                    </Text>

                    <Text
                      style={[
                        styles.recordDate,
                        {
                          color: colors.secondaryText,
                        },
                      ]}
                    >
                      {record.completedAt ??
                        record.scheduledDate}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        borderColor: colors.accent,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: colors.accent,
                        },
                      ]}
                    >
                      {formatStatus(record.status)}
                    </Text>
                  </View>
                </View>

                {record.issueDescription ? (
                  <Text
                    style={[
                      styles.recordDescription,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {record.issueDescription}
                  </Text>
                ) : null}

                <View
                  style={[
                    styles.recordDivider,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                />

                <View style={styles.recordDetails}>
                  <RecordDetail
                    label="Scheduled"
                    value={`${record.scheduledDate} • ${record.scheduledTime}`}
                    textColor={colors.text}
                    secondaryTextColor={
                      colors.secondaryText
                    }
                  />

                  <RecordDetail
                    label="Final Price"
                    value={
                      record.finalPrice !== null
                        ? `R ${record.finalPrice.toFixed(2)}`
                        : 'Not available'
                    }
                    textColor={colors.text}
                    secondaryTextColor={
                      colors.secondaryText
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        <View
          style={[
            styles.noticeCard,
            {
              borderColor: colors.warning,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color={colors.warning}
          />

          <Text
            style={[
              styles.noticeText,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Service history is only shown from authoritative backend
            and workshop records. MechanIQ does not treat development
            bookings or maintenance reminders as completed services.
          </Text>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
}

type RecordDetailProps = {
  label: string
  value: string
  textColor: string
  secondaryTextColor: string
}

function RecordDetail({
  label,
  value,
  textColor,
  secondaryTextColor,
}: RecordDetailProps) {
  return (
    <View style={styles.recordDetail}>
      <Text
        style={[
          styles.recordDetailLabel,
          {
            color: secondaryTextColor,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.recordDetailValue,
          {
            color: textColor,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  )
}

function formatStatus(status: string) {
  return status
    .split('-')
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(' ')
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
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
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
  },

  vehicleCard: {
    marginTop: 18,
    minHeight: 72,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleContent: {
    flex: 1,
    marginLeft: 12,
  },

  vehicleName: {
    fontSize: 13,
    fontWeight: '700',
  },

  vehicleRegistration: {
    marginTop: 3,
    fontSize: 10,
  },

  stateCard: {
    minHeight: 230,
    marginTop: 18,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  stateDescription: {
    marginTop: 7,
    maxWidth: 310,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  primaryButton: {
    minHeight: 44,
    marginTop: 16,
    paddingHorizontal: 18,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  primaryButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },

  secondaryButton: {
    minHeight: 42,
    marginTop: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  secondaryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  recordsContainer: {
    marginTop: 18,
    gap: 12,
  },

  recordCard: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recordIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  recordHeaderContent: {
    flex: 1,
    marginLeft: 10,
  },

  recordTitle: {
    fontSize: 13,
    fontWeight: '700',
  },

  recordDate: {
    marginTop: 3,
    fontSize: 9,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 8,
    fontWeight: '700',
  },

  recordDescription: {
    marginTop: 12,
    fontSize: 10,
    lineHeight: 15,
  },

  recordDivider: {
    height: 1,
    marginVertical: 12,
  },

  recordDetails: {
    gap: 10,
  },

  recordDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  recordDetailLabel: {
    fontSize: 9,
  },

  recordDetailValue: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },

  noticeCard: {
    marginTop: 18,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
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