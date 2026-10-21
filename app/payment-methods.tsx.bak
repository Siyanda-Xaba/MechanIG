import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../src/components/StableScrollView'

import type {
  CustomerPaymentMethod,
} from '../src/customer/customerPaymentTypes'
import { useCustomerPaymentMethods } from '../src/customer/useCustomerPaymentMethods'
import { useTheme } from '../src/theme/ThemeContext'
import { useUser } from '../src/users/UserContext'

export default function PaymentMethodsScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    user,
    isLoadingUser,
  } = useUser()

  const {
    paymentMethods,
    isLoadingPaymentMethods,
    paymentMethodsError,
    refreshPaymentMethods,
  } = useCustomerPaymentMethods(
    user?.id ?? null
  )

  const [
    showProviderNotice,
    setShowProviderNotice,
  ] = useState(false)

  const isLoading =
    isLoadingUser ||
    isLoadingPaymentMethods

  function handleAddPaymentMethod() {
    setShowProviderNotice(true)
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
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
            Payment Methods
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
          Saved Payment Methods
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
          Manage secure payment
          methods used for supported
          MechanIQ services.
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={
            handleAddPaymentMethod
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
            name="credit-card-plus-outline"
            size={21}
            color="#000000"
          />

          <Text
            style={
              styles.addButtonText
            }
          >
            Add Payment Method
          </Text>
        </TouchableOpacity>

        {showProviderNotice ? (
          <View
            style={[
              styles.providerCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.warning,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={27}
              color={colors.warning}
            />

            <View
              style={
                styles.providerContent
              }
            >
              <Text
                style={[
                  styles.providerTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Secure Payment Provider Required
              </Text>

              <Text
                style={[
                  styles.providerDescription,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Adding a payment method
                will be enabled once a
                supported payment
                provider is connected.
                MechanIQ will use that
                provider to securely
                collect and tokenize
                payment details.
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setShowProviderNotice(
                    false
                  )
                }
                style={[
                  styles.dismissButton,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dismissButtonText,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  Dismiss
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

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
                  color: colors.text,
                },
              ]}
            >
              Loading Payment Methods
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
              Retrieving your secure
              payment information.
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
                  color: colors.text,
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
              Your account information
              could not be loaded.
            </Text>
          </View>
        ) : paymentMethodsError ? (
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
                  color: colors.text,
                },
              ]}
            >
              Payment Methods Unavailable
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
              {paymentMethodsError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={
                refreshPaymentMethods
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
                    color: colors.text,
                  },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : paymentMethods.length ===
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
              name="credit-card-outline"
              size={44}
              color={
                colors.secondaryText
              }
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No Payment Methods
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
              Securely saved payment
              methods will appear here
              once payment-provider
              integration is available.
            </Text>
          </View>
        ) : (
          <View
            style={
              styles.paymentList
            }
          >
            {paymentMethods.map(
              (paymentMethod) => (
                <PaymentMethodCard
                  key={
                    paymentMethod.id
                  }
                  paymentMethod={
                    paymentMethod
                  }
                  textColor={
                    colors.text
                  }
                  secondaryTextColor={
                    colors.secondaryText
                  }
                  cardColor={
                    colors.card
                  }
                  borderColor={
                    colors.border
                  }
                  accentColor={
                    colors.accent
                  }
                />
              )
            )}
          </View>
        )}

        <View
          style={[
            styles.securityCard,
            {
              borderColor:
                colors.accent,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={21}
            color={colors.accent}
          />

          <View
            style={
              styles.securityContent
            }
          >
            <Text
              style={[
                styles.securityTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Payment Security
            </Text>

            <Text
              style={[
                styles.securityDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              MechanIQ will never store
              raw card numbers or CVV
              values in the mobile app.
              Payment details must be
              securely handled and
              tokenized by the connected
              payment provider.
            </Text>
          </View>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
}

type PaymentMethodCardProps = {
  paymentMethod: CustomerPaymentMethod

  textColor: string
  secondaryTextColor: string
  cardColor: string
  borderColor: string
  accentColor: string
}

function PaymentMethodCard({
  paymentMethod,
  textColor,
  secondaryTextColor,
  cardColor,
  borderColor,
  accentColor,
}: PaymentMethodCardProps) {
  const maskedNumber =
    paymentMethod.last4
      ? `•••• ${paymentMethod.last4}`
      : 'Secure payment method'

  const expiry =
    paymentMethod.expiryMonth !==
      null &&
    paymentMethod.expiryYear !==
      null
      ? `${String(
          paymentMethod.expiryMonth
        ).padStart(
          2,
          '0'
        )}/${String(
          paymentMethod.expiryYear
        ).slice(-2)}`
      : null

  return (
    <View
      style={[
        styles.paymentCard,
        {
          backgroundColor: cardColor,
          borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.paymentIcon,
          {
            borderColor: accentColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={24}
          color={accentColor}
        />
      </View>

      <View
        style={
          styles.paymentContent
        }
      >
        <View
          style={
            styles.paymentHeader
          }
        >
          <Text
            numberOfLines={1}
            style={[
              styles.paymentName,
              {
                color: textColor,
              },
            ]}
          >
            {paymentMethod.cardBrand ??
              paymentMethod.displayName}
          </Text>

          {paymentMethod.isDefault ? (
            <View
              style={[
                styles.defaultBadge,
                {
                  borderColor:
                    accentColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.defaultBadgeText,
                  {
                    color:
                      accentColor,
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
            styles.maskedNumber,
            {
              color:
                secondaryTextColor,
            },
          ]}
        >
          {maskedNumber}
        </Text>

        {expiry ? (
          <Text
            style={[
              styles.expiry,
              {
                color:
                  secondaryTextColor,
              },
            ]}
          >
            Expires {expiry}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
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

  providerCard: {
    marginTop: 14,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },

  providerContent: {
    flex: 1,
  },

  providerTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  providerDescription: {
    marginTop: 5,
    fontSize: 9.5,
    lineHeight: 15,
  },

  dismissButton: {
    alignSelf: 'flex-start',
    minHeight: 34,
    marginTop: 10,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
  },

  dismissButtonText: {
    fontSize: 9.5,
    fontWeight: '700',
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

  paymentList: {
    marginTop: 18,
    gap: 10,
  },

  paymentCard: {
    minHeight: 92,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  paymentIcon: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  paymentContent: {
    flex: 1,
    marginLeft: 12,
  },

  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  paymentName: {
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

  maskedNumber: {
    marginTop: 5,
    fontSize: 10,
  },

  expiry: {
    marginTop: 3,
    fontSize: 9,
  },

  securityCard: {
    marginTop: 18,
    padding: 13,
    borderWidth: 1,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 11,
    fontWeight: '700',
  },

  securityDescription: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 15,
  },
})