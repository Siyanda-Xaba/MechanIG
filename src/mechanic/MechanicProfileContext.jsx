import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useUser } from '../users/UserContext'
import {
  getMechanicProfileData,
} from './profileService'

const MechanicProfileContext =
  createContext(undefined)

export function MechanicProfileProvider({
  children,
}) {
  const { user } = useUser()

  const [
    profileData,
    setProfileData,
  ] = useState(null)

  const [
    isLoadingProfile,
    setIsLoadingProfile,
  ] = useState(false)

  const [
    profileError,
    setProfileError,
  ] = useState(null)

  const refreshProfileData =
    useCallback(async () => {
      if (!user) {
        setProfileData(null)
        setProfileError(null)
        return
      }

      try {
        setIsLoadingProfile(true)
        setProfileError(null)

        const data =
          await getMechanicProfileData(
            user.id
          )

        setProfileData(data)
      } catch {
        setProfileData(null)

        setProfileError(
          'Unable to load mechanic profile information.'
        )
      } finally {
        setIsLoadingProfile(false)
      }
    }, [user])

  useEffect(() => {
    refreshProfileData()
  }, [refreshProfileData])

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
    useContext(MechanicProfileContext)

  if (!context) {
    throw new Error(
      'useMechanicProfile must be used inside MechanicProfileProvider'
    )
  }

  return context
}