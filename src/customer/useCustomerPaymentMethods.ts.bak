import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getCustomerPaymentMethods,
} from './customerPaymentService'
import type {
  CustomerPaymentMethod,
} from './customerPaymentTypes'

type CustomerPaymentMethodsState = {
  paymentMethods: CustomerPaymentMethod[]

  isLoadingPaymentMethods: boolean

  paymentMethodsError: string | null

  refreshPaymentMethods: () => Promise<void>
}

export function useCustomerPaymentMethods(
  customerId: string | null
): CustomerPaymentMethodsState {
  const [
    paymentMethods,
    setPaymentMethods,
  ] = useState<CustomerPaymentMethod[]>([])

  const [
    isLoadingPaymentMethods,
    setIsLoadingPaymentMethods,
  ] = useState(false)

  const [
    paymentMethodsError,
    setPaymentMethodsError,
  ] = useState<string | null>(null)

  const refreshPaymentMethods =
    useCallback(async () => {
      if (!customerId) {
        setPaymentMethods([])
        setPaymentMethodsError(null)
        setIsLoadingPaymentMethods(false)
        return
      }

      try {
        setIsLoadingPaymentMethods(true)
        setPaymentMethodsError(null)

        const result =
          await getCustomerPaymentMethods(
            customerId
          )

        setPaymentMethods(result)
      } catch (error) {
        setPaymentMethods([])

        setPaymentMethodsError(
          error instanceof Error
            ? error.message
            : 'Unable to load payment methods.'
        )
      } finally {
        setIsLoadingPaymentMethods(false)
      }
    }, [customerId])

  useEffect(() => {
    refreshPaymentMethods()
  }, [refreshPaymentMethods])

  return {
    paymentMethods,
    isLoadingPaymentMethods,
    paymentMethodsError,
    refreshPaymentMethods,
  }
}