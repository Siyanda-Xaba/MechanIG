const developmentMechanicCustomers = [
  {
    id: 'development-customer-001',
    customerId: null,

    firstName: 'Customer',
    lastName: null,
    displayName: 'Customer',

    profileImageUrl: null,

    phone: null,
    email: null,

    status: 'active',

    vehicles: [
      {
        id: 'development-vehicle-001',

        make: 'BMW',
        model: '320i',
        year: null,

        registrationNumber: null,
        vehicleLabel: 'BMW 320i',
      },
    ],

    recentBooking: {
      id: 'development-booking-summary-001',
      bookingId: null,

      serviceType: 'Vehicle Service',

      dateLabel: 'Today',
      timeLabel: '09:30',

      status: 'upcoming',
    },

    openJob: {
      id: 'development-job-summary-001',
      jobId: null,

      serviceType: 'Vehicle Service',
      status: 'accepted',
    },

    lastInteractionLabel: 'Today',
  },

  {
    id: 'development-customer-002',
    customerId: null,

    firstName: 'Customer',
    lastName: null,
    displayName: 'Customer',

    profileImageUrl: null,

    phone: null,
    email: null,

    status: 'active',

    vehicles: [
      {
        id: 'development-vehicle-002',

        make: 'Volkswagen',
        model: 'Polo',
        year: null,

        registrationNumber: null,
        vehicleLabel: 'Volkswagen Polo',
      },
    ],

    recentBooking: {
      id: 'development-booking-summary-002',
      bookingId: null,

      serviceType: 'Diagnostics',

      dateLabel: 'Today',
      timeLabel: '13:00',

      status: 'upcoming',
    },

    openJob: {
      id: 'development-job-summary-002',
      jobId: null,

      serviceType: 'Diagnostics',
      status: 'pending',
    },

    lastInteractionLabel: 'Today',
  },

  {
    id: 'development-customer-003',
    customerId: null,

    firstName: 'Customer',
    lastName: null,
    displayName: 'Customer',

    profileImageUrl: null,

    phone: null,
    email: null,

    status: 'active',

    vehicles: [
      {
        id: 'development-vehicle-003',

        make: 'Toyota',
        model: 'Corolla',
        year: null,

        registrationNumber: null,
        vehicleLabel: 'Toyota Corolla',
      },
    ],

    recentBooking: {
      id: 'development-booking-summary-003',
      bookingId: null,

      serviceType: 'Brake Inspection',

      dateLabel: 'Tomorrow',
      timeLabel: '10:00',

      status: 'upcoming',
    },

    openJob: null,

    lastInteractionLabel: 'Yesterday',
  },

  {
    id: 'development-customer-004',
    customerId: null,

    firstName: 'Customer',
    lastName: null,
    displayName: 'Customer',

    profileImageUrl: null,

    phone: null,
    email: null,

    status: 'inactive',

    vehicles: [
      {
        id: 'development-vehicle-004',

        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: null,

        registrationNumber: null,
        vehicleLabel: 'Mercedes-Benz C-Class',
      },
    ],

    recentBooking: {
      id: 'development-booking-summary-004',
      bookingId: null,

      serviceType: 'Vehicle Service',

      dateLabel: 'Yesterday',
      timeLabel: '11:30',

      status: 'completed',
    },

    openJob: null,

    lastInteractionLabel: 'Yesterday',
  },
]

/**
 * Later this function will load customer records
 * associated with the authenticated mechanic from
 * the MechanIQ backend.
 *
 * Customer identity, vehicles, bookings, open jobs,
 * contact details and interaction history must come
 * from backend-authoritative records.
 *
 * Temporary development records intentionally keep
 * customer, booking and job identifiers null and do
 * not include real phone numbers or email addresses.
 *
 * @returns {Promise<import('./customersTypes').MechanicCustomersData>}
 */
export async function getMechanicCustomersData() {
  const customers =
    developmentMechanicCustomers

  return {
    customers,

    totalCustomers:
      customers.length,

    activeCustomers:
      customers.filter(
        (customer) =>
          customer.status === 'active'
      ).length,

    customersWithOpenJobs:
      customers.filter(
        (customer) =>
          customer.openJob != null
      ).length,

    upcomingBookings:
      customers.filter(
        (customer) =>
          customer.recentBooking?.status ===
          'upcoming'
      ).length,
  }
}