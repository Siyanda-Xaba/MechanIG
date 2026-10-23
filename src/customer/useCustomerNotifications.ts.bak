import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getCustomerNotifications,
} from './customerNotificationService'
import {
  CustomerNotificationsData,
} from './customerNotificationTypes'
import { useUser } from '../users/UserContext'

type UseCustomerNotificationsReturn = {
  notificationsData: CustomerNotificationsData | null
  isLoadingNotifications: boolean
  notificationsError: string | null
  refreshNotifications: () => Promise<void>
}

export function useCustomerNotifications():
  UseCustomerNotificationsReturn {
  const {
    user,
    isLoadingUser,
  } = useUser()

  const [
    notificationsData,
    setNotificationsData,
  ] =
    useState<CustomerNotificationsData | null>(
      null
    )

  const [
    isLoadingNotifications,
    setIsLoadingNotifications,
  ] = useState(false)

  const [
    notificationsError,
    setNotificationsError,
  ] = useState<string | null>(null)

  const userId = user?.id ?? null

  const refreshNotifications =
    useCallback(async () => {
      if (!userId) {
        setNotificationsData(null)
        setNotificationsError(null)
        setIsLoadingNotifications(false)

        return
      }

      try {
        setIsLoadingNotifications(true)
        setNotificationsError(null)

        const data =
          await getCustomerNotifications(
            userId
          )

        setNotificationsData(data)
      } catch {
        setNotificationsData(null)

        setNotificationsError(
          'Unable to load notifications.'
        )
      } finally {
        setIsLoadingNotifications(false)
      }
    }, [userId])

  useEffect(() => {
    if (isLoadingUser) {
      return
    }

    refreshNotifications()
  }, [
    isLoadingUser,
    refreshNotifications,
  ])

  return {
    notificationsData,
    isLoadingNotifications:
      isLoadingUser ||
      isLoadingNotifications,
    notificationsError,
    refreshNotifications,
  }
}