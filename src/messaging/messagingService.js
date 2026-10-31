import {
  auth,
} from '../firebase/firebase'

import {
  messagingApiRequest,
  MESSAGING_API_ERROR_CODES,
} from './messagingApi'

export const MESSAGING_SERVICE_ERRORS = {
  AUTH_REQUIRED: MESSAGING_API_ERROR_CODES.AUTH_REQUIRED,
  BACKEND_NOT_CONNECTED:
    MESSAGING_API_ERROR_CODES.BACKEND_NOT_CONNECTED,
  INVALID_RESPONSE:
    MESSAGING_API_ERROR_CODES.INVALID_RESPONSE,
}

/**
 * Use the authenticated Firebase UID, not a
 * profile record ID or a user-supplied ID.
 *
 * @returns {string}
 */
function requireMessagingAccount() {
  const accountId = auth.currentUser?.uid

  if (!accountId) {
    const error = new Error(
      'You must be signed in to access messages.'
    )
    error.code =
      MESSAGING_SERVICE_ERRORS.AUTH_REQUIRED
    throw error
  }

  return accountId
}

/**
 * Never accept a malformed backend response as
 * a real message or confirmed delivery.
 *
 * @param {string} operation
 * @returns {never}
 */
function throwInvalidMessagingResponse(operation) {
  const error = new Error(
    `MechanIQ messaging returned an invalid ${operation} response.`
  )
  error.code =
    MESSAGING_SERVICE_ERRORS.INVALID_RESPONSE
  throw error
}

/** @param {unknown} value */
function isNullableString(value) {
  return value === null || typeof value === 'string'
}

/** @param {unknown} value */
function isMessagingConversation(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const item = /** @type {Record<string, any>} */ (value)

  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.customerUserId === 'string' &&
    typeof item.mechanicUserId === 'string' &&
    isNullableString(item.customerName) &&
    isNullableString(item.mechanicName) &&
    isNullableString(item.jobId) &&
    isNullableString(item.bookingId) &&
    isNullableString(item.requestId) &&
    isNullableString(item.lastMessageText) &&
    isNullableString(item.lastMessageAt) &&
    Number.isInteger(item.unreadCount) &&
    item.unreadCount >= 0 &&
    isNullableString(item.updatedAt)
  )
}

/** @param {unknown} value */
function isMessagingMessage(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const item = /** @type {Record<string, any>} */ (value)

  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.conversationId === 'string' &&
    typeof item.senderUserId === 'string' &&
    typeof item.recipientUserId === 'string' &&
    item.contentType === 'text' &&
    typeof item.text === 'string' &&
    typeof item.createdAt === 'string' &&
    (
      item.deliveryStatus === 'sent' ||
      item.deliveryStatus === 'delivered' ||
      item.deliveryStatus === 'read'
    )
  )
}

/**
 * Get conversations for the signed-in participant.
 * Unread counts are supplied by the backend.
 *
 * GET /conversations
 *
 * @returns {Promise<import('./messageTypes').MessagingConversationsData>}
 */
export async function getMessagingConversations() {
  const accountId = requireMessagingAccount()

  const data = await messagingApiRequest('conversations')

  if (
    !data ||
    !Array.isArray(data.conversations) ||
    !data.conversations.every(isMessagingConversation) ||
    !Number.isInteger(data.totalUnreadCount) ||
    data.totalUnreadCount < 0 ||
    data.conversations.some(
      (conversation) =>
        conversation.customerUserId !== accountId &&
        conversation.mechanicUserId !== accountId
    )
  ) {
    throwInvalidMessagingResponse('conversations')
  }

  return data
}

/**
 * Get paginated messages in an authorized conversation.
 *
 * GET /conversations/:conversationId/messages
 *
 * @param {{
 *   conversationId: string,
 *   cursor?: string | null,
 *   limit?: number
 * }} input
 *
 * @returns {Promise<import('./messageTypes').MessagingMessagesPage>}
 */
