import {
  useCallback,
  useState,
} from 'react'

import {
  updateCustomerNotificationPreferences,
} from './customerNotificationPreferenceService'
import type {
  CustomerNotificationPreferences,
  UpdateCustomerNotificationPreferencesInput,
} from './customerNotificationPreferenceTypes'

type UseUpdateCustomerNotificationPreferencesReturn = {
  isUpdatingNotificationPreferences: boolean

  updateNotificationPreferencesError: string | null

  updateNotificationPreferences: (
    input: UpdateCustomerNotificationPreferencesInput
  ) => Promise<CustomerNotificationPreferences | null>

  clearUpdateNotificationPreferencesError: () => void
}

export function useUpdateCustomerNotificationPreferences():
  UseUpdateCustomerNotificationPreferencesReturn {
  const [
    isUpdatingNotificationPreferences,
    setIsUpdatingNotificationPreferences,
  ] = useState(false)

  const [
    updateNotificationPreferencesError,
    setUpdateNotificationPreferencesError,
  ] = useState<string | null>(null)

  const updateNotificationPreferences =
    useCallback(
      async (
        input: UpdateCustomerNotificationPreferencesInput
      ) => {
        try {
          setIsUpdatingNotificationPreferences(true)
          setUpdateNotificationPreferencesError(null)

          const savedPreferences =
            await updateCustomerNotificationPreferences(
              input
            )

          return savedPreferences
        } catch (error) {
          setUpdateNotificationPreferencesError(
            error instanceof Error
              ? error.message
              : 'Unable to save notification preferences.'
          )

          return null
        } finally {
          setIsUpdatingNotificationPreferences(false)
        }
      },
      []
    )

  const clearUpdateNotificationPreferencesError =
    useCallback(() => {
      setUpdateNotificationPreferencesError(null)
    }, [])

  return {
    isUpdatingNotificationPreferences,
    updateNotificationPreferencesError,
    updateNotificationPreferences,
    clearUpdateNotificationPreferencesError,
  }
}