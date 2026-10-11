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
  CustomerFaqItem,
  CustomerHelpTopic,
  CustomerSupportChannel,
} from '../src/customer/customerHelpSupportTypes'
import { useCustomerHelpSupport } from '../src/customer/useCustomerHelpSupport'
import { useTheme } from '../src/theme/ThemeContext'

export default function HelpSupportScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const {
    helpSupportData,
    isLoadingHelpSupport,
    helpSupportError,
    refreshHelpSupport,
  } = useCustomerHelpSupport()

  const [
    expandedFaqId,
    setExpandedFaqId,
  ] = useState<string | null>(null)

  function handleFaqPress(
    faq: CustomerFaqItem
  ) {
    setExpandedFaqId(
      (current) =>
        current === faq.id
          ? null
          : faq.id
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
            Help & Support
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
          How can we help?
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
          Browse common MechanIQ topics
          and frequently asked questions.
        </Text>

        {isLoadingHelpSupport ? (
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
              Loading Help
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
              Loading MechanIQ help and
              support information.
            </Text>
          </View>
        ) : helpSupportError ? (
          <View
            style={[
              styles.stateCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.danger,
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={38}
              color={colors.danger}
            />

            <Text
              style={[
                styles.stateTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Unable to Load Help
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
              {helpSupportError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={
                refreshHelpSupport
              }
              style={[
                styles.retryButton,
                {
                  backgroundColor:
                    colors.accent,
                },
              ]}
            >
              <Text
                style={
                  styles.retryText
                }
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : !helpSupportData ? (
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
              name="help-circle-outline"
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
              Help Unavailable
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
              Help and support
              information is currently
              unavailable.
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Help Topics
            </Text>

            <View
              style={styles.topicGrid}
            >
              {helpSupportData.topics.map(
                (topic) => (
                  <HelpTopicCard
                    key={topic.id}
                    topic={topic}
                    textColor={
                      colors.text
                    }
                    secondaryTextColor={
                      colors.secondaryText
                    }
                    accentColor={
                      colors.accent
                    }
                    cardColor={
                      colors.card
                    }
                    borderColor={
                      colors.border
                    }
                  />
                )
              )}
            </View>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Frequently Asked Questions
            </Text>

            <View
              style={[
                styles.faqCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {helpSupportData.faqItems.map(
                (faq, index) => {
                  const isExpanded =
                    expandedFaqId ===
                    faq.id

                  return (
                    <TouchableOpacity
                      key={faq.id}
                      activeOpacity={0.75}
                      onPress={() =>
                        handleFaqPress(
                          faq
                        )
                      }
                      style={[
                        styles.faqItem,
                        index !==
                        helpSupportData
                          .faqItems
                          .length -
                          1
                          ? {
                              borderBottomWidth: 1,
                              borderBottomColor:
                                colors.border,
                            }
                          : null,
                      ]}
                    >
                      <View
                        style={
                          styles.faqHeader
                        }
                      >
                        <Text
                          style={[
                            styles.faqQuestion,
                            {
                              color:
                                colors.text,
                            },
                          ]}
                        >
                          {faq.question}
                        </Text>

                        <Ionicons
                          name={
                            isExpanded
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={18}
                          color={
                            colors.secondaryText
                          }
                        />
                      </View>

                      {isExpanded ? (
                        <Text
                          style={[
                            styles.faqAnswer,
                            {
                              color:
                                colors.secondaryText,
                            },
                          ]}
                        >
                          {faq.answer}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  )
                }
              )}
            </View>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Contact Support
            </Text>

            <View
              style={[
                styles.supportCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {helpSupportData.supportContacts.map(
                (contact, index) => (
                  <View
                    key={
                      contact.channel
                    }
                    style={[
                      styles.supportRow,
                      index !==
                      helpSupportData
                        .supportContacts
                        .length -
                        1
                        ? {
                            borderBottomWidth: 1,
                            borderBottomColor:
                              colors.border,
                          }
                        : null,
                    ]}
                  >
                    <View
                      style={[
                        styles.supportIcon,
                        {
                          borderColor:
                            colors.accent,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={getSupportIcon(
                          contact.channel
                        )}
                        size={20}
                        color={
                          colors.accent
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.supportContent
                      }
                    >
                      <Text
                        style={[
                          styles.supportLabel,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {contact.label}
                      </Text>

                      <Text
                        style={[
                          styles.supportValue,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {contact.isAvailable &&
                        contact.value
                          ? contact.value
                          : 'Not available yet'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          borderColor:
                            contact.isAvailable
                              ? colors.accent
                              : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              contact.isAvailable
                                ? colors.accent
                                : colors.secondaryText,
                          },
                        ]}
                      >
                        {contact.isAvailable
                          ? 'Available'
                          : 'Coming Soon'}
                      </Text>
                    </View>
                  </View>
                )
              )}
            </View>

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
                size={21}
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
                Support contact details
                will only be enabled once
                real MechanIQ support
                channels are configured.
                No email address, phone
                number, or live chat
                endpoint is fabricated
                by the frontend.
              </Text>
            </View>
          </>
        )}
      </StableScrollView>
    </SafeAreaView>
  )
}

type HelpTopicCardProps = {
  topic: CustomerHelpTopic

  textColor: string
  secondaryTextColor: string
  accentColor: string
  cardColor: string
  borderColor: string
}

function HelpTopicCard({
  topic,
  textColor,
  secondaryTextColor,
  accentColor,
  cardColor,
  borderColor,
}: HelpTopicCardProps) {
  return (
    <View
      style={[
        styles.topicCard,
        {
          backgroundColor:
            cardColor,
          borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.topicIcon,
          {
            borderColor:
              accentColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={getTopicIcon(
            topic.id
          )}
          size={22}
          color={accentColor}
        />
      </View>

      <Text
        style={[
          styles.topicTitle,
          {
            color: textColor,
          },
        ]}
      >
        {topic.title}
      </Text>

      <Text
        style={[
          styles.topicDescription,
          {
            color:
              secondaryTextColor,
          },
        ]}
      >
        {topic.description}
      </Text>
    </View>
  )
}

function getTopicIcon(
  id: CustomerHelpTopic['id']
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (id) {
    case 'account-profile':
      return 'account-outline'

    case 'vehicles':
      return 'car-outline'

    case 'diagnostics':
      return 'car-wrench'

    case 'fuel':
      return 'gas-station-outline'

    case 'marketplace':
      return 'store-outline'

    case 'bookings':
      return 'calendar-check-outline'
  }
}

function getSupportIcon(
  channel: CustomerSupportChannel
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (channel) {
    case 'email':
      return 'email-outline'

    case 'phone':
      return 'phone-outline'

    case 'chat':
      return 'message-text-outline'
  }
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

  sectionTitle: {
    marginTop: 20,
    marginBottom: 9,
    fontSize: 15,
    fontWeight: '700',
  },

  stateCard: {
    minHeight: 230,
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
    minWidth: 110,
    minHeight: 40,
    marginTop: 14,
    paddingHorizontal: 16,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
  },

  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  topicCard: {
    width: '48%',
    minHeight: 154,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },

  topicIcon: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topicTitle: {
    marginTop: 10,
    fontSize: 11.5,
    fontWeight: '700',
  },

  topicDescription: {
    marginTop: 5,
    fontSize: 8.5,
    lineHeight: 13,
  },

  faqCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  faqItem: {
    paddingVertical: 14,
  },

  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  faqQuestion: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '600',
  },

  faqAnswer: {
    marginTop: 9,
    paddingRight: 24,
    fontSize: 9,
    lineHeight: 14,
  },

  supportCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  supportRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },

  supportIcon: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  supportContent: {
    flex: 1,
    marginLeft: 11,
  },

  supportLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  supportValue: {
    marginTop: 3,
    fontSize: 9,
  },

  statusBadge: {
    minHeight: 24,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusText: {
    fontSize: 8,
    fontWeight: '600',
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