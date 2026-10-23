import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useUser } from '../users/UserContext'
import { CustomerProfileData } from './customerProfileTypes'
import { getCustomerProfileData } from './customerProfileService'

type CustomerProfileContextType = {
  profileData: CustomerProfileData | null
  isLoadingProfile: boolean
  profileError: string | null
  refreshProfileData: () => Promise<void>
}

const CustomerProfileContext =
  createContext<CustomerProfileContextType | undefined>(
    undefined
  )

export function CustomerProfileProvider({
  children,
}: {
  children: ReactNode
}) {
  const { user } = useUser()

  const [profileData, setProfileData] =
    useState<CustomerProfileData | null>(null)

  const [isLoadingProfile, setIsLoadingProfile] =
    useState(false)

  const [profileError, setProfileError] =
    useState<string | null>(null)

  const refreshProfileData = useCallback(async () => {
    if (!user) {
      setProfileData(null)
      setProfileError(null)
      return
    }

    try {
      setIsLoadingProfile(true)
      setProfileError(null)

      const data = await getCustomerProfileData(
        user.id
      )

      setProfileData(data)
    } catch {
      setProfileData(null)
      setProfileError(
        'Unable to load profile information.'
      )
    } finally {
      setIsLoadingProfile(false)
    }
  }, [user])

  useEffect(() => {
    refreshProfileData()
  }, [refreshProfileData])

  return (
    <CustomerProfileContext.Provider
      value={{
        profileData,
        isLoadingProfile,
        profileError,
        refreshProfileData,
      }}
    >
      {children}
    </CustomerProfileContext.Provider>
  )
}

export function useCustomerProfile() {
  const context = useContext(
    CustomerProfileContext
  )

  if (!context) {
    throw new Error(
      'useCustomerProfile must be used inside CustomerProfileProvider'
    )
  }

  return context
}