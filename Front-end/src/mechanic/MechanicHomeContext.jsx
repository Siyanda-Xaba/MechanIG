import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getMechanicHomeData,
} from './homeService'

const MechanicHomeContext =
  createContext(undefined)

export function MechanicHomeProvider({
  children,
}) {
  const [
    homeData,
    setHomeData,
  ] = useState(null)

  const [
    isLoadingHome,
    setIsLoadingHome,
  ] = useState(false)

  const [
    homeError,
    setHomeError,
  ] = useState(null)

  const refreshHomeData =
    useCallback(async () => {
      try {
        setIsLoadingHome(true)
        setHomeError(null)

        const data =
          await getMechanicHomeData()

        setHomeData(data)
      } catch {
        setHomeData(null)

        setHomeError(
          'Unable to load mechanic dashboard information.'
        )
      } finally {
        setIsLoadingHome(false)
      }
    }, [])

  useEffect(() => {
    refreshHomeData()
  }, [refreshHomeData])

  return (
    <MechanicHomeContext.Provider
      value={{
        homeData,
        isLoadingHome,
        homeError,
        refreshHomeData,
      }}
    >
      {children}
    </MechanicHomeContext.Provider>
  )
}

export function useMechanicHome() {
  const context =
    useContext(MechanicHomeContext)

  if (!context) {
    throw new Error(
      'useMechanicHome must be used inside MechanicHomeProvider'
    )
  }

  return context
}