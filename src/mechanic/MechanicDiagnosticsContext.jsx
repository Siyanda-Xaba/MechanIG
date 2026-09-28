import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

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
  const [
    diagnosticsData,
    setDiagnosticsData,
  ] = useState(null)

  const [
    isLoadingDiagnostics,
    setIsLoadingDiagnostics,
  ] = useState(false)

  const [
    diagnosticsError,
    setDiagnosticsError,
  ] = useState(null)

  const [
    activeDiagnosticAction,
    setActiveDiagnosticAction,
  ] = useState(null)

  const [
    diagnosticActionError,
    setDiagnosticActionError,
  ] = useState(null)

  const refreshDiagnostics =
    useCallback(async () => {
      try {
        setIsLoadingDiagnostics(true)
        setDiagnosticsError(null)

        const data =
          await getMechanicDiagnosticsData()

        setDiagnosticsData(data)
      } catch {
        setDiagnosticsData(null)

        setDiagnosticsError(
          'Unable to load mechanic diagnostics.'
        )
      } finally {
        setIsLoadingDiagnostics(false)
      }
    }, [])

  useEffect(() => {
    refreshDiagnostics()
  }, [refreshDiagnostics])

  const clearDiagnosticActionError =
    useCallback(() => {
      setDiagnosticActionError(null)
    }, [])

  const performDiagnosticAction =
    useCallback(
      async ({
        action,
        diagnosticId = null,
        sessionId = null,
        mode = null,
        finding = null,
        mechanicSummary = null,
      }) => {
        if (!action) {
          setDiagnosticActionError(
            'A valid diagnostic action is required.'
          )

          return null
        }

        const actionTargetId =
          sessionId ??
          diagnosticId ??
          null

        try {
          setActiveDiagnosticAction({
            action,
            targetId:
              actionTargetId,
          })

          setDiagnosticActionError(null)

          let result = null

          switch (action) {
            case MECHANIC_DIAGNOSTIC_ACTIONS.START_DIAGNOSTIC:
              result =
                await startMechanicDiagnosticSession({
                  diagnosticId,
                  mode,
                })
              break

            case MECHANIC_DIAGNOSTIC_ACTIONS.ADD_FINDING:
              result =
                await addMechanicDiagnosticFinding({
                  sessionId,
                  title:
                    finding?.title ??
                    '',
                  description:
                    finding?.description ??
                    null,
                  severity:
                    finding?.severity ??
                    null,
                })
              break

            case MECHANIC_DIAGNOSTIC_ACTIONS.COMPLETE_DIAGNOSTIC:
              result =
                await completeMechanicDiagnosticSession({
                  sessionId,
                  mechanicSummary:
                    mechanicSummary ??
                    '',
                })
              break

            case MECHANIC_DIAGNOSTIC_ACTIONS.CONNECT_OBD:
              throw new Error(
                'OBD connection is not available yet. Real OBD data must come from the dedicated vehicle/OBD connection layer.'
              )

            default:
              throw new Error(
                'This diagnostic action is not supported.'
              )
          }

          await refreshDiagnostics()

          return result
        } catch (error) {
          setDiagnosticActionError(
            error instanceof Error
              ? error.message
              : 'Unable to complete the diagnostic action.'
          )

          return null
        } finally {
          setActiveDiagnosticAction(null)
        }
      },
      [refreshDiagnostics]
    )

  function isDiagnosticActionInProgress(
    targetId,
    action = null
  ) {
    if (!activeDiagnosticAction) {
      return false
    }

    if (
      targetId &&
      activeDiagnosticAction.targetId !==
        targetId
    ) {
      return false
    }

    if (
      action &&
      activeDiagnosticAction.action !==
        action
    ) {
      return false
    }

    return true
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
  const context =
    useContext(
      MechanicDiagnosticsContext
    )

  if (!context) {
    throw new Error(
      'useMechanicDiagnostics must be used inside MechanicDiagnosticsProvider'
    )
  }

  return context
}