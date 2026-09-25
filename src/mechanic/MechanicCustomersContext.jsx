import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getMechanicCustomersData,
} from './customersService'

const MechanicCustomersContext =
  createContext(undefined)

export function MechanicCustomersProvider({
  children,
}) {
  const [
    customersData,
    setCustomersData,
  ] = useState(null)

  const [
    isLoadingCustomers,
    setIsLoadingCustomers,
  ] = useState(false)

  const [
    customersError,
    setCustomersError,
  ] = useState(null)

  const refreshCustomers =
    useCallback(async () => {
      try {
        setIsLoadingCustomers(true)
        setCustomersError(null)

        const data =
          await getMechanicCustomersData()

        setCustomersData(data)
      } catch {
        setCustomersData(null)

        setCustomersError(
          'Unable to load mechanic customers.'
        )
      } finally {
        setIsLoadingCustomers(false)
      }
    }, [])

  useEffect(() => {
    refreshCustomers()
  }, [refreshCustomers])

  return (
    <MechanicCustomersContext.Provider
      value={{
        customersData,
        isLoadingCustomers,
        customersError,
        refreshCustomers,
      }}
    >
      {children}
    </MechanicCustomersContext.Provider>
  )
}

export function useMechanicCustomers() {
  const context =
    useContext(MechanicCustomersContext)

  if (!context) {
    throw new Error(
      'useMechanicCustomers must be used inside MechanicCustomersProvider'
    )
  }

  return context
}