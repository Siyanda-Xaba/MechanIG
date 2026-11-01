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
  acceptMechanicJob,
  completeMechanicJob,
  markMechanicJobArrived,
  rejectMechanicJob,
  startMechanicJob,
  startMechanicJobTrip,
} from './jobActionsService'

import {
  getMechanicJobsData,
} from './jobsService'

import {
  MECHANIC_JOB_ACTIONS,
} from './jobsTypes'

const MechanicJobsContext =
  createContext(undefined)

export function MechanicJobsProvider({
  children,
}) {
  const { user, isLoadingUser } = useUser()

  const mechanicId =
    user?.role === 'mechanic'
      ? user.id ?? null
      : null

  // Check the current account even when a previous request is still pending.
  const currentScopeRef = useRef({
    mechanicId,
    isLoadingUser,
  })

  currentScopeRef.current = {
    mechanicId,
    isLoadingUser,
  }

  // Invalidate responses from older loads and previously signed-in mechanics.
  const requestVersionRef = useRef(0)
  const actionVersionRef = useRef(0)
  const actionInFlightRef = useRef(null)

  const [jobsState, setJobsState] = useState({
    mechanicId: null,
    data: null,
    isLoading: false,
    error: null,
  })

  const [jobActionState, setJobActionState] = useState({
    mechanicId: null,
    activeJobAction: null,
    error: null,
  })

  const refreshJobs = useCallback(async () => {
    const requestVersion = ++requestVersionRef.current

    const isCurrentRequest = () =>
      requestVersion === requestVersionRef.current &&
      currentScopeRef.current.mechanicId === mechanicId &&
      currentScopeRef.current.isLoadingUser === false

    if (isLoadingUser || !mechanicId) {
      setJobsState({
        mechanicId: null,
        data: null,
        isLoading: false,
        error: null,
      })
      return false
    }

    setJobsState({
      mechanicId,
      data: null,
      isLoading: true,
      error: null,
    })

    try {
      // The backend must also verify the signed-in mechanic's identity.
      const data = await getMechanicJobsData(mechanicId)

      if (!isCurrentRequest()) {
        return false
      }

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('The jobs service returned an invalid response.')
      }

      setJobsState({
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

      setJobsState({
        mechanicId,
        data: null,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load mechanic jobs.',
      })
      return false
    }
  }, [mechanicId, isLoadingUser])

  useEffect(() => {
    // Actions and errors must not carry over to the next signed-in mechanic.
    setJobActionState({
      mechanicId,
      activeJobAction: null,
      error: null,
    })

    void refreshJobs()

    return () => {
      requestVersionRef.current += 1
      actionVersionRef.current += 1
      actionInFlightRef.current = null
    }
  }, [mechanicId, refreshJobs])

  const clearJobActionError = useCallback(() => {
    setJobActionState((current) => {
      if (current.mechanicId !== currentScopeRef.current.mechanicId) {
        return current
      }

      return { ...current, error: null }
    })
  }, [])

  const performJobAction = useCallback(
    async ({
      jobId,
      action,
      mechanicLocation = null,
    } = {}) => {
      const hasCurrentMechanic =
        Boolean(mechanicId) &&
        !isLoadingUser &&
        currentScopeRef.current.mechanicId === mechanicId &&
        currentScopeRef.current.isLoadingUser === false

      if (!hasCurrentMechanic) {
        return false
      }

      if (typeof jobId !== 'string' || !jobId.trim() || !action) {
        setJobActionState({
          mechanicId,
          activeJobAction: null,
          error: 'A valid job action is required.',
        })
        return false
      }

      // A ref locks immediately, before React processes the state update.
      // This prevents double taps from submitting competing job transitions.
      if (actionInFlightRef.current) {
        return false
      }

      const actionVersion = ++actionVersionRef.current
      const activeAction = { jobId, action }

      actionInFlightRef.current = {
        ...activeAction,
        actionVersion,
      }

      const isCurrentAction = () =>
        actionVersion === actionVersionRef.current &&
        currentScopeRef.current.mechanicId === mechanicId &&
        currentScopeRef.current.isLoadingUser === false

      setJobActionState({
        mechanicId,
        activeJobAction: activeAction,
        error: null,
      })

      try {
        // Never simulate transitions locally. Action services must receive
        // successful authorization and confirmation from the real backend.
        switch (action) {
          case MECHANIC_JOB_ACTIONS.ACCEPT:
            await acceptMechanicJob(jobId)
            break

          case MECHANIC_JOB_ACTIONS.REJECT:
            await rejectMechanicJob(jobId)
            break

          case MECHANIC_JOB_ACTIONS.START_TRIP:
            await startMechanicJobTrip({ jobId, mechanicLocation })
            break

          case MECHANIC_JOB_ACTIONS.MARK_ARRIVED:
            await markMechanicJobArrived(jobId)
            break

          case MECHANIC_JOB_ACTIONS.START_JOB:
            await startMechanicJob(jobId)
            break

          case MECHANIC_JOB_ACTIONS.COMPLETE_JOB:
            await completeMechanicJob(jobId)
            break

          default:
            throw new Error('This job action is not supported.')
        }

        if (!isCurrentAction()) {
          return false
        }

        // Reload authoritative records after a confirmed action. A refresh
        // failure is reported separately and does not undo a confirmed action.
        await refreshJobs()

        return isCurrentAction()
      } catch (error) {
        if (isCurrentAction()) {
          setJobActionState({
            mechanicId,
            activeJobAction: activeAction,
            error:
              error instanceof Error
                ? error.message
                : 'Unable to complete the job action.',
          })
        }
        return false
      } finally {
        if (actionInFlightRef.current?.actionVersion === actionVersion) {
          actionInFlightRef.current = null
        }

        if (isCurrentAction()) {
          setJobActionState((current) =>
            current.mechanicId === mechanicId
              ? { ...current, activeJobAction: null }
              : current
          )
        }
      }
    },
    [mechanicId, isLoadingUser, refreshJobs]
  )

  // Prevent a previous account's jobs or action state from reaching the UI.
  const isCurrentMechanic =
    !isLoadingUser &&
    Boolean(mechanicId) &&
    jobsState.mechanicId === mechanicId

  const jobsData = isCurrentMechanic ? jobsState.data : null

  const isLoadingJobs =
    isLoadingUser ||
    (Boolean(mechanicId) &&
      (!isCurrentMechanic || jobsState.isLoading))

  const jobsError =
    !isLoadingUser && !mechanicId
      ? 'A mechanic account is required to view jobs.'
      : isCurrentMechanic
        ? jobsState.error
        : null

  const isCurrentActionState =
    !isLoadingUser &&
    Boolean(mechanicId) &&
    jobActionState.mechanicId === mechanicId

  const activeJobAction =
    isCurrentActionState ? jobActionState.activeJobAction : null

  const jobActionError =
    isCurrentActionState ? jobActionState.error : null

  function isJobActionInProgress(jobId, action = null) {
    if (!activeJobAction || activeJobAction.jobId !== jobId) {
      return false
    }

    return !action || activeJobAction.action === action
  }

  return (
    <MechanicJobsContext.Provider
      value={{
        jobsData,
        isLoadingJobs,
        jobsError,
        refreshJobs,
        activeJobAction,
        jobActionError,
        clearJobActionError,
        performJobAction,
        isJobActionInProgress,
      }}
    >
      {children}
    </MechanicJobsContext.Provider>
  )
}

export function useMechanicJobs() {
  const context = useContext(MechanicJobsContext)

  if (!context) {
    throw new Error(
      'useMechanicJobs must be used inside MechanicJobsProvider'
    )
  }

  return context
}
