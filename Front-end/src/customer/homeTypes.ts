export type VehicleHealthStatus = {
  label: string
  value: string
}

export type MaintenanceReminder = {
  id: string
  title: string
  description: string
}

export type RecentActivityItem = {
  id: string
  title: string
  description: string
  time: string
  status: string
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