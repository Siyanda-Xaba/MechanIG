import {
  MECHANIC_JOB_ACTIONS,
  MECHANIC_JOB_FILTERS,
  MECHANIC_JOB_PRIORITIES,
  MECHANIC_JOB_SERVICE_LOCATION_TYPES,
  MECHANIC_JOB_TRAVEL_STATUSES,
} from './jobsTypes';
import {
  getActiveFuelDelivery,
  getAvailableFuelDeliveries,
} from './fuelDeliveryService';
import { getMyMechanicRequests } from '../customer/mechanicRequestService';

/**
 * Transforms an available (pending) fuel delivery into a MechanicJob.
 * Note: Customer exact coordinates and contact information are strictly hidden
 * to prevent privacy breaches before acceptance.
 */
function pendingFuelDeliveryToJob(item) {
  const isEmergency = item.requestType === 'emergency';
  return {
    id: item.id,
    requestId: item.id,
    customerId: null, // Privacy protected
    vehicleId: null,
    bookingId: null,
    diagnosticId: null,
    customerName: 'Customer',
    vehicleLabel: 'Vehicle fuel top-up',
    serviceType: isEmergency ? 'Emergency Fuel Delivery' : 'Fuel Delivery',
    description: `${item.quantityLitres} L of ${item.fuelType || 'fuel'}`,
    scheduledDate: null,
    scheduledTime: null,
    locationLabel: item.approximateArea || 'Nearby delivery',
    serviceLocationType: MECHANIC_JOB_SERVICE_LOCATION_TYPES.MOBILE,
    serviceLocation: {
      label: item.approximateArea || 'Delivery area',
      address: null, // Privacy protected
      latitude: null, // Privacy protected
      longitude: null, // Privacy protected
    },
    status: MECHANIC_JOB_FILTERS.PENDING,
    travelStatus: MECHANIC_JOB_TRAVEL_STATUSES.NOT_STARTED,
    locationSharingActive: false,
    mechanicLocation: null,
    distanceToServiceKm: item.distanceKm ?? null,
    estimatedArrivalAt: null,
    allowedActions: [
      MECHANIC_JOB_ACTIONS.ACCEPT,
      MECHANIC_JOB_ACTIONS.REJECT,
    ],
    priority: isEmergency
      ? MECHANIC_JOB_PRIORITIES.URGENT
      : MECHANIC_JOB_PRIORITIES.NORMAL,
    estimatedAmount: null,
    currency: 'ZAR',
    createdAt: item.createdAt ?? null,
  };
}

/**
 * Transforms an assigned fuel delivery (with exact customer destination unlocked) into a MechanicJob.
 */
function assignedFuelDeliveryToJob(delivery) {
  const isEmergency = delivery.requestType === 'emergency';
  let status = MECHANIC_JOB_FILTERS.ACCEPTED;
  let travelStatus = MECHANIC_JOB_TRAVEL_STATUSES.NOT_STARTED;
  let allowedActions = [
    MECHANIC_JOB_ACTIONS.START_TRIP,
    MECHANIC_JOB_ACTIONS.OPEN_MAP,
  ];

  if (delivery.status === 'en-route') {
    status = MECHANIC_JOB_FILTERS.IN_PROGRESS;
    travelStatus = MECHANIC_JOB_TRAVEL_STATUSES.EN_ROUTE;
    allowedActions = [
      MECHANIC_JOB_ACTIONS.MARK_ARRIVED,
      MECHANIC_JOB_ACTIONS.OPEN_MAP,
    ];
  } else if (delivery.status === 'arrived') {
    status = MECHANIC_JOB_FILTERS.IN_PROGRESS;
    travelStatus = MECHANIC_JOB_TRAVEL_STATUSES.ARRIVED;
    allowedActions = [
      MECHANIC_JOB_ACTIONS.START_JOB,
      MECHANIC_JOB_ACTIONS.OPEN_MAP,
    ];
  } else if (delivery.status === 'delivering') {
    status = MECHANIC_JOB_FILTERS.IN_PROGRESS;
    travelStatus = MECHANIC_JOB_TRAVEL_STATUSES.ARRIVED;
    allowedActions = [MECHANIC_JOB_ACTIONS.COMPLETE_JOB];
  } else if (delivery.status === 'completed') {
    status = MECHANIC_JOB_FILTERS.COMPLETED;
    travelStatus = MECHANIC_JOB_TRAVEL_STATUSES.ARRIVED;
    allowedActions = [];
  }

  const driverLoc = delivery.driver?.location;

  return {
    id: delivery.id,
    requestId: delivery.id,
    customerId: delivery.customerId ?? null,
    vehicleId: delivery.vehicleId ?? null,
    bookingId: null,
    diagnosticId: null,
    customerName: delivery.customerName ?? 'Customer',
    vehicleLabel: 'Customer vehicle',
    serviceType: isEmergency ? 'Emergency Fuel Delivery' : 'Fuel Delivery',
    description: `${delivery.quantityLitres} L of ${delivery.fuelType || 'fuel'}`,
    scheduledDate: null,
    scheduledTime: null,
    locationLabel: delivery.destinationLabel ?? 'Delivery destination',
    serviceLocationType: MECHANIC_JOB_SERVICE_LOCATION_TYPES.MOBILE,
    serviceLocation: {
      label: delivery.destinationLabel ?? 'Delivery destination',
      address: delivery.destinationAddress ?? null,
      latitude: delivery.destination?.latitude ?? null,
      longitude: delivery.destination?.longitude ?? null,
    },
    status,
    travelStatus,
    locationSharingActive: delivery.status === 'en-route',
    mechanicLocation: driverLoc
      ? {
          latitude: Number(driverLoc.latitude),
          longitude: Number(driverLoc.longitude),
          capturedAt: driverLoc.updatedAt ?? null,
        }
      : null,
    distanceToServiceKm: null,
    estimatedArrivalAt: null,
    allowedActions,
    priority: isEmergency
      ? MECHANIC_JOB_PRIORITIES.URGENT
      : MECHANIC_JOB_PRIORITIES.NORMAL,
    estimatedAmount: null,
    currency: 'ZAR',
    createdAt: delivery.createdAt ?? null,
  };
}


