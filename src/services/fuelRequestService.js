import { id, now, store } from "../data/store.js";
import { badRequest, notFound } from "../utils/http.js";
import { normalizeLocation } from "../utils/location.js";
import { findNearestDriver, getDriver } from "./driverService.js";
import trackingService from "./trackingService.js";

const STATUSES = new Set(["PENDING", "ASSIGNED", "EN_ROUTE", "ARRIVED", "COMPLETED", "CANCELLED"]);

export function createFuelRequest({ customerId, fuelType, litres, deliveryLocation, scheduledFor = null }) {
  
  if (!customerId || !fuelType?.trim()) throw badRequest("customerId and fuelType are required");
  const amount = Number(litres);
  
  if (!Number.isFinite(amount) || amount <= 0) throw badRequest("litres must be a positive number");
  const request = { id: id(), customerId, fuelType: fuelType.trim().toUpperCase(), litres: amount, deliveryLocation: normalizeLocation(deliveryLocation), scheduledFor, status: "PENDING", driverId: null, createdAt: now(), updatedAt: now() };
  store.fuelRequests.set(request.id, request);
  
  return request;
}

export function listFuelRequests({ customerId, driverId, status } = {}) {
  return [...store.fuelRequests.values()].filter((request) => (!customerId || request.customerId === customerId) && (!driverId || request.driverId === driverId) && (!status || request.status === status));
}

export function assignFuelRequest(requestId, driverId) {
  
  const request = getFuelRequest(requestId);
  if (request.status !== "PENDING") throw badRequest("Only pending fuel requests can be assigned");
  
  const driver = getDriver(driverId);
  
  if (!driver.isAvailable) throw badRequest("Driver is not available");
  request.driverId = driver.id;
  request.status = "ASSIGNED";
  request.updatedAt = now();
  trackingService.start({ requestId: request.id, driverId: driver.id, customerId: request.customerId, initialLocation: driver.location, status: "ASSIGNED" });
  
  return request;
}

export function autoAssignFuelRequest(requestId) {
  
  const request = getFuelRequest(requestId);
  const driver = findNearestDriver(request.deliveryLocation, request.fuelType);
  
  if (!driver) return request;
  
  return assignFuelRequest(request.id, driver.id);
}

export function updateFuelRequestStatus(requestId, status) {
  
  const request = getFuelRequest(requestId);
  
  if (!STATUSES.has(status)) throw badRequest("Invalid fuel request status");
  request.status = status;
  request.updatedAt = now();
  
  if (request.driverId) trackingService.setStatus(request.id, status === "PENDING" ? "SEARCHING" : status);
  
  return request;
}

export function getFuelRequest(requestId) {
  
  const request = store.fuelRequests.get(requestId);
  
  if (!request) throw notFound("Fuel request was not found");
  
  return request;
}
