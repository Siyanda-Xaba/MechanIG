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

const ConnectivityContext = createContext(null)

function getConnectivityStatus(state) {
  if (
    state?.isConnected === false ||
    state?.isInternetReachable === false
  ) {
    return 'offline'
  }

  if (
    state?.isConnected === true &&
    state?.isInternetReachable === true
  ) {
    return 'online'
  }

  return 'unknown'
}

export function ConnectivityProvider({ children }) {
  const [status, setStatus] = useState('unknown')

  const [
    isCheckingConnectivity,
    setIsCheckingConnectivity,
  ] = useState(true)

  const [
    connectivityError,
    setConnectivityError,
  ] = useState(null)

  const [lastCheckedAt, setLastCheckedAt] = useState(null)

  const mountedRef = useRef(false)
  const revisionRef = useRef(0)

  const applyNetworkState = useCallback((state) => {
    if (!mountedRef.current) {
      return
    }

    revisionRef.current += 1

    setStatus(getConnectivityStatus(state))
    setConnectivityError(null)
    setIsCheckingConnectivity(false)
    setLastCheckedAt(new Date().toISOString())
  }, [])

  const refreshConnectivity = useCallback(async () => {
    if (!mountedRef.current) {
      return 'unknown'
    }

    const revision = ++revisionRef.current

    setIsCheckingConnectivity(true)

    try {
      const state = await NetInfo.fetch()

      if (
        !mountedRef.current ||
        revision !== revisionRef.current
      ) {
        return null
      }

      const nextStatus = getConnectivityStatus(state)

      setStatus(nextStatus)
      setConnectivityError(null)
      setLastCheckedAt(new Date().toISOString())

      return nextStatus
    } catch {
      if (
        !mountedRef.current ||
        revision !== revisionRef.current
      ) {
        return null
      }

      setStatus('unknown')
      setConnectivityError(
        'Unable to determine network connectivity.'
      )

      return 'unknown'
    } finally {
      if (
        mountedRef.current &&
        revision === revisionRef.current
      ) {
        setIsCheckingConnectivity(false)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true

    const unsubscribeNetwork =
      NetInfo.addEventListener(applyNetworkState)

    void refreshConnectivity()

    const appStateSubscription =
      AppState.addEventListener(
        'change',
        (nextState) => {
          if (nextState === 'active') {
            void refreshConnectivity()
          }
        }
      )

    return () => {
      mountedRef.current = false
      revisionRef.current += 1

      unsubscribeNetwork()
      appStateSubscription.remove()
    }
  }, [applyNetworkState, refreshConnectivity])

  return (
    <ConnectivityContext.Provider
      value={{
        status,
        isOnline: status === 'online',
        isOffline: status === 'offline',
        isCheckingConnectivity,
        connectivityError,
        lastCheckedAt,
        refreshConnectivity,
      }}
    >
      {children}
    </ConnectivityContext.Provider>
  )
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext)

  if (!context) {
    throw new Error(
      'useConnectivity must be used inside ConnectivityProvider.'
    )
  }

  return context
}