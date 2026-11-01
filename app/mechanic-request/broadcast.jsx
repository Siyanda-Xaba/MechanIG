import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageSourcePickerModal from '../../src/components/ImageSourcePickerModal';
import StableScrollView from '../../src/components/StableScrollView';
import { useForegroundLocation } from '../../src/location/useForegroundLocation';
import { captureImageFromCamera, selectImageFromLibrary } from '../../src/media/imageCaptureService';
import {
  broadcastServiceRequest,
  subscribeServiceRequest,
} from '../../src/serviceRequests/broadcastServiceRequestService';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';

export default function BroadcastMechanicRequestScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useUser();
  const { selectedVehicle } = useVehicle();
  const { location, isLoadingLocation, locationError, refreshLocation } = useForegroundLocation();

  // Form states
  const [issueDescription, setIssueDescription] = useState('');
  const [vehicleMake, setVehicleMake] = useState(selectedVehicle?.make || '');
  const [vehicleModel, setVehicleModel] = useState(selectedVehicle?.model || '');
  const [vehicleYear, setVehicleYear] = useState(selectedVehicle?.year ? String(selectedVehicle.year) : '');
  const [vehicleRegistration, setVehicleRegistration] = useState(selectedVehicle?.registration || '');
  const [mediaAttachments, setMediaAttachments] = useState([]);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Active request state after submission
  const [createdRequest, setCreatedRequest] = useState(null);
  const [liveRequestStatus, setLiveRequestStatus] = useState(null);

  // Sync vehicle fields when selectedVehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      if (!vehicleMake) setVehicleMake(selectedVehicle.make || '');
      if (!vehicleModel) setVehicleModel(selectedVehicle.model || '');
      if (!vehicleYear) setVehicleYear(selectedVehicle.year ? String(selectedVehicle.year) : '');
      if (!vehicleRegistration) setVehicleRegistration(selectedVehicle.registration || '');
    }
  }, [selectedVehicle]);

  // Subscribe to real-time status of created request
  useEffect(() => {
    if (!createdRequest?.id) return;
    const unsubscribe = subscribeServiceRequest(
      createdRequest.id,
      (data) => {
        if (data) {
          setLiveRequestStatus(data);
        }
      },
      (error) => {
        console.warn('Live request tracking error:', error?.message || error);
      }
    );
    return () => unsubscribe();
  }, [createdRequest?.id]);

  const handleCameraCapture = async () => {
    setIsPickerVisible(false);
    const result = await captureImageFromCamera();
    if (result.status === 'selected' && result.image) {
      setMediaAttachments((prev) => [...prev, result.image.uri]);
    } else if (result.status === 'permission-denied' || result.status === 'error') {
      Alert.alert('Camera Error', result.message || 'Unable to take photo.');
    }
  };

  const handleLibrarySelect = async () => {
    setIsPickerVisible(false);
    const result = await selectImageFromLibrary();
    if (result.status === 'selected' && result.image) {
      setMediaAttachments((prev) => [...prev, result.image.uri]);
    } else if (result.status === 'permission-denied' || result.status === 'error') {
      Alert.alert('Gallery Error', result.message || 'Unable to select image.');
    }
  };

  const handleRemoveMedia = (index) => {
    setMediaAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit =
    Boolean(user) &&
    issueDescription.trim().length > 0 &&
    vehicleMake.trim().length > 0 &&
    vehicleModel.trim().length > 0 &&
    Boolean(location) &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      const payload = {
        customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
        vehicle: {
          id: selectedVehicle?.id || null,
          make: vehicleMake.trim(),
          model: vehicleModel.trim(),
          year: vehicleYear.trim() ? Number(vehicleYear.trim()) : null,
          registration: vehicleRegistration.trim(),
        },
        issueDescription: issueDescription.trim(),
        mediaUrls: mediaAttachments,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: 'Customer Current GPS Location',
        },
      };

      const result = await broadcastServiceRequest(payload);
      setCreatedRequest(result);
      setLiveRequestStatus(result);
    } catch (error) {
      setSubmissionError(error?.message || 'Failed to submit service request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Waiting / Assigned Screen if Request Submitted
  if (createdRequest) {
    const isAssigned = liveRequestStatus?.status === 'assigned';
    const isAwaitingSelection = liveRequestStatus?.status === 'awaiting_selection';
    const isExpired = liveRequestStatus?.status === 'expired';

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityLabel="Go back"
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => router.replace('/(customer)')}
            style={styles.backButton}
          >
            <Ionicons color={colors.text} name="close" size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Service Request Status</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statusContent}>
          <View
            style={[
              styles.statusIconCircle,
              {
                borderColor: isAssigned ? colors.success : isExpired ? colors.danger : colors.accent,
                backgroundColor: colors.card,
              },
            ]}
          >
            {isAssigned ? (
              <MaterialCommunityIcons color={colors.success} name="check-circle-outline" size={54} />
            ) : isExpired ? (
              <MaterialCommunityIcons color={colors.danger} name="clock-alert-outline" size={54} />
            ) : (
              <ActivityIndicator color={colors.accent} size="large" />
            )}
          </View>

          <Text style={[styles.statusTitle, { color: colors.text }]}>
            {isAssigned
              ? 'Mechanic Assigned!'
              : isAwaitingSelection
              ? 'Selecting Best Mechanic...'
              : isExpired
              ? 'Request Expired'
              : 'Broadcasting to Nearby Mechanics'}
          </Text>

          <Text style={[styles.statusDescription, { color: colors.secondaryText }]}>
            {isAssigned
              ? `Good news! ${liveRequestStatus?.assignedMechanicName || 'A mechanic'} has accepted your request.`
              : isAwaitingSelection
              ? 'Multiple mechanics accepted. Evaluating ratings & distance...'
              : isExpired
              ? 'No mechanics were available within 30 km before the request timed out.'
              : `Your request has been broadcast to verified mechanics within 30 km. We will notify you as soon as one is assigned.`}
          </Text>

          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Vehicle:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {vehicleMake} {vehicleModel} {vehicleYear ? `(${vehicleYear})` : ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Status:</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: isAssigned ? colors.success : colors.accent,
                    fontWeight: '700',
                    textTransform: 'capitalize',
                  },
                ]}
              >
                {liveRequestStatus?.status || 'broadcasting'}
              </Text>
            </View>
            {isAssigned && liveRequestStatus?.assignedMechanicName ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Mechanic:</Text>
                <Text style={[styles.infoValue, { color: colors.success, fontWeight: '700' }]}>
                  {liveRequestStatus.assignedMechanicName}
                </Text>
              </View>
            ) : null}
          </View>

          {isAssigned && liveRequestStatus?.conversationId ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: '/customer-conversation/[conversationId]',
                  params: { conversationId: liveRequestStatus.conversationId },
                });
              }}
              style={[styles.primaryButton, { backgroundColor: colors.accent, marginTop: 24 }]}
            >
              <MaterialCommunityIcons color="#000" name="chat-outline" size={20} />
              <Text style={styles.primaryButtonText}>Open Conversation</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.replace('/(customer)')}
              style={[styles.secondaryButton, { borderColor: colors.border, marginTop: 24 }]}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Return to Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Render Request Form Screen
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Request Mechanic</Text>
        <View style={{ width: 40 }} />
      </View>

      <StableScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.bannerText, { color: colors.secondaryText }]}>
          Your request will be broadcast simultaneously to all approved mechanics within 30 km of your location.
        </Text>

        {/* Section 1: Problem Description */}
        <Text style={[styles.fieldLabel, { color: colors.text }]}>1. Describe Vehicle Problem *</Text>
        <TextInput
          multiline
          numberOfLines={4}
          onChangeText={setIssueDescription}
          placeholder="Describe unusual sounds, warning lights, smoke, stalling, or symptoms..."
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.textArea,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={issueDescription}
        />

        {/* Section 2: Vehicle Information */}
        <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 18 }]}>2. Vehicle Details *</Text>
        <View style={styles.vehicleInputRow}>
          <TextInput
            onChangeText={setVehicleMake}
            placeholder="Make (e.g. Toyota)"
            placeholderTextColor={colors.secondaryText}
            style={[styles.halfInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            value={vehicleMake}
          />
          <TextInput
            onChangeText={setVehicleModel}
            placeholder="Model (e.g. Corolla)"
            placeholderTextColor={colors.secondaryText}
            style={[styles.halfInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            value={vehicleModel}
          />
        </View>
        <View style={[styles.vehicleInputRow, { marginTop: 10 }]}>
          <TextInput
            keyboardType="number-pad"
            maxLength={4}
            onChangeText={setVehicleYear}
            placeholder="Year (e.g. 2020)"
            placeholderTextColor={colors.secondaryText}
            style={[styles.halfInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            value={vehicleYear}
          />
          <TextInput
            onChangeText={setVehicleRegistration}
            placeholder="Reg / Plate (Optional)"
            placeholderTextColor={colors.secondaryText}
            style={[styles.halfInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            value={vehicleRegistration}
          />
        </View>

        {/* Section 3: Media Attachments */}
        <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 18 }]}>
          3. Attach Photos / Media (Optional)
        </Text>
        <View style={styles.mediaRow}>
          {mediaAttachments.map((uri, idx) => (
            <View key={idx} style={styles.mediaThumbContainer}>
              <Image source={{ uri }} style={styles.mediaThumb} />
              <TouchableOpacity
                onPress={() => handleRemoveMedia(idx)}
                style={styles.removeMediaBadge}
              >
                <Ionicons color="#fff" name="close" size={14} />
              </TouchableOpacity>
            </View>
          ))}
          {mediaAttachments.length < 5 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPickerVisible(true)}
              style={[styles.addMediaButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <MaterialCommunityIcons color={colors.accent} name="camera-plus-outline" size={24} />
              <Text style={[styles.addMediaText, { color: colors.secondaryText }]}>Add Photo</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Section 4: GPS Location Review */}
        <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 18 }]}>4. Your Current Location *</Text>
        <View style={[styles.locationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.locationHeader}>
            <MaterialCommunityIcons color={colors.accent} name="map-marker-radius" size={24} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.locationStatus, { color: colors.text }]}>
                {isLoadingLocation
                  ? 'Acquiring GPS location...'
                  : location
                  ? 'GPS Location Captured'
                  : 'Location Unavailable'}
              </Text>
              {location ? (
                <Text style={[styles.locationCoords, { color: colors.secondaryText }]}>
                  Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                </Text>
              ) : locationError ? (
                <Text style={[styles.locationCoords, { color: colors.danger }]}>{locationError}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={refreshLocation} style={styles.refreshLocButton}>
              <Ionicons color={colors.accent} name="refresh" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {submissionError ? (
          <Text style={[styles.errorBanner, { color: colors.danger }]}>{submissionError}</Text>
        ) : null}

        {/* Submit Broadcast Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={[
            styles.primaryButton,
            {
              backgroundColor: canSubmit ? colors.accent : colors.card,
              borderColor: canSubmit ? colors.accent : colors.border,
              opacity: canSubmit ? 1 : 0.6,
              marginTop: 26,
              marginBottom: 40,
            },
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons color={canSubmit ? '#000' : colors.secondaryText} name="broadcast" size={20} />
              <Text style={[styles.primaryButtonText, { color: canSubmit ? '#000' : colors.secondaryText }]}>
                Broadcast to Mechanics (30 km)
              </Text>
            </>
          )}
        </TouchableOpacity>
      </StableScrollView>

      {/* Image Picker Modal */}
      <ImageSourcePickerModal
        description="Choose how you would like to attach vehicle photos."
        isBusy={false}
        onCameraPress={handleCameraCapture}
        onClose={() => setIsPickerVisible(false)}
        onLibraryPress={handleLibrarySelect}
        title="Add Problem Photo"
        visible={isPickerVisible}
      />
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
  },
  bannerText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 100,
    padding: 12,
    textAlignVertical: 'top',
  },
  vehicleInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    fontSize: 14,
    height: 48,
    paddingHorizontal: 12,
  },
  mediaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaThumbContainer: {
    position: 'relative',
  },
  mediaThumb: {
    borderRadius: 10,
    height: 72,
    width: 72,
  },
  removeMediaBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    top: -4,
    width: 20,
  },
  addMediaButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  addMediaText: {
    fontSize: 10,
    marginTop: 4,
  },
  locationCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  locationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  locationStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationCoords: {
    fontSize: 12,
    marginTop: 2,
  },
  refreshLocButton: {
    padding: 6,
  },
  errorBanner: {
    fontSize: 13,
    marginTop: 14,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 52,
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  statusIconCircle: {
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 3,
    height: 100,
    justifyContent: 'center',
    marginBottom: 20,
    width: 100,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    padding: 16,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
  },
});
