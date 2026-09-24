import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'

import { useCreateCustomerSavedAddress } from '../src/customer/useCreateCustomerSavedAddress'
import { useCustomerSavedAddresses } from '../src/customer/useCustomerSavedAddresses'
import { useTheme } from '../src/theme/ThemeContext'
import { useUser } from '../src/users/UserContext'

type AddressFormState = {
  label: string
  address: string
  isDefault: boolean
}

type AddressFormErrors = Partial<
  Record<
    keyof Omit<AddressFormState, 'isDefault'>,
    string
  >
>

export default function SavedAddressesScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    user,
    isLoadingUser,
  } = useUser()

  const {
    savedAddresses,
    isLoadingSavedAddresses,
    savedAddressesError,
    refreshSavedAddresses,
  } = useCustomerSavedAddresses(
    user?.id ?? null
  )

  const {
    isCreatingSavedAddress,
    createSavedAddressError,
    createSavedAddress,
    clearCreateSavedAddressError,
  } = useCreateCustomerSavedAddress()

  const [
    isAddingAddress,
    setIsAddingAddress,
  ] = useState(false)

  const [
    form,
    setForm,
  ] = useState<AddressFormState>({
    label: '',
    address: '',
    isDefault: false,
  })

  const [
    formErrors,
    setFormErrors,
  ] = useState<AddressFormErrors>({})

  const isLoading =
    isLoadingUser ||
    isLoadingSavedAddresses

  function updateField(
    field: 'label' | 'address',
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setFormErrors((current) => ({
      ...current,
      [field]: undefined,
    }))

    clearCreateSavedAddressError()
  }

  function resetForm() {
    setForm({
      label: '',
      address: '',
      isDefault: false,
    })

    setFormErrors({})
    clearCreateSavedAddressError()
  }

  function handleCancelAdd() {
    resetForm()
    setIsAddingAddress(false)
  }

  function validateForm() {
    const errors: AddressFormErrors = {}

    const label = form.label.trim()
    const address = form.address.trim()

    if (!label) {
      errors.label =
        'Address label is required.'
    }

    if (!address) {
      errors.address =
        'Address is required.'
    }

    setFormErrors(errors)

    if (
      Object.keys(errors).length > 0
    ) {
      return null
    }

    return {
      label,
      address,
    }
  }

  async function handleSaveAddress() {
    if (!user) {
      return
    }

    const values = validateForm()

    if (!values) {
      return
    }

    const savedAddress =
      await createSavedAddress({
        customerId: user.id,
        label: values.label,
        address: values.address,
        isDefault: form.isDefault,
      })

    if (!savedAddress) {
      return
    }

    resetForm()
    setIsAddingAddress(false)

    await refreshSavedAddresses()
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
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <StableScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
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
              Saved Addresses
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
            Your Locations
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
            Manage addresses that can
            later be reused across
            supported MechanIQ services.
          </Text>

          {!isAddingAddress ? (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                setIsAddingAddress(
                  true
                )
              }
              style={[
                styles.addButton,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color="#000000"
              />

              <Text
                style={
                  styles.addButtonText
                }
              >
                Add Address
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.formCard,
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
                  styles.formTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Add Saved Address
              </Text>

              <AddressField
                label="Label"
                value={form.label}
                placeholder="e.g. Home"
                error={formErrors.label}
                onChangeText={(value) =>
                  updateField(
                    'label',
                    value
                  )
                }
                textColor={
                  colors.text
                }
                secondaryTextColor={
                  colors.secondaryText
                }
                borderColor={
                  colors.border
                }
                dangerColor={
                  colors.danger
                }
              />

              <AddressField
                label="Address"
                value={form.address}
                placeholder="Enter full address"
                error={
                  formErrors.address
                }
                multiline
                onChangeText={(value) =>
                  updateField(
                    'address',
                    value
                  )
                }
                textColor={
                  colors.text
                }
                secondaryTextColor={
                  colors.secondaryText
                }
                borderColor={
                  colors.border
                }
                dangerColor={
                  colors.danger
                }
              />

              <View
                style={[
                  styles.defaultRow,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <View
                  style={
                    styles.defaultText
                  }
                >
                  <Text
                    style={[
                      styles.defaultTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    Set as Default
                  </Text>

                  <Text
                    style={[
                      styles.defaultDescription,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Use this as the
                    preferred saved
                    address where
                    supported.
                  </Text>
                </View>

                <Switch
                  value={
                    form.isDefault
                  }
                  disabled={
                    isCreatingSavedAddress
                  }
                  onValueChange={(
                    value
                  ) => {
                    clearCreateSavedAddressError()

                    setForm(
                      (current) => ({
                        ...current,
                        isDefault:
                          value,
                      })
                    )
                  }}
                />
              </View>

              {createSavedAddressError ? (
                <View
                  style={[
                    styles.errorCard,
                    {
                      borderColor:
                        colors.danger,
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color={
                      colors.danger
                    }
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
                    {
                      createSavedAddressError
                    }
                  </Text>
                </View>
              ) : null}

              <View
                style={
                  styles.formActions
                }
              >
                <TouchableOpacity
                  activeOpacity={0.75}
                  disabled={
                    isCreatingSavedAddress
                  }
                  onPress={
                    handleCancelAdd
                  }
                  style={[
                    styles.cancelButton,
                    {
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
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
                  activeOpacity={0.75}
                  disabled={
                    isCreatingSavedAddress
                  }
                  onPress={
                    handleSaveAddress
                  }
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor:
                        colors.accent,
                      opacity:
                        isCreatingSavedAddress
                          ? 0.6
                          : 1,
                    },
                  ]}
                >
                  {isCreatingSavedAddress ? (
                    <ActivityIndicator
                      size="small"
                      color="#000000"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="content-save-outline"
                      size={18}
                      color="#000000"
                    />
                  )}

                  <Text
                    style={
                      styles.saveButtonText
                    }
                  >
                    {isCreatingSavedAddress
                      ? 'Saving...'
                      : 'Save Address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isLoading ? (
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
              <ActivityIndicator
                size="large"
                color={colors.accent}
              />

              <Text
                style={[
                  styles.stateTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Loading Addresses
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
                Retrieving your saved
                locations.
              </Text>
            </View>
          ) : !user ? (
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
              <Ionicons
                name="person-outline"
                size={40}
                color={
                  colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.stateTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Customer Unavailable
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
                Your account
                information could not
                be loaded.
              </Text>
            </View>
          ) : savedAddressesError ? (
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
              <Ionicons
                name="alert-circle-outline"
                size={40}
                color={colors.warning}
              />

              <Text
                style={[
                  styles.stateTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Addresses Unavailable
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
                {savedAddressesError}
              </Text>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={
                  refreshSavedAddresses
                }
                style={[
                  styles.retryButton,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={18}
                  color={colors.text}
                />

                <Text
                  style={[
                    styles.retryButtonText,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          ) : savedAddresses.length ===
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
                name="map-marker-outline"
                size={42}
                color={
                  colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.stateTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                No Saved Addresses
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
                Add an address above.
                It will only appear
                here after the backend
                confirms that it has
                been saved.
              </Text>
            </View>
          ) : (
            <View
              style={
                styles.addressList
              }
            >
              {savedAddresses.map(
                (savedAddress) => (
                  <View
                    key={
                      savedAddress.id
                    }
                    style={[
                      styles.addressCard,
                      {
                        backgroundColor:
                          colors.card,
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.addressIcon,
                        {
                          borderColor:
                            colors.accent,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={22}
                        color={
                          colors.accent
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.addressContent
                      }
                    >
                      <View
                        style={
                          styles.addressHeader
                        }
                      >
                        <Text
                          style={[
                            styles.addressLabel,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {
                            savedAddress.label
                          }
                        </Text>

                        {savedAddress.isDefault ? (
                          <View
                            style={[
                              styles.defaultBadge,
                              {
                                borderColor:
                                  colors.accent,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.defaultBadgeText,
                                {
                                  color:
                                    colors.accent,
                                },
                              ]}
                            >
                              Default
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text
                        style={[
                          styles.addressValue,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {
                          savedAddress.address
                        }
                      </Text>
                    </View>
                  </View>
                )
              )}
            </View>
          )}

          <View
            style={[
              styles.noticeCard,
              {
                borderColor:
                  colors.warning,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={colors.warning}
            />

            <Text
              style={[
                styles.noticeText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Address validation,
              geocoding, persistent
              storage, and default
              address rules are owned
              by the backend. The app
              does not invent
              coordinates or treat
              local form data as a
              saved address.
            </Text>
          </View>
        </StableScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

type AddressFieldProps = {
  label: string
  value: string
  placeholder: string
  error?: string
  multiline?: boolean

  onChangeText: (
    value: string
  ) => void

  textColor: string
  secondaryTextColor: string
  borderColor: string
  dangerColor: string
}

function AddressField({
  label,
  value,
  placeholder,
  error,
  multiline = false,
  onChangeText,
  textColor,
  secondaryTextColor,
  borderColor,
  dangerColor,
}: AddressFieldProps) {
  return (
    <View style={styles.field}>
      <Text
        style={[
          styles.fieldLabel,
          {
            color: textColor,
          },
        ]}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={
          secondaryTextColor
        }
        multiline={multiline}
        textAlignVertical={
          multiline
            ? 'top'
            : 'center'
        }
        autoCapitalize="words"
        style={[
          styles.input,
          multiline &&
            styles.multilineInput,
          {
            color: textColor,
            borderColor: error
              ? dangerColor
              : borderColor,
          },
        ]}
      />

      {error ? (
        <Text
          style={[
            styles.fieldError,
            {
              color: dangerColor,
            },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  backButton: {
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
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
  },

  addButton: {
    minHeight: 48,
    marginTop: 18,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  addButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },

  formCard: {
    marginTop: 18,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    gap: 14,
  },

  formTitle: {
    fontSize: 15,
    fontWeight: '700',
  },

  field: {
    gap: 6,
  },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 12,
  },

  multilineInput: {
    minHeight: 90,
    paddingTop: 12,
    paddingBottom: 12,
  },

  fieldError: {
    fontSize: 9,
    lineHeight: 13,
  },

  defaultRow: {
    minHeight: 72,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  defaultText: {
    flex: 1,
  },

  defaultTitle: {
    fontSize: 11,
    fontWeight: '700',
  },

  defaultDescription: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 14,
  },

  errorCard: {
    padding: 11,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
  },

  formActions: {
    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  saveButton: {
    flex: 1.4,
    minHeight: 46,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  saveButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },

  stateCard: {
    minHeight: 220,
    marginTop: 18,
    padding: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  stateDescription: {
    marginTop: 7,
    maxWidth: 310,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  retryButton: {
    minHeight: 42,
    marginTop: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  retryButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },

  addressList: {
    marginTop: 18,
    gap: 10,
  },

  addressCard: {
    minHeight: 84,
    padding: 13,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  addressIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addressContent: {
    flex: 1,
    marginLeft: 11,
  },

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  addressLabel: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '700',
  },

  defaultBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 5,
  },

  defaultBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },

  addressValue: {
    marginTop: 5,
    fontSize: 9.5,
    lineHeight: 14,
  },

  noticeCard: {
    marginTop: 18,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  noticeText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 15,
  },
})