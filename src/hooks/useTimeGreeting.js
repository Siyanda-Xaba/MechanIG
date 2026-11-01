import {
  useEffect,
  useState,
} from 'react'

import {
  AppState,
} from 'react-native'

/**
 * Returns the appropriate greeting
 * using the device's local time.
 *
 * 05:00–11:59: Good Morning
 * 12:00–16:59: Good Afternoon
 * 17:00–04:59: Good Evening
 */
function getTimeGreeting() {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return 'Good Morning'
  }

  if (hour >= 12 && hour < 17) {
    return 'Good Afternoon'
  }

  return 'Good Evening'
}

/**
 * Shared greeting hook for Customer
 * and Mechanic Home dashboards.
 *
 * Updates when:
 * - The component first mounts
 * - The app returns to the foreground
 * - The local time period changes
 *
 * Does not require internet access.
 */
export function useTimeGreeting() {
  const [
    greeting,
    setGreeting,
  ] = useState(getTimeGreeting)

  useEffect(() => {
    function updateGreeting() {
      setGreeting(getTimeGreeting())
    }

    const appStateSubscription =
      AppState.addEventListener(
        'change',
        (nextState) => {
          if (nextState === 'active') {
            updateGreeting()
          }
        }
      )

    const interval = setInterval(
      updateGreeting,
      60 * 1000
    )

    return () => {
      appStateSubscription.remove()
      clearInterval(interval)
    }
  }, [])

  return greeting
}