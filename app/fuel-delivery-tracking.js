import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import FuelMap from '../src/components/FuelMap';
import { useFuelDeliveryTracking } from '../src/customer/useFuelDeliveryTracking';
import { useForegroundLocation } from '../src/location/useForegroundLocation';
import { useTheme } from '../src/theme/ThemeContext';

function getStatusLabel(status) {
  switch (status) {
    case 'scheduled':
      return 'Scheduled';
    case 'driver-assigned':
      return 'Driver Assigned';
    case 'en-route':
      return 'En Route';
    case 'arrived':
      return 'Driver Arrived';
    case 'delivering':
      return 'Delivering Fuel';
    case 'completed':
      return 'Completed';
    case 'declined':
      return 'Declined';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Requested';
  }
}

export default function FuelDeliveryTrackingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const deliveryId = Array.isArray(params.deliveryId)
    ? params.deliveryId[0]
    : params.deliveryId;

  const {
    tracking,
    isLoadingTracking,
    trackingError,
    refreshTracking,
  } = useFuelDeliveryTracking(deliveryId ?? null);

  const {
    location,
    isLoadingLocation,
    locationError,
    refreshLocation,
  } = useForegroundLocation();

  const destinationLocation = tracking?.destination ?? location;
  const driverLocation = tracking?.driver?.location ?? null;
  const isLoading = isLoadingTracking || isLoadingLocation;
  const mapError = locationError ?? trackingError;

  // Stale location detection: driver location unchanged or not received for > 60 seconds
  const isDriverLocationStale = useMemo(() => {
    if (
      !driverLocation ||
      !driverLocation.updatedAt ||
      tracking?.status !== 'en-route'
    ) {
      return false;
    }
    const updatedTime = new Date(driverLocation.updatedAt).getTime();
    if (Number.isNaN(updatedTime)) return false;
    return Date.now() - updatedTime > 60_000;
  }, [driverLocation, tracking?.status]);

  if (!deliveryId) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.emptyPage}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.dismissTo('/fuel')}
              style={[styles.headerButton, { borderColor: colors.border }]}
            >
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Track Delivery</Text>
            <View style={styles.headerPlaceholder} />
          </View>
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={48} color={colors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No active delivery</Text>
            <Text style={[styles.emptyDescription, { color: colors.secondaryText }]}>
              When you have an active fuel delivery, its live status and driver location will appear here.
            </Text>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.dismissTo('/fuel')}
              style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.primaryButtonText}>Back to Fuel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoadingTracking && !tracking) {
    return (
      <SafeAreaView style={[styles.centeredPage, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
          Loading delivery tracking...
        </Text>
      </SafeAreaView>
    );
  }

  if (trackingError && !tracking) {
    return (
      <SafeAreaView style={[styles.centeredPage, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="truck-alert-outline" size={48} color={colors.danger} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>Tracking unavailable</Text>
        <Text style={[styles.errorMessage, { color: colors.secondaryText }]}>{trackingError}</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={refreshTracking}
          style={[styles.primaryButton, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.dismissTo('/fuel')}
          style={[styles.secondaryButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isCompleted = tracking?.status === 'completed';
  const isCancelled = tracking?.status === 'cancelled';
  const isDeclined = tracking?.status === 'declined';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StableScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.dismissTo('/fuel')}
            style={[styles.headerButton, { borderColor: colors.border }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Track Delivery</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              refreshTracking();
              refreshLocation();
            }}
            style={[styles.headerButton, { borderColor: colors.border }]}
          >
            <Ionicons name="refresh" size={19} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Fuel Delivery</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Follow your delivery status and driver location.
        </Text>

        {tracking ? (
          <>
            {/* Terminal Status: Completed */}
            {isCompleted ? (
              <View style={[styles.terminalCard, { backgroundColor: '#102A1E', borderColor: '#2E7D32' }]}>
                <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
                <Text style={[styles.terminalTitle, { color: '#E8F5E9' }]}>Delivery Completed</Text>
                <Text style={[styles.terminalDescription, { color: '#C8E6C9' }]}>
                  {tracking.quantityLitres} L of {tracking.fuelType} has been successfully delivered.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => router.dismissTo('/fuel')}
                  style={[styles.primaryButton, { backgroundColor: colors.accent, marginTop: 14 }]}
                >
                  <Text style={styles.primaryButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Terminal Status: Declined */}
            {isDeclined ? (
              <View style={[styles.terminalCard, { backgroundColor: '#2D1616', borderColor: '#C62828' }]}>
                <Ionicons name="close-circle" size={40} color="#EF5350" />
                <Text style={[styles.terminalTitle, { color: '#FFEBEE' }]}>Request Declined</Text>
                <Text style={[styles.terminalDescription, { color: '#FFCDD2' }]}>The selected mechanic could not accept this fuel request.</Text>
                <TouchableOpacity activeOpacity={0.75} onPress={() => router.dismissTo('/fuel')} style={[styles.primaryButton, { backgroundColor: colors.accent, marginTop: 14 }]}>
                  <Text style={styles.primaryButtonText}>Back to Fuel</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Terminal Status: Cancelled */}
            {isCancelled ? (
              <View style={[styles.terminalCard, { backgroundColor: '#2D1616', borderColor: '#C62828' }]}>
                <Ionicons name="close-circle" size={40} color="#EF5350" />
                <Text style={[styles.terminalTitle, { color: '#FFEBEE' }]}>Delivery Cancelled</Text>
                <Text style={[styles.terminalDescription, { color: '#FFCDD2' }]}>
                  This delivery request was cancelled.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => router.dismissTo('/fuel')}
                  style={[styles.primaryButton, { backgroundColor: colors.accent, marginTop: 14 }]}
                >
                  <Text style={styles.primaryButtonText}>Back to Fuel</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Active Status Card */}
            {!isCompleted && !isCancelled && !isDeclined ? (
              <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.statusTopRow}>
                  <View>
                    <Text style={[styles.statusLabel, { color: colors.secondaryText }]}>
                      Delivery Status
                    </Text>
                    <Text style={[styles.statusValue, { color: colors.accent }]}>
                      {getStatusLabel(tracking.status)}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="truck-fast-outline" size={32} color={colors.accent} />
                </View>

                {isDriverLocationStale ? (
                  <View style={styles.staleLocationBadge}>
                    <Ionicons name="warning-outline" size={14} color="#FFA726" />
                    <Text style={styles.staleLocationText}>
                      Driver location signal delayed • updating...
                    </Text>
                  </View>
                ) : null}

                {tracking.estimatedArrivalMinutes !== null ? (
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={18} color={colors.accent} />
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
                        Estimated Arrival
                      </Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {tracking.estimatedArrivalMinutes} min
                      </Text>
                    </View>
                  </View>
                ) : null}

                {tracking.destinationLabel ? (
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={18} color={colors.accent} />
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
                        Delivery Location
                      </Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {tracking.destinationLabel}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Map Section */}
            {!isCompleted && !isCancelled && !isDeclined ? (
              <View style={styles.mapSection}>
                <FuelMap
                  customerLocation={destinationLocation}
                  deliveryVehicleLocation={driverLocation}
                  routeCoordinates={tracking.routeCoordinates}
                  isLoading={isLoading}
                  errorMessage={mapError}
                  height={350}
                />
              </View>
            ) : null}

            {/* Driver Card */}
            {tracking.driver ? (
              <View style={[styles.driverCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.driverIcon, { borderColor: colors.accent }]}>
                  <Ionicons name="person-outline" size={24} color={colors.accent} />
                </View>
                <View style={styles.driverContent}>
                  <Text style={[styles.driverLabel, { color: colors.secondaryText }]}>
                    Your Driver
                  </Text>
                  <Text style={[styles.driverName, { color: colors.text }]}>
                    {tracking.driver.name ?? 'Assigned driver'}
                  </Text>
                  {tracking.driver.vehicle ? (
                    <Text style={[styles.driverVehicle, { color: colors.secondaryText }]}>
                      {typeof tracking.driver.vehicle === 'string'
                        ? tracking.driver.vehicle
                        : [tracking.driver.vehicle.make, tracking.driver.vehicle.model].filter(Boolean).join(' ')}
                    </Text>
                  ) : null}
                </View>
                {tracking.driver.phone ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => Linking.openURL(`tel:${tracking.driver.phone}`)}
                    style={[styles.callButton, { backgroundColor: colors.accent }]}
                  >
                    <Ionicons name="call" size={18} color="#000000" />
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : !isCompleted && !isCancelled && !isDeclined ? (
              <View style={[styles.waitingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <MaterialCommunityIcons name="account-clock-outline" size={28} color={colors.accent} />
                <View style={styles.waitingContent}>
                  <Text style={[styles.waitingTitle, { color: colors.text }]}>
                    Searching for nearby mechanic
                  </Text>
                  <Text style={[styles.waitingDescription, { color: colors.secondaryText }]}>
                    Dispatching to eligible nearby mechanics. Details will appear once accepted.
                  </Text>
                </View>
              </View>
            ) : null}

            {tracking.updatedAt ? (
              <Text style={[styles.updatedText, { color: colors.secondaryText }]}>
                Last updated: {tracking.updatedAt}
              </Text>
            ) : null}
          </>
        ) : null}
      </StableScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyPage: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centeredPage: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  loadingText: {
    marginTop: 12,
    fontSize: 12,
  },
  errorTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: 42,
    marginTop: 20,
    paddingHorizontal: 24,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 42,
    marginTop: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    marginTop: 40,
    minHeight: 230,
    padding: 24,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDescription: {
    marginTop: 7,
    maxWidth: 280,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
  statusCard: {
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },
  statusTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 9,
  },
  statusValue: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '700',
  },
  staleLocationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 167, 38, 0.15)',
    borderRadius: 8,
  },
  staleLocationText: {
    fontSize: 11,
    color: '#FFA726',
    fontWeight: '600',
  },
  terminalCard: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
  },
  terminalTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
  },
  terminalDescription: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  infoRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
  },
  infoValue: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
  },
  mapSection: {
    marginTop: 16,
  },
  driverCard: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverIcon: {
    width: 46,
    height: 46,
    borderWidth: 1.5,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverContent: {
    flex: 1,
    marginLeft: 12,
  },
  driverLabel: {
    fontSize: 9,
  },
  driverName: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '700',
  },
  driverVehicle: {
    marginTop: 4,
    fontSize: 10,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  waitingCard: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitingContent: {
    flex: 1,
    marginLeft: 12,
  },
  waitingTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  waitingDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
  },
  updatedText: {
    marginTop: 12,
    fontSize: 9,
    textAlign: 'center',
  },
});
