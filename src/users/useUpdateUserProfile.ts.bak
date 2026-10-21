import {
  useCallback,
  useState,
} from 'react'

import type {
  UpdateUserProfileInput,
  UserProfile,
} from './types'
import { useUser } from './UserContext'
import { updateCurrentUserProfile } from './userService'

type UseUpdateUserProfileReturn = {
  isUpdatingProfile: boolean
  updateProfileError: string | null

  updateProfile: (
    input: UpdateUserProfileInput
  ) => Promise<UserProfile | null>

  clearUpdateProfileError: () => void
}

export function useUpdateUserProfile():
  UseUpdateUserProfileReturn {
  const { setUser } = useUser()

  const [
    isUpdatingProfile,
    setIsUpdatingProfile,
  ] = useState(false)

  const [
    updateProfileError,
    setUpdateProfileError,
  ] = useState<string | null>(null)

  const updateProfile =
    useCallback(
      async (
        input: UpdateUserProfileInput
      ) => {
        try {
          setIsUpdatingProfile(true)
          setUpdateProfileError(null)

          const savedUser =
            await updateCurrentUserProfile(
              input
            )

          setUser(savedUser)

          return savedUser
        } catch (error) {
          setUpdateProfileError(
            error instanceof Error
              ? error.message
              : 'Unable to update your profile.'
          )

          return null
        } finally {
          setIsUpdatingProfile(false)
        }
      },
      [setUser]
    )

  const clearUpdateProfileError =
    useCallback(() => {
      setUpdateProfileError(null)
    }, [])

  return {
    isUpdatingProfile,
    updateProfileError,
    updateProfile,
    clearUpdateProfileError,
  }
}