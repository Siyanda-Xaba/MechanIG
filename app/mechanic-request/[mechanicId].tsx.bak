import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'

import StableScrollView from '../../src/components/StableScrollView'
import { useMechanicRequest } from '../../src/customer/useMechanicRequest'
import { useTheme } from '../../src/theme/ThemeContext'
import { useUser } from '../../src/users/UserContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function MechanicRequestScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const { user } = useUser()
  const { selectedVehicle } = useVehicle()

  const params = useLocalSearchParams<{
    mechanicId?: string | string[]
    resultId?: string | string[]
  }>()

  const mechanicId = Array.isArray(params.mechanicId)
    ? params.mechanicId[0]
    : params.mechanicId

  const resultId = Array.isArray(params.resultId)
    ? params.resultId[0]
    : params.resultId

  const [serviceAddress, setServiceAddress] =
    useState('')

  const [issueDescription, setIssueDescription] =
    useState('')

  const {
    mechanicRequest,
    isSubmittingRequest,
    mechanicRequestError,
    submitMechanicRequest,
  } = useMechanicRequest()

  const hasServiceAddress =
    serviceAddress.trim().length > 0

  const canSubmit =
    Boolean(user) &&
    Boolean(selectedVehicle) &&
    Boolean(mechanicId) &&
    hasServiceAddress &&
    !isSubmittingRequest

  const handleSubmit = async () => {
    if (
      !user ||
      !selectedVehicle ||
      !mechanicId ||
      !hasServiceAddress
    ) {
      return
    }

    await submitMechanicRequest({
      customerId: user.id,
      vehicleId: selectedVehicle.id,
      mechanicId,

      diagnosticResultId: resultId ?? null,

      requestType: 'mobile',

      serviceLocation: {
        address: serviceAddress.trim(),

        // Later GPS/geocoding will provide
        // authoritative coordinates.
        latitude: null,
        longitude: null,
      },

      scheduledAt: null,

      issueDescription:
        issueDescription.trim() || null,
    })
  }

  if (mechanicRequest) {
    return (
      <SafeAreaView
        style={[
          styles.centeredPage,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.successIcon,
            {
              borderColor: colors.success,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="check"
            size={34}
            color={colors.success}
          />
        </View>

        <Text
          style={[
            styles.successTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Request Submitted
        </Text>

        <Text
          style={[
            styles.successDescription,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Your mechanic request has been created and is
          awaiting confirmation.
        </Text>

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.statusLabel,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Request Status
          </Text>

          <Text
            style={[
              styles.statusValue,
              {
                color: colors.warning,
              },
            ]}
          >
            Pending
          </Text>

          <Text
            style={[
              styles.requestId,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            {mechanicRequest.id}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() =>
            router.replace('/(customer)')
          }
          style={[
            styles.doneButton,
            {
              backgroundColor: colors.accent,
            },
          ]}
        >
          <Text style={styles.doneButtonText}>
            Back to Home
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
          backgroundColor: colors.background,
        },
      ]}
    >
      <StableScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
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
            Request Mechanic
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
          Mobile Mechanic Request
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Review your vehicle and issue details before
          requesting assistance.
        </Text>

        {/* Vehicle */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Vehicle
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {selectedVehicle ? (
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    borderColor: colors.accent,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="car-outline"
                  size={23}
                  color={colors.accent}
                />
              </View>

              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoTitle,
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
                    styles.infoDescription,
                    {
                      color: colors.secondaryText,
                    },
                  ]}
                >
                  {selectedVehicle.registration}
                </Text>

                <Text
                  style={[
                    styles.infoDescription,
                    {
                      color: colors.secondaryText,
                    },
                  ]}
                >
                  {selectedVehicle.fuelType} •{' '}
                  {selectedVehicle.year}
                </Text>
              </View>
            </View>
          ) : (
            <Text
              style={[
                styles.missingText,
                {
                  color: colors.danger,
                },
              ]}
            >
              No vehicle selected.
            </Text>
          )}
        </View>

        {/* Service Type */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Service Type
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.accent,
            },
          ]}
        >
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="car-wrench"
              size={24}
              color={colors.accent}
            />

            <View style={styles.infoContent}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Mobile Mechanic
              </Text>

              <Text
                style={[
                  styles.infoDescription,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                The mechanic travels to your service
                location.
              </Text>
            </View>

            <MaterialCommunityIcons
              name="check-circle"
              size={21}
              color={colors.accent}
            />
          </View>
        </View>

        {/* Service Location */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Service Location
        </Text>

        <View
          style={[
            styles.addressContainer,
            {
              backgroundColor: colors.card,
              borderColor: hasServiceAddress
                ? colors.accent
                : colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={23}
            color={colors.accent}
          />

          <TextInput
            value={serviceAddress}
            onChangeText={setServiceAddress}
            placeholder="Enter the address where you need assistance"
            placeholderTextColor={colors.secondaryText}
            autoCapitalize="words"
            returnKeyType="done"
            style={[
              styles.addressInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>

        <Text
          style={[
            styles.locationNote,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          GPS and address suggestions will be added here
          later. For now, enter the service address
          manually.
        </Text>

        {/* Issue */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Additional Details
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={21}
            color={colors.accent}
          />

          <TextInput
            value={issueDescription}
            onChangeText={setIssueDescription}
            placeholder="Describe anything else the mechanic should know..."
            placeholderTextColor={colors.secondaryText}
            multiline
            maxLength={500}
            textAlignVertical="top"
            style={[
              styles.input,
              {
                color: colors.text,
              },
            ]}
          />
        </View>

        <Text
          style={[
            styles.characterCount,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          {issueDescription.length}/500
        </Text>

        {mechanicRequestError ? (
          <Text
            style={[
              styles.requestError,
              {
                color: colors.danger,
              },
            ]}
          >
            {mechanicRequestError}
          </Text>
        ) : null}

        {/* Submit */}
        <TouchableOpacity
          activeOpacity={0.75}
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={[
            styles.submitButton,
            {
              backgroundColor: canSubmit
                ? colors.accent
                : colors.border,
            },
          ]}
        >
          {isSubmittingRequest ? (
            <ActivityIndicator
              size="small"
              color="#000000"
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="car-wrench"
                size={20}
                color="#000000"
              />

              <Text style={styles.submitButtonText}>
                Request Mechanic
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.disclaimer,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Mechanic availability, pricing and arrival time
          will be confirmed by MechanIQ before service
          begins.
        </Text>
      </StableScrollView>
    </SafeAreaView>
  )
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

  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '700',
  },

  card: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  infoDescription: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 14,
  },

  missingText: {
    fontSize: 11,
    textAlign: 'center',
  },

  addressContainer: {
    minHeight: 54,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  addressInput: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 0,
    fontSize: 11,
  },

  locationNote: {
    marginTop: 6,
    paddingHorizontal: 4,
    fontSize: 8,
    lineHeight: 13,
  },

  inputContainer: {
    minHeight: 125,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  input: {
    flex: 1,
    minHeight: 95,
    padding: 0,
    fontSize: 11,
    lineHeight: 17,
  },

  characterCount: {
    marginTop: 5,
    fontSize: 8,
    textAlign: 'right',
  },

  requestError: {
    marginTop: 12,
    fontSize: 10,
    textAlign: 'center',
  },

  submitButton: {
    minHeight: 48,
    marginTop: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  submitButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },

  disclaimer: {
    marginTop: 10,
    paddingHorizontal: 12,
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
  },

  successIcon: {
    width: 72,
    height: 72,
    borderWidth: 2,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successTitle: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: '800',
  },

  successDescription: {
    marginTop: 8,
    maxWidth: 300,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  statusCard: {
    width: '100%',
    maxWidth: 320,
    marginTop: 22,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },

  statusLabel: {
    fontSize: 9,
  },

  statusValue: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '800',
  },

  requestId: {
    marginTop: 7,
    fontSize: 8,
  },

  doneButton: {
    width: '100%',
    maxWidth: 320,
    minHeight: 46,
    marginTop: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  doneButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
})