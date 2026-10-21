export type VehicleHealthStatus = {
  label: string
  value: string
}

export type MaintenanceReminder = {
  id: string
  title: string
  description: string
}

export type CustomerActivityAction =
  | {
      type: 'diagnostics'
      resultId?: string
    }
  | {
      type: 'fuel'
      deliveryId?: string
    }
  | {
      type: 'maintenance'
    }
  | {
      type: 'service'
      mechanicId?: string
    }
  | {
      type: 'marketplace'
    }
  | {
      type: 'profile'
    }

export type RecentActivityItem = {
  id: string

  title: string
  description: string

  time: string
  status: string

  action: CustomerActivityAction | null
}

export type CustomerHomeData = {
  vehicleHealthScore: number | null
  vehicleHealthLabel: string | null

  fuelLevel: number | null
  estimatedRangeKm: number | null

  nextServiceKm: number | null
  nextServiceDays: number | null

  batteryStatus: string | null
  tyreStatus: string | null

  nextOutageTime: string | null

  maintenanceReminders: MaintenanceReminder[]
  recentActivity: RecentActivityItem[]
}