export async function getMessagingMessages(input) {
  requireMessagingAccount()

  if (!input?.conversationId?.trim()) {
    throw new Error('A conversation ID is required.')
  }

  if (
    input.limit != null &&
    (!Number.isInteger(input.limit) || input.limit <= 0)
  ) {
    throw new Error(
      'Message page size must be a positive integer.'
    )
  }

  const params = []

  if (input.cursor) {
    params.push(`cursor=${encodeURIComponent(input.cursor)}`)
  }

  if (input.limit != null) {
    params.push(`limit=${input.limit}`)
  }

  const suffix = params.length > 0
    ? `?${params.join('&')}`
    : ''

  const path =
    `conversations/${encodeURIComponent(input.conversationId)}/messages${suffix}`

  const data = await messagingApiRequest(path)

  if (
    !data ||
    !Array.isArray(data.messages) ||
    !data.messages.every(isMessagingMessage) ||
    !isNullableString(data.nextCursor) ||
    typeof data.hasMore !== 'boolean' ||
    data.messages.some(
      (message) =>
        message.conversationId !== input.conversationId
    )
  ) {
    throwInvalidMessagingResponse('messages')
  }

  return data
}

/**
 * Open or create a conversation. The server derives
 * the initiating account from the Firebase token.
 *
 * POST /conversations
 *
 * @param {import('./messageTypes').OpenMessagingConversationInput} input
 * @returns {Promise<import('./messageTypes').MessagingConversation>}
 */
export async function openMessagingConversation(input) {
  const accountId = requireMessagingAccount()

  if (!input?.recipientUserId?.trim()) {
    throw new Error('A recipient account is required.')
  }

  if (input.recipientUserId === accountId) {
    throw new Error(
      'You cannot start a conversation with yourself.'
    )
  }

  const conversation = await messagingApiRequest(
    'conversations',
    {
      method: 'POST',
      body: {
        recipientUserId: input.recipientUserId,
        jobId: input.jobId ?? null,
        bookingId: input.bookingId ?? null,
        requestId: input.requestId ?? null,
      },
    }
  )

  if (
    !isMessagingConversation(conversation) ||
    ![conversation.customerUserId, conversation.mechanicUserId]
      .includes(accountId) ||
    ![conversation.customerUserId, conversation.mechanicUserId]
      .includes(input.recipientUserId)
  ) {
    throwInvalidMessagingResponse('conversation')
  }

  return conversation
}

/**
 * Send a message. A stable clientRequestId is required
 * so the backend can deduplicate retries.
 * Do not show a sent status without an acknowledged reply.
 *
 * POST /conversations/:conversationId/messages
 *
 * @param {import('./messageTypes').SendTextMessageInput} input
 * @returns {Promise<import('./messageTypes').MessagingMessage>}
 */
export async function sendTextMessage(input) {
  const accountId = requireMessagingAccount()

  if (!input?.conversationId?.trim()) {
    throw new Error('A conversation ID is required.')
  }

  if (!input?.text?.trim()) {
    throw new Error('Enter a message before sending.')
  }

  if (!input?.clientRequestId?.trim()) {
    throw new Error('A message request ID is required.')
  }

  const message = await messagingApiRequest(
    `conversations/${encodeURIComponent(input.conversationId)}/messages`,
    {
      method: 'POST',
      body: {
        text: input.text.trim(),
        clientRequestId: input.clientRequestId,
      },
    }
  )

  if (
    !isMessagingMessage(message) ||
    message.conversationId !== input.conversationId ||
    message.senderUserId !== accountId
  ) {
    throwInvalidMessagingResponse('sent message')
  }

  return message
}

/**
 * Ask the backend to mark a conversation read.
 * Success requires a 2xx server response;
 * no local read receipt is fabricated.
 *
 * POST /conversations/:conversationId/read
 *
 * @param {string} conversationId
 * @returns {Promise<void>}
 */
export async function markMessagingConversationRead(conversationId) {
  requireMessagingAccount()

  if (!conversationId?.trim()) {
    throw new Error('A conversation ID is required.')
  }

  await messagingApiRequest(
    `conversations/${encodeURIComponent(conversationId)}/read`,
    { method: 'POST' }
  )
}