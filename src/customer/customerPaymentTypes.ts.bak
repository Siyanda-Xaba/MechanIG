export type CustomerPaymentMethodType =
  | 'card'
  | 'other'

export type CustomerPaymentMethod = {
  id: string

  customerId: string

  type: CustomerPaymentMethodType

  displayName: string

  cardBrand: string | null
  last4: string | null

  expiryMonth: number | null
  expiryYear: number | null

  isDefault: boolean

  providerReference: string
}

export type AttachCustomerPaymentMethodInput = {
  customerId: string

  providerReference: string

  isDefault: boolean
}