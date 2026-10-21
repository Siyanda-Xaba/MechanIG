import {
  useCallback,
  useState,
} from 'react'

import {
  changeCustomerPassword,
} from './customerSecurityService'
import type {
  ChangeCustomerPasswordInput,
} from './customerSecurityTypes'

type UseChangeCustomerPasswordReturn = {
  isChangingPassword: boolean

  changePasswordError: string | null

  changePassword: (
    input: ChangeCustomerPasswordInput
  ) => Promise<boolean>

  clearChangePasswordError: () => void
}

export function useChangeCustomerPassword():
  UseChangeCustomerPasswordReturn {
  const [
    isChangingPassword,
    setIsChangingPassword,
  ] = useState(false)

  const [
    changePasswordError,
    setChangePasswordError,
  ] = useState<string | null>(null)

  const changePassword =
    useCallback(
      async (
        input: ChangeCustomerPasswordInput
      ) => {
        try {
          setIsChangingPassword(true)
          setChangePasswordError(null)

          await changeCustomerPassword(input)

          return true
        } catch (error) {
          setChangePasswordError(
            error instanceof Error
              ? error.message
              : 'Unable to change your password.'
          )

          return false
        } finally {
          setIsChangingPassword(false)
        }
      },
      []
    )

  const clearChangePasswordError =
    useCallback(() => {
      setChangePasswordError(null)
    }, [])

  return {
    isChangingPassword,
    changePasswordError,
    changePassword,
    clearChangePasswordError,
  }
}