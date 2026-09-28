import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

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
  const [
    jobsData,
    setJobsData,
  ] = useState(null)

  const [
    isLoadingJobs,
    setIsLoadingJobs,
  ] = useState(false)

  const [
    jobsError,
    setJobsError,
  ] = useState(null)

  const [
    activeJobAction,
    setActiveJobAction,
  ] = useState(null)

  const [
    jobActionError,
    setJobActionError,
  ] = useState(null)

  const refreshJobs =
    useCallback(async () => {
      try {
        setIsLoadingJobs(true)
        setJobsError(null)

        const data =
          await getMechanicJobsData()

        setJobsData(data)
      } catch {
        setJobsData(null)

        setJobsError(
          'Unable to load mechanic jobs.'
        )
      } finally {
        setIsLoadingJobs(false)
      }
    }, [])

  useEffect(() => {
    refreshJobs()
  }, [refreshJobs])

  const clearJobActionError =
    useCallback(() => {
      setJobActionError(null)
    }, [])

  const performJobAction =
    useCallback(
      async ({
        jobId,
        action,
        mechanicLocation = null,
      }) => {
        if (!jobId || !action) {
          setJobActionError(
            'A valid job action is required.'
          )

          return false
        }

        try {
          setActiveJobAction({
            jobId,
            action,
          })

          setJobActionError(null)

          switch (action) {
            case MECHANIC_JOB_ACTIONS.ACCEPT:
              await acceptMechanicJob(
                jobId
              )
              break

            case MECHANIC_JOB_ACTIONS.REJECT:
              await rejectMechanicJob(
                jobId
              )
              break

            case MECHANIC_JOB_ACTIONS.START_TRIP:
              await startMechanicJobTrip({
                jobId,
                mechanicLocation,
              })
              break

            case MECHANIC_JOB_ACTIONS.MARK_ARRIVED:
              await markMechanicJobArrived(
                jobId
              )
              break

            case MECHANIC_JOB_ACTIONS.START_JOB:
              await startMechanicJob(
                jobId
              )
              break

            case MECHANIC_JOB_ACTIONS.COMPLETE_JOB:
              await completeMechanicJob(
                jobId
              )
              break

            default:
              throw new Error(
                'This job action is not supported.'
              )
          }

          await refreshJobs()

          return true
        } catch (error) {
          setJobActionError(
            error instanceof Error
              ? error.message
              : 'Unable to complete the job action.'
          )

          return false
        } finally {
          setActiveJobAction(null)
        }
      },
      [refreshJobs]
    )

  function isJobActionInProgress(
    jobId,
    action = null
  ) {
    if (!activeJobAction) {
      return false
    }

    if (
      activeJobAction.jobId !==
      jobId
    ) {
      return false
    }

    if (
      action &&
      activeJobAction.action !==
        action
    ) {
      return false
    }

    return true
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
  const context =
    useContext(MechanicJobsContext)

  if (!context) {
    throw new Error(
      'useMechanicJobs must be used inside MechanicJobsProvider'
    )
  }

  return context
}