import {
  auth,
} from '../firebase/firebase'

import {
  MESSAGING_API_ERROR_CODES,
} from './messagingApi'

import {
  sendTextMessage,
} from './messagingService'

import {
  MESSAGE_OUTBOX_STATUSES,
} from './messageTypes'

import {
  loadMessagingOutbox,
  upsertMessagingOutboxItem,
  removeMessagingOutboxItem,
} from './messagingOutboxStorage'

/**
 * MechanIQ Messaging Synchronization
 *
 * Shared by Customer and Mechanic messaging.
 *
 * Local outbox records are not authoritative
 * messages.
 *
 * Only a successful backend response can
 * confirm that a message was sent.
 *
 * The backend must deduplicate requests using
 * clientRequestId.
 */

const messagesInProgress = new Set()

let activeSyncPromise = null

function requireMessagingAccount() {
  const accountId = auth.currentUser?.uid

  if (!accountId) {
    throw new Error(
      'Sign in before accessing saved messages.'
    )
  }

  return accountId
}

function isCurrentAccount(accountId) {
  return auth.currentUser?.uid === accountId
}

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : 'Unable to synchronize the message.'
}

function isRetryableError(error) {
  return [
    MESSAGING_API_ERROR_CODES.NETWORK_ERROR,
    MESSAGING_API_ERROR_CODES.TIMEOUT,
    MESSAGING_API_ERROR_CODES.BACKEND_NOT_CONNECTED,
  ].includes(error?.code)
}

/**
 * Save a message for synchronization.
 *
 * This function must only be called following
 * an explicit user action to send a message.
 *
 * clientRequestId must remain unchanged
 * throughout all retries.
 *
 * @param {import('./messageTypes').SendTextMessageInput} input
 */
export async function queueMessagingText(
  input
) {
  const accountId = requireMessagingAccount()

  const conversationId =
    input?.conversationId?.trim()

  const text = input?.text?.trim()

  const clientRequestId =
    input?.clientRequestId?.trim()

  if (!conversationId || !text || !clientRequestId) {
    throw new Error(
      'A conversation, message and request ID are required.'
    )
  }

  const existing = await loadMessagingOutbox(
    accountId
  )

  const previous = existing.find(
    (item) =>
      item.clientRequestId === clientRequestId
  )

  if (previous) {
    if (
      previous.conversationId !== conversationId ||
      previous.text !== text
    ) {
      throw new Error(
        'A message request ID cannot be reused for different content.'
      )
    }

    return previous
  }

  const now = new Date().toISOString()

  const item = {
    id: clientRequestId,
    accountId,
    conversationId,
    text,
    clientRequestId,
    status: MESSAGE_OUTBOX_STATUSES.QUEUED,
    createdAt: now,
    updatedAt: now,
    lastError: null,
  }

  return upsertMessagingOutboxItem(item)
}

/**
 * Attempt to send one saved message.
 *
 * A successful backend response is required
 * before removing the item from local storage.
 *
 * @param {import('./messageTypes').MessagingOutboxItem} item
 */
async function synchronizeItem(item) {
  const accountId = requireMessagingAccount()

  if (item.accountId !== accountId) {
    throw new Error(
      'This message belongs to another account.'
    )
  }

  if (item.status === MESSAGE_OUTBOX_STATUSES.DRAFT) {
    return {
      status: 'draft',
      message: null,
    }
  }

  const operationKey =
    `${accountId}:${item.id}`

  if (messagesInProgress.has(operationKey)) {
    return {
      status: 'sending',
      message: null,
    }
  }

  messagesInProgress.add(operationKey)

  try {
    await upsertMessagingOutboxItem({
      ...item,
      status: MESSAGE_OUTBOX_STATUSES.SENDING,
      updatedAt: new Date().toISOString(),
      lastError: null,
    })

    let confirmedMessage

    try {
      confirmedMessage = await sendTextMessage({
        conversationId: item.conversationId,
        text: item.text,
        clientRequestId: item.clientRequestId,
      })
    } catch (error) {
      if (!isCurrentAccount(accountId)) {
        return {
          status: 'session-changed',
          message: null,
        }
      }

      const nextStatus = isRetryableError(error)
        ? MESSAGE_OUTBOX_STATUSES.QUEUED
        : MESSAGE_OUTBOX_STATUSES.FAILED

      await upsertMessagingOutboxItem({
        ...item,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        lastError: getErrorMessage(error),
      })

      return {
        status: nextStatus,
        message: null,
      }
    }

    if (!isCurrentAccount(accountId)) {
      return {
        status: 'session-changed',
        message: null,
      }
    }

    // The backend has acknowledged this message.
    // Remove the local copy without creating a
    // second authoritative message record.

    try {
      await removeMessagingOutboxItem(
        accountId,
        item.id
      )

      return {
        status: 'sent',
        message: confirmedMessage,
      }
    } catch {
      // If cleanup fails, preserve the original
      // request ID. A later retry remains safe
      // when the backend enforces idempotency.

      return {
        status: 'cleanup-required',
        message: confirmedMessage,
      }
    }
  } finally {
    messagesInProgress.delete(operationKey)
  }
}

/**
 * Synchronize messages awaiting delivery.
 *
 * Drafts and permanently failed messages
 * are excluded from automatic attempts.
 *
 * Interrupted "sending" records may be
 * retried using the same clientRequestId.
 */
export async function syncMessagingOutbox() {
  const accountId = requireMessagingAccount()

  if (activeSyncPromise) {
    return activeSyncPromise
  }

  const operation = async () => {
    const stored = await loadMessagingOutbox(
      accountId
    )

    const pending = stored
      .filter((item) =>
        [
          MESSAGE_OUTBOX_STATUSES.QUEUED,
          MESSAGE_OUTBOX_STATUSES.SENDING,
        ].includes(item.status)
      )
      .sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      )

    const results = []

    for (const item of pending) {
      if (!isCurrentAccount(accountId)) {
        break
      }

      const result = await synchronizeItem(item)

      results.push({
        itemId: item.id,
        ...result,
      })

      // Avoid attempting additional requests
      // when the service is unavailable.

      if (
        result.status === MESSAGE_OUTBOX_STATUSES.QUEUED ||
        result.status === 'session-changed'
      ) {
        break
      }
    }

    return results
  }

  const promise = operation()

  activeSyncPromise = promise

  try {
    return await promise
  } finally {
    if (activeSyncPromise === promise) {
      activeSyncPromise = null
    }
  }
}

/**
 * Manually retry one saved message.
 *
 * Failed messages require an explicit retry.
 *
 * The original clientRequestId is preserved.
 *
 * @param {string} itemId
 */
export async function retryMessagingOutboxItem(
  itemId
) {
  const accountId = requireMessagingAccount()

  const stored = await loadMessagingOutbox(
    accountId
  )

  const item = stored.find(
    (record) => record.id === itemId
  )

  if (!item) {
    throw new Error(
      'The saved message could not be found.'
    )
  }

  if (item.status === MESSAGE_OUTBOX_STATUSES.DRAFT) {
    throw new Error(
      'Save this draft as a queued message before sending.'
    )
  }

  return synchronizeItem(item)
}