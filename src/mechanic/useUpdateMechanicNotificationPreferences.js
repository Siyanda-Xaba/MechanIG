import {
  useCallback,
  useState,
} from 'react'

import {
  updateMechanicNotificationPreferences,
} from './mechanicNotificationPreferenceService'

export function useUpdateMechanicNotificationPreferences() {
  const [
    isUpdatingNotificationPreferences,
    setIsUpdatingNotificationPreferences,
  ] = useState(false)

  const [
    updateNotificationPreferencesError,
    setUpdateNotificationPreferencesError,
  ] = useState(null)

  const updateNotificationPreferences =
    useCallback(async (input) => {
      try {
        setIsUpdatingNotificationPreferences(
          true
        )

        setUpdateNotificationPreferencesError(
          null
        )

        const savedPreferences =
          await updateMechanicNotificationPreferences(
            input
          )

        return savedPreferences
      } catch (error) {
        setUpdateNotificationPreferencesError(
          error instanceof Error
            ? error.message
            : 'Unable to save mechanic notification preferences.'
        )

        return null
      } finally {
        setIsUpdatingNotificationPreferences(
          false
        )
      }
    }, [])

  const clearUpdateNotificationPreferencesError =
    useCallback(() => {
      setUpdateNotificationPreferencesError(
        null
      )
    }, [])

  return {
    isUpdatingNotificationPreferences,
    updateNotificationPreferencesError,
    updateNotificationPreferences,
    clearUpdateNotificationPreferencesError,
  }
}