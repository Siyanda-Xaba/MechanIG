const developmentMechanicJobs = [
  {
    id: 'development-job-001',
    customerId: null,
    vehicleId: null,
    bookingId: null,
    diagnosticId: null,

    customerName: 'Customer',
    vehicleLabel: 'BMW 320i',

    serviceType: 'Vehicle Service',
    description:
      'Routine vehicle service and inspection.',

    scheduledDate: 'Today',
    scheduledTime: '09:30',

    locationLabel: 'Workshop',

    status: 'accepted',
    priority: 'normal',

    estimatedAmount: 1250,
    currency: 'ZAR',

    createdAt: null,
  },

  {
    id: 'development-job-002',
    customerId: null,
    vehicleId: null,
    bookingId: null,
    diagnosticId: null,

    customerName: 'Customer',
    vehicleLabel: 'Volkswagen Polo',

    serviceType: 'Diagnostics',
    description:
      'Diagnostic inspection requested for a reported vehicle issue.',

    scheduledDate: 'Today',
    scheduledTime: '13:00',

    locationLabel: 'Workshop',

    status: 'pending',
    priority: 'urgent',

    estimatedAmount: null,
    currency: null,

    createdAt: null,
  },

  {
    id: 'development-job-003',
    customerId: null,
    vehicleId: null,
    bookingId: null,
    diagnosticId: null,

    customerName: 'Customer',
    vehicleLabel: 'Toyota Corolla',

    serviceType: 'Brake Inspection',
    description:
      'Inspect braking system and confirm required repair work.',

    scheduledDate: 'Tomorrow',
    scheduledTime: '10:00',

    locationLabel: 'Workshop',

    status: 'pending',
    priority: 'normal',

    estimatedAmount: null,
    currency: null,

    createdAt: null,
  },

  {
    id: 'development-job-004',
    customerId: null,
    vehicleId: null,
    bookingId: null,
    diagnosticId: null,

    customerName: 'Customer',
    vehicleLabel: 'Ford Ranger',

    serviceType: 'Engine Repair',
    description:
      'Repair work currently in progress.',

    scheduledDate: 'Today',
    scheduledTime: '08:00',

    locationLabel: 'Workshop',

    status: 'in-progress',
    priority: 'normal',

    estimatedAmount: 3800,
    currency: 'ZAR',

    createdAt: null,
  },

  {
    id: 'development-job-005',
    customerId: null,
    vehicleId: null,
    bookingId: null,
    diagnosticId: null,

    customerName: 'Customer',
    vehicleLabel: 'Mercedes-Benz C-Class',

    serviceType: 'Vehicle Service',
    description:
      'Scheduled service completed successfully.',

    scheduledDate: 'Yesterday',
    scheduledTime: '11:30',

    locationLabel: 'Workshop',

    status: 'completed',
    priority: 'normal',

    estimatedAmount: 2100,
    currency: 'ZAR',

    createdAt: null,
  },
]

/**
 * Later this function will load mechanic jobs from
 * the MechanIQ backend using the authenticated
 * mechanic session.
 *
 * Job status, customer assignments, bookings,
 * diagnostic references and pricing must come
 * from backend-authoritative records.
 *
 * Temporary development records intentionally
 * leave customer, vehicle, booking and diagnostic
 * identifiers null so the frontend does not imply
 * real cross-user relationships.
 *
 * @returns {Promise<import('./jobsTypes').MechanicJobsData>}
 */
export async function getMechanicJobsData() {
  const jobs = developmentMechanicJobs

  return {
    jobs,

    totalPending: jobs.filter(
      (job) => job.status === 'pending'
    ).length,

    totalAccepted: jobs.filter(
      (job) => job.status === 'accepted'
    ).length,

    totalInProgress: jobs.filter(
      (job) => job.status === 'in-progress'
    ).length,

    totalCompleted: jobs.filter(
      (job) => job.status === 'completed'
    ).length,
  }
}