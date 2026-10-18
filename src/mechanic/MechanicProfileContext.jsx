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
  getMechanicProfileData,
} from './profileService'

const MechanicProfileContext =
  createContext(undefined)

const emptyProfileState = {
  mechanicId: null,
  data: null,
  isLoading: false,
  error: null,
}

export function MechanicProfileProvider({
  children,
}) {
  const { user, isLoadingUser } = useUser()

  const mechanicId =
    user?.role === 'mechanic' &&
    typeof user.id === 'string' &&
    user.id.trim()
      ? user.id
      : null

  const currentScopeRef = useRef({
    mechanicId,
    isLoadingUser,
  })

  currentScopeRef.current = {
    mechanicId,
    isLoadingUser,
  }

  const requestVersionRef = useRef(0)

  const [
    profileState,
    setProfileState,
  ] = useState(emptyProfileState)

  const refreshProfileData =
    useCallback(async () => {
      const requestVersion =
        ++requestVersionRef.current

      const isCurrentRequest = () =>
        requestVersion ===
          requestVersionRef.current &&
        currentScopeRef.current.mechanicId ===
          mechanicId &&
        currentScopeRef.current.isLoadingUser ===
          false

      if (
        isLoadingUser ||
        !mechanicId
      ) {
        setProfileState({
          ...emptyProfileState,
        })

        return false
      }

      setProfileState({
        mechanicId,
        data: null,
        isLoading: true,
        error: null,
      })

      try {
        const data =
          await getMechanicProfileData(
            mechanicId
          )

        if (!isCurrentRequest()) {
          return false
        }

        // A null activity collection means its contents have
        // not been verified. An empty array means the backend
        // confirmed there is no activity.
        if (
          !data ||
          typeof data !== 'object' ||
          Array.isArray(data) ||
          !Array.isArray(data.settings) ||
          !(
            data.recentActivity === null ||
            Array.isArray(data.recentActivity)
          )
        ) {
          throw new Error(
            'The mechanic profile service returned an invalid response.'
          )
        }

        setProfileState({
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

        setProfileState({
          mechanicId,
          data: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Unable to load mechanic profile information.',
        })

        return false
      }
    }, [
      mechanicId,
      isLoadingUser,
    ])

  useEffect(() => {
    void refreshProfileData()

    return () => {
      requestVersionRef.current += 1
    }
  }, [refreshProfileData])

  const isCurrentAccount =
    !isLoadingUser &&
    mechanicId !== null &&
    profileState.mechanicId ===
      mechanicId

  const profileData =
    isCurrentAccount
      ? profileState.data
      : null

  const isLoadingProfile =
    isCurrentAccount
      ? profileState.isLoading
      : false

  const profileError =
    isCurrentAccount
      ? profileState.error
      : null

  return (
    <MechanicProfileContext.Provider
      value={{
        profileData,
        isLoadingProfile,
        profileError,
        refreshProfileData,
      }}
    >
      {children}
    </MechanicProfileContext.Provider>
  )
}

export function useMechanicProfile() {
  const context =
    useContext(
      MechanicProfileContext
    )

  if (!context) {
    throw new Error(
      'useMechanicProfile must be used inside MechanicProfileProvider'
    )
  }

  return context
}
