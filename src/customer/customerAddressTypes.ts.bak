export type CustomerAddressCoordinate = {
  latitude: number
  longitude: number
}

export type CustomerSavedAddress = {
  id: string

  customerId: string

  label: string
  address: string

  coordinate: CustomerAddressCoordinate | null

  isDefault: boolean
}

export type CreateCustomerSavedAddressInput = {
  customerId: string

  label: string
  address: string

  isDefault: boolean
}