function pendingMechanicRequestToJob(item) { return { id: item.id, requestId: item.id, customerId: null, vehicleId: null, bookingId: null, diagnosticId: null, customerName: 'Customer', vehicleLabel: item.vehicle ? [item.vehicle.make, item.vehicle.model].filter(Boolean).join(' ') || 'Customer vehicle' : 'Customer vehicle', serviceType: 'Mobile Mechanic Request', description: item.issueDescription || 'Customer requested mobile assistance.', scheduledDate: null, scheduledTime: null, locationLabel: 'Location shared after acceptance', serviceLocationType: MECHANIC_JOB_SERVICE_LOCATION_TYPES.MOBILE, serviceLocation: { label: 'Customer location', address: null, latitude: null, longitude: null }, status: MECHANIC_JOB_FILTERS.PENDING, travelStatus: MECHANIC_JOB_TRAVEL_STATUSES.NOT_STARTED, locationSharingActive: false, mechanicLocation: null, distanceToServiceKm: null, estimatedArrivalAt: null, allowedActions: [MECHANIC_JOB_ACTIONS.ACCEPT], priority: MECHANIC_JOB_PRIORITIES.NORMAL, estimatedAmount: null, currency: 'ZAR', createdAt: item.createdAt ?? null, mechanicRequest: true }; }

/**
 * Retrieve jobs belonging to an authenticated mechanic from the backend.
 *
 * @param {string} mechanicId
 * @returns {Promise<import('./jobsTypes').MechanicJobsData>}
 */
export async function getMechanicJobsData(mechanicId) {
  if (typeof mechanicId !== 'string' || !mechanicId.trim()) {
    throw new Error(
      'An authenticated mechanic account is required to load jobs.'
    );
  }

  const [availableList, activeDelivery, mechanicRequests] = await Promise.all([
    getAvailableFuelDeliveries().catch(() => []),
    getActiveFuelDelivery().catch(() => null),
    getMyMechanicRequests().catch(() => []),
  ]);

  const jobs = [];

  // Active or assigned job takes precedence
  if (activeDelivery) {
    jobs.push(assignedFuelDeliveryToJob(activeDelivery));
  }

  for (const request of mechanicRequests) jobs.push(pendingMechanicRequestToJob(request));

  // Pending available jobs (exclude any already assigned to this mechanic)
  for (const pending of availableList) {
    if (activeDelivery && activeDelivery.id === pending.id) {
      continue;
    }
    jobs.push(pendingFuelDeliveryToJob(pending));
  }

  const totalPending = jobs.filter(
    (j) => j.status === MECHANIC_JOB_FILTERS.PENDING
  ).length;
  const totalAccepted = jobs.filter(
    (j) => j.status === MECHANIC_JOB_FILTERS.ACCEPTED
  ).length;
  const totalInProgress = jobs.filter(
    (j) => j.status === MECHANIC_JOB_FILTERS.IN_PROGRESS
  ).length;
  const totalCompleted = jobs.filter(
    (j) => j.status === MECHANIC_JOB_FILTERS.COMPLETED
  ).length;

  return {
    jobs,
    totalPending,
    totalAccepted,
    totalInProgress,
    totalCompleted,
  };
}
