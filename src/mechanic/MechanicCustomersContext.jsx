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
  getMechanicCustomersData,
} from './customersService'

const MechanicCustomersContext =
  createContext(undefined)

const emptyCustomersState = {
  mechanicId: null,
  data: null,
  isLoading: false,
  error: null,
}

export function MechanicCustomersProvider({
  children,
}) {
  const { user, isLoadingUser } = useUser()

  const mechanicId =
    user?.role === 'mechanic' &&
    typeof user.id === 'string' &&
    user.id.trim()
      ? user.id
      : null

  // Compare requests against the currently rendered account, not only
  // the account captured when an asynchronous request began.
  const currentScopeRef = useRef({
    mechanicId,
    isLoadingUser,
  })

  currentScopeRef.current = {
    mechanicId,
    isLoadingUser,
  }

  const requestVersionRef = useRef(0)

  const [customersState, setCustomersState] =
    useState(emptyCustomersState)

  const refreshCustomers = useCallback(async () => {
    const requestVersion = ++requestVersionRef.current

    const isCurrentRequest = () =>
      requestVersion === requestVersionRef.current &&
      currentScopeRef.current.mechanicId === mechanicId &&
      currentScopeRef.current.isLoadingUser === false

    if (isLoadingUser || !mechanicId) {
      setCustomersState({ ...emptyCustomersState })
      return false
    }

    setCustomersState({
      mechanicId,
      data: null,
      isLoading: true,
      error: null,
    })

    try {
      // The backend must also verify the authenticated mechanic's
      // access to every customer, vehicle, booking and job record.
      const data = await getMechanicCustomersData(mechanicId)

      if (!isCurrentRequest()) {
        return false
      }

      const countFields = [
        'totalCustomers',
        'activeCustomers',
        'customersWithOpenJobs',
        'upcomingBookings',
      ]

      if (
        !data ||
        typeof data !== 'object' ||
        Array.isArray(data) ||
        !Array.isArray(data.customers) ||
        !countFields.every(
          (field) =>
            Number.isInteger(data[field]) &&
            data[field] >= 0
        )
      ) {
        throw new Error(
          'The mechanic customers service returned an invalid response.'
        )
      }

      setCustomersState({
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

      setCustomersState({
        mechanicId,
        data: null,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load mechanic customers.',
      })
      return false
    }
  }, [mechanicId, isLoadingUser])

  useEffect(() => {
    void refreshCustomers()

    return () => {
      // Prevent an earlier account's request from restoring its data.
      requestVersionRef.current += 1
    }
  }, [refreshCustomers])

  // Hide previous-account state immediately during a role/account change,
  // even before the effect that reloads the new account has run.
  const isCurrentState =
    !isLoadingUser &&
    Boolean(mechanicId) &&
    customersState.mechanicId === mechanicId

  const customersData = isCurrentState
    ? customersState.data
    : null

  const isLoadingCustomers =
    isLoadingUser ||
    (Boolean(mechanicId) &&
      (!isCurrentState || customersState.isLoading))

  const customersError = isLoadingUser
    ? null
    : !mechanicId
      ? 'Sign in with a mechanic account to view customers.'
      : isCurrentState
        ? customersState.error
        : null

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
  const context = useContext(MechanicCustomersContext)

  if (!context) {
    throw new Error(
      'useMechanicCustomers must be used inside MechanicCustomersProvider'
    )
  }

  return context
}
