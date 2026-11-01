import {
  useCallback,
  useState,
} from 'react'

import {
  updateCustomerBiometricPreference,
} from './customerSecurityService'
import type {
  CustomerSecuritySettings,
  UpdateCustomerBiometricPreferenceInput,
} from './customerSecurityTypes'

type UseUpdateCustomerBiometricPreferenceReturn = {
  isUpdatingBiometricPreference: boolean

  biometricPreferenceError: string | null

  updateBiometricPreference: (
    input: UpdateCustomerBiometricPreferenceInput
  ) => Promise<CustomerSecuritySettings | null>

  clearBiometricPreferenceError: () => void
}

export function useUpdateCustomerBiometricPreference():
  UseUpdateCustomerBiometricPreferenceReturn {
  const [
    isUpdatingBiometricPreference,
    setIsUpdatingBiometricPreference,
  ] = useState(false)

  const [
    biometricPreferenceError,
    setBiometricPreferenceError,
  ] = useState<string | null>(null)

  const updateBiometricPreference =
    useCallback(
      async (
        input: UpdateCustomerBiometricPreferenceInput
      ) => {
        try {
          setIsUpdatingBiometricPreference(true)
          setBiometricPreferenceError(null)

          const savedSettings =
            await updateCustomerBiometricPreference(
              input
            )

          return savedSettings
        } catch (error) {
          setBiometricPreferenceError(
            error instanceof Error
              ? error.message
              : 'Unable to update biometric sign-in.'
          )

          return null
        } finally {
          setIsUpdatingBiometricPreference(false)
        }
      },
      []
    )

  const clearBiometricPreferenceError =
    useCallback(() => {
      setBiometricPreferenceError(null)
    }, [])

  return {
    isUpdatingBiometricPreference,
    biometricPreferenceError,
    updateBiometricPreference,
    clearBiometricPreferenceError,
  }
}