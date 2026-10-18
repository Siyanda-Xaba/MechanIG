import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useUser } from '../users/UserContext'

import {
  addMechanicDiagnosticFinding,
  completeMechanicDiagnosticSession,
  getMechanicDiagnosticsData,
  startMechanicDiagnosticSession,
} from './diagnosticsService'

import {
  MECHANIC_DIAGNOSTIC_ACTIONS,
} from './diagnosticsTypes'

const MechanicDiagnosticsContext =
  createContext(undefined)

export function MechanicDiagnosticsProvider({
  children,
}) {
  const { user, isLoadingUser } = useUser()

  const mechanicId =
    user?.role === 'mechanic'
      ? user.id ?? null
      : null

  // Check account identity during render as well as after asynchronous work.
  const currentScopeRef = useRef({
    mechanicId,
    isLoadingUser,
  })

  currentScopeRef.current = {
    mechanicId,
    isLoadingUser,
  }

  // Invalidate older loads/actions on account changes and unmount.
  const requestVersionRef = useRef(0)
  const actionVersionRef = useRef(0)

  // A synchronous lock prevents rapid taps from submitting two actions.
  const actionInFlightRef = useRef(null)

  const [diagnosticsState, setDiagnosticsState] = useState({
    mechanicId: null,
    data: null,
    isLoading: false,
    error: null,
  })

  const [diagnosticActionState, setDiagnosticActionState] = useState({
    mechanicId: null,
    activeDiagnosticAction: null,
    error: null,
  })

  const refreshDiagnostics = useCallback(async () => {
    const requestVersion = ++requestVersionRef.current

    const isCurrentRequest = () =>
      requestVersion === requestVersionRef.current &&
      currentScopeRef.current.mechanicId === mechanicId &&
      currentScopeRef.current.isLoadingUser === false

    if (isLoadingUser || !mechanicId) {
      setDiagnosticsState({
        mechanicId: null,
        data: null,
        isLoading: false,
        error: null,
      })
      return false
    }

    setDiagnosticsState({
      mechanicId,
      data: null,
      isLoading: true,
      error: null,
    })

    try {
      // The backend must independently verify the requesting mechanic.
      const data = await getMechanicDiagnosticsData(mechanicId)

      if (!isCurrentRequest()) {
        return false
      }

      // Reject malformed responses rather than presenting unknown data as
      // a successful empty diagnostic list.
      if (
        !data ||
        !Array.isArray(data.diagnostics) ||
        !Number.isInteger(data.totalPendingReview) ||
        !Number.isInteger(data.totalInReview) ||
        !Number.isInteger(data.totalCompleted) ||
        data.totalPendingReview < 0 ||
        data.totalInReview < 0 ||
        data.totalCompleted < 0
      ) {
        throw new Error(
          'The mechanic diagnostics service returned an invalid response.'
        )
      }

      setDiagnosticsState({
        mechanicId,
        data,
        isLoading: false,
        error: null,
      })
      return true
    } catch (error) {
      if (!isCurrentRequest()) {
        return false
      }

      setDiagnosticsState({
        mechanicId,
        data: null,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load mechanic diagnostics.',
      })
      return false
    }
  }, [mechanicId, isLoadingUser])

  useEffect(() => {
    // Clear pending action state and errors when the mechanic changes.
    setDiagnosticActionState({
      mechanicId,
      activeDiagnosticAction: null,
      error: null,
    })

    void refreshDiagnostics()

    return () => {
      requestVersionRef.current += 1
      actionVersionRef.current += 1
      actionInFlightRef.current = null
    }
  }, [mechanicId, refreshDiagnostics])

  const clearDiagnosticActionError = useCallback(() => {
    setDiagnosticActionState((current) => {
      if (current.mechanicId !== currentScopeRef.current.mechanicId) {
        return current
      }

      return {
        ...current,
        error: null,
      }
    })
  }, [])

  const performDiagnosticAction = useCallback(
    async ({
      action,
      diagnosticId = null,
      sessionId = null,
      mode = null,
      finding = null,
      mechanicSummary = null,
    } = {}) => {
      const hasCurrentMechanic =
        Boolean(mechanicId) &&
        !isLoadingUser &&
        currentScopeRef.current.mechanicId === mechanicId &&
        currentScopeRef.current.isLoadingUser === false

      if (!hasCurrentMechanic) {
        return null
      }

      if (!action) {
        setDiagnosticActionState({
          mechanicId,
          activeDiagnosticAction: null,
          error: 'A valid diagnostic action is required.',
        })
        return null
      }

      // Lock immediately, before React commits the state update. Prevent
      // duplicate submissions and conflicting diagnostic transitions.
      if (actionInFlightRef.current) {
        return null
      }

      const actionVersion = ++actionVersionRef.current
      const targetId = sessionId ?? diagnosticId ?? null
      const activeAction = { action, targetId }

      actionInFlightRef.current = {
        actionVersion,
        ...activeAction,
      }

      const isCurrentAction = () =>
        actionVersion === actionVersionRef.current &&
        currentScopeRef.current.mechanicId === mechanicId &&
        currentScopeRef.current.isLoadingUser === false

      setDiagnosticActionState({
        mechanicId,
        activeDiagnosticAction: activeAction,
        error: null,
      })

      try {
        let result = null

        switch (action) {
          case MECHANIC_DIAGNOSTIC_ACTIONS.START_DIAGNOSTIC:
            result = await startMechanicDiagnosticSession({
              diagnosticId,
              mode,
            })
            break

          case MECHANIC_DIAGNOSTIC_ACTIONS.ADD_FINDING:
            result = await addMechanicDiagnosticFinding({
              sessionId,
              title: finding?.title ?? '',
              description: finding?.description ?? null,
              severity: finding?.severity ?? null,
            })
            break

          case MECHANIC_DIAGNOSTIC_ACTIONS.COMPLETE_DIAGNOSTIC:
            result = await completeMechanicDiagnosticSession({
              sessionId,
              mechanicSummary: mechanicSummary ?? '',
            })
            break

          case MECHANIC_DIAGNOSTIC_ACTIONS.CONNECT_OBD:
            throw new Error(
              'OBD connection is not available yet. Real OBD data must come from the dedicated vehicle/OBD connection layer.'
            )

          default:
            throw new Error('This diagnostic action is not supported.')
        }

        if (!isCurrentAction()) {
          return null
        }

        // Only refresh after the action service confirms success. Do not
        // fabricate sessions, findings, OBD readings, or completion locally.
        // A refresh error remains separate from a confirmed action result.
        await refreshDiagnostics()

        return isCurrentAction() ? result : null
      } catch (error) {
        if (isCurrentAction()) {
          setDiagnosticActionState({
            mechanicId,
            activeDiagnosticAction: activeAction,
            error:
              error instanceof Error
                ? error.message
                : 'Unable to complete the diagnostic action.',
          })
        }
        return null
      } finally {
        if (actionInFlightRef.current?.actionVersion === actionVersion) {
          actionInFlightRef.current = null
        }

        if (isCurrentAction()) {
          setDiagnosticActionState((current) =>
            current.mechanicId === mechanicId
              ? { ...current, activeDiagnosticAction: null }
              : current
          )
        }
      }
    },
    [mechanicId, isLoadingUser, refreshDiagnostics]
  )

  // Never expose diagnostics or actions belonging to another account.
  const isCurrentMechanic =
    !isLoadingUser &&
    Boolean(mechanicId) &&
    diagnosticsState.mechanicId === mechanicId

  const diagnosticsData = isCurrentMechanic
    ? diagnosticsState.data
    : null

  const isLoadingDiagnostics =
    isLoadingUser ||
    (Boolean(mechanicId) &&
      (!isCurrentMechanic || diagnosticsState.isLoading))

  const diagnosticsError =
    !isLoadingUser && !mechanicId
      ? 'A mechanic account is required to view diagnostics.'
      : isCurrentMechanic
        ? diagnosticsState.error
        : null

  const isCurrentActionState =
    !isLoadingUser &&
    Boolean(mechanicId) &&
    diagnosticActionState.mechanicId === mechanicId

  const activeDiagnosticAction = isCurrentActionState
    ? diagnosticActionState.activeDiagnosticAction
    : null

  const diagnosticActionError = isCurrentActionState
    ? diagnosticActionState.error
    : null

  function isDiagnosticActionInProgress(targetId, action = null) {
    if (!activeDiagnosticAction) {
      return false
    }

    if (targetId && activeDiagnosticAction.targetId !== targetId) {
      return false
    }

    return !action || activeDiagnosticAction.action === action
  }

  return (
    <MechanicDiagnosticsContext.Provider
      value={{
        diagnosticsData,
        isLoadingDiagnostics,
        diagnosticsError,
        refreshDiagnostics,
        activeDiagnosticAction,
        diagnosticActionError,
        clearDiagnosticActionError,
        performDiagnosticAction,
        isDiagnosticActionInProgress,
      }}
    >
      {children}
    </MechanicDiagnosticsContext.Provider>
  )
}

export function useMechanicDiagnostics() {
  const context = useContext(MechanicDiagnosticsContext)

  if (!context) {
    throw new Error(
      'useMechanicDiagnostics must be used inside MechanicDiagnosticsProvider'
    )
  }

  return context
}
