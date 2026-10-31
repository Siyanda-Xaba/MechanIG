import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getMechanicNotificationPreferences,
} from './mechanicNotificationPreferenceService'

export function useMechanicNotificationPreferences(
  mechanicId
) {
  const [
    notificationPreferences,
    setNotificationPreferences,
  ] = useState(null)

  const [
    isLoadingNotificationPreferences,
    setIsLoadingNotificationPreferences,
  ] = useState(false)

  const [
    notificationPreferencesError,
    setNotificationPreferencesError,
  ] = useState(null)

  const refreshNotificationPreferences =
    useCallback(async () => {
      if (!mechanicId) {
        setNotificationPreferences(null)
        setNotificationPreferencesError(
          null
        )
        setIsLoadingNotificationPreferences(
          false
        )
        return
      }

      try {
        setIsLoadingNotificationPreferences(
          true
        )
        setNotificationPreferencesError(
          null
        )

        const result =
          await getMechanicNotificationPreferences(
            mechanicId
          )

        setNotificationPreferences(
          result
        )
      } catch (error) {
        setNotificationPreferences(null)

        setNotificationPreferencesError(
          error instanceof Error
            ? error.message
            : 'Unable to load mechanic notification preferences.'
        )
      } finally {
        setIsLoadingNotificationPreferences(
          false
        )
      }
    }, [mechanicId])

  useEffect(() => {
    refreshNotificationPreferences()
  }, [
    refreshNotificationPreferences,
  ])

  return {
    notificationPreferences,
    isLoadingNotificationPreferences,
    notificationPreferencesError,
    refreshNotificationPreferences,
  }
}