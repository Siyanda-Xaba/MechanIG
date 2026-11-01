import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getCustomerNotificationPreferences,
} from './customerNotificationPreferenceService'
import type {
  CustomerNotificationPreferences,
} from './customerNotificationPreferenceTypes'

type CustomerNotificationPreferencesState = {
  notificationPreferences:
    CustomerNotificationPreferences | null

  isLoadingNotificationPreferences: boolean

  notificationPreferencesError: string | null

  refreshNotificationPreferences: () => Promise<void>
}

export function useCustomerNotificationPreferences(
  customerId: string | null
): CustomerNotificationPreferencesState {
  const [
    notificationPreferences,
    setNotificationPreferences,
  ] =
    useState<CustomerNotificationPreferences | null>(
      null
    )

  const [
    isLoadingNotificationPreferences,
    setIsLoadingNotificationPreferences,
  ] = useState(false)

  const [
    notificationPreferencesError,
    setNotificationPreferencesError,
  ] = useState<string | null>(null)

  const refreshNotificationPreferences =
    useCallback(async () => {
      if (!customerId) {
        setNotificationPreferences(null)
        setNotificationPreferencesError(null)
        setIsLoadingNotificationPreferences(false)
        return
      }

      try {
        setIsLoadingNotificationPreferences(true)
        setNotificationPreferencesError(null)

        const result =
          await getCustomerNotificationPreferences(
            customerId
          )

        setNotificationPreferences(result)
      } catch (error) {
        setNotificationPreferences(null)

        setNotificationPreferencesError(
          error instanceof Error
            ? error.message
            : 'Unable to load notification preferences.'
        )
      } finally {
        setIsLoadingNotificationPreferences(false)
      }
    }, [customerId])

  useEffect(() => {
    refreshNotificationPreferences()
  }, [refreshNotificationPreferences])

  return {
    notificationPreferences,
    isLoadingNotificationPreferences,
    notificationPreferencesError,
    refreshNotificationPreferences,
  }
}