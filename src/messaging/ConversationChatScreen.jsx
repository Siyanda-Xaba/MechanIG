import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { auth } from '../firebase/firebase'
import { useTheme } from '../theme/ThemeContext'
import { useUser } from '../users/UserContext'
import { useMessaging } from './MessagingContext'
import { getMessagingPreviewData } from './messagingPreviewData'
import { MESSAGE_OUTBOX_STATUSES } from './messageTypes'

const MAX_MESSAGE_LENGTH = 2000
const PREVIEW_CONVERSATION_ID = 'preview-conversation-001'

function formatMessageTime(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function createClientRequestId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return `msg-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}-${Math.random().toString(36).slice(2)}`
}

function MessageBubble({
  message,
  isMine,
  colors,
  showDeliveryStatus = true,
}) {
  const status = message.deliveryStatus
  const statusIcon =
    status === 'read'
      ? 'checkmark-done'
      : status === 'delivered'
        ? 'checkmark-done-outline'
        : 'checkmark'

  return (
    <View
      style={[
        styles.bubbleRow,
        isMine ? styles.ownBubbleRow : styles.receivedBubbleRow,
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isMine ? colors.accent : colors.card,
            borderColor: isMine ? colors.accent : colors.border,
          },
        ]}
      >
        <Text
          selectable
          style={[
            styles.messageText,
            { color: isMine ? '#000000' : colors.text },
          ]}
        >
          {message.text}
        </Text>

        <View style={styles.messageMetadata}>
          <Text
            style={[
              styles.messageTime,
              {
                color: isMine
                  ? 'rgba(0,0,0,0.7)'
                  : colors.secondaryText,
              },
            ]}
          >
            {formatMessageTime(message.createdAt)}
          </Text>

          {isMine && showDeliveryStatus ? (
            <Ionicons
              name={statusIcon}
              size={15}
              color="rgba(0,0,0,0.75)"
              accessibilityLabel={status}
            />
          ) : null}
        </View>
      </View>
    </View>
  )
}

