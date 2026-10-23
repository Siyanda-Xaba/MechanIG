import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import StableScrollView from '../../src/components/StableScrollView'
import { auth } from '../../src/firebase/firebase'
import { useMessaging } from '../../src/messaging/MessagingContext'
import { useTheme } from '../../src/theme/ThemeContext'
import { useUser } from '../../src/users/UserContext'

function formatMessageDate(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString()
}

export default function MechanicMessagesScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { isLoadingUser } = useUser()

  const {
    conversationsData,
    isLoadingConversations,
    conversationsError,
    refreshConversations,
  } = useMessaging()

  const accountId =
    auth.currentUser?.uid ?? null

  useEffect(() => {
    if (
      isLoadingUser ||
      !accountId
    ) {
      return
    }

    void refreshConversations()
  }, [
    accountId,
    isLoadingUser,
    refreshConversations,
  ])

  const conversations =
    conversationsData?.conversations ?? []

  const totalUnreadCount =
    conversationsData?.totalUnreadCount ?? 0

  const canRefresh =
    !!accountId &&
    !isLoadingUser &&
    !isLoadingConversations

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
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.75}
            onPress={() => router.back()}
            style={[
              styles.iconButton,
              {
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={23}
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
            Messages
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Refresh conversations"
            activeOpacity={0.75}
            disabled={!canRefresh}
            onPress={() => {
              void refreshConversations()
            }}
            style={[
              styles.iconButton,
              {
                borderColor:
                  colors.border,
                opacity: canRefresh
                  ? 1
                  : 0.5,
              },
            ]}
          >
            <Ionicons
              name="refresh-outline"
              size={21}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Customer Conversations
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
          Conversations connected to your
          MechanIQ service work.
        </Text>

        {__DEV__ ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open development chat preview"
            activeOpacity={0.8}
            onPress={() => {
              router.push({
                pathname:
                  '/mechanic-conversation/[conversationId]',
                params: {
                  conversationId:
                    'preview-conversation-001',
                  preview: '1',
                },
              })
            }}
            style={[
              styles.previewCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.accent,
              },
            ]}
          >
            <View
              style={[
                styles.previewIcon,
                {
                  backgroundColor: `${colors.accent}18`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="message-processing-outline"
                size={23}
                color={colors.accent}
              />
            </View>

            <View style={styles.previewInfo}>
              <Text
                style={[
                  styles.previewTitle,
                  { color: colors.text },
                ]}
              >
                Preview Chat
              </Text>
              <Text
                style={[
                  styles.previewDescription,
                  { color: colors.secondaryText },
                ]}
              >
                Development only · sample messages · nothing sent
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.accent}
            />
          </TouchableOpacity>
        ) : null}

        {conversationsData ? (
          <View
            style={[
              styles.countCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="message-text-outline"
              size={22}
              color={colors.accent}
            />

            <Text
              style={[
                styles.countText,
                {
                  color: colors.text,
                },
              ]}
            >
              {conversations.length}{' '}
              conversation
              {conversations.length === 1
                ? ''
                : 's'}
            </Text>

            {totalUnreadCount > 0 ? (
              <View
                style={[
                  styles.unreadBadge,
                  {
                    backgroundColor:
                      colors.accent,
                  },
                ]}
              >
                <Text
                  style={
                    styles.unreadBadgeText
                  }
                >
                  {totalUnreadCount} unread
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {isLoadingUser ? (
          <StatusCard
            colors={colors}
            loading
            title="Checking your account"
            description="Preparing your messaging access."
          />
        ) : !accountId ? (
          <StatusCard
            colors={colors}
            icon="account-lock-outline"
            title="Sign in required"
            description="Sign in to your MechanIQ account to access customer conversations."
          />
        ) : isLoadingConversations &&
          !conversationsData ? (
          <StatusCard
            colors={colors}
            loading
            title="Loading conversations"
            description="Retrieving your authorized message history."
          />
        ) : conversationsError &&
          !conversationsData ? (
          <StatusCard
            colors={colors}
            icon="message-alert-outline"
            title="Messaging unavailable"
            description={conversationsError}
          />
        ) : conversations.length === 0 ? (
          <StatusCard
            colors={colors}
            icon="message-text-outline"
            title="No conversations yet"
            description="Conversations will appear here when the messaging backend returns authorized customer threads."
          />
        ) : (
          <View
            style={styles.conversationList}
          >
            {conversationsError ? (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: colors.warning,
                  },
                ]}
              >
                {conversationsError}
              </Text>
            ) : null}

            {conversations.map(
              (conversation) => (
                <ConversationPreview
                  key={conversation.id}
                  conversation={conversation}
                  colors={colors}
                  onPress={() => {
                    router.push({
                      pathname:
                        '/mechanic-conversation/[conversationId]',
                      params: {
                        conversationId:
                          conversation.id,
                      },
                    })
                  }}
                />
              )
            )}
          </View>
        )}

        <View
          style={styles.footerNotice}
        >
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={18}
            color={colors.accent}
          />
          <Text
            style={[
              styles.footerText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Messages, unread counts, and
            delivery states require backend
            confirmation. No customer
            conversations are fabricated locally.
          </Text>
        </View>
      </StableScrollView>
    </SafeAreaView>
  )
}

function StatusCard({
  colors,
  loading = false,
  icon = 'message-text-outline',
  title,
  description,
}) {
  return (
    <View
      style={[
        styles.statusCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />
      ) : (
        <MaterialCommunityIcons
          name={icon}
          size={34}
          color={colors.accent}
        />
      )}

      <Text
        style={[
          styles.statusTitle,
          {
            color: colors.text,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.statusDescription,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        {description}
      </Text>
    </View>
  )
}

function ConversationPreview({
  conversation,
  colors,
  onPress,
}) {
  const lastMessageDate =
    formatMessageDate(
      conversation.lastMessageAt
    )

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Open conversation with ${conversation.customerName ?? 'Customer'}`}
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.conversationCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.conversationHeader}>
        <MaterialCommunityIcons
          name="account-circle-outline"
          size={36}
          color={colors.accent}
        />

        <View
          style={styles.conversationHeading}
        >
          <Text
            style={[
              styles.conversationName,
              {
                color: colors.text,
              },
            ]}
          >
            {conversation.customerName ??
              'Customer'}
          </Text>

          {conversation.jobId ? (
            <Text
              style={[
                styles.linkedJobLabel,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Linked service job
            </Text>
          ) : null}
        </View>

        {conversation.unreadCount > 0 ? (
          <View
            style={[
              styles.messageCount,
              {
                backgroundColor:
                  colors.accent,
              },
            ]}
          >
            <Text
              style={
                styles.messageCountText
              }
            >
              {conversation.unreadCount}
            </Text>
          </View>
        ) : null}

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.secondaryText}
        />
      </View>

      <Text
        style={[
          styles.previewText,
          {
            color:
              colors.secondaryText,
          },
        ]}
        numberOfLines={2}
      >
        {conversation.lastMessageText ??
          'No messages yet'}
      </Text>

      {lastMessageDate ? (
        <Text
          style={[
            styles.dateText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {lastMessageDate}
        </Text>
      ) : null}
    </TouchableOpacity>
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
    minHeight: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  title: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 13,
    lineHeight: 19,
  },
  previewCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  previewDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
  },
  countCard: {
    minHeight: 60,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 14,
  },
  countText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  unreadBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  statusCard: {
    minHeight: 220,
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  statusDescription: {
    marginTop: 9,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
  conversationList: {
    gap: 12,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
  },
  conversationCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  conversationHeading: {
    flex: 1,
  },
  conversationName: {
    fontSize: 14,
    fontWeight: '800',
  },
  linkedJobLabel: {
    marginTop: 3,
    fontSize: 10,
  },
  messageCount: {
    minWidth: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  messageCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
  },
  previewText: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
  },
  dateText: {
    marginTop: 7,
    fontSize: 10,
    textAlign: 'right',
  },
  footerNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  footerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
  },
})
