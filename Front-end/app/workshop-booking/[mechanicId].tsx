import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'

import { useWorkshopBooking } from '../../src/customer/useWorkshopBooking'
import { useTheme } from '../../src/theme/ThemeContext'
import { useUser } from '../../src/users/UserContext'
import { useVehicle } from '../../src/vehicles/VehicleContext'

export default function WorkshopBookingScreen() {
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

  const [serviceType, setServiceType] =
    useState('Vehicle Inspection')

  const [scheduledDate, setScheduledDate] =
    useState('')

  const [scheduledTime, setScheduledTime] =
    useState('')

  const [issueDescription, setIssueDescription] =
    useState('')

  const {
    workshopBooking,
    isSubmittingBooking,
    workshopBookingError,
    submitWorkshopBooking,
  } = useWorkshopBooking()

  const hasServiceType =
    serviceType.trim().length > 0

  const hasDate =
    scheduledDate.trim().length > 0

  const hasTime =
    scheduledTime.trim().length > 0

  const canSubmit =
    Boolean(user) &&
    Boolean(selectedVehicle) &&
    Boolean(mechanicId) &&
    hasServiceType &&
    hasDate &&
    hasTime &&
    !isSubmittingBooking

  const handleSubmit = async () => {
    if (
      !user ||
      !selectedVehicle ||
      !mechanicId ||
      !hasServiceType ||
      !hasDate ||
      !hasTime
    ) {
      return
    }

    await submitWorkshopBooking({
      customerId: user.id,
      vehicleId: selectedVehicle.id,
      mechanicId,

      diagnosticResultId: resultId ?? null,

      serviceType: serviceType.trim(),

      issueDescription:
        issueDescription.trim() || null,

      scheduledDate: scheduledDate.trim(),
      scheduledTime: scheduledTime.trim(),
    })
  }

  if (workshopBooking) {
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
            name="calendar-check-outline"
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
          Booking Submitted
        </Text>

        <Text
          style={[
            styles.successDescription,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Your requested workshop appointment has been
          submitted and is awaiting confirmation.
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
            Requested Appointment
          </Text>

          <Text
            style={[
              styles.appointmentValue,
              {
                color: colors.text,
              },
            ]}
          >
            {workshopBooking.scheduledDate}
          </Text>

          <Text
            style={[
              styles.appointmentTime,
              {
                color: colors.text,
              },
            ]}
          >
            {workshopBooking.scheduledTime}
          </Text>

          <Text
            style={[
              styles.statusValue,
              {
                color: colors.warning,
              },
            ]}
          >
            Pending Confirmation
          </Text>

          <Text
            style={[
              styles.bookingId,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            {workshopBooking.id}
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
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
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
            Book Service
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
          Workshop Booking
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Request a workshop appointment for your selected
          vehicle.
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

        {/* Service */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Service
        </Text>

        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="wrench-outline"
            size={21}
            color={colors.accent}
          />

          <TextInput
            value={serviceType}
            onChangeText={setServiceType}
            placeholder="e.g. Brake Inspection"
            placeholderTextColor={colors.secondaryText}
            style={[
              styles.singleLineInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>

        {/* Date */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Preferred Date
        </Text>

        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="calendar-outline"
            size={21}
            color={colors.accent}
          />

          <TextInput
            value={scheduledDate}
            onChangeText={setScheduledDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.secondaryText}
            keyboardType="numbers-and-punctuation"
            style={[
              styles.singleLineInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>

        {/* Time */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Preferred Time
        </Text>

        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="clock-outline"
            size={21}
            color={colors.accent}
          />

          <TextInput
            value={scheduledTime}
            onChangeText={setScheduledTime}
            placeholder="HH:MM"
            placeholderTextColor={colors.secondaryText}
            keyboardType="numbers-and-punctuation"
            style={[
              styles.singleLineInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>

        <Text
          style={[
            styles.slotNote,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          This is a requested appointment time. The
          workshop must confirm availability before the
          booking becomes confirmed.
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
            styles.descriptionContainer,
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
            placeholder="Describe anything the workshop should know..."
            placeholderTextColor={colors.secondaryText}
            multiline
            maxLength={500}
            textAlignVertical="top"
            style={[
              styles.descriptionInput,
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

        {workshopBookingError ? (
          <Text
            style={[
              styles.bookingError,
              {
                color: colors.danger,
              },
            ]}
          >
            {workshopBookingError}
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
          {isSubmittingBooking ? (
            <ActivityIndicator
              size="small"
              color="#000000"
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="calendar-check-outline"
                size={20}
                color="#000000"
              />

              <Text style={styles.submitButtonText}>
                Request Booking
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
          Appointment availability, pricing and final
          confirmation will be provided by the workshop
          through MechanIQ.
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

  inputRow: {
    minHeight: 54,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  singleLineInput: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 0,
    fontSize: 11,
  },

  slotNote: {
    marginTop: 7,
    paddingHorizontal: 4,
    fontSize: 8,
    lineHeight: 13,
  },

  descriptionContainer: {
    minHeight: 125,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  descriptionInput: {
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

  bookingError: {
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

  appointmentValue: {
    marginTop: 7,
    fontSize: 14,
    fontWeight: '700',
  },

  appointmentTime: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '700',
  },

  statusValue: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '800',
  },

  bookingId: {
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