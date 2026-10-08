import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  SafeAreaView,
} from 'react-native-safe-area-context'

import {
  ESTIMATE_LINE_ITEM_TYPES,
} from '../../src/estimates/estimateTypes'
import StableScrollView from '../../src/components/StableScrollView'
import {
  useMechanicEstimate,
} from '../../src/mechanic/MechanicEstimateContext'
import {
  useMechanicJobs,
} from '../../src/mechanic/MechanicJobsContext'
import {
  useTheme,
} from '../../src/theme/ThemeContext'
import {
  useUser,
} from '../../src/users/UserContext'

const ELIGIBLE_JOB_STATUSES = [
  'pending',
  'accepted',
  'in-progress',
]

const LINE_ITEM_TYPE_LABELS = {
  [ESTIMATE_LINE_ITEM_TYPES.LABOUR]:
    'Labour',

  [ESTIMATE_LINE_ITEM_TYPES.PART]:
    'Part',

  [ESTIMATE_LINE_ITEM_TYPES.OTHER]:
    'Other',
}

let localLineItemCounter = 0

function createLineItem(
  type =
    ESTIMATE_LINE_ITEM_TYPES
      .LABOUR
) {
  localLineItemCounter += 1

  return {
    id: `estimate-line-${Date.now()}-${localLineItemCounter}`,
    type,
    description: '',
    quantity: '1',
    unitPrice: '',
  }
}

function parsePositiveNumber(
  value
) {
  const normalizedValue =
    String(value)
      .trim()
      .replace(',', '.')

  if (
    normalizedValue.length === 0
  ) {
    return null
  }

  const numberValue =
    Number(normalizedValue)

  if (
    !Number.isFinite(
      numberValue
    ) ||
    numberValue <= 0
  ) {
    return null
  }

  return numberValue
}

function formatMoney(
  amount,
  currency
) {
  if (
    typeof amount !== 'number' ||
    !Number.isFinite(amount)
  ) {
    return `${currency} 0.00`
  }

  return `${currency} ${amount.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`
}

