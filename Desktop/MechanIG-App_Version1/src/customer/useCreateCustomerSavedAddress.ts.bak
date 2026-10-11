import {
  useCallback,
  useState,
} from 'react'

import {
  createCustomerSavedAddress,
} from './customerAddressService'
import type {
  CreateCustomerSavedAddressInput,
  CustomerSavedAddress,
} from './customerAddressTypes'

type UseCreateCustomerSavedAddressReturn = {
  isCreatingSavedAddress: boolean

  createSavedAddressError: string | null

  createSavedAddress: (
    input: CreateCustomerSavedAddressInput
  ) => Promise<CustomerSavedAddress | null>

  clearCreateSavedAddressError: () => void
}

export function useCreateCustomerSavedAddress():
  UseCreateCustomerSavedAddressReturn {
  const [
    isCreatingSavedAddress,
    setIsCreatingSavedAddress,
  ] = useState(false)

  const [
    createSavedAddressError,
    setCreateSavedAddressError,
  ] = useState<string | null>(null)

  const createSavedAddress =
    useCallback(
      async (
        input: CreateCustomerSavedAddressInput
      ) => {
        try {
          setIsCreatingSavedAddress(true)
          setCreateSavedAddressError(null)

          const savedAddress =
            await createCustomerSavedAddress(
              input
            )

          return savedAddress
        } catch (error) {
          setCreateSavedAddressError(
            error instanceof Error
              ? error.message
              : 'Unable to save the address.'
          )

          return null
        } finally {
          setIsCreatingSavedAddress(false)
        }
      },
      []
    )

  const clearCreateSavedAddressError =
    useCallback(() => {
      setCreateSavedAddressError(null)
    }, [])

  return {
    isCreatingSavedAddress,
    createSavedAddressError,
    createSavedAddress,
    clearCreateSavedAddressError,
  }
}