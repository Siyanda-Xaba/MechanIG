import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getMechanicJobsData,
} from './jobsService'

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

  return (
    <MechanicJobsContext.Provider
      value={{
        jobsData,
        isLoadingJobs,
        jobsError,
        refreshJobs,
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