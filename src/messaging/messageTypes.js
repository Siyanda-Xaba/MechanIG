export const MESSAGE_PARTICIPANT_ROLES = {
  CUSTOMER: 'customer',
  MECHANIC: 'mechanic',
}

export const MESSAGE_CONTENT_TYPES = {
  TEXT: 'text',
}

export const MESSAGE_DELIVERY_STATUSES = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
}

export const MESSAGE_OUTBOX_STATUSES = {
  DRAFT: 'draft',
  QUEUED: 'queued',
  SENDING: 'sending',
  FAILED: 'failed',
}

/**
 * A participant's authenticated Firebase UID.
 *
 * The backend must verify the user's identity
 * and role before allowing conversation access.
 *
 * @typedef {string} MessagingAccountId
 */

/**
 * @typedef {'customer' | 'mechanic'} MessageParticipantRole
 */

/**
 * @typedef {'text'} MessageContentType
 */

/**
 * These statuses describe messages acknowledged
 * by the authoritative messaging backend.
 *
 * @typedef {'sent' | 'delivered' | 'read'} MessageDeliveryStatus
 */

/**
 * Local message states used by future offline
 * draft storage and synchronization.
 *
 * Queued or sending messages must never be
 * presented as successfully delivered.
 *
 * @typedef {'draft' | 'queued' | 'sending' | 'failed'} MessageOutboxStatus
 */

/**
 * @typedef {{
 *   id: string,
 *   conversationId: string,
 *   senderUserId: MessagingAccountId,
 *   recipientUserId: MessagingAccountId,
 *   contentType: MessageContentType,
 *   text: string,
 *   createdAt: string,
 *   deliveryStatus: MessageDeliveryStatus
 * }} MessagingMessage
 */

/**
 * @typedef {{
 *   id: string,
 *   customerUserId: MessagingAccountId,
 *   mechanicUserId: MessagingAccountId,
 *   customerName: string | null,
 *   mechanicName: string | null,
 *   jobId: string | null,
 *   bookingId: string | null,
 *   requestId: string | null,
 *   lastMessageText: string | null,
 *   lastMessageAt: string | null,
 *   unreadCount: number,
 *   updatedAt: string | null
 * }} MessagingConversation
 */

/**
 * Conversations visible to the authenticated
 * account.
 *
 * unreadCount must be calculated for that
 * authenticated participant by the backend.
 *
 * @typedef {{
 *   conversations: MessagingConversation[],
 *   totalUnreadCount: number
 * }} MessagingConversationsData
 */

/**
 * @typedef {{
 *   messages: MessagingMessage[],
 *   nextCursor: string | null,
 *   hasMore: boolean
 * }} MessagingMessagesPage
 */

/**
 * Request to open or create a conversation.
 *
 * The initiating user is derived from Firebase
 * authentication, not trusted from form input.
 *
 * The backend must validate both participants
 * and any linked service records.
 *
 * @typedef {{
 *   recipientUserId: MessagingAccountId,
 *   jobId?: string | null,
 *   bookingId?: string | null,
 *   requestId?: string | null
 * }} OpenMessagingConversationInput
 */

/**
 * Request to send a text message.
 *
 * clientRequestId is a stable unique identifier
 * created by the frontend for retry safety.
 *
 * The backend must use it to prevent duplicate
 * messages during synchronization.
 *
 * @typedef {{
 *   conversationId: string,
 *   text: string,
 *   clientRequestId: string
 * }} SendTextMessageInput
 */

/**
 * Local draft/outbox record for future offline
 * synchronization.
 *
 * This is not an authoritative message record.
 * It must be stored separately from confirmed
 * backend messages.
 *
 * accountId scopes the draft to the correct
 * authenticated account.
 *
 * @typedef {{
 *   id: string,
 *   accountId: MessagingAccountId,
 *   conversationId: string,
 *   text: string,
 *   clientRequestId: string,
 *   status: MessageOutboxStatus,
 *   createdAt: string,
 *   updatedAt: string,
 *   lastError: string | null
 * }} MessagingOutboxItem
 */