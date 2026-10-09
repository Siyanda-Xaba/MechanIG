import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useTheme } from '../theme/ThemeContext'

const DELIVERY_STEPS = [
  {
    status: 'scheduled',
    label: 'Scheduled',
    description: 'Your delivery has been scheduled.',
  },
  {
    status: 'driver-assigned',
    label: 'Driver Assigned',
    description: 'A driver has been assigned.',
  },
  {
    status: 'en-route',
    label: 'En Route',
    description: 'Your driver is travelling to you.',
  },
  {
    status: 'arrived',
    label: 'Driver Arrived',
    description: 'Your driver has reached the location.',
  },
  {
    status: 'delivering',
    label: 'Delivering Fuel',
    description: 'Fuel delivery is in progress.',
  },
  {
    status: 'completed',
    label: 'Completed',
    description: 'Your delivery has been completed.',
  },
]

export default function FuelDeliveryTimeline({
  status,
}) {
  const { colors } = useTheme()

  const isCancelled = status === 'cancelled'

  const currentStepIndex =
    DELIVERY_STEPS.findIndex(
      (step) => step.status === status
    )

  const hasValidStatus =
    isCancelled || currentStepIndex >= 0

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Delivery Progress
      </Text>

      {!hasValidStatus ? (
        <Text
          style={[
            styles.notice,
            { color: colors.secondaryText },
          ]}
        >
          Delivery progress will appear when
          tracking information is available.
        </Text>
      ) : isCancelled ? (
        <View style={styles.cancelledContainer}>
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={28}
            color={colors.danger}
          />

          <View style={styles.cancelledTextContainer}>
            <Text
              style={[
                styles.cancelledTitle,
                { color: colors.danger },
              ]}
            >
              Delivery Cancelled
            </Text>

            <Text
              style={[
                styles.cancelledDescription,
                { color: colors.secondaryText },
              ]}
            >
              This delivery has been cancelled.
              Its previous progress is unavailable.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.timeline}>
          {DELIVERY_STEPS.map((step, index) => {
            const isCompleted =
              index < currentStepIndex

            const isCurrent =
              index === currentStepIndex

            const isReached =
              index <= currentStepIndex

            const isLast =
              index === DELIVERY_STEPS.length - 1

            return (
              <View
                key={step.status}
                style={styles.stepRow}
                accessibilityLabel={`${step.label}, ${
                  isCompleted
                    ? 'completed'
                    : isCurrent
                      ? 'current stage'
                      : 'upcoming'
                }`}
              >
                <View style={styles.markerColumn}>
                  <View
                    style={[
                      styles.marker,
                      {
                        backgroundColor: isReached
                          ? colors.accent
                          : colors.card,
                        borderColor: isReached
                          ? colors.accent
                          : colors.border,
                      },
                    ]}
                  >
                    {isCompleted ? (
                      <MaterialCommunityIcons
                        name="check"
                        size={15}
                        color="#000000"
                      />
                    ) : (
                      <Text
                        style={[
                          styles.markerNumber,
                          {
                            color: isCurrent
                              ? '#000000'
                              : colors.secondaryText,
                          },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>

                  {!isLast ? (
                    <View
                      style={[
                        styles.connector,
                        {
                          backgroundColor: isCompleted
                            ? colors.accent
                            : colors.border,
                        },
                      ]}
                    />
                  ) : null}
                </View>

                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isReached
                          ? colors.text
                          : colors.secondaryText,
                        fontWeight: isCurrent
                          ? '800'
                          : '600',
                      },
                    ]}
                  >
                    {step.label}
                  </Text>

                  <Text
                    style={[
                      styles.stepDescription,
                      { color: colors.secondaryText },
                    ]}
                  >
                    {step.description}
                  </Text>

                  {isCurrent ? (
                    <Text
                      style={[
                        styles.currentLabel,
                        { color: colors.accent },
                      ]}
                    >
                      Current Stage
                    </Text>
                  ) : null}
                </View>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 18,
  },

  timeline: {
    paddingLeft: 4,
  },

  stepRow: {
    flexDirection: 'row',
    minHeight: 76,
  },

  markerColumn: {
    width: 32,
    alignItems: 'center',
  },

  marker: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerNumber: {
    fontSize: 11,
    fontWeight: '800',
  },

  connector: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },

  stepContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },

  stepLabel: {
    fontSize: 13,
  },

  stepDescription: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  currentLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 6,
  },

  notice: {
    fontSize: 12,
    lineHeight: 19,
  },

  cancelledContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  cancelledTextContainer: {
    flex: 1,
  },

  cancelledTitle: {
    fontSize: 14,
    fontWeight: '800',
  },

  cancelledDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
})