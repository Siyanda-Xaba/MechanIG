import {
  CustomerServiceTypeId,
} from './bookServiceTypes'

export type MaintenanceReminderStatus =
  | 'upcoming'
  | 'due-soon'
  | 'overdue'

export type CustomerMaintenanceReminder = {
  id: string

  vehicleId: string

  title: string
  description: string

  status: MaintenanceReminderStatus

  serviceId: CustomerServiceTypeId | null

  dueInKm: number | null
  dueInDays: number | null
}

export type CustomerMaintenanceData = {
  reminders: CustomerMaintenanceReminder[]
}