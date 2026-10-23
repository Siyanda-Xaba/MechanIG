export type CustomerServiceTypeId =
  | 'oil-service'
  | 'brake-service'
  | 'battery-service'
  | 'tyre-service'
  | 'general-service'
  | 'vehicle-inspection'
  | 'other'

export type CustomerServiceType = {
  id: CustomerServiceTypeId
  title: string
  description: string
  estimatedDurationMinutes: number | null
}

export type CustomerBookServiceData = {
  services: CustomerServiceType[]
}