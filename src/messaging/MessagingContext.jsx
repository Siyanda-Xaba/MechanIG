import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import NetInfo from '@react-native-community/netinfo'
import { AppState } from 'react-native'

import {
  onAuthStateChanged,
} from 'firebase/auth'

import {
  auth,
} from '../firebase/firebase'

import {
  loadMessagingOutbox,
} from './messagingOutboxStorage'

import {
  queueMessagingText,
  retryMessagingOutboxItem,
  syncMessagingOutbox,
} from './messagingOutboxSync'

import {
  subscribeMessagingLiveUpdates,
} from './messagingLiveUpdates'

import {
  getMessagingConversations,
  getMessagingMessages,
  openMessagingConversation,
  sendTextMessage,
  markMessagingConversationRead,
  MESSAGING_SERVICE_ERRORS,
} from './messagingService'

const MessagingContext =
  createContext(undefined)

function getMessagingErrorMessage(
  error,
  fallbackMessage
) {
  if (
    error?.code ===
    MESSAGING_SERVICE_ERRORS
      .BACKEND_NOT_CONNECTED
  ) {
    return 'Messaging is not available until the MechanIQ messaging backend is connected.'
  }

  return (
    error?.message ??
    fallbackMessage
  )
}

export function MessagingProvider({
  children,
}) {
  const [
    conversationsData,
    setConversationsData,
  ] = useState(null)

  const [
    isLoadingConversations,
    setIsLoadingConversations,
  ] = useState(false)

  const [
    conversationsError,
    setConversationsError,
  ] = useState(null)

  const [
    messagesPage,
    setMessagesPage,
  ] = useState(null)

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState(null)

  const [
    isLoadingMessages,
    setIsLoadingMessages,
  ] = useState(false)

  const [
    messagesError,
    setMessagesError,
  ] = useState(null)

  const [
    isOpeningConversation,
    setIsOpeningConversation,
  ] = useState(false)

  const [
    openConversationError,
    setOpenConversationError,
  ] = useState(null)

  const [
    isSendingMessage,
    setIsSendingMessage,
  ] = useState(false)

  const [
    sendMessageError,
    setSendMessageError,
  ] = useState(null)

  const [
    isMarkingConversationRead,
    setIsMarkingConversationRead,
  ] = useState(false)

  const [
    markReadError,
    setMarkReadError,
  ] = useState(null)

  // Offline records are never treated as backend-confirmed messages.
  const [outboxItems, setOutboxItems] = useState([])
  const [isLoadingOutbox, setIsLoadingOutbox] = useState(false)
  const [outboxError, setOutboxError] = useState(null)
  const [isSyncingOutbox, setIsSyncingOutbox] = useState(false)

  const accountIdRef =
    useRef(
      auth.currentUser?.uid ?? null
    )

  const sessionVersionRef =
    useRef(0)

  const messageRequestRef =
    useRef(0)

  // Live refresh never replaces a conversation's initial load.
  // Refs keep background polling callbacks pointed at the active chat
  // without resubscribing on every screen render.
  const activeConversationIdRef = useRef(null)
  const loadedConversationIdRef = useRef(null)

  const outboxRequestRef = useRef(0)
  const outboxSyncOperationRef = useRef(0)

  const resetMessagingState =
    useCallback(() => {
      messageRequestRef.current += 1
      activeConversationIdRef.current = null
      loadedConversationIdRef.current = null
      outboxRequestRef.current += 1
      outboxSyncOperationRef.current += 1

      setOutboxItems([])
      setIsLoadingOutbox(false)
      setOutboxError(null)
      setIsSyncingOutbox(false)

      setConversationsData(null)
      setIsLoadingConversations(false)
      setConversationsError(null)

      setMessagesPage(null)
      setActiveConversationId(null)
      setIsLoadingMessages(false)
      setMessagesError(null)

      setIsOpeningConversation(false)
      setOpenConversationError(null)

      setIsSendingMessage(false)
      setSendMessageError(null)

      setIsMarkingConversationRead(false)
      setMarkReadError(null)
    }, [])

  // Restore only the currently signed-in account's local outbox.
  // Version checks prevent old account results reaching the new UI.
  const refreshOutbox = useCallback(async () => {
    const accountId = auth.currentUser?.uid ?? null
    const sessionVersion = sessionVersionRef.current
    const requestId = ++outboxRequestRef.current

    if (!accountId) {
      setOutboxItems([])
      setIsLoadingOutbox(false)
      setOutboxError(null)
      return []
    }

    try {
      setIsLoadingOutbox(true)
      setOutboxError(null)

      const items = await loadMessagingOutbox(accountId)

      if (
        sessionVersion !== sessionVersionRef.current ||
        requestId !== outboxRequestRef.current ||
        auth.currentUser?.uid !== accountId
      ) {
        return null
      }

      setOutboxItems(items)
      return items
    } catch (error) {
      if (
        sessionVersion !== sessionVersionRef.current ||
        requestId !== outboxRequestRef.current ||
        auth.currentUser?.uid !== accountId
      ) {
        return null
      }

      setOutboxError(getMessagingErrorMessage(
        error,
        'Unable to load saved messages.'
      ))
      return null
    } finally {
      if (
        sessionVersion === sessionVersionRef.current &&
        requestId === outboxRequestRef.current &&
        auth.currentUser?.uid === accountId
      ) {
        setIsLoadingOutbox(false)
      }
    }
  }, [])

  useEffect(() => {
    let isFirstAuthNotification = true

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const nextAccountId = firebaseUser?.uid ?? null
      const accountChanged = nextAccountId !== accountIdRef.current

      if (accountChanged) {
        accountIdRef.current = nextAccountId
        sessionVersionRef.current += 1
        resetMessagingState()
      }

      // Firebase restores auth asynchronously. Also load on the first
      // notification if auth.currentUser was already set at mount.
      if (accountChanged || isFirstAuthNotification) {
        isFirstAuthNotification = false
        void refreshOutbox()
      }
    })

    return () => {
      sessionVersionRef.current += 1
      outboxRequestRef.current += 1
      outboxSyncOperationRef.current += 1
      unsubscribe()
    }
  }, [refreshOutbox, resetMessagingState])

  // Persist a pending message only after an explicit Send action.
  // This operation does NOT mean the backend received the message.
  const queueMessage = useCallback(async (input) => {
    const accountId = auth.currentUser?.uid ?? null
    const sessionVersion = sessionVersionRef.current

    try {
      setOutboxError(null)
      const item = await queueMessagingText(input)

      if (
        sessionVersion !== sessionVersionRef.current ||
        auth.currentUser?.uid !== accountId
      ) {
        return null
      }

      await refreshOutbox()
      return sessionVersion === sessionVersionRef.current &&
        auth.currentUser?.uid === accountId ? item : null
    } catch (error) {
      if (
        sessionVersion === sessionVersionRef.current &&
        auth.currentUser?.uid === accountId
      ) {
        setOutboxError(getMessagingErrorMessage(
          error,
          'Unable to save the message for later.'
        ))
      }
      return null
    }
  }, [refreshOutbox])

  // Retry a specific failed/queued message with its original request ID.
  // Returns a result object, never a fabricated MessagingMessage.
  const retryOutboxMessage = useCallback(async (itemId) => {
    const accountId = auth.currentUser?.uid ?? null
    const sessionVersion = sessionVersionRef.current
    const operationId = ++outboxSyncOperationRef.current

    try {
      setIsSyncingOutbox(true)
      setOutboxError(null)
      const result = await retryMessagingOutboxItem(itemId)

      if (
        sessionVersion !== sessionVersionRef.current ||
        auth.currentUser?.uid !== accountId
      ) {
        return null
      }

      await refreshOutbox()
      return sessionVersion === sessionVersionRef.current &&
        auth.currentUser?.uid === accountId ? result : null
    } catch (error) {
      if (
        sessionVersion === sessionVersionRef.current &&
        auth.currentUser?.uid === accountId
      ) {
        setOutboxError(getMessagingErrorMessage(
          error,
          'Unable to retry the message.'
        ))
      }
      return null
    } finally {
      if (
        operationId === outboxSyncOperationRef.current &&
        sessionVersion === sessionVersionRef.current &&
        auth.currentUser?.uid === accountId
      ) {
        setIsSyncingOutbox(false)
      }
    }
  }, [refreshOutbox])

  // Used by a future network/app-resume trigger and by explicit retry UI.
  const synchronizeOutbox = useCallback(async () => {
    const accountId = auth.currentUser?.uid ?? null
    const sessionVersion = sessionVersionRef.current
    const operationId = ++outboxSyncOperationRef.current

    try {
      setIsSyncingOutbox(true)
      setOutboxError(null)
      const results = await syncMessagingOutbox()

      if (
        sessionVersion !== sessionVersionRef.current ||
        auth.currentUser?.uid !== accountId
      ) {
        return null
      }

      await refreshOutbox()
      return sessionVersion === sessionVersionRef.current &&
        auth.currentUser?.uid === accountId ? results : null
    } catch (error) {
      if (
        sessionVersion === sessionVersionRef.current &&
        auth.currentUser?.uid === accountId
      ) {
        setOutboxError(getMessagingErrorMessage(
          error,
          'Unable to synchronize saved messages.'
        ))
      }
      return null
    } finally {
      if (
        operationId === outboxSyncOperationRef.current &&
        sessionVersion === sessionVersionRef.current &&
        auth.currentUser?.uid === accountId
      ) {
        setIsSyncingOutbox(false)
      }
    }
  }, [refreshOutbox])

  // Keep queued messages synchronized while the app is open.
  // Nothing is sent automatically until a real messaging API URL is set.
  // Network presence is not delivery confirmation: only the backend can
  // acknowledge a message via the existing messaging service.
  useEffect(() => {
    if (!process.env.EXPO_PUBLIC_MESSAGING_API_URL?.trim()) {
      return undefined
    }

    let subscribed = true
    let isOnline = false
    let syncInProgress = false
    let syncAgainRequested = false

    const isNetworkAvailable = (state) =>
      state?.isConnected === true &&
      state?.isInternetReachable !== false

    const attemptAutomaticSync = async () => {
      if (
        !subscribed ||
        !isOnline ||
        AppState.currentState !== 'active' ||
        !auth.currentUser?.uid
      ) {
        return
      }

      if (syncInProgress) {
        // An account change or reconnection may happen during a request.
        // Repeat once the current operation finishes rather than racing it.
        syncAgainRequested = true
        return
      }

      syncInProgress = true

      try {
        do {
          syncAgainRequested = false
          // synchronizeOutbox already checks Firebase account changes,
          // refreshes the local outbox, and reports failures safely.
          await synchronizeOutbox()
        } while (
          subscribed &&
          syncAgainRequested &&
          isOnline &&
          AppState.currentState === 'active' &&
          auth.currentUser?.uid
        )
      } finally {
        syncInProgress = false
      }
    }

    const refreshConnectivityAndSync = () => {
      void NetInfo.fetch()
        .then((state) => {
          if (!subscribed) {
            return
          }

          isOnline = isNetworkAvailable(state)

          if (isOnline) {
            void attemptAutomaticSync()
          }
        })
        .catch(() => {
          // Do not assume connectivity when the network check fails.
          isOnline = false
        })
    }

    const unsubscribeNetwork = NetInfo.addEventListener((state) => {
      const wasOnline = isOnline
      isOnline = isNetworkAvailable(state)

      if (isOnline && !wasOnline) {
        void attemptAutomaticSync()
      }
    })

    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextState) => {
        if (nextState === 'active') {
          refreshConnectivityAndSync()
        }
      }
    )

    // Covers initial Firebase session restoration and account switches.
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser?.uid) {
        refreshConnectivityAndSync()
      }
    })

    return () => {
      subscribed = false
      unsubscribeNetwork()
      unsubscribeAuth()
      appStateSubscription.remove()
    }
  }, [synchronizeOutbox])

  const refreshConversations =
    useCallback(async () => {
      const sessionVersion =
        sessionVersionRef.current

      try {
        setIsLoadingConversations(true)
        setConversationsError(null)

        const data =
          await getMessagingConversations()

        if (
          sessionVersion !==
          sessionVersionRef.current
        ) {
          return null
        }

        setConversationsData(data)

        return data
      } catch (error) {
        if (
          sessionVersion !==
          sessionVersionRef.current
        ) {
          return null
        }

        setConversationsError(
          getMessagingErrorMessage(
            error,
            'Unable to load conversations.'
          )
        )

        return null
      } finally {
        if (
          sessionVersion ===
          sessionVersionRef.current
        ) {
          setIsLoadingConversations(false)
        }
      }
    }, [])

  const loadConversationMessages =
    useCallback(async (
      conversationId,
      options = {}
    ) => {
      const sessionVersion =
        sessionVersionRef.current

      const requestId =
        ++messageRequestRef.current

      // A new load owns the initial page. Background refreshes must not
      // populate an earlier chat or interrupt this loading state.
      activeConversationIdRef.current = conversationId
      loadedConversationIdRef.current = null

      try {
        setActiveConversationId(
          conversationId
        )

        setMessagesPage(null)
        setIsLoadingMessages(true)
        setMessagesError(null)

        const data =
          await getMessagingMessages({
            conversationId,
            cursor:
              options.cursor ?? null,
            limit:
              options.limit ?? 30,
          })

        if (
          sessionVersion !==
            sessionVersionRef.current ||
          requestId !==
            messageRequestRef.current
        ) {
          return null
        }

        loadedConversationIdRef.current = conversationId
        setMessagesPage(data)

        return data
      } catch (error) {
        if (
          sessionVersion !==
            sessionVersionRef.current ||
          requestId !==
            messageRequestRef.current
        ) {
          return null
        }

        setMessagesError(
          getMessagingErrorMessage(
            error,
            'Unable to load messages.'
          )
        )

        return null
      } finally {
        if (
          sessionVersion ===
            sessionVersionRef.current &&
          requestId ===
            messageRequestRef.current
        ) {
          setIsLoadingMessages(false)
        }
      }
    }, [])

  // Read-only foreground polling. The backend remains authoritative;
  // these callbacks never create messages or delivery acknowledgments.
  // Updates are applied silently so an open chat does not flicker into
  // a loading state every time the polling interval runs.
  useEffect(() => {
    const unsubscribe = subscribeMessagingLiveUpdates({
      getActiveConversationId: () => {
        const conversationId = activeConversationIdRef.current

        // Wait for the initial fetch before asking for live updates.
        return conversationId &&
          loadedConversationIdRef.current === conversationId
          ? conversationId
          : null
      },
      onConversations: (data) => {
        const accountId = auth.currentUser?.uid

        if (
          !accountId ||
          data.conversations.some(
            (conversation) =>
              conversation.customerUserId !== accountId &&
              conversation.mechanicUserId !== accountId
          )
        ) {
          return
        }

        setConversationsData(data)
        setConversationsError(null)
      },
      onMessages: (conversationId, latestPage) => {
        if (
          !auth.currentUser?.uid ||
          activeConversationIdRef.current !== conversationId ||
          loadedConversationIdRef.current !== conversationId
        ) {
          return
        }

        setMessagesPage((currentPage) => {
          if (
            !currentPage ||
            activeConversationIdRef.current !== conversationId ||
            loadedConversationIdRef.current !== conversationId
          ) {
            return currentPage
          }

          // Merge by authoritative message ID. Preserve any previously
          // loaded older messages and the pagination cursor while updating
          // delivery/read statuses from the latest backend records.
          const messagesById = new Map(
            currentPage.messages.map(
              (message) => [message.id, message]
            )
          )

          for (const message of latestPage.messages) {
            messagesById.set(message.id, message)
          }

          const mergedMessages = Array.from(messagesById.values())
            .sort((left, right) => {
              const leftTime = Date.parse(left.createdAt)
              const rightTime = Date.parse(right.createdAt)

              if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
                return left.id.localeCompare(right.id)
              }

              return leftTime - rightTime || left.id.localeCompare(right.id)
            })

          return {
            ...currentPage,
            messages: mergedMessages,
          }
        })

        setMessagesError(null)
      },
      onError: () => {
        // A background refresh failure must not discard previously
        // confirmed messages. Explicit screen loads retain their
        // existing loading/error/retry behavior.
      },
    })

    return unsubscribe
  }, [])

  const openConversation =
    useCallback(async (input) => {
      const sessionVersion =
        sessionVersionRef.current

      try {
        setIsOpeningConversation(true)
        setOpenConversationError(null)

        const conversation =
          await openMessagingConversation(
            input
          )

        if (
          sessionVersion !==
          sessionVersionRef.current
        ) {
          return null
        }

        return conversation
      } catch (error) {
        if (
          sessionVersion !==
          sessionVersionRef.current
        ) {
          return null
        }

        setOpenConversationError(
          getMessagingErrorMessage(
            error,
            'Unable to open the conversation.'
          )
        )

        return null
      } finally {
        if (
          sessionVersion ===
          sessionVersionRef.current
        ) {
          setIsOpeningConversation(false)
        }
      }
    }, [])

  const sendMessage =
    useCallback(async (input) => {
      const sessionVersion =
        sessionVersionRef.current

      try {
        setIsSendingMessage(true)
        setSendMessageError(null)

        const message =
          await sendTextMessage(input)

        if (
          sessionVersion !==
          sessionVersionRef.current
        ) {
          return null
        }

        // Only the backend response represents
        // a successfully sent message.
        //
        // Do not fabricate message IDs,
        // delivery states or timestamps.

        return message
      } catch (error) {
        if (
          sessionVersion !==
          sessionVersionRef.current
        ) {
          return null
        }

        setSendMessageError(
          getMessagingErrorMessage(
            error,
            'Unable to send the message.'
          )
        )

        return null
      } finally {
        if (
          sessionVersion ===
          sessionVersionRef.current
        ) {
          setIsSendingMessage(false)
        }
      }
    }, [])

  const markConversationRead =
    useCallback(async (
      conversationId
    ) => {
      const sessionVersion =
        sessionVersionRef.current

      try {
        setIsMarkingConversationRead(true)
        setMarkReadError(null)

        await markMessagingConversationRead(
          conversationId
        )

        if (
          sessionVersion !==
          sessionVersionRef.current
        ) {
          return false
        }

        // Do not change unread counts locally.
        // The backend must confirm the update.

        return true
      } catch (error) {
        if (
          sessionVersion !==
          sessionVersionRef.current
        ) {
          return false
        }

        setMarkReadError(
          getMessagingErrorMessage(
            error,
            'Unable to mark the conversation as read.'
          )
        )

        return false
      } finally {
        if (
          sessionVersion ===
          sessionVersionRef.current
        ) {
          setIsMarkingConversationRead(false)
        }
      }
    }, [])

  const clearMessagingErrors =
    useCallback(() => {
      setConversationsError(null)
      setMessagesError(null)
      setOpenConversationError(null)
      setSendMessageError(null)
      setMarkReadError(null)
      setOutboxError(null)
    }, [])

  return (
    <MessagingContext.Provider
      value={{
        outboxItems,
        isLoadingOutbox,
        isSyncingOutbox,
        outboxError,
        refreshOutbox,
        queueMessage,
        retryOutboxMessage,
        synchronizeOutbox,

        conversationsData,
        isLoadingConversations,
        conversationsError,
        refreshConversations,

        messagesPage,
        activeConversationId,
        isLoadingMessages,
        messagesError,
        loadConversationMessages,

        isOpeningConversation,
        openConversationError,
        openConversation,

        isSendingMessage,
        sendMessageError,
        sendMessage,

        isMarkingConversationRead,
        markReadError,
        markConversationRead,

        clearMessagingErrors,
        resetMessagingState,
      }}
    >
      {children}
    </MessagingContext.Provider>
  )
}

export function useMessaging() {
  const context =
    useContext(
      MessagingContext
    )

  if (!context) {
    throw new Error(
      'useMessaging must be used inside MessagingProvider'
    )
  }

  return context
}