import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  auth,
} from '../firebase/firebase'

import {
  MESSAGE_OUTBOX_STATUSES,
} from './messageTypes'

/**
 * MechanIQ Messaging Outbox Storage
 *
 * Stores local message drafts and messages
 * awaiting backend acknowledgment.
 *
 * Every record belongs to a specific
 * authenticated Firebase account.
 *
 * These records are NOT confirmed backend
 * messages and must never appear as delivered.
 *
 * AsyncStorage does not encrypt message text.
 * Sensitive-message storage requirements must
 * be addressed before production deployment.
 */

const STORAGE_PREFIX =
  '@mechaniq/messaging/outbox/v1/'

const VALID_STATUSES = Object.values(
  MESSAGE_OUTBOX_STATUSES
)

// Serialize storage operations to prevent
// concurrent updates overwriting one another.

let storageQueue = Promise.resolve()

function serializeStorageOperation(operation) {
  const result = storageQueue.then(
    operation,
    operation
  )

  storageQueue = result.then(
    () => undefined,
    () => undefined
  )

  return result
}

function requireStorageAccount(accountId) {
  const authenticatedId =
    auth.currentUser?.uid

  if (
    !authenticatedId ||
    !accountId ||
    authenticatedId !== accountId
  ) {
    throw new Error(
      'Messaging storage requires the correct authenticated account.'
    )
  }
}

function getStorageKey(accountId) {
  return (
    STORAGE_PREFIX +
    encodeURIComponent(accountId)
  )
}

function isNonEmptyString(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  )
}

/**
 * Validate local message records.
 *
 * @param {unknown} value
 * @param {string} accountId
 */
function isValidOutboxItem(
  value,
  accountId
) {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return false
  }

  const item = value

  return (
    isNonEmptyString(item.id) &&
    item.accountId === accountId &&
    isNonEmptyString(item.conversationId) &&
    typeof item.text === 'string' &&
    isNonEmptyString(item.clientRequestId) &&
    VALID_STATUSES.includes(item.status) &&
    isNonEmptyString(item.createdAt) &&
    isNonEmptyString(item.updatedAt) &&
    (
      item.lastError === null ||
      typeof item.lastError === 'string'
    )
  )
}

/**
 * Read stored drafts and pending messages.
 *
 * The caller must be authenticated as the
 * account that owns these records.
 *
 * @param {string} accountId
 * @returns {Promise<import('./messageTypes').MessagingOutboxItem[]>}
 */
async function readStoredOutbox(accountId) {
  requireStorageAccount(accountId)

  const stored = await AsyncStorage.getItem(
    getStorageKey(accountId)
  )

  requireStorageAccount(accountId)

  if (stored === null) {
    return []
  }

  let items

  try {
    items = JSON.parse(stored)
  } catch {
    throw new Error(
      'Unable to read saved messaging data.'
    )
  }

  if (
    !Array.isArray(items) ||
    !items.every((item) =>
      isValidOutboxItem(
        item,
        accountId
      )
    )
  ) {
    throw new Error(
      'Saved messaging data has an invalid format.'
    )
  }

  return items
}

/**
 * Load this account's saved messages.
 *
 * @param {string} accountId
 * @returns {Promise<import('./messageTypes').MessagingOutboxItem[]>}
 */
export async function loadMessagingOutbox(
  accountId
) {
  return serializeStorageOperation(
    () => readStoredOutbox(accountId)
  )
}

/**
 * Create or update a local outbox record.
 *
 * Updating a record preserves its
 * clientRequestId, allowing safe retries.
 *
 * No backend delivery is implied.
 *
 * @param {import('./messageTypes').MessagingOutboxItem} item
 */
export async function upsertMessagingOutboxItem(
  item
) {
  const accountId = item?.accountId

  requireStorageAccount(accountId)

  if (
    !isValidOutboxItem(
      item,
      accountId
    )
  ) {
    throw new Error(
      'Cannot save an invalid messaging outbox item.'
    )
  }

  return serializeStorageOperation(
    async () => {
      const existing =
        await readStoredOutbox(accountId)

      // Never assign one retry identifier
      // to two different local messages.

      const duplicateRequest =
        existing.some(
          (savedItem) =>
            savedItem.clientRequestId ===
              item.clientRequestId &&
            savedItem.id !== item.id
        )

      if (duplicateRequest) {
        throw new Error(
          'A message with this request ID already exists.'
        )
      }

      const index =
        existing.findIndex(
          (savedItem) =>
            savedItem.id === item.id
        )

      if (index >= 0) {
        // Keep the original idempotency key
        // when updating an existing message.

        if (
          existing[index].clientRequestId !==
          item.clientRequestId
        ) {
          throw new Error(
            'A message request ID cannot change during retries.'
          )
        }

        existing[index] = item
      } else {
        existing.push(item)
      }

      requireStorageAccount(accountId)

      await AsyncStorage.setItem(
        getStorageKey(accountId),
        JSON.stringify(existing)
      )

      requireStorageAccount(accountId)

      return item
    }
  )
}

/**
 * Remove a local record.
 *
 * Callers must only remove queued messages
 * after an authoritative backend acknowledgment
 * or an explicit user deletion.
 *
 * @param {string} accountId
 * @param {string} itemId
 * @returns {Promise<boolean>}
 */
export async function removeMessagingOutboxItem(
  accountId,
  itemId
) {
  requireStorageAccount(accountId)

  if (!isNonEmptyString(itemId)) {
    throw new Error(
      'A saved message ID is required.'
    )
  }

  return serializeStorageOperation(
    async () => {
      const existing =
        await readStoredOutbox(accountId)

      const remaining =
        existing.filter(
          (item) =>
            item.id !== itemId
        )

      if (
        remaining.length ===
        existing.length
      ) {
        return false
      }

      requireStorageAccount(accountId)

      if (remaining.length === 0) {
        await AsyncStorage.removeItem(
          getStorageKey(accountId)
        )
      } else {
        await AsyncStorage.setItem(
          getStorageKey(accountId),
          JSON.stringify(remaining)
        )
      }

      requireStorageAccount(accountId)

      return true
    }
  )
}