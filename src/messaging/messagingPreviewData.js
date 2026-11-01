/**
 * MechanIQ development-only messaging preview.
 *
 * These records exist exclusively to help us
 * visually test Customer and Mechanic chat UI.
 *
 * They must never be treated as real conversations,
 * persisted messages, or successful delivery.
 */

const PREVIEW_CUSTOMER_ID =
  'preview-customer-account'

const PREVIEW_MECHANIC_ID =
  'preview-mechanic-account'

const PREVIEW_CONVERSATION_ID =
  'preview-conversation-001'

const previewConversation = {
  id: PREVIEW_CONVERSATION_ID,

  customerUserId: PREVIEW_CUSTOMER_ID,
  mechanicUserId: PREVIEW_MECHANIC_ID,

  customerName: 'Preview Customer',
  mechanicName: 'Preview Mechanic',

  jobId: null,
  bookingId: null,
  requestId: null,

  lastMessageText:
    'I will confirm before travelling.',

  lastMessageAt:
    '2026-10-08T09:45:00.000Z',

  unreadCount: 0,
  updatedAt:
    '2026-10-08T09:45:00.000Z',
}

const previewMessages = [
  {
    id: 'preview-message-001',
    conversationId: PREVIEW_CONVERSATION_ID,

    senderUserId: PREVIEW_CUSTOMER_ID,
    recipientUserId: PREVIEW_MECHANIC_ID,

    contentType: 'text',

    text:
      'Hi, I would like an update on my vehicle.',

    createdAt:
      '2026-10-08T09:30:00.000Z',

    deliveryStatus: 'read',
  },

  {
    id: 'preview-message-002',
    conversationId: PREVIEW_CONVERSATION_ID,

    senderUserId: PREVIEW_MECHANIC_ID,
    recipientUserId: PREVIEW_CUSTOMER_ID,

    contentType: 'text',

    text:
      'Hello! I have reviewed your service request. I will keep you updated.',

    createdAt:
      '2026-10-08T09:35:00.000Z',

    deliveryStatus: 'read',
  },

  {
    id: 'preview-message-003',
    conversationId: PREVIEW_CONVERSATION_ID,

    senderUserId: PREVIEW_CUSTOMER_ID,
    recipientUserId: PREVIEW_MECHANIC_ID,

    contentType: 'text',

    text:
      'Thank you. Please let me know when you are on your way.',

    createdAt:
      '2026-10-08T09:40:00.000Z',

    deliveryStatus: 'delivered',
  },

  {
    id: 'preview-message-004',
    conversationId: PREVIEW_CONVERSATION_ID,

    senderUserId: PREVIEW_MECHANIC_ID,
    recipientUserId: PREVIEW_CUSTOMER_ID,

    contentType: 'text',

    text:
      'Of course. I will confirm before travelling.',

    createdAt:
      '2026-10-08T09:45:00.000Z',

    deliveryStatus: 'sent',
  },
]

/**
 * Returns sample data only in development builds.
 *
 * viewerRole determines which messages appear
 * as outgoing or incoming in the chat interface.
 *
 * @param {'customer' | 'mechanic'} viewerRole
 */
export function getMessagingPreviewData(
  viewerRole
) {
  if (!__DEV__) {
    return null
  }

  if (
    viewerRole !== 'customer' &&
    viewerRole !== 'mechanic'
  ) {
    return null
  }

  return {
    conversation: {
      ...previewConversation,
    },

    messages: previewMessages.map(
      (message) => ({
        ...message,
      })
    ),

    viewerUserId:
      viewerRole === 'mechanic'
        ? PREVIEW_MECHANIC_ID
        : PREVIEW_CUSTOMER_ID,

    viewerRole,

    isPreview: true,
  }
}