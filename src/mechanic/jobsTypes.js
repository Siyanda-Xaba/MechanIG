export const MECHANIC_JOB_FILTERS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

export const MECHANIC_JOB_FILTER_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

export const MECHANIC_JOB_PRIORITIES = {
  NORMAL: 'normal',
  URGENT: 'urgent',
}

/**
 * @typedef {'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'} MechanicJobStatus
 */

/**
 * @typedef {'normal' | 'urgent'} MechanicJobPriority
 */

/**
 * @typedef {{
 *   id: string,
 *   customerId: string | null,
 *   vehicleId: string | null,
 *   bookingId: string | null,
 *   diagnosticId: string | null,
 *   customerName: string | null,
 *   vehicleLabel: string | null,
 *   serviceType: string,
 *   description: string | null,
 *   scheduledDate: string | null,
 *   scheduledTime: string | null,
 *   locationLabel: string | null,
 *   status: MechanicJobStatus,
 *   priority: MechanicJobPriority,
 *   estimatedAmount: number | null,
 *   currency: string | null,
 *   createdAt: string | null
 * }} MechanicJob
 */

/**
 * @typedef {{
 *   jobs: MechanicJob[],
 *   totalPending: number,
 *   totalAccepted: number,
 *   totalInProgress: number,
 *   totalCompleted: number
 * }} MechanicJobsData
 */