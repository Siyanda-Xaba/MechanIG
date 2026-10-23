import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  useUser,
} from '../users/UserContext'

import {
  getMechanicHomeData,
} from './homeService'

const MechanicHomeContext =
  createContext(undefined)

export function MechanicHomeProvider({
  children,
}) {
  const {
    user,
    isLoadingUser,
  } = useUser()

  /*
   * Only an authenticated user with the
   * mechanic role may own Mechanic Home data.
   *
   * The backend must independently verify
   * authentication and authorization.
   */
  const mechanicId =
    user?.role === 'mechanic'
      ? user.id ?? null
      : null

  /*
   * Track the currently authenticated
   * mechanic and authentication state.
   */
  const currentScopeRef = useRef({
    mechanicId,
    isLoadingUser,
  })

  currentScopeRef.current = {
    mechanicId,
    isLoadingUser,
  }

  /*
   * Each request receives a version number.
   *
   * An older request must never overwrite
   * data belonging to the current mechanic.
   */
  const requestVersionRef = useRef(0)

  /*
   * Store the mechanic ID alongside the
   * dashboard data so information from
   * another account cannot be exposed.
   */
  const [
    homeState,
    setHomeState,
  ] = useState({
    mechanicId: null,
    homeData: null,
    isLoading: false,
    error: null,
  })

  const refreshHomeData =
    useCallback(async () => {
      const requestVersion =
        ++requestVersionRef.current

      const isCurrentRequest = () => {
        return (
          requestVersion ===
            requestVersionRef.current &&
          currentScopeRef.current.mechanicId ===
            mechanicId &&
          currentScopeRef.current.isLoadingUser ===
            false
        )
      }

      /*
       * Never request mechanic information
       * while the user is still loading or
       * when the user is not a mechanic.
       */
      if (
        isLoadingUser ||
        !mechanicId
      ) {
        setHomeState({
          mechanicId: null,
          homeData: null,
          isLoading: false,
          error: null,
        })

        return
      }

      /*
       * Begin a new request for the current
       * authenticated mechanic.
       *
       * Previously loaded dashboard data
       * is cleared when refreshing.
       */
      setHomeState({
        mechanicId,
        homeData: null,
        isLoading: true,
        error: null,
      })

      try {
        /*
         * Supply the mechanic ID to the
         * service so future backend requests
         * can be scoped appropriately.
         *
         * The backend remains responsible
         * for verifying ownership and role.
         */
        const data =
          await getMechanicHomeData(
            mechanicId
          )

        /*
         * Ignore results from outdated
         * requests or previous accounts.
         */
        if (!isCurrentRequest()) {
          return
        }

        setHomeState({
          mechanicId,
          homeData: data,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        if (!isCurrentRequest()) {
          return
        }

        setHomeState({
          mechanicId,
          homeData: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Unable to load mechanic dashboard information.',
        })
      }
    }, [
      mechanicId,
      isLoadingUser,
    ])

  useEffect(() => {
    void refreshHomeData()

    /*
     * Invalidate pending requests when
     * the mechanic changes, authentication
     * changes, or the provider unmounts.
     */
    return () => {
      requestVersionRef.current += 1
    }
  }, [refreshHomeData])

  /*
   * Never expose dashboard information
   * associated with another mechanic.
   */
  const isCurrentMechanic =
    !isLoadingUser &&
    homeState.mechanicId === mechanicId

  const homeData =
    isCurrentMechanic
      ? homeState.homeData
      : null

  const isLoadingHome =
    isLoadingUser ||
    (
      Boolean(mechanicId) &&
      (
        !isCurrentMechanic ||
        homeState.isLoading
      )
    )

  const homeError =
    isCurrentMechanic
      ? homeState.error
      : null

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