function getJobStatusLabel(
  status
) {
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

export default function MechanicEstimateScreen() {
  const router =
    useRouter()

  const {
    jobId: routeJobId,
  } = useLocalSearchParams()

  const normalizedRouteJobId =
    Array.isArray(routeJobId)
      ? routeJobId[0]
      : routeJobId

  const {
    colors,
  } = useTheme()

  const {
    user,
  } = useUser()

  const {
    jobsData,
    isLoadingJobs,
    jobsError,
    refreshJobs,
  } = useMechanicJobs()

  const {
    createdEstimate,
    isCreatingEstimate,
    estimateError,
    createMechanicEstimate,
    clearEstimateError,
    resetEstimate,
  } = useMechanicEstimate()

  const [
    selectedJobId,
    setSelectedJobId,
  ] = useState(null)

  const [
    isJobPickerVisible,
    setIsJobPickerVisible,
  ] = useState(false)

  const [
    currency,
    setCurrency,
  ] = useState('ZAR')

  const [
    lineItems,
    setLineItems,
  ] = useState([
    createLineItem(),
  ])

  const [
    notes,
    setNotes,
  ] = useState('')

  const [
    localFormError,
    setLocalFormError,
  ] = useState(null)

  const jobs =
    jobsData?.jobs ?? []

  const eligibleJobs =
    useMemo(
      () =>
        jobs.filter(
          (job) =>
            ELIGIBLE_JOB_STATUSES.includes(
              job.status
            )
        ),
      [jobs]
    )

  useEffect(() => {
    if (!normalizedRouteJobId) {
      return
    }

    const routeJob =
      eligibleJobs.find(
        (job) =>
          job.id ===
          normalizedRouteJobId
      )

    if (!routeJob) {
      return
    }

    setSelectedJobId(
      (currentJobId) =>
        currentJobId === routeJob.id
          ? currentJobId
          : routeJob.id
    )

    if (routeJob.currency) {
      setCurrency(
        (currentCurrency) =>
          currentCurrency ===
          routeJob.currency
            ? currentCurrency
            : routeJob.currency
      )
    }
  }, [
    eligibleJobs,
    normalizedRouteJobId,
  ])

  const selectedJob =
    useMemo(
      () =>
        eligibleJobs.find(
          (job) =>
            job.id ===
            selectedJobId
        ) ?? null,
      [
        eligibleJobs,
        selectedJobId,
      ]
    )

  const previewSubtotal =
    useMemo(() => {
      return lineItems.reduce(
        (
          total,
          lineItem
        ) => {
          const quantity =
            parsePositiveNumber(
              lineItem.quantity
            )

          const unitPrice =
            parsePositiveNumber(
              lineItem.unitPrice
            )

          if (
            quantity == null ||
            unitPrice == null
          ) {
            return total
          }

          return (
            total +
            quantity *
              unitPrice
          )
        },
        0
      )
    }, [lineItems])

  const clearErrors = () => {
    setLocalFormError(null)
    clearEstimateError()
  }

  const handleSelectJob = (
    job
  ) => {
    setSelectedJobId(
      job.id
    )

    if (job.currency) {
      setCurrency(
        job.currency
      )
    }

    setIsJobPickerVisible(
      false
    )

    clearErrors()
  }

  const updateLineItem = (
    lineItemId,
    field,
    value
  ) => {
    setLineItems(
      (currentItems) =>
        currentItems.map(
          (lineItem) =>
            lineItem.id ===
            lineItemId
              ? {
                  ...lineItem,
                  [field]:
                    value,
                }
              : lineItem
        )
    )

    clearErrors()
  }

  const addLineItem = () => {
    setLineItems(
      (currentItems) => [
        ...currentItems,
        createLineItem(),
      ]
    )

    clearErrors()
  }

  const removeLineItem = (
    lineItemId
  ) => {
    if (
      lineItems.length === 1
    ) {
      setLocalFormError(
        'An estimate must contain at least one line item.'
      )

      return
    }

    setLineItems(
      (currentItems) =>
        currentItems.filter(
          (lineItem) =>
            lineItem.id !==
            lineItemId
        )
    )

    clearErrors()
  }

  const validateForm = () => {
    if (!user?.id) {
      return 'A signed-in mechanic account is required to create an estimate.'
    }

    if (!selectedJob) {
      return 'Select a job for this estimate.'
    }

    if (
      !ELIGIBLE_JOB_STATUSES.includes(
        selectedJob.status
      )
    ) {
      return 'This job is not eligible for a new estimate.'
    }

    if (!currency.trim()) {
      return 'Enter a currency code for the estimate.'
    }

    if (
      currency.trim().length !==
      3
    ) {
      return 'Currency must use a 3-letter code such as ZAR or USD.'
    }

    if (
      lineItems.length === 0
    ) {
      return 'Add at least one estimate line item.'
    }

    for (
      const lineItem of lineItems
    ) {
      if (
        !lineItem.description.trim()
      ) {
        return 'Enter a description for every estimate line item.'
      }

      const quantity =
        parsePositiveNumber(
          lineItem.quantity
        )

      if (quantity == null) {
        return 'Every line item must have a quantity greater than zero.'
      }

      const unitPrice =
        parsePositiveNumber(
          lineItem.unitPrice
        )

      if (unitPrice == null) {
        return 'Every line item must have a unit price greater than zero.'
      }
    }

    return null
  }

  const handleCreateEstimate =
    async () => {
      const validationError =
        validateForm()

      if (validationError) {
        setLocalFormError(
          validationError
        )

        return
      }

      setLocalFormError(null)

      const normalizedLineItems =
        lineItems.map(
          (lineItem) => ({
            id: lineItem.id,

            type:
              lineItem.type,

            description:
              lineItem.description.trim(),

            quantity:
              parsePositiveNumber(
                lineItem.quantity
              ),

            unitPrice:
              parsePositiveNumber(
                lineItem.unitPrice
              ),
          })
        )

      await createMechanicEstimate({
        jobId:
          selectedJob.id,

        bookingId:
          selectedJob.bookingId ??
          null,

        customerId:
          selectedJob.customerId ??
          null,

        vehicleId:
          selectedJob.vehicleId ??
          null,

        mechanicId:
          user.id,

        currency:
          currency
            .trim()
            .toUpperCase(),

        lineItems:
          normalizedLineItems,

        notes:
          notes.trim() ||
          null,
      })
    }

  const handleResetForm = () => {
    resetEstimate()

    setSelectedJobId(null)

    setCurrency('ZAR')

    setLineItems([
      createLineItem(),
    ])

    setNotes('')
    setLocalFormError(null)
  }

  if (
    isLoadingJobs &&
    !jobsData
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
          Loading jobs...
        </Text>
      </SafeAreaView>
    )
  }

  if (
    jobsError &&
    !jobsData
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
        <View
          style={[
            styles.stateIcon,
            {
              borderColor:
                colors.danger,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="clipboard-alert-outline"
            size={32}
            color={colors.danger}
          />
        </View>

        <Text
          style={[
            styles.stateTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Unable to load jobs
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
          {jobsError}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            refreshJobs
          }
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                colors.accent,
            },
          ]}
        >
          <Text
            style={
              styles.primaryButtonText
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

  if (createdEstimate) {
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
        <View
          style={[
            styles.stateIcon,
            {
              borderColor:
                colors.success,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="file-check-outline"
            size={34}
            color={colors.success}
          />
        </View>

        <Text
          style={[
            styles.stateTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Estimate Created
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
          The estimate has been
          created successfully.
        </Text>

        <View
          style={[
            styles.successCard,
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
              styles.successLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Estimate ID
          </Text>

          <Text
            style={[
              styles.successValue,
              {
                color: colors.text,
              },
            ]}
          >
            {createdEstimate.id}
          </Text>

          <Text
            style={[
              styles.successLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Status
          </Text>

          <Text
            style={[
              styles.successValue,
              {
                color:
                  colors.warning,
              },
            ]}
          >
            {createdEstimate.status}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            handleResetForm
          }
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                colors.accent,
            },
          ]}
        >
          <Text
            style={
              styles.primaryButtonText
            }
          >
            Create Another
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() =>
            router.replace(
              '/(mechanic)'
            )
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
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <StableScrollView
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.content
        }
      >
        <View
          style={
            styles.header
          }
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.back()
            }
            style={[
              styles.headerButton,
              {
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

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Create Estimate
          </Text>

          <View
            style={
              styles.headerPlaceholder
            }
          />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Service Estimate
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
          Prepare itemized pricing
          for linked service work.
        </Text>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={22}
            color={colors.accent}
          />

          <Text
            style={[
              styles.infoCardText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Totals shown here are a
            frontend preview only.
            The MechanIQ backend
            must validate pricing,
            currency, job links and
            customer approval before
            an estimate becomes
            authoritative.
          </Text>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Job
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() =>
            setIsJobPickerVisible(
              true
            )
          }
          style={[
            styles.selectionField,
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
              styles.selectionIcon
            }
          >
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={22}
              color={colors.accent}
            />
          </View>

          <View
            style={
              styles.selectionContent
            }
          >
            <Text
              style={[
                styles.selectionLabel,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Linked Job
            </Text>

            <Text
              style={[
                styles.selectionValue,
                {
                  color:
                    selectedJob
                      ? colors.text
                      : colors
                          .secondaryText,
                },
              ]}
              numberOfLines={1}
            >
              {selectedJob
                ? selectedJob
                    .serviceType
                : 'Select job'}
            </Text>
          </View>

          <Ionicons
            name="chevron-down"
            size={20}
            color={
              colors.secondaryText
            }
          />
        </TouchableOpacity>

        {selectedJob ? (
          <View
            style={[
              styles.jobSummaryCard,
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
                styles.jobSummaryRow
              }
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={18}
                color={
                  colors.accent
                }
              />

              <Text
                style={[
                  styles.jobSummaryText,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {selectedJob.customerName ??
                  'Customer'}
              </Text>
            </View>

            <View
              style={
                styles.jobSummaryRow
              }
            >
              <MaterialCommunityIcons
                name="car-outline"
                size={18}
                color={
                  colors.accent
                }
              />

              <Text
                style={[
                  styles.jobSummaryText,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {selectedJob.vehicleLabel ??
                  'Vehicle details unavailable'}
              </Text>
            </View>

            <View
              style={
                styles.jobSummaryRow
              }
            >
              <MaterialCommunityIcons
                name="progress-wrench"
                size={18}
                color={
                  colors.accent
                }
              />

              <Text
                style={[
                  styles.jobSummaryText,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {getJobStatusLabel(
                  selectedJob.status
                )}
              </Text>
            </View>

            {selectedJob.estimatedAmount !=
              null &&
            selectedJob.currency ? (
              <View
                style={[
                  styles.existingEstimateNotice,
                  {
                    borderColor:
                      colors.warning,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="information-outline"
                  size={18}
                  color={
                    colors.warning
                  }
                />

                <Text
                  style={[
                    styles.existingEstimateText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  This development
                  job already displays
                  an estimated amount
                  of{' '}
                  {formatMoney(
                    selectedJob.estimatedAmount,
                    selectedJob.currency
                  )}
                  . This is display
                  data only and is not
                  treated as a
                  persisted Estimate
                  record.
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Currency
        </Text>

        <View
          style={[
            styles.inputRow,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="currency-usd"
            size={21}
            color={colors.accent}
          />

          <TextInput
            value={currency}
            onChangeText={(value) => {
              setCurrency(
                value.toUpperCase()
              )

              clearErrors()
            }}
            placeholder="ZAR"
            placeholderTextColor={
              colors.secondaryText
            }
            autoCapitalize="characters"
            maxLength={3}
            style={[
              styles.singleLineInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>

        <View
          style={
            styles.lineItemsHeader
          }
        >
          <Text
            style={[
              styles.sectionTitle,
              styles.lineItemsSectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Estimate Items
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={addLineItem}
            style={[
              styles.addItemButton,
              {
                borderColor:
                  colors.accent,
              },
            ]}
          >
            <Ionicons
              name="add"
              size={18}
              color={colors.accent}
            />

            <Text
              style={[
                styles.addItemText,
                {
                  color:
                    colors.accent,
                },
              ]}
            >
              Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {lineItems.map(
          (
            lineItem,
            index
          ) => (
            <View
              key={lineItem.id}
              style={[
                styles.lineItemCard,
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
                  styles.lineItemHeader
                }
              >
                <Text
                  style={[
                    styles.lineItemTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  Item {index + 1}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    removeLineItem(
                      lineItem.id
                    )
                  }
                  style={[
                    styles.removeItemButton,
                    {
                      borderColor:
                        colors.danger,
                    },
                  ]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={
                      colors.danger
                    }
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Type
              </Text>

              <View
                style={
                  styles.typeRow
                }
              >
                {Object.values(
                  ESTIMATE_LINE_ITEM_TYPES
                ).map(
                  (type) => {
                    const isSelected =
                      lineItem.type ===
                      type

                    return (
                      <TouchableOpacity
                        key={type}
                        activeOpacity={
                          0.75
                        }
                        onPress={() =>
                          updateLineItem(
                            lineItem.id,
                            'type',
                            type
                          )
                        }
                        style={[
                          styles.typeChip,
                          {
                            borderColor:
                              isSelected
                                ? colors.accent
                                : colors.border,

                            backgroundColor:
                              isSelected
                                ? `${colors.accent}18`
                                : colors.background,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeChipText,
                            {
                              color:
                                isSelected
                                  ? colors.accent
                                  : colors.secondaryText,
                            },
                          ]}
                        >
                          {
                            LINE_ITEM_TYPE_LABELS[
                              type
                            ]
                          }
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                )}
              </View>

              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Description
              </Text>

              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor:
                      colors.background,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="text-box-outline"
                  size={20}
                  color={
                    colors.accent
                  }
                />

                <TextInput
                  value={
                    lineItem.description
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateLineItem(
                      lineItem.id,
                      'description',
                      value
                    )
                  }
                  placeholder={
                    lineItem.type ===
                    ESTIMATE_LINE_ITEM_TYPES
                      .LABOUR
                      ? 'e.g. Brake inspection labour'
                      : lineItem.type ===
                          ESTIMATE_LINE_ITEM_TYPES
                            .PART
                        ? 'e.g. Front brake pads'
                        : 'e.g. Diagnostic fee'
                  }
                  placeholderTextColor={
                    colors.secondaryText
                  }
                  style={[
                    styles.singleLineInput,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                />
              </View>

              <View
                style={
                  styles.priceRow
                }
              >
                <View
                  style={
                    styles.priceField
                  }
                >
                  <Text
                    style={[
                      styles.fieldLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Quantity
                  </Text>

                  <View
                    style={[
                      styles.compactInput,
                      {
                        backgroundColor:
                          colors.background,
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    <TextInput
                      value={
                        lineItem.quantity
                      }
                      onChangeText={(
                        value
                      ) =>
                        updateLineItem(
                          lineItem.id,
                          'quantity',
                          value
                        )
                      }
                      placeholder="1"
                      placeholderTextColor={
                        colors.secondaryText
                      }
                      keyboardType="decimal-pad"
                      style={[
                        styles.compactInputText,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View
                  style={
                    styles.priceField
                  }
                >
                  <Text
                    style={[
                      styles.fieldLabel,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Unit Price
                  </Text>

                  <View
                    style={[
                      styles.compactInput,
                      {
                        backgroundColor:
                          colors.background,
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    <TextInput
                      value={
                        lineItem.unitPrice
                      }
                      onChangeText={(
                        value
                      ) =>
                        updateLineItem(
                          lineItem.id,
                          'unitPrice',
                          value
                        )
                      }
                      placeholder="0.00"
                      placeholderTextColor={
                        colors.secondaryText
                      }
                      keyboardType="decimal-pad"
                      style={[
                        styles.compactInputText,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View
                style={
                  styles.lineItemTotalRow
                }
              >
                <Text
                  style={[
                    styles.lineItemTotalLabel,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Preview
                </Text>

                <Text
                  style={[
                    styles.lineItemTotalValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {formatMoney(
                    (
                      parsePositiveNumber(
                        lineItem.quantity
                      ) ?? 0
                    ) *
                      (
                        parsePositiveNumber(
                          lineItem.unitPrice
                        ) ?? 0
                      ),
                    currency
                      .trim()
                      .toUpperCase() ||
                      '---'
                  )}
                </Text>
              </View>
            </View>
          )
        )}

        <View
          style={[
            styles.totalCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.accent,
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.totalLabel,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Preview Subtotal
            </Text>

            <Text
              style={[
                styles.totalNote,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Not yet persisted
            </Text>
          </View>

          <Text
            style={[
              styles.totalValue,
              {
                color:
                  colors.accent,
              },
            ]}
          >
            {formatMoney(
              previewSubtotal,
              currency
                .trim()
                .toUpperCase() ||
                '---'
            )}
          </Text>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Notes
        </Text>

        <View
          style={[
            styles.descriptionContainer,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="note-text-outline"
            size={21}
            color={colors.accent}
          />

          <TextInput
            value={notes}
            onChangeText={(value) => {
              setNotes(value)
              clearErrors()
            }}
            placeholder="Add estimate notes for the customer..."
            placeholderTextColor={
              colors.secondaryText
            }
            multiline
            maxLength={700}
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
              color:
                colors.secondaryText,
            },
          ]}
        >
          {notes.length}/700
        </Text>

        {localFormError ? (
          <View
            style={[
              styles.errorCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.danger,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={21}
              color={colors.danger}
            />

            <Text
              style={[
                styles.errorText,
                {
                  color:
                    colors.danger,
                },
              ]}
            >
              {localFormError}
            </Text>
          </View>
        ) : null}

        {estimateError ? (
          <View
            style={[
              styles.errorCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.danger,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="database-alert-outline"
              size={21}
              color={colors.danger}
            />

            <Text
              style={[
                styles.errorText,
                {
                  color:
                    colors.danger,
                },
              ]}
            >
              {estimateError}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.75}
          disabled={
            isCreatingEstimate
          }
          onPress={
            handleCreateEstimate
          }
          style={[
            styles.createButton,
            {
              backgroundColor:
                isCreatingEstimate
                  ? colors.border
                  : colors.accent,
            },
          ]}
        >
          {isCreatingEstimate ? (
            <ActivityIndicator
              size="small"
              color="#000000"
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={21}
                color="#000000"
              />

              <Text
                style={
                  styles.createButtonText
                }
              >
                Create Estimate
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.disclaimer,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          MechanIQ will not fabricate
          a persisted estimate,
          customer approval or final
          price locally. The backend
          remains authoritative.
        </Text>
      </StableScrollView>

      <Modal
        visible={
          isJobPickerVisible
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setIsJobPickerVisible(
            false
          )
        }
      >
        <View
          style={
            styles.modalBackdrop
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
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Select Job
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setIsJobPickerVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color={
                    colors.text
                  }
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.modalList
              }
            >
              {eligibleJobs.length >
              0 ? (
                eligibleJobs.map(
                  (job) => {
                    const isSelected =
                      job.id ===
                      selectedJobId

                    return (
                      <TouchableOpacity
                        key={job.id}
                        activeOpacity={
                          0.75
                        }
                        onPress={() =>
                          handleSelectJob(
                            job
                          )
                        }
                        style={[
                          styles.modalOption,
                          {
                            borderColor:
                              isSelected
                                ? colors.accent
                                : colors.border,

                            backgroundColor:
                              colors.background,
                          },
                        ]}
                      >
                        <View
                          style={
                            styles.modalOptionContent
                          }
                        >
                          <Text
                            style={[
                              styles.modalOptionTitle,
                              {
                                color:
                                  colors.text,
                              },
                            ]}
                          >
                            {
                              job.serviceType
                            }
                          </Text>

                          <Text
                            style={[
                              styles.modalOptionDescription,
                              {
                                color:
                                  colors.secondaryText,
                              },
                            ]}
                          >
                            {job.customerName ??
                              'Customer'}
                            {' • '}
                            {job.vehicleLabel ??
                              'Vehicle unavailable'}
                          </Text>

                          <Text
                            style={[
                              styles.modalOptionMeta,
                              {
                                color:
                                  colors.secondaryText,
                              },
                            ]}
                          >
                            {getJobStatusLabel(
                              job.status
                            )}
                            {' • '}
                            {job.scheduledDate ??
                              'Not scheduled'}
                            {' • '}
                            {job.scheduledTime ??
                              'No time'}
                          </Text>
                        </View>

                        {isSelected ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color={
                              colors.accent
                            }
                          />
                        ) : null}
                      </TouchableOpacity>
                    )
                  }
                )
              ) : (
                <View
                  style={
                    styles.emptyModalContainer
                  }
                >
                  <MaterialCommunityIcons
                    name="briefcase-off-outline"
                    size={30}
                    color={
                      colors.secondaryText
                    }
                  />

                  <Text
                    style={[
                      styles.emptyModalText,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    No pending,
                    accepted or
                    in-progress jobs
                    are available for
                    estimate creation.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 16,
      paddingBottom: 40,
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
      justifyContent:
        'space-between',
    },

    headerButton: {
      width: 42,
      height: 42,
      borderRadius: 13,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
    },

    headerPlaceholder: {
      width: 42,
      height: 42,
    },

    title: {
      marginTop: 10,
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '800',
    },

    subtitle: {
      marginTop: 7,
      fontSize: 14,
      lineHeight: 21,
    },

    infoCard: {
      marginTop: 18,
      padding: 14,
      borderWidth: 1,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 11,
    },

    infoCardText: {
      flex: 1,
      fontSize: 12.5,
      lineHeight: 19,
    },

    sectionTitle: {
      marginTop: 23,
      marginBottom: 9,
      fontSize: 15,
      fontWeight: '700',
    },

    selectionField: {
      minHeight: 66,
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderWidth: 1,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },

    selectionIcon: {
      width: 36,
      alignItems: 'flex-start',
    },

    selectionContent: {
      flex: 1,
    },

    selectionLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 3,
    },

    selectionValue: {
      fontSize: 14,
      fontWeight: '600',
    },

    jobSummaryCard: {
      marginTop: 10,
      padding: 14,
      borderWidth: 1,
      borderRadius: 16,
      gap: 10,
    },

    jobSummaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },

    jobSummaryText: {
      flex: 1,
      fontSize: 12.5,
      lineHeight: 18,
    },

    existingEstimateNotice: {
      marginTop: 3,
      padding: 11,
      borderWidth: 1,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 9,
    },

    existingEstimateText: {
      flex: 1,
      fontSize: 11.5,
      lineHeight: 17,
    },

    inputRow: {
      minHeight: 56,
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },

    singleLineInput: {
      flex: 1,
      paddingVertical: 11,
      fontSize: 14,
    },

    lineItemsHeader: {
      marginTop: 6,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent:
        'space-between',
      gap: 12,
    },

    lineItemsSectionTitle: {
      flex: 1,
    },

    addItemButton: {
      minHeight: 36,
      paddingHorizontal: 11,
      marginBottom: 5,
      borderWidth: 1,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
    },

    addItemText: {
      fontSize: 11.5,
      fontWeight: '700',
    },

    lineItemCard: {
      marginBottom: 12,
      padding: 14,
      borderWidth: 1,
      borderRadius: 16,
    },

    lineItemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 13,
    },

    lineItemTitle: {
      fontSize: 14,
      fontWeight: '800',
    },

    removeItemButton: {
      width: 34,
      height: 34,
      borderWidth: 1,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    fieldLabel: {
      marginBottom: 7,
      fontSize: 10.5,
      fontWeight: '600',
    },

    typeRow: {
      flexDirection: 'row',
      gap: 7,
      marginBottom: 14,
    },

    typeChip: {
      flex: 1,
      minHeight: 38,
      paddingHorizontal: 7,
      borderWidth: 1,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },

    typeChipText: {
      fontSize: 10.5,
      fontWeight: '700',
    },

    priceRow: {
      marginTop: 13,
      flexDirection: 'row',
      gap: 10,
    },

    priceField: {
      flex: 1,
    },

    compactInput: {
      minHeight: 49,
      borderWidth: 1,
      borderRadius: 12,
      justifyContent: 'center',
      paddingHorizontal: 12,
    },

    compactInputText: {
      fontSize: 13,
      paddingVertical: 8,
    },

    lineItemTotalRow: {
      marginTop: 13,
      paddingTop: 11,
      borderTopWidth:
        StyleSheet.hairlineWidth,
      borderTopColor:
        'rgba(128,128,128,0.35)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    lineItemTotalLabel: {
      fontSize: 11,
      fontWeight: '600',
    },

    lineItemTotalValue: {
      fontSize: 13,
      fontWeight: '800',
    },

    totalCard: {
      marginTop: 4,
      padding: 16,
      borderWidth: 1.5,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      gap: 14,
    },

    totalLabel: {
      fontSize: 11,
      fontWeight: '600',
    },

    totalNote: {
      marginTop: 3,
      fontSize: 10,
    },

    totalValue: {
      fontSize: 19,
      fontWeight: '800',
      textAlign: 'right',
    },

    descriptionContainer: {
      minHeight: 132,
      paddingHorizontal: 14,
      paddingTop: 14,
      borderWidth: 1,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },

    descriptionInput: {
      flex: 1,
      minHeight: 100,
      paddingTop: 0,
      paddingBottom: 10,
      fontSize: 14,
      lineHeight: 20,
    },

    characterCount: {
      marginTop: 6,
      textAlign: 'right',
      fontSize: 11,
    },

    errorCard: {
      marginTop: 16,
      padding: 13,
      borderWidth: 1,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },

    errorText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
    },

    createButton: {
      minHeight: 54,
      marginTop: 22,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
    },

    createButtonText: {
      color: '#000000',
      fontSize: 14,
      fontWeight: '800',
    },

    disclaimer: {
      marginTop: 12,
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 17,
    },

    loadingText: {
      marginTop: 13,
      fontSize: 13,
    },

    stateIcon: {
      width: 68,
      height: 68,
      borderWidth: 1.5,
      borderRadius: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },

    stateTitle: {
      marginTop: 18,
      fontSize: 22,
      fontWeight: '800',
      textAlign: 'center',
    },

    stateDescription: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'center',
      maxWidth: 320,
    },

    primaryButton: {
      minWidth: 190,
      minHeight: 50,
      marginTop: 22,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },

    primaryButtonText: {
      color: '#000000',
      fontSize: 14,
      fontWeight: '800',
    },

    secondaryButton: {
      minWidth: 190,
      minHeight: 50,
      marginTop: 10,
      borderWidth: 1,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },

    secondaryButtonText: {
      fontSize: 14,
      fontWeight: '700',
    },

    successCard: {
      width: '100%',
      maxWidth: 330,
      marginTop: 20,
      padding: 17,
      borderWidth: 1,
      borderRadius: 16,
    },

    successLabel: {
      marginTop: 5,
      fontSize: 11,
      fontWeight: '600',
    },

    successValue: {
      marginTop: 3,
      marginBottom: 10,
      fontSize: 14,
      fontWeight: '700',
    },

    modalBackdrop: {
      flex: 1,
      backgroundColor:
        'rgba(0,0,0,0.48)',
      justifyContent: 'flex-end',
    },

    modalSheet: {
      maxHeight: '74%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 28,
    },

    modalHeader: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: '800',
    },

    modalList: {
      paddingTop: 10,
      paddingBottom: 8,
      gap: 9,
    },

    modalOption: {
      minHeight: 78,
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderWidth: 1,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },

    modalOptionContent: {
      flex: 1,
      paddingRight: 10,
    },

    modalOptionTitle: {
      fontSize: 14,
      fontWeight: '700',
    },

    modalOptionDescription: {
      marginTop: 4,
      fontSize: 11.5,
      lineHeight: 16,
    },

    modalOptionMeta: {
      marginTop: 4,
      fontSize: 10.5,
      lineHeight: 15,
    },

    emptyModalContainer: {
      paddingVertical: 34,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },

    emptyModalText: {
      maxWidth: 280,
      textAlign: 'center',
      fontSize: 12.5,
      lineHeight: 19,
    },
  })