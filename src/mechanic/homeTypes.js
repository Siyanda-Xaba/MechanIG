export const MECHANIC_JOB_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const MECHANIC_SERVICE_ALERT_SEVERITIES = {
  INFO: 'info',
  WARNING: 'warning',
  URGENT: 'urgent',
}

/**
 * @typedef {'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'} MechanicJobStatus
 */

/**
 * @typedef {'info' | 'warning' | 'urgent'} MechanicServiceAlertSeverity
 */

/**
 * @typedef {{
 *   type: 'job',
 *   jobId: string
 * } | {
 *   type: 'diagnostics',
 *   diagnosticId?: string
 * } | {
 *   type: 'customer',
 *   customerId: string
 * } | {
 *   type: 'profile'
 * }} MechanicHomeActivityAction
 */

/**
 * @typedef {{
 *   amount: number,
 *   currency: string
 * }} MechanicHomeEarnings
 */

/**
 * @typedef {{
 *   id: string,
 *   jobId: string | null,
 *   customerId: string | null,
 *   title: string,
 *   customerName: string | null,
 *   vehicleLabel: string | null,
 *   date: string,
 *   time: string,
 *   status: MechanicJobStatus
 * }} MechanicScheduleItem
 */

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string,
 *   severity: MechanicServiceAlertSeverity,
 *   customerId: string | null,
 *   vehicleId: string | null,
 *   diagnosticId: string | null
 * }} MechanicServiceAlert
 */

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string,
 *   time: string,
 *   status: string,
 *   action: MechanicHomeActivityAction | null
 * }} MechanicRecentActivityItem
 */

/**
 * @typedef {{
 *   jobsCompleted: number,
 *   pendingJobs: number,
 *   bookings: number,
 *   rating: number | null,
 *   earnings: MechanicHomeEarnings | null,
 *   schedule: MechanicScheduleItem[],
 *   serviceAlerts: MechanicServiceAlert[],
 *   recentActivity: MechanicRecentActivityItem[]
 * }} MechanicHomeData
 */