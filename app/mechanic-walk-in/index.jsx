import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useRouter,
} from 'expo-router'
import {
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

import StableScrollView from '../../src/components/StableScrollView'
import {
  useMechanicCustomers,
} from '../../src/mechanic/MechanicCustomersContext'
import {
  useMechanicWalkInJob,
} from '../../src/mechanic/MechanicWalkInJobContext'
import {
  MECHANIC_WALK_IN_PRIORITIES,
} from '../../src/mechanic/walkInJobTypes'
import {
  useTheme,
} from '../../src/theme/ThemeContext'
import {
  useUser,
} from '../../src/users/UserContext'

export default function MechanicWalkInScreen() {
  const router =
    useRouter()

  const {
    colors,
  } = useTheme()

  const {
    user,
  } = useUser()

  const {
    customersData,
    isLoadingCustomers,
    customersError,
    refreshCustomers,
  } = useMechanicCustomers()

  const {
    createdWalkInJob,
    isCreatingWalkInJob,
    walkInJobError,
    createWalkInJob,
    clearWalkInJobError,
    resetWalkInJob,
  } = useMechanicWalkInJob()

  const [
    selectedCustomerRecordId,
    setSelectedCustomerRecordId,
  ] = useState(null)

  const [
    selectedVehicleId,
    setSelectedVehicleId,
  ] = useState(null)

  const [
    serviceType,
    setServiceType,
  ] = useState(
    'Vehicle Inspection'
  )

  const [
    description,
    setDescription,
  ] = useState('')

  const [
    priority,
    setPriority,
  ] = useState(
    MECHANIC_WALK_IN_PRIORITIES
      .NORMAL
  )

  const [
    isCustomerPickerVisible,
    setIsCustomerPickerVisible,
  ] = useState(false)

  const [
    isVehiclePickerVisible,
    setIsVehiclePickerVisible,
  ] = useState(false)

  const [
    localFormError,
    setLocalFormError,
  ] = useState(null)

  const customers =
    customersData?.customers ?? []

  const selectedCustomer =
    useMemo(
      () =>
        customers.find(
          (customer) =>
            customer.id ===
            selectedCustomerRecordId
        ) ?? null,
      [
        customers,
        selectedCustomerRecordId,
      ]
    )

  const selectedVehicle =
    useMemo(
      () =>
        selectedCustomer
          ?.vehicles
          ?.find(
            (vehicle) =>
              vehicle.id ===
              selectedVehicleId
          ) ?? null,
      [
        selectedCustomer,
        selectedVehicleId,
      ]
    )

  const availableVehicles =
    selectedCustomer?.vehicles ?? []

  const clearErrors = () => {
    setLocalFormError(null)
    clearWalkInJobError()
  }

  const handleSelectCustomer = (
    customer
  ) => {
    setSelectedCustomerRecordId(
      customer.id
    )

    setSelectedVehicleId(
      customer.vehicles?.[0]?.id ??
        null
    )

    setIsCustomerPickerVisible(
      false
    )

    clearErrors()
  }

  const handleSelectVehicle = (
    vehicle
  ) => {
    setSelectedVehicleId(
      vehicle.id
    )

    setIsVehiclePickerVisible(
      false
    )

    clearErrors()
  }

  const handlePriorityChange = (
    nextPriority
  ) => {
    setPriority(
      nextPriority
    )

    clearErrors()
  }

  const validateForm = () => {
    if (!user?.id) {
      return 'A signed-in mechanic account is required to create a walk-in job.'
    }

    if (!selectedCustomer) {
      return 'Select a customer for this walk-in job.'
    }

    if (
      !selectedCustomer.customerId
    ) {
      return 'The selected customer is not yet linked to a backend customer account. A real walk-in job cannot be created from this development record.'
    }

    if (!selectedVehicle) {
      return 'Select a vehicle for this walk-in job.'
    }

    if (
      !serviceType.trim()
    ) {
      return 'Enter the service required.'
    }

    return null
  }

  const handleCreateWalkInJob =
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

      await createWalkInJob({
        customerId:
          selectedCustomer
            .customerId,

        vehicleId:
          selectedVehicle.id,

        mechanicId:
          user.id,

        serviceType:
          serviceType.trim(),

        description:
          description.trim() ||
          null,

        priority,
      })
    }

  const handleCreateAnother = () => {
    resetWalkInJob()

    setSelectedCustomerRecordId(
      null
    )

    setSelectedVehicleId(
      null
    )

    setServiceType(
      'Vehicle Inspection'
    )

    setDescription('')

    setPriority(
      MECHANIC_WALK_IN_PRIORITIES
        .NORMAL
    )

    setLocalFormError(null)
  }

  if (
    isLoadingCustomers &&
    !customersData
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
          Loading customers...
        </Text>
      </SafeAreaView>
    )
  }

  if (
    customersError &&
    !customersData
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
            name="account-alert-outline"
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
          Unable to load customers
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
          {customersError}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            refreshCustomers
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

  if (createdWalkInJob) {
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
            name="clipboard-check-outline"
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
          Walk-in Job Created
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
          The unscheduled workshop
          job has been created
          successfully.
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
            Job ID
          </Text>

          <Text
            style={[
              styles.successValue,
              {
                color: colors.text,
              },
            ]}
          >
            {createdWalkInJob.id}
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
            {createdWalkInJob.status}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            handleCreateAnother
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
            Add Another Walk-in
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
            Walk-in Job
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
          Add Walk-in Job
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
          Start unscheduled workshop
          intake for an existing
          customer and vehicle.
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
            name="garage-variant"
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
            Walk-in jobs are
            workshop-only. Customer
            identity, vehicle
            ownership, job status,
            workshop assignment and
            pricing remain backend
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
          Customer
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() =>
            setIsCustomerPickerVisible(
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
              name="account-outline"
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
              Customer
            </Text>

            <Text
              style={[
                styles.selectionValue,
                {
                  color:
                    selectedCustomer
                      ? colors.text
                      : colors
                          .secondaryText,
                },
              ]}
            >
              {selectedCustomer
                ? selectedCustomer
                    .displayName
                : 'Select customer'}
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

        <TouchableOpacity
          activeOpacity={0.75}
          disabled={
            !selectedCustomer
          }
          onPress={() =>
            setIsVehiclePickerVisible(
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
              opacity:
                selectedCustomer
                  ? 1
                  : 0.55,
            },
          ]}
        >
          <View
            style={
              styles.selectionIcon
            }
          >
            <MaterialCommunityIcons
              name="car-outline"
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
              Vehicle
            </Text>

            <Text
              style={[
                styles.selectionValue,
                {
                  color:
                    selectedVehicle
                      ? colors.text
                      : colors
                          .secondaryText,
                },
              ]}
            >
              {selectedVehicle
                ? selectedVehicle
                    .vehicleLabel
                : selectedCustomer
                  ? 'Select vehicle'
                  : 'Select a customer first'}
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

        {selectedCustomer &&
        !selectedCustomer.customerId ? (
          <View
            style={[
              styles.warningCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.warning,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-outline"
              size={21}
              color={colors.warning}
            />

            <Text
              style={[
                styles.warningText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              This development
              customer is not linked
              to a real backend
              customer account yet.
              You can preview the
              walk-in intake form,
              but a real job cannot
              be submitted for this
              record.
            </Text>
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
          Service
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
            name="wrench-outline"
            size={21}
            color={colors.accent}
          />

          <TextInput
            value={serviceType}
            onChangeText={(value) => {
              setServiceType(
                value
              )

              clearErrors()
            }}
            placeholder="e.g. Brake Inspection"
            placeholderTextColor={
              colors.secondaryText
            }
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
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Priority
        </Text>

        <View
          style={
            styles.priorityRow
          }
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              handlePriorityChange(
                MECHANIC_WALK_IN_PRIORITIES
                  .NORMAL
              )
            }
            style={[
              styles.priorityCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  priority ===
                  MECHANIC_WALK_IN_PRIORITIES
                    .NORMAL
                    ? colors.accent
                    : colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={24}
              color={
                priority ===
                MECHANIC_WALK_IN_PRIORITIES
                  .NORMAL
                  ? colors.accent
                  : colors.secondaryText
              }
            />

            <Text
              style={[
                styles.priorityTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Normal
            </Text>

            <Text
              style={[
                styles.priorityDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Standard workshop
              intake.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              handlePriorityChange(
                MECHANIC_WALK_IN_PRIORITIES
                  .URGENT
              )
            }
            style={[
              styles.priorityCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  priority ===
                  MECHANIC_WALK_IN_PRIORITIES
                    .URGENT
                    ? colors.warning
                    : colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-outline"
              size={24}
              color={
                priority ===
                MECHANIC_WALK_IN_PRIORITIES
                  .URGENT
                  ? colors.warning
                  : colors.secondaryText
              }
            />

            <Text
              style={[
                styles.priorityTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Urgent
            </Text>

            <Text
              style={[
                styles.priorityDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Needs prompt workshop
              attention.
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.fieldNote,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Priority is an intake flag.
          Final queueing and job
          assignment remain backend
          controlled.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Workshop Intake
        </Text>

        <View
          style={[
            styles.workshopCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="garage-variant"
            size={25}
            color={colors.accent}
          />

          <View
            style={
              styles.workshopContent
            }
          >
            <Text
              style={[
                styles.workshopTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Workshop
            </Text>

            <Text
              style={[
                styles.workshopDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              The customer and vehicle
              are already at the
              workshop for unscheduled
              service intake.
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.fieldNote,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          The authoritative workshop
          will come from the
          mechanic&apos;s backend
          business/workshop profile.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Intake Details
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
            name="clipboard-text-outline"
            size={21}
            color={colors.accent}
          />

          <TextInput
            value={description}
            onChangeText={(value) => {
              setDescription(
                value
              )

              clearErrors()
            }}
            placeholder="Describe the customer's concern, requested work or initial workshop observations..."
            placeholderTextColor={
              colors.secondaryText
            }
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
              color:
                colors.secondaryText,
            },
          ]}
        >
          {description.length}
          /500
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

        {walkInJobError ? (
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
              {walkInJobError}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.75}
          disabled={
            isCreatingWalkInJob
          }
          onPress={
            handleCreateWalkInJob
          }
          style={[
            styles.createButton,
            {
              backgroundColor:
                isCreatingWalkInJob
                  ? colors.border
                  : colors.accent,
            },
          ]}
        >
          {isCreatingWalkInJob ? (
            <ActivityIndicator
              size="small"
              color="#000000"
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="clipboard-plus-outline"
                size={21}
                color="#000000"
              />

              <Text
                style={
                  styles.createButtonText
                }
              >
                Create Walk-in Job
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
          MechanIQ will not create a
          fake job locally. Job IDs,
          status, workshop assignment,
          customer/vehicle links,
          pricing and allowed actions
          remain backend controlled.
        </Text>
      </StableScrollView>

      <Modal
        visible={
          isCustomerPickerVisible
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setIsCustomerPickerVisible(
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
                Select Customer
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setIsCustomerPickerVisible(
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
              {customers.length >
              0 ? (
                customers.map(
                  (customer) => {
                    const isSelected =
                      customer.id ===
                      selectedCustomerRecordId

                    return (
                      <TouchableOpacity
                        key={
                          customer.id
                        }
                        activeOpacity={
                          0.75
                        }
                        onPress={() =>
                          handleSelectCustomer(
                            customer
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
                              customer.displayName
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
                            {customer
                              .vehicles
                              ?.length ??
                              0}{' '}
                            vehicle
                            {(customer
                              .vehicles
                              ?.length ??
                              0) ===
                            1
                              ? ''
                              : 's'}
                            {' • '}
                            {customer.status}
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
                <Text
                  style={[
                    styles.emptyModalText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  No customers are
                  available.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={
          isVehiclePickerVisible
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setIsVehiclePickerVisible(
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
                Select Vehicle
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setIsVehiclePickerVisible(
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
              {availableVehicles
                .length > 0 ? (
                availableVehicles.map(
                  (vehicle) => {
                    const isSelected =
                      vehicle.id ===
                      selectedVehicleId

                    return (
                      <TouchableOpacity
                        key={
                          vehicle.id
                        }
                        activeOpacity={
                          0.75
                        }
                        onPress={() =>
                          handleSelectVehicle(
                            vehicle
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
                              vehicle.vehicleLabel
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
                            {vehicle.registrationNumber ??
                              'Registration unavailable'}
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
                <Text
                  style={[
                    styles.emptyModalText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  No vehicles are
                  available for this
                  customer.
                </Text>
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

    warningCard: {
      marginTop: 11,
      padding: 13,
      borderWidth: 1,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },

    warningText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
    },

    inputRow: {
      minHeight: 56,
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    singleLineInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 14,
    },

    priorityRow: {
      flexDirection: 'row',
      gap: 10,
    },

    priorityCard: {
      flex: 1,
      minHeight: 128,
      padding: 14,
      borderWidth: 1.5,
      borderRadius: 16,
    },

    priorityTitle: {
      marginTop: 10,
      fontSize: 14,
      fontWeight: '700',
    },

    priorityDescription: {
      marginTop: 5,
      fontSize: 11.5,
      lineHeight: 17,
    },

    workshopCard: {
      minHeight: 104,
      padding: 14,
      borderWidth: 1.5,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },

    workshopContent: {
      flex: 1,
    },

    workshopTitle: {
      fontSize: 14,
      fontWeight: '700',
    },

    workshopDescription: {
      marginTop: 5,
      fontSize: 11.5,
      lineHeight: 17,
    },

    fieldNote: {
      marginTop: 9,
      fontSize: 11.5,
      lineHeight: 17,
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
      maxHeight: '72%',
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
      minHeight: 64,
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderWidth: 1,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },

    modalOptionContent: {
      flex: 1,
    },

    modalOptionTitle: {
      fontSize: 14,
      fontWeight: '700',
    },

    modalOptionDescription: {
      marginTop: 4,
      fontSize: 11.5,
      lineHeight: 16,
      textTransform: 'capitalize',
    },

    emptyModalText: {
      paddingVertical: 28,
      textAlign: 'center',
      fontSize: 13,
    },
  })