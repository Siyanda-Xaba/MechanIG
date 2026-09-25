const developmentMechanicHomeData = {
  jobsCompleted: 24,
  pendingJobs: 5,
  bookings: 8,

  rating: 4.8,

  earnings: {
    amount: 12450,
    currency: 'ZAR',
  },

  schedule: [
    {
      id: 'schedule-001',
      jobId: null,
      customerId: null,

      title: 'Vehicle Service',
      customerName: 'Customer',
      vehicleLabel: 'BMW 320i',

      date: 'Today',
      time: '09:30',

      status: 'accepted',
    },

    {
      id: 'schedule-002',
      jobId: null,
      customerId: null,

      title: 'Diagnostics',
      customerName: 'Customer',
      vehicleLabel: 'Volkswagen Polo',

      date: 'Today',
      time: '13:00',

      status: 'pending',
    },
  ],

  serviceAlerts: [
    {
      id: 'alert-001',

      title: 'Diagnostic Review',
      description:
        'A vehicle diagnostic requires mechanic review.',

      severity: 'warning',

      customerId: null,
      vehicleId: null,
      diagnosticId: null,
    },
  ],

  recentActivity: [
    {
      id: 'activity-001',

      title: 'Job Completed',
      description:
        'Vehicle service marked as completed.',

      time: 'Today, 08:45',
      status: 'Completed',

      action: null,
    },

    {
      id: 'activity-002',

      title: 'New Booking',
      description:
        'A new workshop booking was received.',

      time: 'Yesterday, 16:20',
      status: 'Pending',

      action: null,
    },
  ],
}

/**
 * Later this function will call the MechanIQ backend
 * using the authenticated mechanic session.
 *
 * Dashboard counts, ratings, earnings, bookings,
 * schedule entries, alerts and activity must come
 * from backend-authoritative records.
 *
 * Temporary development entries intentionally do not
 * contain fake customer, job, vehicle or diagnostic IDs.
 * Navigation actions should only receive those IDs when
 * corresponding backend records actually exist.
 *
 * @returns {Promise<import('./homeTypes').MechanicHomeData>}
 */
export async function getMechanicHomeData() {
  return developmentMechanicHomeData
}