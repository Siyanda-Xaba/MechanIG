import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useForegroundLocation } from '../../src/location/useForegroundLocation';
import {
  acceptServiceRequest,
  declineServiceRequest,
  setMechanicAcceptingJobs,
  subscribeMechanicIncomingRequests,
  updateMechanicLiveLocation,
} from '../../src/serviceRequests/broadcastServiceRequestService';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';

export default function MechanicIncomingRequestsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useUser();
  const { location } = useForegroundLocation();

  const [requests, setRequests] = useState([]);
  const [isAccepting, setIsAccepting] = useState({});
  const [isAvailable, setIsAvailable] = useState(user?.isAcceptingJobs !== false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  // Sync live location to Firebase so customer searches calculate exact distance
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      updateMechanicLiveLocation(location).catch((err) =>
        console.warn('Unable to sync live location:', err?.message || err)
      );
    }
  }, [location?.latitude, location?.longitude]);

  // Subscribe to real-time incoming broadcast requests for this mechanic
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeMechanicIncomingRequests(
      user.uid,
      (list) => {
        // Only show requests that are still active (broadcasting or awaiting_selection)
        const active = list.filter(
          (req) => req.status === 'broadcasting' || req.status === 'awaiting_selection'
        );
        setRequests(active);
      },
      (error) => {
        console.warn('Incoming requests subscription error:', error?.message || error);
      }
    );
    return () => unsubscribe();
  }, [user?.uid]);

  const handleToggleAvailability = async () => {
    try {
      setUpdatingAvailability(true);
      const next = !isAvailable;
      await setMechanicAcceptingJobs(next);
      setIsAvailable(next);
    } catch (err) {
      Alert.alert('Error', err?.message || 'Could not update availability.');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setIsAccepting((prev) => ({ ...prev, [requestId]: true }));
      const result = await acceptServiceRequest(requestId);
      if (result.success) {
        Alert.alert(
          'Acceptance Recorded',
          'Your acceptance was submitted. The 5-second selection window is active. You will receive an immediate notification if assigned.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Notice', result.message || 'Request was assigned to another mechanic.');
      }
    } catch (err) {
      Alert.alert('Unable to Accept', err?.message || 'An error occurred while accepting.');
    } finally {
      setIsAccepting((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDecline = async (requestId) => {
    if (!user?.uid) return;
    try {
      await declineServiceRequest(user.uid, requestId);
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId && r.id !== requestId));
    } catch (err) {
      console.warn('Decline error:', err?.message || err);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          accessibilityRole="button"
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons color={colors.text} name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Incoming Nearby Requests</Text>
        <View style={{ width: 40 }} />
      </View>

      <StableScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Availability Toggle Bar */}
        <View style={[styles.availabilityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.availabilityInfo}>
            <Text style={[styles.availabilityTitle, { color: colors.text }]}>
              Availability: {isAvailable ? 'Online' : 'Offline'}
            </Text>
            <Text style={[styles.availabilitySubtitle, { color: colors.secondaryText }]}>
              {isAvailable
                ? 'Receiving broadcasts within 30 km'
                : 'Turn online to receive customer service broadcasts'}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={updatingAvailability}
            onPress={handleToggleAvailability}
            style={[
              styles.toggleButton,
              {
                backgroundColor: isAvailable ? colors.success : colors.card,
                borderColor: isAvailable ? colors.success : colors.border,
              },
            ]}
          >
            {updatingAvailability ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={[styles.toggleButtonText, { color: isAvailable ? '#fff' : colors.text }]}>
                {isAvailable ? 'ONLINE' : 'GO ONLINE'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionHeading, { color: colors.text }]}>
          Active Requests Nearby ({requests.length})
        </Text>

        {requests.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons color={colors.secondaryText} name="radar" size={48} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No requests right now</Text>
            <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
              When a customer within 30 km requests service, it will appear here in real time.
            </Text>
          </View>
        ) : (
          requests.map((item) => {
            const reqId = item.requestId || item.id;
            const acceptingThis = isAccepting[reqId];

            return (
              <View
                key={reqId}
                style={[styles.requestCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                {/* Distance Badge */}
                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.distanceBadge, { backgroundColor: 'rgba(0, 239, 253, 0.12)' }]}>
                      <MaterialCommunityIcons color={colors.accent} name="map-marker-distance" size={16} />
                      <Text style={[styles.distanceText, { color: colors.accent }]}>
                        ~{item.approximateDistanceKm != null ? item.approximateDistanceKm : '?'} km away
                      </Text>
                    </View>
                    {item.status === 'awaiting_selection' ? (
                      <View style={[styles.selectionBadge, { backgroundColor: 'rgba(255, 179, 0, 0.15)' }]}>
                        <Text style={[styles.selectionText, { color: colors.warning }]}>In Selection (5s)</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {/* Vehicle Details */}
                <Text style={[styles.vehicleTitle, { color: colors.text }]}>
                  {item.vehicle?.make} {item.vehicle?.model} {item.vehicle?.year ? `(${item.vehicle?.year})` : ''}
                </Text>
                {item.vehicle?.registration ? (
                  <Text style={[styles.registrationText, { color: colors.secondaryText }]}>
                    Reg: {item.vehicle.registration}
                  </Text>
                ) : null}

                {/* Issue Description */}
                <Text style={[styles.issueLabel, { color: colors.secondaryText }]}>Reported Issue:</Text>
                <Text style={[styles.issueText, { color: colors.text }]}>
                  {item.issueDescription || 'No description provided.'}
                </Text>

                {/* Optional Media previews */}
                {Array.isArray(item.mediaUrls) && item.mediaUrls.length > 0 ? (
                  <View style={styles.mediaRow}>
                    {item.mediaUrls.map((uri, idx) => (
                      <Image key={idx} source={{ uri }} style={styles.mediaThumb} />
                    ))}
                  </View>
                ) : null}

                {/* Actions */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleDecline(reqId)}
                    style={[styles.declineButton, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.declineText, { color: colors.secondaryText }]}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={acceptingThis}
                    onPress={() => handleAccept(reqId)}
                    style={[styles.acceptButton, { backgroundColor: colors.accent }]}
                  >
                    {acceptingThis ? (
                      <ActivityIndicator color="#000" size="small" />
                    ) : (
                      <>
                        <MaterialCommunityIcons color="#000" name="check-bold" size={18} />
                        <Text style={styles.acceptText}>Accept Request</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </StableScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  availabilityCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 14,
  },
  availabilityInfo: {
    flex: 1,
    paddingRight: 10,
  },
  availabilityTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  availabilitySubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  toggleButton: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center',
  },
  requestCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  distanceBadge: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectionBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  registrationText: {
    fontSize: 12,
    marginTop: 2,
  },
  issueLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
  },
  issueText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  mediaThumb: {
    borderRadius: 8,
    height: 54,
    width: 54,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  declineButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  declineText: {
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 2,
    flexDirection: 'row',
    gap: 6,
    height: 44,
    justifyContent: 'center',
  },
  acceptText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
});
