import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getCustomerHelpSupportData,
} from './customerHelpSupportService'
import type {
  CustomerHelpSupportData,
} from './customerHelpSupportTypes'

type CustomerHelpSupportState = {
  helpSupportData:
    CustomerHelpSupportData | null

  isLoadingHelpSupport: boolean

  helpSupportError: string | null

  refreshHelpSupport: () => Promise<void>
}

export function useCustomerHelpSupport():
  CustomerHelpSupportState {
  const [
    helpSupportData,
    setHelpSupportData,
  ] =
    useState<CustomerHelpSupportData | null>(
      null
    )

  const [
    isLoadingHelpSupport,
    setIsLoadingHelpSupport,
  ] = useState(false)

  const [
    helpSupportError,
    setHelpSupportError,
  ] = useState<string | null>(null)

  const refreshHelpSupport =
    useCallback(async () => {
      try {
        setIsLoadingHelpSupport(true)
        setHelpSupportError(null)

        const result =
          await getCustomerHelpSupportData()

        setHelpSupportData(result)
      } catch (error) {
        setHelpSupportData(null)

        setHelpSupportError(
          error instanceof Error
            ? error.message
            : 'Unable to load help and support.'
        )
      } finally {
        setIsLoadingHelpSupport(false)
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