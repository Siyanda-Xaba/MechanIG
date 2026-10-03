import DateTimePicker from '@react-native-community/datetimepicker'
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  useEffect,
  useState,
} from 'react'
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'
import {
  MECHANIC_AVAILABILITY_DAY_LABELS,
  MECHANIC_AVAILABILITY_DAY_ORDER,
} from '../../src/mechanic/availabilityTypes'
import {
  useMechanicAvailability,
} from '../../src/mechanic/MechanicAvailabilityContext'
import { useTheme } from '../../src/theme/ThemeContext'

const TIME_PATTERN =
  /^([01]\d|2[0-3]):([0-5]\d)$/

const COMMON_TIMEZONES = [
  'Africa/Johannesburg',
  'Africa/Gaborone',
  'Africa/Harare',
  'Africa/Maputo',
  'Africa/Windhoek',
  'Africa/Nairobi',
  'Africa/Lagos',
  'Africa/Accra',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Athens',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'America/Sao_Paulo',
  'Etc/UTC',
]

let localWindowCounter = 0

function getTimezoneOptions() {
  let deviceTimezone = null

  try {
    deviceTimezone =
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone
  } catch {
    deviceTimezone = null
  }

  return Array.from(
    new Set(
      [
        deviceTimezone,
        ...COMMON_TIMEZONES,
      ].filter(Boolean)
    )
  )
}

const TIMEZONE_OPTIONS =
  getTimezoneOptions()

function createLocalWindowId(day) {
  localWindowCounter += 1

  return `availability-${day}-${Date.now()}-${localWindowCounter}`
}

function cloneWeeklySchedule(schedule) {
  return schedule.map((day) => ({
    ...day,

    windows:
      day.windows.map(
        (window) => ({
          ...window,
        })
      ),
  }))
}

function isValidTimeWindow(window) {
  if (
    !TIME_PATTERN.test(
      window.startTime
    ) ||
    !TIME_PATTERN.test(
      window.endTime
    )
  ) {
    return false
  }

  return (
    window.startTime <
    window.endTime
  )
}

function createDateFromTime(
  timeValue,
  fallbackTime
) {
  const sourceTime =
    TIME_PATTERN.test(timeValue)
      ? timeValue
      : fallbackTime

  const [
    hours,
    minutes,
  ] = sourceTime
    .split(':')
    .map(Number)

  const date = new Date()

  date.setHours(
    hours,
    minutes,
    0,
    0
  )

  return date
}

function formatTimeValue(date) {
  const hours =
    String(
      date.getHours()
    ).padStart(2, '0')

  const minutes =
    String(
      date.getMinutes()
    ).padStart(2, '0')

  return `${hours}:${minutes}`
}

