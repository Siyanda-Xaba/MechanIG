const developmentMechanicJobs = [
  {
    id: 'development-job-001',

    requestId: null,
    customerId: null,
    vehicleId: null,
    bookingId: null,
    diagnosticId: null,

    customerName: 'Customer',
    vehicleLabel: 'BMW 320i',

    serviceType: 'Mobile Vehicle Service',

    description:
      'Routine vehicle service requested at the customer location.',

    scheduledDate: 'Today',
    scheduledTime: '09:30',

    locationLabel: 'Customer Location',

    serviceLocationType: 'mobile',

    serviceLocation: {
      label: 'Customer Location',
      address: null,
      latitude: null,
      longitude: null,
    },

    status: 'accepted',

    travelStatus: 'not-started',

    locationSharingActive: false,

    mechanicLocation: null,

    distanceToServiceKm: null,

    estimatedArrivalAt: null,

    allowedActions: [
      'start-trip',
    ],

    priority: 'normal',

    estimatedAmount: 1250,
    currency: 'ZAR',

    createdAt: null,
  },

  {
    id: 'development-job-002',

    requestId: null,
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

    serviceLocationType: 'workshop',

    serviceLocation: {
      label: 'Workshop',
      address: null,
      latitude: null,
      longitude: null,
    },

    status: 'pending',

    travelStatus: 'not-required',

    locationSharingActive: false,

    mechanicLocation: null,

    distanceToServiceKm: null,

    estimatedArrivalAt: null,

    allowedActions: [
      'accept',
      'reject',
    ],

    priority: 'urgent',

    estimatedAmount: null,
    currency: null,

    createdAt: null,
  },

  {
    id: 'development-job-003',

    requestId: null,
    customerId: null,
    vehicleId: null,
    bookingId: null,
    diagnosticId: null,

    customerName: 'Customer',
    vehicleLabel: 'Toyota Corolla',

    serviceType: 'Mobile Brake Inspection',

    description:
      'Inspect the braking system at the customer location and confirm required repair work.',

    scheduledDate: 'Tomorrow',
    scheduledTime: '10:00',

    locationLabel: 'Customer Location',

    serviceLocationType: 'mobile',

    serviceLocation: {
      label: 'Customer Location',
      address: null,
      latitude: null,
      longitude: null,
    },

    status: 'pending',

    travelStatus: 'not-started',

    locationSharingActive: false,

    mechanicLocation: null,

    distanceToServiceKm: null,

    estimatedArrivalAt: null,

    allowedActions: [
      'accept',
      'reject',
    ],

    priority: 'normal',

    estimatedAmount: null,
    currency: null,

    createdAt: null,
  },

  {
    id: 'development-job-004',

    requestId: null,
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

    serviceLocationType: 'workshop',

    serviceLocation: {
      label: 'Workshop',
      address: null,
      latitude: null,
      longitude: null,
    },

    status: 'in-progress',

    travelStatus: 'not-required',

    locationSharingActive: false,

    mechanicLocation: null,

    distanceToServiceKm: null,

    estimatedArrivalAt: null,

    allowedActions: [
      'complete-job',
    ],

    priority: 'normal',

    estimatedAmount: 3800,
    currency: 'ZAR',

    createdAt: null,
  },

  {
    id: 'development-job-005',

    requestId: null,
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

    serviceLocationType: 'workshop',

    serviceLocation: {
      label: 'Workshop',
      address: null,
      latitude: null,
      longitude: null,
    },

    status: 'completed',

    travelStatus: 'not-required',

    locationSharingActive: false,

    mechanicLocation: null,

    distanceToServiceKm: null,

    estimatedArrivalAt: null,

    allowedActions: [],

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
 * diagnostic references, pricing, service locations,
 * travel state and permitted actions must come from
 * backend-authoritative records.
 *
 * Mobile-job service coordinates, mechanic GPS
 * location, route distance and ETA must never be
 * invented by the frontend.
 *
 * Temporary development records intentionally
 * leave customer, vehicle, booking, request and
 * diagnostic identifiers null so the frontend does
 * not imply real cross-user relationships.
 *
 * Development records may declare workflow states
 * and allowed actions so the mechanic UI can be
 * exercised before backend job mutations are
 * connected.
 *
 * @returns {Promise<import('./jobsTypes').MechanicJobsData>}
 */
export async function getMechanicJobsData() {
  const jobs =
    developmentMechanicJobs

  return {
    jobs,

    totalPending:
      jobs.filter(
        (job) =>
          job.status === 'pending'
      ).length,

    totalAccepted:
      jobs.filter(
        (job) =>
          job.status === 'accepted'
      ).length,

    totalInProgress:
      jobs.filter(
        (job) =>
          job.status ===
          'in-progress'
      ).length,

    totalCompleted:
      jobs.filter(
        (job) =>
          job.status ===
          'completed'
      ).length,
  }
}