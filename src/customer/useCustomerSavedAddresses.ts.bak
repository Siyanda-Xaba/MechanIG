import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getCustomerSavedAddresses,
} from './customerAddressService'
import type {
  CustomerSavedAddress,
} from './customerAddressTypes'

type CustomerSavedAddressesState = {
  savedAddresses: CustomerSavedAddress[]

  isLoadingSavedAddresses: boolean

  savedAddressesError: string | null

  refreshSavedAddresses: () => Promise<void>
}

export function useCustomerSavedAddresses(
  customerId: string | null
): CustomerSavedAddressesState {
  const [
    savedAddresses,
    setSavedAddresses,
  ] = useState<CustomerSavedAddress[]>([])

  const [
    isLoadingSavedAddresses,
    setIsLoadingSavedAddresses,
  ] = useState(false)

  const [
    savedAddressesError,
    setSavedAddressesError,
  ] = useState<string | null>(null)

  const refreshSavedAddresses =
    useCallback(async () => {
      if (!customerId) {
        setSavedAddresses([])
        setSavedAddressesError(null)
        setIsLoadingSavedAddresses(false)
        return
      }

      try {
        setIsLoadingSavedAddresses(true)
        setSavedAddressesError(null)

        const result =
          await getCustomerSavedAddresses(
            customerId
          )

        setSavedAddresses(result)
      } catch (error) {
        setSavedAddresses([])

        setSavedAddressesError(
          error instanceof Error
            ? error.message
            : 'Unable to load saved addresses.'
        )
      } finally {
        setIsLoadingSavedAddresses(false)
      }
    }, [customerId])

  useEffect(() => {
    refreshSavedAddresses()
  }, [refreshSavedAddresses])

  return {
    savedAddresses,
    isLoadingSavedAddresses,
    savedAddressesError,
    refreshSavedAddresses,
  }
}