export default function MechanicAvailabilityScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    availabilityData,
    isLoadingAvailability,
    availabilityError,
    refreshAvailability,

    isSavingAvailability,
    availabilitySaveError,
    saveAvailability,
    clearAvailabilitySaveError,
  } = useMechanicAvailability()

  const [
    isAcceptingJobs,
    setIsAcceptingJobs,
  ] = useState(false)

  const [
    timezone,
    setTimezone,
  ] = useState('')

  const [
    isTimezonePickerVisible,
    setIsTimezonePickerVisible,
  ] = useState(false)

  const [
    weeklySchedule,
    setWeeklySchedule,
  ] = useState([])

  const [
    localFormError,
    setLocalFormError,
  ] = useState(null)

  const [
    hasChanges,
    setHasChanges,
  ] = useState(false)

  const [
    timePickerTarget,
    setTimePickerTarget,
  ] = useState(null)

  const [
    timePickerValue,
    setTimePickerValue,
  ] = useState(new Date())

  useEffect(() => {
    if (!availabilityData) {
      return
    }

    setIsAcceptingJobs(
      availabilityData
        .isAcceptingJobs
    )

    setTimezone(
      availabilityData.timezone ??
        ''
    )

    setWeeklySchedule(
      cloneWeeklySchedule(
        availabilityData
          .weeklySchedule
      )
    )

    setLocalFormError(null)
    setHasChanges(false)
  }, [availabilityData])

  function markChanged() {
    setHasChanges(true)
    setLocalFormError(null)

    if (availabilitySaveError) {
      clearAvailabilitySaveError()
    }
  }

  function handleAcceptingJobsChange(
    value
  ) {
    setIsAcceptingJobs(value)
    markChanged()
  }

  function handleTimezoneSelect(
    selectedTimezone
  ) {
    setTimezone(
      selectedTimezone
    )

    setIsTimezonePickerVisible(
      false
    )

    markChanged()
  }

  function updateDay(
    dayKey,
    updater
  ) {
    setWeeklySchedule(
      (currentSchedule) =>
        currentSchedule.map(
          (day) => {
            if (
              day.day !== dayKey
            ) {
              return day
            }

            return updater(day)
          }
        )
    )

    markChanged()
  }

  function handleDayEnabledChange(
    dayKey,
    value
  ) {
    updateDay(
      dayKey,
      (day) => ({
        ...day,
        isAvailable: value,
      })
    )
  }

  function handleAddWindow(
    dayKey
  ) {
    updateDay(
      dayKey,
      (day) => ({
        ...day,

        windows: [
          ...day.windows,
          {
            id:
              createLocalWindowId(
                dayKey
              ),

            startTime: '',
            endTime: '',
          },
        ],
      })
    )
  }

  function handleRemoveWindow(
    dayKey,
    windowId
  ) {
    if (
      timePickerTarget
        ?.dayKey === dayKey &&
      timePickerTarget
        ?.windowId === windowId
    ) {
      setTimePickerTarget(null)
    }

    updateDay(
      dayKey,
      (day) => ({
        ...day,

        windows:
          day.windows.filter(
            (window) =>
              window.id !==
              windowId
          ),
      })
    )
  }

  function handleWindowChange(
    dayKey,
    windowId,
    field,
    value
  ) {
    updateDay(
      dayKey,
      (day) => ({
        ...day,

        windows:
          day.windows.map(
            (window) => {
              if (
                window.id !==
                windowId
              ) {
                return window
              }

              return {
                ...window,
                [field]: value,
              }
            }
          ),
      })
    )
  }

  function handleOpenTimePicker(
    dayKey,
    windowId,
    field,
    currentValue
  ) {
    const fallbackTime =
      field === 'startTime'
        ? '08:00'
        : '17:00'

    setTimePickerValue(
      createDateFromTime(
        currentValue,
        fallbackTime
      )
    )

    setTimePickerTarget({
      dayKey,
      windowId,
      field,
    })
  }

  function commitSelectedTime(
    selectedDate
  ) {
    if (!timePickerTarget) {
      return
    }

    handleWindowChange(
      timePickerTarget.dayKey,
      timePickerTarget.windowId,
      timePickerTarget.field,
      formatTimeValue(
        selectedDate
      )
    )
  }

  function handleTimePickerChange(
    event,
    selectedDate
  ) {
    if (
      event.type ===
        'dismissed' ||
      !selectedDate
    ) {
      if (
        Platform.OS ===
        'android'
      ) {
        setTimePickerTarget(null)
      }

      return
    }

    if (
      Platform.OS ===
      'android'
    ) {
      commitSelectedTime(
        selectedDate
      )

      setTimePickerTarget(null)

      return
    }

    setTimePickerValue(
      selectedDate
    )
  }

  function handleConfirmTimePicker() {
    commitSelectedTime(
      timePickerValue
    )

    setTimePickerTarget(null)
  }

  function validateDraft() {
    const trimmedTimezone =
      timezone.trim()

    if (
      isAcceptingJobs &&
      !trimmedTimezone
    ) {
      return (
        'Select a scheduling timezone before accepting new jobs.'
      )
    }

    for (
      const day
      of weeklySchedule
    ) {
      if (!day.isAvailable) {
        continue
      }

      if (
        day.windows.length === 0
      ) {
        const dayLabel =
          MECHANIC_AVAILABILITY_DAY_LABELS[
            day.day
          ]

        return `${dayLabel} is enabled but has no availability time window.`
      }

      for (
        const window
        of day.windows
      ) {
        if (
          !window.startTime ||
          !window.endTime
        ) {
          return (
            'Select both a start and end time for every active availability window.'
          )
        }

        if (
          !isValidTimeWindow(
            window
          )
        ) {
          return (
            'Each availability start time must be earlier than its end time.'
          )
        }
      }
    }

    return null
  }

  async function handleSave() {
    setLocalFormError(null)

    const validationError =
      validateDraft()

    if (validationError) {
      setLocalFormError(
        validationError
      )

      return
    }

    const didSave =
      await saveAvailability({
        isAcceptingJobs,

        timezone:
          timezone.trim() ||
          null,

        weeklySchedule:
          cloneWeeklySchedule(
            weeklySchedule
          ),

        overrides:
          availabilityData
            ?.overrides
            ? availabilityData
                .overrides
                .map(
                  (override) => ({
                    ...override,

                    windows:
                      override.windows.map(
                        (window) => ({
                          ...window,
                        })
                      ),
                  })
                )
            : [],
      })

    if (didSave) {
      setHasChanges(false)
    }
  }

  function handleReset() {
    if (!availabilityData) {
      return
    }

    setIsAcceptingJobs(
      availabilityData
        .isAcceptingJobs
    )

    setTimezone(
      availabilityData.timezone ??
        ''
    )

    setWeeklySchedule(
      cloneWeeklySchedule(
        availabilityData
          .weeklySchedule
      )
    )

    setLocalFormError(null)
    clearAvailabilitySaveError()
    setHasChanges(false)
    setTimePickerTarget(null)
    setIsTimezonePickerVisible(
      false
    )
  }

  if (isLoadingAvailability) {
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
          Loading availability...
        </Text>
      </SafeAreaView>
    )
  }

  if (
    availabilityError ||
    !availabilityData
  ) {
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
          name="calendar-alert"
          size={48}
          color={colors.danger}
        />

        <Text
          style={[
            styles.errorTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Unable to load availability
        </Text>

        <Text
          style={[
            styles.errorMessage,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {availabilityError ??
            'Mechanic availability information is unavailable.'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            refreshAvailability
          }
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
            style={
              styles.retryButtonText
            }
          >
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() =>
            router.back()
          }
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

  const visibleError =
    localFormError ??
    availabilitySaveError

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
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.back()
            }
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

          <View
            style={
              styles.headerText
            }
          >
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Availability
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
              Manage when you can
              accept new customer
              work.
            </Text>
          </View>
        </View>

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
          <View
            style={
              styles.summaryIcon
            }
          >
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={26}
              color={colors.accent}
            />
          </View>

          <View
            style={
              styles.summaryContent
            }
          >
            <Text
              style={[
                styles.summaryTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Job Availability
            </Text>

            <Text
              style={[
                styles.summaryDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Your availability will
              eventually be used by
              customer booking and job
              assignment services.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
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
              styles.settingRow
            }
          >
            <View
              style={
                styles.settingText
              }
            >
              <Text
                style={[
                  styles.settingTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Accept New Jobs
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Control whether new
                customer work can be
                offered to you.
              </Text>
            </View>

            <Switch
              value={
                isAcceptingJobs
              }
              onValueChange={
                handleAcceptingJobsChange
              }
              trackColor={{
                false:
                  colors.border,
                true:
                  colors.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Scheduling Timezone
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
              Used to interpret your
              working hours correctly.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor:
                colors.card,

              borderColor:
                colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.inputLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Timezone
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              setIsTimezonePickerVisible(
                true
              )
            }
            style={[
              styles.dropdownField,
              {
                borderColor:
                  colors.border,

                backgroundColor:
                  colors.background,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="earth"
              size={20}
              color={colors.accent}
            />

            <Text
              numberOfLines={1}
              style={[
                styles.dropdownValue,
                {
                  color: timezone
                    ? colors.text
                    : colors.secondaryText,
                },
              ]}
            >
              {timezone ||
                'Select timezone'}
            </Text>

            <Ionicons
              name="chevron-down"
              size={19}
              color={
                colors.secondaryText
              }
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.helperText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Select the timezone used
            for your workshop or mobile
            service schedule.
          </Text>
        </View>

        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Weekly Schedule
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
              Enable each working day
              and add the hours you are
              available.
            </Text>
          </View>
        </View>

        <View
          style={
            styles.daysList
          }
        >
          {MECHANIC_AVAILABILITY_DAY_ORDER.map(
            (dayKey) => {
              const day =
                weeklySchedule.find(
                  (item) =>
                    item.day ===
                    dayKey
                )

              if (!day) {
                return null
              }

              return (
                <View
                  key={day.day}
                  style={[
                    styles.dayCard,
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
                      styles.dayHeader
                    }
                  >
                    <View
                      style={
                        styles.dayTitleContainer
                      }
                    >
                      <Text
                        style={[
                          styles.dayTitle,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {
                          MECHANIC_AVAILABILITY_DAY_LABELS[
                            day.day
                          ]
                        }
                      </Text>

                      <Text
                        style={[
                          styles.dayStatus,
                          {
                            color:
                              day.isAvailable
                                ? colors.success
                                : colors.secondaryText,
                          },
                        ]}
                      >
                        {day.isAvailable
                          ? 'Available'
                          : 'Unavailable'}
                      </Text>
                    </View>

                    <Switch
                      value={
                        day.isAvailable
                      }
                      onValueChange={(
                        value
                      ) =>
                        handleDayEnabledChange(
                          day.day,
                          value
                        )
                      }
                      trackColor={{
                        false:
                          colors.border,
                        true:
                          colors.accent,
                      }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {day.isAvailable ? (
                    <View
                      style={
                        styles.windowsContainer
                      }
                    >
                      {day.windows
                        .length ===
                      0 ? (
                        <View
                          style={
                            styles.emptyWindow
                          }
                        >
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={22}
                            color={
                              colors.secondaryText
                            }
                          />

                          <Text
                            style={[
                              styles.emptyWindowText,
                              {
                                color:
                                  colors.secondaryText,
                              },
                            ]}
                          >
                            No working
                            hours added
                            yet.
                          </Text>
                        </View>
                      ) : (
                        day.windows.map(
                          (
                            window,
                            index
                          ) => (
                            <View
                              key={
                                window.id
                              }
                              style={[
                                styles.windowCard,
                                {
                                  borderColor:
                                    colors.border,

                                  backgroundColor:
                                    colors.background,
                                },
                              ]}
                            >
                              <View
                                style={
                                  styles.windowHeader
                                }
                              >
                                <Text
                                  style={[
                                    styles.windowTitle,
                                    {
                                      color:
                                        colors.text,
                                    },
                                  ]}
                                >
                                  Time Window{' '}
                                  {index +
                                    1}
                                </Text>

                                <TouchableOpacity
                                  activeOpacity={
                                    0.7
                                  }
                                  onPress={() =>
                                    handleRemoveWindow(
                                      day.day,
                                      window.id
                                    )
                                  }
                                  style={
                                    styles.removeWindowButton
                                  }
                                >
                                  <Ionicons
                                    name="trash-outline"
                                    size={
                                      18
                                    }
                                    color={
                                      colors.danger
                                    }
                                  />
                                </TouchableOpacity>
                              </View>

                              <View
                                style={
                                  styles.timeInputsRow
                                }
                              >
                                <View
                                  style={
                                    styles.timeInputContainer
                                  }
                                >
                                  <Text
                                    style={[
                                      styles.timeInputLabel,
                                      {
                                        color:
                                          colors.secondaryText,
                                      },
                                    ]}
                                  >
                                    Start
                                  </Text>

                                  <TouchableOpacity
                                    activeOpacity={
                                      0.75
                                    }
                                    onPress={() =>
                                      handleOpenTimePicker(
                                        day.day,
                                        window.id,
                                        'startTime',
                                        window.startTime
                                      )
                                    }
                                    style={[
                                      styles.timeField,
                                      {
                                        borderColor:
                                          colors.border,

                                        backgroundColor:
                                          colors.card,
                                      },
                                    ]}
                                  >
                                    <Ionicons
                                      name="time-outline"
                                      size={
                                        18
                                      }
                                      color={
                                        colors.accent
                                      }
                                    />

                                    <Text
                                      style={[
                                        styles.timeFieldValue,
                                        {
                                          color:
                                            window.startTime
                                              ? colors.text
                                              : colors.secondaryText,
                                        },
                                      ]}
                                    >
                                      {window.startTime ||
                                        'Select'}
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={
                                    styles.timeSeparator
                                  }
                                >
                                  <MaterialCommunityIcons
                                    name="arrow-right"
                                    size={
                                      20
                                    }
                                    color={
                                      colors.secondaryText
                                    }
                                  />
                                </View>

                                <View
                                  style={
                                    styles.timeInputContainer
                                  }
                                >
                                  <Text
                                    style={[
                                      styles.timeInputLabel,
                                      {
                                        color:
                                          colors.secondaryText,
                                      },
                                    ]}
                                  >
                                    End
                                  </Text>

                                  <TouchableOpacity
                                    activeOpacity={
                                      0.75
                                    }
                                    onPress={() =>
                                      handleOpenTimePicker(
                                        day.day,
                                        window.id,
                                        'endTime',
                                        window.endTime
                                      )
                                    }
                                    style={[
                                      styles.timeField,
                                      {
                                        borderColor:
                                          colors.border,

                                        backgroundColor:
                                          colors.card,
                                      },
                                    ]}
                                  >
                                    <Ionicons
                                      name="time-outline"
                                      size={
                                        18
                                      }
                                      color={
                                        colors.accent
                                      }
                                    />

                                    <Text
                                      style={[
                                        styles.timeFieldValue,
                                        {
                                          color:
                                            window.endTime
                                              ? colors.text
                                              : colors.secondaryText,
                                        },
                                      ]}
                                    >
                                      {window.endTime ||
                                        'Select'}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          )
                        )
                      )}

                      <TouchableOpacity
                        activeOpacity={
                          0.75
                        }
                        onPress={() =>
                          handleAddWindow(
                            day.day
                          )
                        }
                        style={[
                          styles.addWindowButton,
                          {
                            borderColor:
                              colors.accent,
                          },
                        ]}
                      >
                        <Ionicons
                          name="add"
                          size={19}
                          color={
                            colors.accent
                          }
                        />

                        <Text
                          style={[
                            styles.addWindowText,
                            {
                              color:
                                colors.accent,
                            },
                          ]}
                        >
                          Add Time Window
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              )
            }
          )}
        </View>

        <View
          style={[
            styles.infoCard,
            {
              borderColor:
                colors.border,

              backgroundColor:
                colors.card,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color={colors.accent}
          />

          <Text
            style={[
              styles.infoText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Changes can be prepared
            here, but production
            availability will only
            become authoritative once
            the MechanIQ availability
            backend is connected.
          </Text>
        </View>

        {visibleError ? (
          <View
            style={[
              styles.errorCard,
              {
                borderColor:
                  colors.danger,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color={colors.danger}
            />

            <Text
              style={[
                styles.inlineErrorText,
                {
                  color:
                    colors.danger,
                },
              ]}
            >
              {visibleError}
            </Text>
          </View>
        ) : null}

        <View
          style={
            styles.actions
          }
        >
          <TouchableOpacity
            activeOpacity={0.75}
            disabled={
              !hasChanges ||
              isSavingAvailability
            }
            onPress={
              handleReset
            }
            style={[
              styles.resetButton,
              {
                borderColor:
                  colors.border,

                opacity:
                  !hasChanges ||
                  isSavingAvailability
                    ? 0.5
                    : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.resetButtonText,
                {
                  color: colors.text,
                },
              ]}
            >
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={
              !hasChanges ||
              isSavingAvailability
            }
            onPress={
              handleSave
            }
            style={[
              styles.saveButton,
              {
                backgroundColor:
                  colors.accent,

                opacity:
                  !hasChanges ||
                  isSavingAvailability
                    ? 0.5
                    : 1,
              },
            ]}
          >
            {isSavingAvailability ? (
              <ActivityIndicator
                size="small"
                color="#000000"
              />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={19}
                  color="#000000"
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  Save Availability
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </StableScrollView>

      <Modal
        visible={
          isTimezonePickerVisible
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setIsTimezonePickerVisible(
            false
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.modalSheet,
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
                styles.modalHeader
              }
            >
              <View
                style={
                  styles.modalHeaderText
                }
              >
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  Select Timezone
                </Text>

                <Text
                  style={[
                    styles.modalDescription,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Choose the timezone
                  used for your working
                  hours.
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setIsTimezonePickerVisible(
                    false
                  )
                }
                style={[
                  styles.modalCloseButton,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={
                styles.timezoneList
              }
              showsVerticalScrollIndicator={
                false
              }
            >
              {TIMEZONE_OPTIONS.map(
                (option) => {
                  const isSelected =
                    timezone === option

                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={
                        0.7
                      }
                      onPress={() =>
                        handleTimezoneSelect(
                          option
                        )
                      }
                      style={[
                        styles.timezoneOption,
                        {
                          borderBottomColor:
                            colors.border,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="map-clock-outline"
                        size={20}
                        color={
                          isSelected
                            ? colors.accent
                            : colors.secondaryText
                        }
                      />

                      <Text
                        style={[
                          styles.timezoneOptionText,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {option}
                      </Text>

                      {isSelected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={21}
                          color={
                            colors.accent
                          }
                        />
                      ) : null}
                    </TouchableOpacity>
                  )
                }
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {Platform.OS ===
        'android' &&
      timePickerTarget ? (
        <DateTimePicker
          value={timePickerValue}
          mode="time"
          display="default"
          is24Hour
          onChange={
            handleTimePickerChange
          }
        />
      ) : null}

      <Modal
        visible={
          Platform.OS === 'ios' &&
          timePickerTarget !== null
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setTimePickerTarget(null)
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.timePickerSheet,
              {
                backgroundColor:
                  colors.card,

                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {timePickerTarget
                ?.field ===
              'startTime'
                ? 'Select Start Time'
                : 'Select End Time'}
            </Text>

            <DateTimePicker
              value={
                timePickerValue
              }
              mode="time"
              display="spinner"
              is24Hour
              textColor={colors.text}
              onChange={
                handleTimePickerChange
              }
              style={
                styles.iosTimePicker
              }
            />

            <View
              style={
                styles.pickerActions
              }
            >
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  setTimePickerTarget(
                    null
                  )
                }
                style={[
                  styles.pickerCancelButton,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pickerCancelText,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={
                  handleConfirmTimePicker
                }
                style={[
                  styles.pickerDoneButton,
                  {
                    backgroundColor:
                      colors.accent,
                  },
                ]}
              >
                <Text
                  style={
                    styles.pickerDoneText
                  }
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 36,
  },

  centeredPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 14,
    textAlign: 'center',
  },

  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  retryButton: {
    minHeight: 46,
    marginTop: 22,
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  retryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },

  secondaryButton: {
    minHeight: 44,
    marginTop: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
    marginBottom: 22,
  },

  backButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    flex: 1,
    paddingTop: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
  },

  summaryCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 13,
    marginBottom: 18,
  },

  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryContent: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  summaryDescription: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
  },

  sectionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },

  settingDescription: {
    marginTop: 4,
    fontSize: 12.5,
    lineHeight: 18,
  },

  sectionHeader: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '750',
  },

  sectionDescription: {
    marginTop: 4,
    fontSize: 12.5,
    lineHeight: 18,
  },

  inputLabel: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: '600',
  },

  dropdownField: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  dropdownValue: {
    flex: 1,
    fontSize: 14,
  },

  helperText: {
    marginTop: 8,
    fontSize: 11.5,
    lineHeight: 17,
  },

  daysList: {
    gap: 12,
    marginBottom: 18,
  },

  dayCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
  },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: 12,
  },

  dayTitleContainer: {
    flex: 1,
  },

  dayTitle: {
    fontSize: 15,
    fontWeight: '700',
  },

  dayStatus: {
    marginTop: 3,
    fontSize: 11.5,
    fontWeight: '600',
  },

  windowsContainer: {
    marginTop: 15,
    gap: 10,
  },

  emptyWindow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  emptyWindowText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },

  windowCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },

  windowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 10,
  },

  windowTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },

  removeWindowButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeInputsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  timeInputContainer: {
    flex: 1,
  },

  timeInputLabel: {
    marginBottom: 6,
    fontSize: 11,
    fontWeight: '600',
  },

  timeField: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  timeFieldValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  timeSeparator: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addWindowButton: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  addWindowText: {
    fontSize: 12.5,
    fontWeight: '700',
  },

  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },

  errorCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 14,
  },

  inlineErrorText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
  },

  resetButton: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  saveButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  saveButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0, 0, 0, 0.55)',
  },

  modalSheet: {
    maxHeight: '72%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },

  modalHeaderText: {
    flex: 1,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
  },

  modalDescription: {
    marginTop: 4,
    fontSize: 12.5,
    lineHeight: 18,
  },

  modalCloseButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timezoneList: {
    width: '100%',
  },

  timezoneOption: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
  },

  timezoneOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },

  timePickerSheet: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 28,
  },

  iosTimePicker: {
    width: '100%',
    marginVertical: 8,
  },

  pickerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },

  pickerCancelButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pickerCancelText: {
    fontSize: 14,
    fontWeight: '700',
  },

  pickerDoneButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pickerDoneText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
})