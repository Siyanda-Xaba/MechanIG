import NetInfo from '@react-native-community/netinfo'
import { AppState } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../firebase/firebase'

import {
  getMessagingConversations,
  getMessagingMessages,
} from './messagingService'

/**
 * MechanIQ Messaging Live Updates
 *
 * Shared foreground message-refresh mechanism
 * for Customer and Mechanic messaging.
 *
 * Uses authoritative backend data only.
 *
 * No fake messages, unread counts or delivery
 * confirmations are generated.
 *
 * The transport can later be replaced by
 * backend push events without changing the
 * Customer or Mechanic chat screens.
 */

const DEFAULT_REFRESH_INTERVAL = 15000
const MAX_RETRY_INTERVAL = 120000

function isNetworkAvailable(state) {
  return (
    state?.isConnected === true &&
    state?.isInternetReachable !== false
  )
}

/**
 * Subscribe to authenticated messaging updates.
 *
 * Only runs when:
 * - the messaging backend URL is configured
 * - the user is authenticated
 * - internet connectivity is available
 * - the application is in the foreground
 *
 * @param {{
 *   getActiveConversationId?: () => string | null,
 *   onConversations?: (data: import('./messageTypes').MessagingConversationsData) => void,
 *   onMessages?: (
 *     conversationId: string,
 *     data: import('./messageTypes').MessagingMessagesPage
 *   ) => void,
 *   onError?: (error: unknown) => void,
 *   refreshInterval?: number
 * }} options
 *
 * @returns {() => void}
 */
export function subscribeMessagingLiveUpdates(
  options = {}
) {
  if (
    !process.env.EXPO_PUBLIC_MESSAGING_API_URL
      ?.trim()
  ) {
    return () => {}
  }

  const {
    getActiveConversationId = () => null,
    onConversations,
    onMessages,
    onError,
  } = options

  const refreshInterval =
    Number.isInteger(options.refreshInterval) &&
    options.refreshInterval >= 5000
      ? options.refreshInterval
      : DEFAULT_REFRESH_INTERVAL

  let disposed = false
  let isOnline = false
  let isPolling = false
  let pollAgain = false
  let timer = null
  let failedAttempts = 0

  function clearPollTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function isReady() {
    return (
      !disposed &&
      isOnline &&
      AppState.currentState === 'active' &&
      Boolean(auth.currentUser?.uid)
    )
  }

  function schedulePoll(delay = 0) {
    clearPollTimer()

    if (!isReady()) {
      return
    }

    timer = setTimeout(() => {
      timer = null
      void pollMessaging()
    }, delay)
  }

  function requestImmediatePoll() {
    if (!isReady()) {
      return
    }

    if (isPolling) {
      pollAgain = true
      return
    }

    schedulePoll(0)
  }

  async function pollMessaging() {
    if (!isReady()) {
      return
    }

    if (isPolling) {
      pollAgain = true
      return
    }

    const accountId =
      auth.currentUser?.uid

    if (!accountId) {
      return
    }

    isPolling = true

    let nextInterval = refreshInterval

    try {
      /**
       * Fetch authoritative conversations
       * and unread counts.
       */

      const conversations =
        await getMessagingConversations()

      if (
        disposed ||
        auth.currentUser?.uid !== accountId
      ) {
        return
      }

      onConversations?.(conversations)

      /**
       * Refresh the active conversation only.
       *
       * The context will decide which
       * conversation is currently visible.
       */

      const conversationId =
        getActiveConversationId()

      if (conversationId) {
        const messages =
          await getMessagingMessages({
            conversationId,
            limit: 30,
          })

        if (
          disposed ||
          auth.currentUser?.uid !== accountId ||
          getActiveConversationId() !==
            conversationId
        ) {
          return
        }

        onMessages?.(
          conversationId,
          messages
        )
      }

      failedAttempts = 0
    } catch (error) {
      if (
        !disposed &&
        auth.currentUser?.uid === accountId
      ) {
        failedAttempts += 1

        nextInterval = Math.min(
          refreshInterval *
            Math.pow(
              2,
              Math.min(failedAttempts, 3)
            ),
          MAX_RETRY_INTERVAL
        )

        onError?.(error)
      }
    } finally {
      isPolling = false

      if (isReady()) {
        if (pollAgain) {
          pollAgain = false
          schedulePoll(0)
        } else {
          schedulePoll(nextInterval)
        }
      }
    }
  }

  /**
   * Recheck connectivity when the app
   * returns to the foreground.
   */

  function refreshNetworkState() {
    void NetInfo.fetch()
      .then((state) => {
        if (disposed) {
          return
        }

        isOnline =
          isNetworkAvailable(state)

        if (isOnline) {
          failedAttempts = 0
          requestImmediatePoll()
        } else {
          clearPollTimer()
        }
      })
      .catch(() => {
        isOnline = false
        clearPollTimer()
      })
  }

  /**
   * Listen for connectivity changes.
   */

  const unsubscribeNetwork =
    NetInfo.addEventListener((state) => {
      if (disposed) {
        return
      }

      const wasOnline = isOnline

      isOnline =
        isNetworkAvailable(state)

      if (!isOnline) {
        clearPollTimer()
        return
      }

      if (!wasOnline) {
        failedAttempts = 0
        requestImmediatePoll()
      }
    })

  /**
   * Pause background polling.
   */

  const appStateSubscription =
    AppState.addEventListener(
      'change',
      (nextState) => {
        if (nextState === 'active') {
          refreshNetworkState()
        } else {
          clearPollTimer()
        }
      }
    )

  /**
   * Prevent stale account updates.
   */

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      () => {
        failedAttempts = 0
        requestImmediatePoll()
      }
    )

  refreshNetworkState()

  /**
   * Unsubscribe from all listeners.
   */

  return () => {
    disposed = true
    clearPollTimer()

    unsubscribeNetwork()
    unsubscribeAuth()
    appStateSubscription.remove()
  }
}