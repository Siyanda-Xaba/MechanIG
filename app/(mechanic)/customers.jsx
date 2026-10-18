import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  useMemo,
  useState,
} from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import ProfileAvatar from '../../src/components/ProfileAvatar'
import StableScrollView from '../../src/components/StableScrollView'
import { useMechanicCustomers } from '../../src/mechanic/MechanicCustomersContext'
import { useTheme } from '../../src/theme/ThemeContext'

const CUSTOMER_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  OPEN_JOBS: 'open-jobs',
}

const customerFilters = [
  CUSTOMER_FILTERS.ALL,
  CUSTOMER_FILTERS.ACTIVE,
  CUSTOMER_FILTERS.OPEN_JOBS,
]

const customerFilterLabels = {
  all: 'All',
  active: 'Active',
  'open-jobs': 'Open Jobs',
}

export default function MechanicCustomers() {
  const { colors } = useTheme()
  const router = useRouter()

  const {
    customersData,
    isLoadingCustomers,
    customersError,
    refreshCustomers,
  } = useMechanicCustomers()

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState(
    CUSTOMER_FILTERS.ALL
  )

  const filteredCustomers = useMemo(() => {
    const customers =
      customersData?.customers ?? []

    const normalizedSearch =
      searchQuery
        .trim()
        .toLowerCase()

    return customers.filter(
      (customer) => {
        if (
          selectedFilter ===
            CUSTOMER_FILTERS.ACTIVE &&
          customer.status !== 'active'
        ) {
          return false
        }

        if (
          selectedFilter ===
            CUSTOMER_FILTERS.OPEN_JOBS &&
          !customer.openJob
        ) {
          return false
        }

        if (!normalizedSearch) {
          return true
        }

        const vehicleLabels =
          customer.vehicles
            .map(
              (vehicle) =>
                vehicle.vehicleLabel
            )
            .join(' ')
            .toLowerCase()

        const searchableText = [
          customer.displayName,
          customer.firstName,
          customer.lastName,
          customer.email,
          customer.phone,
          vehicleLabels,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(
          normalizedSearch
        )
      }
    )
  }, [
    customersData,
    searchQuery,
    selectedFilter,
  ])

  function getFilterCount(filter) {
    if (!customersData) {
      return '--'
    }

    switch (filter) {
      case CUSTOMER_FILTERS.ALL:
        return customersData.totalCustomers ?? '--'

      case CUSTOMER_FILTERS.ACTIVE:
        return customersData.activeCustomers ?? '--'

      case CUSTOMER_FILTERS.OPEN_JOBS:
        return customersData
          .customersWithOpenJobs ?? '--'

      default:
        return '--'
    }
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
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Customers
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
              Customer records and vehicles
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={refreshCustomers}
            accessibilityRole="button"
            accessibilityLabel="Refresh customers"
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
            <Ionicons
              name="refresh-outline"
              size={21}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.summaryGrid,
          ]}
        >
          <SummaryCard
            icon="account-group-outline"
            label="Customers"
            value={
              customersData
                ?.totalCustomers ?? '--'
            }
            colors={colors}
          />

          <SummaryCard
            icon="account-check-outline"
            label="Active"
            value={
              customersData
                ?.activeCustomers ?? '--'
            }
            colors={colors}
          />

          <SummaryCard
            icon="briefcase-outline"
            label="Open Jobs"
            value={
              customersData
                ?.customersWithOpenJobs ??
              '--'
            }
            colors={colors}
          />

          <SummaryCard
            icon="calendar-clock-outline"
            label="Bookings"
            value={
              customersData
                ?.upcomingBookings ?? '--'
            }
            colors={colors}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open customer messages"
          onPress={() => {
            router.push('/mechanic-messages')
          }}
          style={[
            styles.messagesEntry,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.messagesEntryIcon,
              {
                backgroundColor: `${colors.accent}18`,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="message-text-outline"
              size={23}
              color={colors.accent}
            />
          </View>

          <View style={styles.messagesEntryContent}>
            <Text
              style={[
                styles.messagesEntryTitle,
                { color: colors.text },
              ]}
            >
              Messages
            </Text>
            <Text
              style={[
                styles.messagesEntrySubtitle,
                { color: colors.secondaryText },
              ]}
            >
              View customer conversations
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.secondaryText}
          />
        </TouchableOpacity>

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
            placeholder="Search customers or vehicles"
            placeholderTextColor={
              colors.secondaryText
            }
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.searchInput,
              {
                color: colors.text,
              },
            ]}
          />

          {searchQuery ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setSearchQuery('')
              }}
              accessibilityRole="button"
              accessibilityLabel="Clear customer search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={
                  colors.secondaryText
                }
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <View
          style={[
            styles.filterContainer,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          {customerFilters.map(
            (filter) => {
              const isSelected =
                selectedFilter === filter

              return (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedFilter(
                      filter
                    )
                  }}
                  style={[
                    styles.filterButton,
                    isSelected && {
                      backgroundColor:
                        colors.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      {
                        color:
                          isSelected
                            ? '#FFFFFF'
                            : colors.secondaryText,
                      },
                    ]}
                  >
                    {
                      customerFilterLabels[
                        filter
                      ]
                    }
                  </Text>

                  <View
                    style={[
                      styles.filterCount,
                      {
                        backgroundColor:
                          isSelected
                            ? 'rgba(255,255,255,0.16)'
                            : colors.background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterCountText,
                        {
                          color:
                            isSelected
                              ? '#FFFFFF'
                              : colors.text,
                        },
                      ]}
                    >
                      {getFilterCount(
                        filter
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }
          )}
        </View>

        {isLoadingCustomers &&
        !customersData ? (
          <View
            style={
              styles.stateContainer
            }
          >
            <ActivityIndicator
              size="small"
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
              Loading customers...
            </Text>
          </View>
        ) : customersError || !customersData ? (
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
              size={30}
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
              Customers unavailable
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
              {customersError ??
                'Verified customer records are unavailable.'}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={refreshCustomers}
              style={[
                styles.retryButton,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredCustomers.length ===
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
              name="account-search-outline"
              size={32}
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
              {customersData.customers.length === 0
                ? 'No Customers Yet'
                : 'No Customers Found'}
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
              {customersData.customers.length === 0
                ? 'Verified customer records will appear here once they are associated with your mechanic account.'
                : 'Try changing your search or selected filter.'}
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.customersList
            }
          >
            {filteredCustomers.map(
              (customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  colors={colors}
                />
              )
            )}
          </View>
        )}
      </StableScrollView>
    </SafeAreaView>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  colors,
}) {
  return (
    <View
      style={[
        styles.summaryCard,
        {
          backgroundColor:
            colors.card,
          borderColor:
            colors.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={colors.accent}
      />

      <Text
        style={[
          styles.summaryValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.summaryLabel,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

function CustomerCard({
  customer,
  colors,
}) {
  const primaryVehicle =
    customer.vehicles[0] ?? null

  const statusColor =
    customer.status === 'active'
      ? colors.success
      : colors.secondaryText

  return (
    <View
      style={[
        styles.customerCard,
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
          styles.customerHeader
        }
      >
        <ProfileAvatar
          imageUrl={
            customer.profileImageUrl
          }
          size={46}
        />

        <View
          style={
            styles.customerIdentity
          }
        >
          <Text
            style={[
              styles.customerName,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {customer.displayName}
          </Text>

          <View
            style={
              styles.statusRow
            }
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    statusColor,
                },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color:
                    statusColor,
                },
              ]}
            >
              {customer.status ===
              'active'
                ? 'Active'
                : 'Inactive'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.interactionBadge,
            {
              backgroundColor:
                colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.interactionText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {customer.lastInteractionLabel ??
              'No history'}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          {
            backgroundColor:
              colors.border,
          },
        ]}
      />

      <View
        style={styles.vehicleRow}
      >
        <View
          style={[
            styles.vehicleIcon,
            {
              backgroundColor:
                `${colors.accent}18`,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="car-outline"
            size={22}
            color={colors.accent}
          />
        </View>

        <View
          style={
            styles.vehicleDetails
          }
        >
          <Text
            style={[
              styles.sectionLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Primary Vehicle
          </Text>

          <Text
            style={[
              styles.vehicleName,
              {
                color: colors.text,
              },
            ]}
          >
            {primaryVehicle
              ?.vehicleLabel ??
              'No vehicle available'}
          </Text>

          {customer.vehicles.length >
          1 ? (
            <Text
              style={[
                styles.additionalVehicles,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              +
              {customer.vehicles
                .length - 1}{' '}
              more vehicle
              {customer.vehicles
                .length - 1 ===
              1
                ? ''
                : 's'}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={styles.infoGrid}
      >
        <CustomerInfoCard
          icon="calendar-outline"
          label="Recent Booking"
          value={
            customer.recentBooking
              ? customer.recentBooking
                  .serviceType
              : 'No booking'
          }
          detail={
            customer.recentBooking
              ? [
                  customer
                    .recentBooking
                    .dateLabel,
                  customer
                    .recentBooking
                    .timeLabel,
                ]
                  .filter(Boolean)
                  .join(' • ')
              : null
          }
          colors={colors}
        />

        <CustomerInfoCard
          icon="briefcase-outline"
          label="Open Job"
          value={
            customer.openJob
              ? customer.openJob
                  .serviceType
              : 'No open job'
          }
          detail={
            customer.openJob
              ? formatJobStatus(
                  customer.openJob
                    .status
                )
              : null
          }
          colors={colors}
        />
      </View>

      <View
        style={[
          styles.contactContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <View
          style={styles.contactRow}
        >
          <Ionicons
            name="call-outline"
            size={16}
            color={
              customer.phone
                ? colors.accent
                : colors.secondaryText
            }
          />

          <Text
            style={[
              styles.contactText,
              {
                color:
                  customer.phone
                    ? colors.text
                    : colors.secondaryText,
              },
            ]}
            numberOfLines={1}
          >
            {customer.phone ??
              'Phone unavailable'}
          </Text>
        </View>

        <View
          style={styles.contactRow}
        >
          <Ionicons
            name="mail-outline"
            size={16}
            color={
              customer.email
                ? colors.accent
                : colors.secondaryText
            }
          />

          <Text
            style={[
              styles.contactText,
              {
                color:
                  customer.email
                    ? colors.text
                    : colors.secondaryText,
              },
            ]}
            numberOfLines={1}
          >
            {customer.email ??
              'Email unavailable'}
          </Text>
        </View>
      </View>
    </View>
  )
}

function CustomerInfoCard({
  icon,
  label,
  value,
  detail,
  colors,
}) {
  return (
    <View
      style={[
        styles.infoCard,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={19}
        color={colors.accent}
      />

      <Text
        style={[
          styles.infoLabel,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.infoValue,
          {
            color: colors.text,
          },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>

      {detail ? (
        <Text
          style={[
            styles.infoDetail,
            {
              color:
                colors.secondaryText,
            },
          ]}
          numberOfLines={1}
        >
          {detail}
        </Text>
      ) : null}
    </View>
  )
}

function formatJobStatus(status) {
  switch (status) {
    case 'pending':
      return 'Pending'

    case 'accepted':
      return 'Accepted'

    case 'in-progress':
      return 'In Progress'

    case 'completed':
      return 'Completed'

    case 'cancelled':
      return 'Cancelled'

    default:
      return status
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
    paddingBottom: 120,
  },

  header: {
    marginTop: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  refreshButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  summaryCard: {
    flex: 1,
    minHeight: 92,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryValue: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: '800',
  },

  summaryLabel: {
    marginTop: 2,
    fontSize: 8.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  messagesEntry: {
    minHeight: 70,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  messagesEntryIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  messagesEntryContent: {
    flex: 1,
    marginLeft: 12,
  },

  messagesEntryTitle: {
    fontSize: 14,
    fontWeight: '800',
  },

  messagesEntrySubtitle: {
    marginTop: 4,
    fontSize: 11,
  },

  searchContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
  },

  filterContainer: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    marginBottom: 18,
  },

  filterButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 11,
    paddingHorizontal: 4,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },

  filterCount: {
    minWidth: 24,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterCountText: {
    fontSize: 10,
    fontWeight: '800',
  },

  stateContainer: {
    paddingVertical: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateCard: {
    minHeight: 220,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },

  stateText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  retryButton: {
    minWidth: 120,
    height: 42,
    marginTop: 18,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  customersList: {
    gap: 14,
  },

  customerCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  customerIdentity: {
    flex: 1,
    marginLeft: 11,
  },

  customerName: {
    fontSize: 15,
    fontWeight: '800',
  },

  statusRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  interactionBadge: {
    minHeight: 27,
    borderRadius: 9,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  interactionText: {
    fontSize: 9.5,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    marginVertical: 15,
  },

  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleDetails: {
    flex: 1,
    marginLeft: 11,
  },

  sectionLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  vehicleName: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '700',
  },

  additionalVehicles: {
    marginTop: 3,
    fontSize: 10,
  },

  infoGrid: {
    marginTop: 15,
    flexDirection: 'row',
    gap: 10,
  },

  infoCard: {
    flex: 1,
    minHeight: 108,
    borderRadius: 13,
    padding: 12,
  },

  infoLabel: {
    marginTop: 7,
    fontSize: 9.5,
    fontWeight: '700',
  },

  infoValue: {
    marginTop: 4,
    fontSize: 11.5,
    fontWeight: '700',
  },

  infoDetail: {
    marginTop: 4,
    fontSize: 9.5,
  },

  contactContainer: {
    marginTop: 12,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  contactText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 11,
  },
})