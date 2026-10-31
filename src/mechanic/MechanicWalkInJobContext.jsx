import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

import {
  createMechanicWalkInJob,
  WALK_IN_JOB_SERVICE_ERRORS,
} from './walkInJobService'

const MechanicWalkInJobContext =
  createContext(undefined)

export function MechanicWalkInJobProvider({
  children,
}) {
  const [
    createdWalkInJob,
    setCreatedWalkInJob,
  ] = useState(null)

  const [
    isCreatingWalkInJob,
    setIsCreatingWalkInJob,
  ] = useState(false)

  const [
    walkInJobError,
    setWalkInJobError,
  ] = useState(null)

  const createWalkInJob =
    useCallback(async (input) => {
      try {
        setIsCreatingWalkInJob(true)
        setWalkInJobError(null)

        const job =
          await createMechanicWalkInJob(
            input
          )

        setCreatedWalkInJob(job)

        return job
      } catch (error) {
        setCreatedWalkInJob(null)

        if (
          error?.code ===
          WALK_IN_JOB_SERVICE_ERRORS
            .PERSISTENCE_NOT_CONNECTED
        ) {
          setWalkInJobError(
            'Walk-in job creation is not available until the MechanIQ job backend is connected.'
          )
        } else {
          setWalkInJobError(
            error?.message ??
              'Unable to create the walk-in job.'
          )
        }

        return null
      } finally {
        setIsCreatingWalkInJob(false)
      }
    }, [])

  const clearWalkInJobError =
    useCallback(() => {
      setWalkInJobError(null)
    }, [])

  const resetWalkInJob =
    useCallback(() => {
      setCreatedWalkInJob(null)
      setWalkInJobError(null)
    }, [])

  return (
    <MechanicWalkInJobContext.Provider
      value={{
        createdWalkInJob,
        isCreatingWalkInJob,
        walkInJobError,
        createWalkInJob,
        clearWalkInJobError,
        resetWalkInJob,
      }}
    >
      {children}
    </MechanicWalkInJobContext.Provider>
  )
}

export function useMechanicWalkInJob() {
  const context =
    useContext(
      MechanicWalkInJobContext
    )

  if (!context) {
    throw new Error(
      'useMechanicWalkInJob must be used inside MechanicWalkInJobProvider'
    )
  }

  return context
}