function OutboxMessageBubble({ item, colors, onRetry, retryDisabled }) {
  const isFailed = item.status === MESSAGE_OUTBOX_STATUSES.FAILED
  const isSending = item.status === MESSAGE_OUTBOX_STATUSES.SENDING
  const statusLabel = isFailed
    ? 'Failed — not delivered'
    : isSending
      ? 'Sending — awaiting confirmation'
      : 'Queued on this device — not delivered'

  return (
    <View style={[styles.bubbleRow, styles.ownBubbleRow]}>
      <View
        style={[
          styles.bubble,
          styles.outboxBubble,
          {
            backgroundColor: colors.card,
            borderColor: colors.accent,
          },
        ]}
      >
        <Text selectable style={[styles.messageText, { color: colors.text }]}>
          {item.text}
        </Text>

        <Text style={[styles.outboxStatusText, {
          color: isFailed ? colors.danger : colors.secondaryText,
        }]}>
          {formatMessageTime(item.createdAt)} · {statusLabel}
        </Text>

        {item.lastError ? (
          <Text style={[styles.outboxErrorText, { color: colors.secondaryText }]}>
            {item.lastError}
          </Text>
        ) : null}

        {!isSending ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Retry sending saved message"
            disabled={retryDisabled}
            activeOpacity={0.8}
            onPress={() => onRetry(item.id)}
            style={[styles.outboxRetryButton, {
              backgroundColor: colors.accent,
              opacity: retryDisabled ? 0.5 : 1,
            }]}
          >
            <Ionicons name="refresh" size={14} color="#000000" />
            <Text style={styles.outboxRetryText}>Retry send</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

function MessageState({
  colors,
  icon,
  title,
  description,
  loading = false,
  onRetry,
}) {
  return (
    <View style={styles.stateContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} />
      ) : (
        <MaterialCommunityIcons
          name={icon ?? 'message-text-outline'}
          size={34}
          color={colors.accent}
        />
      )}

      <Text style={[styles.stateTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Text
        style={[
          styles.stateDescription,
          { color: colors.secondaryText },
        ]}
      >
        {description}
      </Text>

      {onRetry ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Retry loading messages"
          onPress={onRetry}
          activeOpacity={0.8}
          style={[
            styles.retryButton,
            { backgroundColor: colors.accent },
          ]}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

/**
 * Shared Customer/Mechanic chat interface.
 *
 * Production messages and delivery states come from authenticated
 * services. An explicitly enabled development preview uses separate
 * example data and never calls the messaging backend.
 *
 * @param {{
 *   conversationId: string,
 *   participantRole: 'customer' | 'mechanic',
 *   onBack: () => void,
 *   previewMode?: boolean,
 * }} props
 */
export default function ConversationChatScreen({
  conversationId,
  participantRole,
  onBack,
  previewMode = false,
}) {
  const { colors } = useTheme()
  const { isLoadingUser } = useUser()
  const listRef = useRef(null)
  const sendInFlightRef = useRef(false)
  const sendOperationRef = useRef(0)
  const conversationIdRef = useRef(conversationId)
  conversationIdRef.current = conversationId
  const [draft, setDraft] = useState('')
  const [isSavingMessage, setIsSavingMessage] = useState(false)
  const [previewSendNotice, setPreviewSendNotice] = useState(false)

  const {
    conversationsData,
    activeConversationId,
    messagesPage,
    isLoadingMessages,
    messagesError,
    loadConversationMessages,
    outboxItems,
    isSyncingOutbox,
    outboxError,
    queueMessage,
    retryOutboxMessage,
    markConversationRead,
    clearMessagingErrors,
  } = useMessaging()

  // Only a dedicated development route may opt into preview mode.
  // A production build can never display preview conversation data.
  const previewData = useMemo(() => {
    if (
      !__DEV__ ||
      !previewMode ||
      conversationId !== PREVIEW_CONVERSATION_ID
    ) {
      return null
    }

    const viewerRole = participantRole === 'customer'
      ? 'mechanic'
      : 'customer'

    return getMessagingPreviewData(viewerRole)
  }, [conversationId, participantRole, previewMode])

  const isPreview = Boolean(previewData)
  const accountId = auth.currentUser?.uid ?? null
  const canLoad = isPreview || Boolean(
    conversationId && accountId && !isLoadingUser
  )

  const conversation = useMemo(
    () => previewData?.conversation ??
      conversationsData?.conversations.find(
        (item) => item.id === conversationId
      ) ?? null,
    [conversationsData, conversationId, previewData]
  )

  const otherParticipantLabel =
    participantRole === 'mechanic' ? 'Mechanic' : 'Customer'

  const participantName =
    participantRole === 'mechanic'
      ? conversation?.mechanicName ?? otherParticipantLabel
      : conversation?.customerName ?? otherParticipantLabel

  const isCurrentConversation = activeConversationId === conversationId
  const currentPage = isPreview
    ? { messages: previewData.messages, hasMore: false, nextCursor: null }
    : isCurrentConversation ? messagesPage : null
  const currentError = isPreview
    ? null
    : isCurrentConversation ? messagesError : null
  const currentIsLoading = !isPreview && isCurrentConversation && isLoadingMessages

  // Local outbox items are rendered separately from confirmed messages.
  // Their statuses are never converted into backend delivery receipts.
  const messages = useMemo(() => {
    const confirmed = (currentPage?.messages ?? []).map((message) => ({
      key: `confirmed:${message.id}`,
      createdAt: message.createdAt,
      kind: 'confirmed',
      message,
    }))

    const pending = isPreview
      ? []
      : outboxItems
        .filter((item) =>
          item.accountId === accountId &&
          item.conversationId === conversationId &&
          item.status !== MESSAGE_OUTBOX_STATUSES.DRAFT
        )
        .map((item) => ({
          key: `outbox:${item.id}`,
          createdAt: item.createdAt,
          kind: 'outbox',
          item,
        }))

    return [...confirmed, ...pending].sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime()
      const rightTime = new Date(right.createdAt).getTime()

      if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
        return 0
      }

      return leftTime - rightTime
    })
  }, [accountId, conversationId, currentPage, isPreview, outboxItems])

  useEffect(() => {
    sendOperationRef.current += 1
    sendInFlightRef.current = false
    setIsSavingMessage(false)
    setDraft('')
    setPreviewSendNotice(false)

    if (!isPreview) {
      clearMessagingErrors()
    }
  }, [accountId, conversationId, clearMessagingErrors, isPreview])

  useEffect(() => {
    if (!canLoad || isPreview) {
      return
    }

    void loadConversationMessages(conversationId)
  }, [canLoad, conversationId, isPreview, loadConversationMessages])

  useEffect(() => {
    if (isPreview || !canLoad || !isCurrentConversation || !currentPage) {
      return
    }

    void markConversationRead(conversationId)
  }, [
    canLoad,
    conversationId,
    currentPage,
    isCurrentConversation,
    isPreview,
    markConversationRead,
  ])

  const handleDraftChange = useCallback((value) => {
    setDraft(value)
    setPreviewSendNotice(false)
  }, [])

  const handleRetryOutbox = useCallback(async (itemId) => {
    if (isPreview || !accountId || isSyncingOutbox) {
      return
    }

    const result = await retryOutboxMessage(itemId)

    if (
      result?.message &&
      auth.currentUser?.uid === accountId &&
      conversationIdRef.current === conversationId
    ) {
      void loadConversationMessages(conversationId)
    }
  }, [
    accountId,
    conversationId,
    isPreview,
    isSyncingOutbox,
    loadConversationMessages,
    retryOutboxMessage,
  ])

  const handleSend = useCallback(async () => {
    const text = draft.trim()

    if (!canLoad || !text || (!isPreview && sendInFlightRef.current)) {
      return
    }

    if (isPreview) {
      // Preview messages never enter the outbox or call the backend.
      setPreviewSendNotice(true)
      return
    }

    if (!accountId) {
      return
    }

    const operationId = ++sendOperationRef.current
    sendInFlightRef.current = true
    setIsSavingMessage(true)

    try {
      // Persist FIRST. Do not clear the composer if local saving fails.
      const item = await queueMessage({
        conversationId,
        text,
        clientRequestId: createClientRequestId(),
      })

      if (
        !item ||
        auth.currentUser?.uid !== accountId ||
        conversationIdRef.current !== conversationId
      ) {
        return
      }

      // Message is now saved locally, NOT sent. It has its own bubble.
      setDraft((current) => (current.trim() === text ? '' : current))

      // Attempt once immediately. The original request ID is retained
      // for explicit retry and later synchronization if this fails.
      const result = await retryOutboxMessage(item.id)

      if (
        result?.message &&
        auth.currentUser?.uid === accountId &&
        conversationIdRef.current === conversationId
      ) {
        void loadConversationMessages(conversationId)
      }
    } finally {
      if (sendOperationRef.current === operationId) {
        sendInFlightRef.current = false
        setIsSavingMessage(false)
      }
    }
  }, [
    accountId,
    canLoad,
    conversationId,
    draft,
    isPreview,
    loadConversationMessages,
    queueMessage,
    retryOutboxMessage,
  ])

  let emptyContent = null

  if (!isPreview && isLoadingUser) {
    emptyContent = (
      <MessageState
        colors={colors}
        loading
        title="Checking your account"
        description="Preparing your messaging access."
      />
    )
  } else if (!isPreview && !accountId) {
    emptyContent = (
      <MessageState
        colors={colors}
        icon="account-lock-outline"
        title="Sign in required"
        description="Sign in to view and send messages."
      />
    )
  } else if (!conversationId) {
    emptyContent = (
      <MessageState
        colors={colors}
        icon="message-alert-outline"
        title="Conversation unavailable"
        description="A valid conversation is required to open this chat."
      />
    )
  } else if (currentIsLoading || (!isPreview && !isCurrentConversation && canLoad)) {
    emptyContent = (
      <MessageState
        colors={colors}
        loading
        title="Loading messages"
        description="Retrieving your authorized conversation history."
      />
    )
  } else if (currentError) {
    emptyContent = (
      <MessageState
        colors={colors}
        icon="message-alert-outline"
        title="Messages unavailable"
        description={currentError}
        onRetry={() => void loadConversationMessages(conversationId)}
      />
    )
  } else if (currentPage && messages.length === 0) {
    emptyContent = (
      <MessageState
        colors={colors}
        icon="message-text-outline"
        title="No messages yet"
        description="Messages will appear here when confirmed by the MechanIQ backend."
      />
    )
  }

  const canSend = canLoad && draft.trim().length > 0 &&
    (isPreview || !isSavingMessage)

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back to messages"
            activeOpacity={0.75}
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.participantIcon}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={32}
              color={colors.accent}
            />
          </View>

          <View style={styles.headerDetails}>
            <Text
              style={[styles.participantName, { color: colors.text }]}
              numberOfLines={1}
            >
              {participantName}
            </Text>
            <Text
              style={[
                styles.participantSubtitle,
                { color: colors.secondaryText },
              ]}
              numberOfLines={1}
            >
              {conversation?.jobId ? 'Service job conversation' : 'Messages'}
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Refresh messages"
            activeOpacity={0.75}
            disabled={isPreview || !canLoad || currentIsLoading}
            onPress={() => void loadConversationMessages(conversationId)}
            style={styles.refreshButton}
          >
            <Ionicons
              name="refresh-outline"
              size={21}
              color={canLoad ? colors.accent : colors.secondaryText}
            />
          </TouchableOpacity>
        </View>

        {isPreview ? (
          <View
            style={[
              styles.previewBanner,
              { backgroundColor: colors.card, borderBottomColor: colors.border },
            ]}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={19}
              color={colors.accent}
            />
            <Text style={[styles.previewBannerText, { color: colors.text }]}>
              DEVELOPMENT PREVIEW — example messages only. Nothing here is real or delivered.
            </Text>
          </View>
        ) : null}

        <FlatList
          ref={listRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          data={messages}
          keyExtractor={(item) => item.key}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
          renderItem={({ item }) => item.kind === 'outbox' ? (
            <OutboxMessageBubble
              item={item.item}
              colors={colors}
              onRetry={handleRetryOutbox}
              retryDisabled={isSyncingOutbox}
            />
          ) : (
            <MessageBubble
              message={item.message}
              isMine={item.message.senderUserId === (
                isPreview ? previewData.viewerUserId : accountId
              )}
              colors={colors}
              showDeliveryStatus={!isPreview}
            />
          )}
          ListHeaderComponent={
            (currentPage?.hasMore || (currentError && messages.length > 0)) ? (
              <Text
                style={[
                  styles.historyNotice,
                  { color: colors.secondaryText },
                ]}
              >
                {currentError
                  ? `History unavailable: ${currentError}`
                  : 'Earlier messages are available in the conversation history.'}
              </Text>
            ) : null
          }
          ListEmptyComponent={emptyContent}
          ListFooterComponent={
            currentError && currentPage ? (
              <Text style={[styles.inlineError, { color: colors.danger }]}>
                {currentError}
              </Text>
            ) : null
          }
        />

        <View
          style={[
            styles.composerContainer,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}
        >
          {isPreview && previewSendNotice ? (
            <View style={styles.sendErrorRow}>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color={colors.accent}
              />
              <Text style={[styles.sendErrorText, { color: colors.text }]}>
                Preview only: this message was not sent. Your text is still here.
              </Text>
            </View>
          ) : null}

          {!isPreview && outboxError ? (
            <View style={styles.sendErrorRow}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={16}
                color={colors.danger}
              />
              <Text style={[styles.sendErrorText, { color: colors.danger }]}>
                {outboxError} Check the local message status before retrying.
              </Text>
            </View>
          ) : null}

          <View style={styles.composerRow}>
            <TextInput
              accessibilityLabel="Message text"
              multiline
              maxLength={MAX_MESSAGE_LENGTH}
              value={draft}
              onChangeText={handleDraftChange}
              editable={canLoad && (isPreview || !isSavingMessage)}
              placeholder="Type a message..."
              placeholderTextColor={colors.secondaryText}
              style={[
                styles.messageInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              textAlignVertical="center"
            />

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Send message"
              activeOpacity={0.8}
              disabled={!canSend}
              onPress={() => void handleSend()}
              style={[
                styles.sendButton,
                {
                  backgroundColor: colors.accent,
                  opacity: canSend ? 1 : 0.45,
                },
              ]}
            >
              {!isPreview && isSavingMessage ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Ionicons name="send" size={20} color="#000000" />
              )}
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.backendNotice, { color: colors.secondaryText }]}
          >
            {isPreview
              ? 'Preview mode: typing is enabled, but sending is disabled.'
              : 'Queued messages are saved locally, not delivered. Only the backend can confirm sending.'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardContainer: { flex: 1 },
  header: {
    height: 70,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backButton: {
    width: 38,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantIcon: {
    marginRight: 8,
  },
  headerDetails: { flex: 1 },
  participantName: { fontSize: 16, fontWeight: '800' },
  participantSubtitle: { marginTop: 3, fontSize: 11 },
  refreshButton: {
    width: 42,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  previewBannerText: { flex: 1, fontSize: 11, lineHeight: 16, fontWeight: '600' },
  messagesList: { flex: 1 },
  messagesContent: {
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 20,
    flexGrow: 1,
  },
  bubbleRow: { marginBottom: 11, flexDirection: 'row' },
  ownBubbleRow: { justifyContent: 'flex-end' },
  receivedBubbleRow: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '84%',
    minWidth: 86,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 16,
  },
  outboxBubble: { borderStyle: 'dashed' },
  outboxStatusText: { marginTop: 6, fontSize: 10, lineHeight: 16 },
  outboxErrorText: { marginTop: 4, fontSize: 10, lineHeight: 15 },
  outboxRetryButton: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  outboxRetryText: { fontSize: 11, fontWeight: '700', color: '#000000' },
  messageText: { fontSize: 14, lineHeight: 21 },
  messageMetadata: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  messageTime: { fontSize: 10 },
  historyNotice: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
  },
  inlineError: { marginVertical: 8, fontSize: 12, textAlign: 'center' },
  stateContainer: {
    flex: 1,
    minHeight: 240,
    paddingHorizontal: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 11,
  },
  retryText: { fontSize: 12, fontWeight: '800', color: '#000000' },
  composerContainer: {
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  composerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 9 },
  messageInput: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 13,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendErrorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    paddingBottom: 9,
  },
  sendErrorText: { flex: 1, fontSize: 11, lineHeight: 16 },
  backendNotice: {
    marginTop: 8,
    fontSize: 10,
    textAlign: 'center',
  },
})
