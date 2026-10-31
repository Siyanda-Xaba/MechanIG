import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getMechanicHelpSupportData,
} from './mechanicHelpSupportService'

export function useMechanicHelpSupport() {
  const [
    helpSupportData,
    setHelpSupportData,
  ] = useState(null)

  const [
    isLoadingHelpSupport,
    setIsLoadingHelpSupport,
  ] = useState(false)

  const [
    helpSupportError,
    setHelpSupportError,
  ] = useState(null)

  const refreshHelpSupport =
    useCallback(async () => {
      try {
        setIsLoadingHelpSupport(
          true
        )

        setHelpSupportError(null)

        const result =
          await getMechanicHelpSupportData()

        setHelpSupportData(result)
      } catch (error) {
        setHelpSupportData(null)

        setHelpSupportError(
          error instanceof Error
            ? error.message
            : 'Unable to load mechanic help and support.'
        )
      } finally {
        setIsLoadingHelpSupport(
          false
        )
      }
    }, [])

  useEffect(() => {
    refreshHelpSupport()
  }, [refreshHelpSupport])

  return {
    helpSupportData,
    isLoadingHelpSupport,
    helpSupportError,
    refreshHelpSupport,
  }
}